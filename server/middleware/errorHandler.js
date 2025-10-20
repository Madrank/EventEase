/**
 * Middleware de gestion d'erreurs centralisé
 * Conforme référentiel DWWM 2023
 */

const { logger, logError } = require("../utils/logger");

/**
 * Middleware de gestion d'erreurs Express
 * @param {Error} err - L'erreur à traiter
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction next Express
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  logError(err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: req.user?.id,
  });

  // Erreur de validation Prisma
  if (err.code === "P2002") {
    const message = "Violation de contrainte unique";
    error = {
      message,
      statusCode: 400,
      code: "UNIQUE_CONSTRAINT_VIOLATION",
    };
  }

  // Erreur de validation Prisma
  if (err.code === "P2025") {
    const message = "Ressource non trouvée";
    error = {
      message,
      statusCode: 404,
      code: "RECORD_NOT_FOUND",
    };
  }

  // Erreur de validation Joi
  if (err.isJoi) {
    const message = "Données de validation invalides";
    error = {
      message,
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details: err.details,
    };
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    const message = "Token JWT invalide";
    error = {
      message,
      statusCode: 401,
      code: "INVALID_TOKEN",
    };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token JWT expiré";
    error = {
      message,
      statusCode: 401,
      code: "TOKEN_EXPIRED",
    };
  }

  // Erreur de validation Express
  if (err.type === "entity.parse.failed") {
    const message = "Format JSON invalide";
    error = {
      message,
      statusCode: 400,
      code: "INVALID_JSON",
    };
  }

  // Erreur de limite de taille de fichier
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "Fichier trop volumineux";
    error = {
      message,
      statusCode: 413,
      code: "FILE_TOO_LARGE",
    };
  }

  // Erreur de limite de requêtes
  if (err.status === 429) {
    const message = "Trop de requêtes, veuillez réessayer plus tard";
    error = {
      message,
      statusCode: 429,
      code: "RATE_LIMIT_EXCEEDED",
    };
  }

  // Erreur par défaut
  const statusCode = error.statusCode || 500;
  const message = error.message || "Erreur interne du serveur";

  // Réponse d'erreur
  const errorResponse = {
    success: false,
    error: {
      message,
      code: error.code || "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        details: error.details,
      }),
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Log de sécurité pour les erreurs d'authentification
  if (statusCode === 401 || statusCode === 403) {
    logger.warn("Tentative d'accès non autorisée", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.originalUrl,
      method: req.method,
      error: message,
    });
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware pour capturer les routes non trouvées
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction next Express
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Wrapper pour les fonctions async/await
 * @param {Function} fn - Fonction async à wrapper
 * @returns {Function} - Fonction wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
};

