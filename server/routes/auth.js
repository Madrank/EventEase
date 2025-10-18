/*
 * Routes d'authentification
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const { asyncHandler } = require("../middleware/errorHandler");
const { logSecurity } = require("../utils/logger");

const router = express.Router();
const prisma = new PrismaClient();

// Validation des données d'inscription
const registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères"),
  body("phone")
    .optional()
    .isMobilePhone("fr-FR")
    .withMessage("Numéro de téléphone invalide"),
];

// Validation des données de connexion
const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 */
router.post(
  "/register",
  registerValidation,
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

    const { email, password, firstName, lastName, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logSecurity("Tentative d'inscription avec email existant", {
        email,
        ip: req.ip,
      });

      return res.status(409).json({
        success: false,
        error: {
          message: "Un compte avec cet email existe déjà",
          code: "USER_ALREADY_EXISTS",
        },
      });
    }

    // Hacher le mot de passe
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Créer une session
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      },
    });

    logSecurity("Nouvel utilisateur inscrit", {
      userId: user.id,
      email: user.email,
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      data: {
        user,
        token,
      },
    });
  })
);

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur
 */
router.post(
  "/login",
  loginValidation,
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

    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logSecurity("Tentative de connexion avec email inexistant", {
        email,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        error: {
          message: "Identifiants invalides",
          code: "INVALID_CREDENTIALS",
        },
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      logSecurity("Tentative de connexion avec compte désactivé", {
        userId: user.id,
        email: user.email,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        error: {
          message: "Compte désactivé",
          code: "ACCOUNT_DISABLED",
        },
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logSecurity("Tentative de connexion avec mot de passe incorrect", {
        userId: user.id,
        email: user.email,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        error: {
          message: "Identifiants invalides",
          code: "INVALID_CREDENTIALS",
        },
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Créer une session
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      },
    });

    logSecurity("Utilisateur connecté", {
      userId: user.id,
      email: user.email,
      ip: req.ip,
    });

    res.json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      },
    });
  })
);

/**
 * POST /api/auth/logout
 * Déconnexion d'un utilisateur
 */
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      // Supprimer la session
      await prisma.session.deleteMany({
        where: { token },
      });
    }

    res.json({
      success: true,
      message: "Déconnexion réussie",
    });
  })
);

/**
 * GET /api/auth/me
 * Récupérer les informations de l'utilisateur connecté
 */
router.get(
  "/me",
  asyncHandler(async (req, res) => {
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

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Vérifier la session
      const session = await prisma.session.findFirst({
        where: {
          token,
          userId: decoded.userId,
          expiresAt: { gt: new Date() },
        },
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          error: {
            message: "Session expirée",
            code: "SESSION_EXPIRED",
          },
        });
      }

      // Récupérer l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
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

      throw error;
    }
  })
);

module.exports = router;
