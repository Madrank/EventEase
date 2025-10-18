/**
 * Routes pour la gestion des prestataires
 * Conforme référentiel DWWM 2023
 */

const express = require("express");
const { body, validationResult, query } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();
const prisma = new PrismaClient();

// Validation pour la création de prestataire
const createProviderValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Le nom doit contenir entre 1 et 100 caractères"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("La description doit contenir au moins 10 caractères"),
  body("category")
    .isIn([
      "CATERING",
      "PHOTOGRAPHY",
      "MUSIC",
      "DECORATION",
      "VENUE",
      "TRANSPORT",
      "OTHER",
    ])
    .withMessage("Catégorie invalide"),
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("phone")
    .optional()
    .isMobilePhone("fr-FR")
    .withMessage("Numéro de téléphone invalide"),
  body("address")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("L'adresse est requise si fournie"),
  body("city")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("La ville est requise si fournie"),
  body("postalCode")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Le code postal est requis si fourni"),
  body("priceRange")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(
      "La fourchette de prix doit contenir entre 1 et 50 caractères"
    ),
];

/**
 * GET /api/providers
 * Récupérer la liste des prestataires
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 12,
      category,
      city,
      search,
      minRating = 0,
      sortBy = "rating",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construction des filtres
    const where = {
      isActive: true,
      rating: { gte: parseFloat(minRating) },
    };

    if (category && category !== "all") {
      where.category = category.toUpperCase();
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Construction du tri
    const orderBy = {};
    if (sortBy === "rating") {
      orderBy.rating = sortOrder;
    } else if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else if (sortBy === "price") {
      orderBy.priceRange = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    // Récupération des prestataires
    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          _count: {
            select: {
              reviews: true,
              bookings: true,
            },
          },
        },
      }),
      prisma.provider.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        providers,
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
 * GET /api/providers/:id
 * Récupérer un prestataire par son ID
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const provider = await prisma.provider.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Prestataire non trouvé",
          code: "PROVIDER_NOT_FOUND",
        },
      });
    }

    res.json({
      success: true,
      data: { provider },
    });
  })
);

/**
 * POST /api/providers
 * Créer un nouveau prestataire
 */
router.post(
  "/",
  createProviderValidation,
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
      name,
      description,
      category,
      email,
      phone,
      website,
      address,
      city,
      postalCode,
      country = "France",
      priceRange,
      images = [],
    } = req.body;

    // Vérifier si un prestataire avec cet email existe déjà
    const existingProvider = await prisma.provider.findFirst({
      where: { email },
    });

    if (existingProvider) {
      return res.status(409).json({
        success: false,
        error: {
          message: "Un prestataire avec cet email existe déjà",
          code: "PROVIDER_ALREADY_EXISTS",
        },
      });
    }

    // Création du prestataire
    const provider = await prisma.provider.create({
      data: {
        name,
        description,
        category,
        email,
        phone,
        website,
        address,
        city,
        postalCode,
        country,
        priceRange,
        images,
      },
      include: {
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Prestataire créé avec succès",
      data: { provider },
    });
  })
);

/**
 * PUT /api/providers/:id
 * Mettre à jour un prestataire
 */
router.put(
  "/:id",
  createProviderValidation,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Vérifier que le prestataire existe
    const existingProvider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!existingProvider) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Prestataire non trouvé",
          code: "PROVIDER_NOT_FOUND",
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

    // Supprimer les champs non modifiables
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.rating;
    delete updateData.reviewCount;

    const provider = await prisma.provider.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Prestataire mis à jour avec succès",
      data: { provider },
    });
  })
);

/**
 * DELETE /api/providers/:id
 * Supprimer un prestataire (soft delete)
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Vérifier que le prestataire existe
    const existingProvider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!existingProvider) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Prestataire non trouvé",
          code: "PROVIDER_NOT_FOUND",
        },
      });
    }

    // Soft delete
    await prisma.provider.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: "Prestataire supprimé avec succès",
    });
  })
);

/**
 * GET /api/providers/categories
 * Récupérer les catégories de prestataires
 */
router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const categories = [
      { value: "CATERING", label: "Traiteur", icon: "🍽️" },
      { value: "PHOTOGRAPHY", label: "Photographe", icon: "📸" },
      { value: "MUSIC", label: "Musique", icon: "🎵" },
      { value: "DECORATION", label: "Décoration", icon: "🎨" },
      { value: "VENUE", label: "Lieu", icon: "🏛️" },
      { value: "TRANSPORT", label: "Transport", icon: "🚗" },
      { value: "OTHER", label: "Autre", icon: "⭐" },
    ];

    res.json({
      success: true,
      data: { categories },
    });
  })
);

/**
 * POST /api/providers/:id/reviews
 * Ajouter un avis sur un prestataire
 */
router.post(
  "/:id/reviews",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: {
          message: "La note doit être entre 1 et 5",
          code: "INVALID_RATING",
        },
      });
    }

    // Vérifier que le prestataire existe
    const provider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Prestataire non trouvé",
          code: "PROVIDER_NOT_FOUND",
        },
      });
    }

    // Créer l'avis
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        providerId: id,
        userId: "user-123", // À remplacer par l'ID de l'utilisateur connecté
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Mettre à jour la note moyenne du prestataire
    const reviews = await prisma.review.findMany({
      where: { providerId: id },
    });

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.provider.update({
      where: { id },
      data: {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });

    res.status(201).json({
      success: true,
      message: "Avis ajouté avec succès",
      data: { review },
    });
  })
);

module.exports = router;
