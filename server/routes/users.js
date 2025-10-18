/**
 * Routes pour la gestion des utilisateurs
 * Conforme référentiel DWWM 2023
 */

const express = require("express");
const { body, validationResult } = require("express-validator");
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

/**
 * GET /api/users/profile
 * Récupérer le profil de l'utilisateur connecté
 */
router.get(
  "/profile",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Utilisateur non trouvé",
          code: "USER_NOT_FOUND",
        },
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  })
);

/**
 * PUT /api/users/profile
 * Mettre à jour le profil de l'utilisateur
 */
router.put(
  "/profile",
  authenticateToken,
  [
    body("firstName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Le prénom doit contenir entre 2 et 50 caractères"),
    body("lastName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Le nom doit contenir entre 2 et 50 caractères"),
    body("phone")
      .optional()
      .isMobilePhone("fr-FR")
      .withMessage("Numéro de téléphone invalide"),
  ],
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

    const { firstName, lastName, phone } = req.body;
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      data: { user },
    });
  })
);

module.exports = router;
