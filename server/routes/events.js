/**
 * Routes pour la gestion des événements
 * Conforme référentiel DWWM 2023
 */

const express = require("express");
const { body, validationResult, query } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const { asyncHandler } = require("../middleware/errorHandler");
const { logSecurity } = require("../utils/logger");

const router = express.Router();
const prisma = new PrismaClient();

// Middleware d'authentification
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Token d'authentification requis",
          code: "TOKEN_REQUIRED",
        },
      });
    }

    // Vérifier le token JWT
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Utilisateur non trouvé ou inactif",
          code: "USER_NOT_FOUND",
        },
      });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: {
          message: "Token invalide",
          code: "INVALID_TOKEN",
        },
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: {
          message: "Token expiré",
          code: "TOKEN_EXPIRED",
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: "Erreur d'authentification",
        code: "AUTH_ERROR",
      },
    });
  }
};

// Validation pour la création d'événement
const createEventValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Le titre doit contenir entre 1 et 100 caractères"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("La description doit contenir au moins 10 caractères"),
  body("startDate")
    .isISO8601()
    .withMessage("La date de début doit être au format ISO 8601"),
  body("startTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("L'heure de début doit être au format HH:MM"),
  body("location")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Le lieu est requis"),
  body("address")
    .trim()
    .isLength({ min: 1 })
    .withMessage("L'adresse est requise"),
  body("city").trim().isLength({ min: 1 }).withMessage("La ville est requise"),
  body("postalCode")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Le code postal est requis"),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacité doit être un entier positif"),
  body("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Le budget doit être un nombre positif"),
  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic doit être un booléen"),
];

// Validation pour la mise à jour d'événement
const updateEventValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Le titre doit contenir entre 1 et 100 caractères"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("La description doit contenir au moins 10 caractères"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("La date de début doit être au format ISO 8601"),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacité doit être un entier positif"),
  body("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Le budget doit être un nombre positif"),
];

/**
 * GET /api/events
 * Récupérer la liste des événements
 */
router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construction des filtres
    const where = {
      organizerId: req.user.id,
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Récupération des événements
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              invitations: true,
              contributions: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  })
);

/**
 * GET /api/events/:id
 * Récupérer un événement par son ID
 */
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const event = await prisma.event.findFirst({
      where: {
        id,
        organizerId: req.user.id,
      },
      include: {
        invitations: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        contributions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        bookings: {
          include: {
            provider: true,
            venue: true,
          },
        },
        _count: {
          select: {
            invitations: true,
            contributions: true,
            bookings: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Événement non trouvé",
          code: "EVENT_NOT_FOUND",
        },
      });
    }

    res.json({
      success: true,
      data: { event },
    });
  })
);

/**
 * POST /api/events
 * Créer un nouvel événement
 */
router.post(
  "/",
  authenticateToken,
  createEventValidation,
  asyncHandler(async (req, res) => {
    // Validation des données
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Données de validation invalides",
          code: "VALIDATION_ERROR",
          details: errors.array(),
        },
      });
    }

    const {
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      address,
      city,
      postalCode,
      country = "France",
      capacity,
      budget,
      isPublic = false,
    } = req.body;

    // Création de l'événement
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(`${startDate}T${startTime}:00.000Z`),
        endDate: endDate
          ? new Date(`${endDate}T${endTime || "23:59"}:00.000Z`)
          : null,
        location,
        address,
        city,
        postalCode,
        country,
        capacity: capacity ? parseInt(capacity) : null,
        budget: budget ? parseFloat(budget) : null,
        isPublic,
        organizerId: req.user.id,
      },
      include: {
        _count: {
          select: {
            invitations: true,
            contributions: true,
          },
        },
      },
    });

    logSecurity("Nouvel événement créé", {
      eventId: event.id,
      title: event.title,
      organizerId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      data: { event },
    });
  })
);

/**
 * PUT /api/events/:id
 * Mettre à jour un événement
 */
router.put(
  "/:id",
  authenticateToken,
  updateEventValidation,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Vérifier que l'événement existe et appartient à l'utilisateur
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        organizerId: req.user.id,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Événement non trouvé",
          code: "EVENT_NOT_FOUND",
        },
      });
    }

    // Validation des données
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Données de validation invalides",
          code: "VALIDATION_ERROR",
          details: errors.array(),
        },
      });
    }

    const updateData = { ...req.body };

    // Traitement des dates si fournies
    if (updateData.startDate && updateData.startTime) {
      updateData.startDate = new Date(
        `${updateData.startDate}T${updateData.startTime}:00.000Z`
      );
    }

    if (updateData.endDate && updateData.endTime) {
      updateData.endDate = new Date(
        `${updateData.endDate}T${updateData.endTime}:00.000Z`
      );
    }

    // Supprimer les champs non modifiables
    delete updateData.organizerId;
    delete updateData.createdAt;

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            invitations: true,
            contributions: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Événement mis à jour avec succès",
      data: { event },
    });
  })
);

/**
 * DELETE /api/events/:id
 * Supprimer un événement
 */
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Vérifier que l'événement existe et appartient à l'utilisateur
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        organizerId: req.user.id,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Événement non trouvé",
          code: "EVENT_NOT_FOUND",
        },
      });
    }

    // Supprimer l'événement (cascade supprimera les relations)
    await prisma.event.delete({
      where: { id },
    });

    logSecurity("Événement supprimé", {
      eventId: id,
      title: existingEvent.title,
      organizerId: req.user.id,
    });

    res.json({
      success: true,
      message: "Événement supprimé avec succès",
    });
  })
);

/**
 * POST /api/events/:id/invite
 * Inviter des personnes à un événement
 */
router.post(
  "/:id/invite",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { emails, message } = req.body;

    // Vérifier que l'événement existe et appartient à l'utilisateur
    const event = await prisma.event.findFirst({
      where: {
        id,
        organizerId: req.user.id,
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Événement non trouvé",
          code: "EVENT_NOT_FOUND",
        },
      });
    }

    // Créer les invitations
    const invitations = await Promise.all(
      emails.map((email) =>
        prisma.eventInvitation.create({
          data: {
            eventId: id,
            email,
            message,
          },
        })
      )
    );

    res.json({
      success: true,
      message: "Invitations envoyées avec succès",
      data: { invitations },
    });
  })
);

module.exports = router;
