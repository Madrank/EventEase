/*
 * Configuration du logger Winston
 */

const winston = require("winston");
const path = require("path");

// Configuration des formats
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "HH:mm:ss",
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Configuration du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: {
    service: "eventease-api",
    version: process.env.npm_package_version || "1.0.0",
  },
  transports: [
    // Fichier de logs d'erreurs
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Fichier de logs combinés
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "exceptions.log"),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "rejections.log"),
    }),
  ],
});

// Ajouter le transport console en développement
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Fonctions utilitaires
const logRequest = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip || req.connection.remoteAddress,
    };

    if (res.statusCode >= 400) {
      logger.warn("Requête HTTP", logData);
    } else {
      logger.info("Requête HTTP", logData);
    }
  });

  next();
};

const logError = (error, context = {}) => {
  logger.error("Erreur application", {
    message: error.message,
    stack: error.stack,
    ...context,
  });
};

const logSecurity = (event, details = {}) => {
  logger.warn("Événement de sécurité", {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  logger,
  logRequest,
  logError,
  logSecurity,
};
