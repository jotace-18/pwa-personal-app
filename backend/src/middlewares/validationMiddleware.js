// src/middlewares/validationMiddleware.js

/**
 * @function validateBody
 * @description Middleware para validar el cuerpo de la solicitud (req.body) contra un esquema Joi.
 * @param {object} schema - Esquema Joi para validar.
 * @returns {Function} Middleware de Express.
 */
export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const err = new Error(error.details.map(d => d.message).join(', '));
    err.status = 400; // Bad Request
    return next(err);
  }
  next();
};

/**
 * @function validateQuery
 * @description Middleware para validar los parámetros de consulta (req.query) contra un esquema Joi.
 * @param {object} schema - Esquema Joi para validar.
 * @returns {Function} Middleware de Express.
 */
export const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query);
  if (error) {
    const err = new Error(error.details.map(d => d.message).join(', '));
    err.status = 400; // Bad Request
    return next(err);
  }
  next();
};
