/*
 * Routes pour la gestion des lieux
 */

const express = require("express");
const { body, validationResult, query } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();
const prisma = new PrismaClient();

// Validation pour la création de lieu
const createVenueValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Le nom doit contenir entre 1 et 100 caractères"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("La description doit contenir au moins 10 caractères"),
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
    .isInt({ min: 1 })
    .withMessage("La capacité doit être un entier positif"),
  body("pricePerDay")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Le prix par jour doit être un nombre positif"),
  body("amenities")
    .optional()
    .isArray()
    .withMessage("Les équipements doivent être un tableau"),
  body("images")
    .optional()
    .isArray()
    .withMessage("Les images doivent être un tableau"),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("La latitude doit être entre -90 et 90"),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("La longitude doit être entre -180 et 180"),
];

/**
 * GET /api/venues
 * Récupérer la liste des lieux
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 12,
      city,
      minCapacity,
      maxCapacity,
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

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (minCapacity) {
      where.capacity = { gte: parseInt(minCapacity) };
    }

    if (maxCapacity) {
      where.capacity = {
        ...where.capacity,
        lte: parseInt(maxCapacity),
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    // Construction du tri
    const orderBy = {};
    if (sortBy === "rating") {
      orderBy.rating = sortOrder;
    } else if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else if (sortBy === "capacity") {
      orderBy.capacity = sortOrder;
    } else if (sortBy === "price") {
      orderBy.pricePerDay = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    // Récupération des lieux
    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      }),
      prisma.venue.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        venues,
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
 * GET /api/venues/:id
 * Récupérer un lieu par son ID
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const venue = await prisma.venue.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!venue) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Lieu non trouvé",
          code: "VENUE_NOT_FOUND",
        },
      });
    }

    res.json({
      success: true,
      data: { venue },
    });
  })
);

/**
 * POST /api/venues
 * Créer un nouveau lieu
 */
router.post(
  "/",
  createVenueValidation,
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
      address,
      city,
      postalCode,
      country = "France",
      capacity,
      pricePerDay,
      amenities = [],
      images = [],
      latitude,
      longitude,
    } = req.body;

    // Création du lieu
    const venue = await prisma.venue.create({
      data: {
        name,
        description,
        address,
        city,
        postalCode,
        country,
        capacity: parseInt(capacity),
        pricePerDay: pricePerDay ? parseFloat(pricePerDay) : null,
        amenities,
        images,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Lieu créé avec succès",
      data: { venue },
    });
  })
);

/**
 * PUT /api/venues/:id
 * Mettre à jour un lieu
 */
router.put(
  "/:id",
  createVenueValidation,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Vérifier que le lieu existe
    const existingVenue = await prisma.venue.findUnique({
      where: { id },
    });

    if (!existingVenue) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Lieu non trouvé",
          code: "VENUE_NOT_FOUND",
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

    // Conversion des types
    if (updateData.capacity) {
      updateData.capacity = parseInt(updateData.capacity);
    }
    if (updateData.pricePerDay) {
      updateData.pricePerDay = parseFloat(updateData.pricePerDay);
    }
    if (updateData.latitude) {
      updateData.latitude = parseFloat(updateData.latitude);
    }
    if (updateData.longitude) {
      updateData.longitude = parseFloat(updateData.longitude);
    }

    // Supprimer les champs non modifiables
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.rating;
    delete updateData.reviewCount;

    const venue = await prisma.venue.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Lieu mis à jour avec succès",
      data: { venue },
    });
  })
);

/**
 * DELETE /api/venues/:id
 * Supprimer un lieu (soft delete)
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Vérifier que le lieu existe
    const existingVenue = await prisma.venue.findUnique({
      where: { id },
    });

    if (!existingVenue) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Lieu non trouvé",
          code: "VENUE_NOT_FOUND",
        },
      });
    }

    // Soft delete
    await prisma.venue.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: "Lieu supprimé avec succès",
    });
  })
);

/**
 * GET /api/venues/search/nearby
 * Rechercher des lieux à proximité
 */
router.get(
  "/search/nearby",
  asyncHandler(async (req, res) => {
    const { latitude, longitude, radius = 10, limit = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Latitude et longitude sont requises",
          code: "MISSING_COORDINATES",
        },
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    // Requête SQL brute pour la recherche géographique
    const venues = await prisma.$queryRaw`
    SELECT *,
      (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * 
       cos(radians(longitude) - radians(${lng})) + 
       sin(radians(${lat})) * sin(radians(latitude)))) AS distance
    FROM "venues"
    WHERE is_active = true
      AND latitude IS NOT NULL 
      AND longitude IS NOT NULL
      AND (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * 
           cos(radians(longitude) - radians(${lng})) + 
           sin(radians(${lat})) * sin(radians(latitude)))) <= ${rad}
    ORDER BY distance
    LIMIT ${parseInt(limit)}
  `;

    res.json({
      success: true,
      data: { venues },
    });
  })
);

/**
 * GET /api/venues/amenities
 * Récupérer la liste des équipements disponibles
 */
router.get(
  "/amenities",
  asyncHandler(async (req, res) => {
    const amenities = [
      { value: "parking", label: "Parking", icon: "🅿️" },
      { value: "wifi", label: "WiFi", icon: "📶" },
      { value: "air_conditioning", label: "Climatisation", icon: "❄️" },
      { value: "heating", label: "Chauffage", icon: "🔥" },
      { value: "kitchen", label: "Cuisine", icon: "🍳" },
      { value: "bar", label: "Bar", icon: "🍸" },
      { value: "stage", label: "Scène", icon: "🎭" },
      { value: "sound_system", label: "Système son", icon: "🔊" },
      { value: "projector", label: "Projecteur", icon: "📽️" },
      { value: "outdoor_space", label: "Espace extérieur", icon: "🌳" },
      { value: "disabled_access", label: "Accès handicapés", icon: "♿" },
      { value: "security", label: "Sécurité", icon: "🔒" },
    ];

    res.json({
      success: true,
      data: { amenities },
    });
  })
);

module.exports = router;
