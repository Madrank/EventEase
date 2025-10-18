/**
 * Middleware pour gérer les erreurs asynchrones
 * Conforme référentiel DWWM 2023
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;





