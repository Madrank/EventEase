/**
 * EventEase Server - API Backend
 * Conforme référentiel DWWM 2023
 *
 * @author EventEase Team
 * @version 1.0.0
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { logger } = require("./utils/logger");
const { errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const userRoutes = require("./routes/users");
const providerRoutes = require("./routes/providers");
const venueRoutes = require("./routes/venues");

const app = express();
const PORT = process.env.PORT || 3001;

// Initialisation Prisma
const prisma = new PrismaClient();

// Middleware de sécurité
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        scriptSrc: [
          "'self'",
          "https://cdn.tailwindcss.com",
          "https://unpkg.com",
        ],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "ws:", "wss:"],
      },
    },
  })
);

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Compression
app.use(compression());

// Logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
    retryAfter: Math.ceil(
      parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 / 60
    ),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slow down pour les requêtes répétées
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Permettre 50 requêtes par 15 minutes, puis commencer à ralentir
  delayMs: () => 500, // Ajouter 500ms de délai par requête après delayAfter
});

app.use("/api/", limiter);
app.use("/api/", speedLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes de santé
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/venues", venueRoutes);

// Route de test pour la documentation
app.get("/api", (req, res) => {
  res.json({
    message: "EventEase API v1.0.0",
    documentation: "/api/docs",
    health: "/health",
    endpoints: {
      auth: "/api/auth",
      events: "/api/events",
      users: "/api/users",
      providers: "/api/providers",
      venues: "/api/venues",
    },
  });
});

// Gestion des routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    message: `La route ${req.method} ${req.originalUrl} n'existe pas`,
    availableRoutes: [
      "GET /health",
      "GET /api",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "GET /api/events",
      "POST /api/events",
      "GET /api/users/profile",
      "GET /api/providers",
      "GET /api/venues",
    ],
  });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Gestion des erreurs non capturées
process.on("uncaughtException", (error) => {
  logger.error("Erreur non capturée:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Promesse rejetée non gérée:", reason);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("Signal SIGTERM reçu, fermeture gracieuse...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("Signal SIGINT reçu, fermeture gracieuse...");
  await prisma.$disconnect();
  process.exit(0);
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await prisma.$connect();
    logger.info("Connexion à la base de données établie");

    app.listen(PORT, () => {
      logger.info(`🚀 Serveur EventEase démarré sur le port ${PORT}`);
      logger.info(`📚 Documentation API: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environnement: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
