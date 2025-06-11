import { Router } from 'express';
import Joi from 'joi';
import { validateBody, validateQuery } from '../../middlewares/validationMiddleware.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import {
  create,
  list,
  getById,
  update,
  remove
} from './units.controller.js';

/**
 * @file Define las rutas para la API de unidades de medida.
 * @module routes/unitRoutes
 * @requires express
 * @requires joi
 * @requires middlewares/validationMiddleware
 * @requires middlewares/authMiddleware
 * @requires modules/units/units.controller
 */

const router = Router();

/**
 * Esquema de validación para la creación de una unidad.
 * @const {Joi.ObjectSchema} createSchema
 * @property {string} name - Nombre de la unidad. Requerido, máximo 30 caracteres.
 * @property {string} abbreviation - Abreviatura de la unidad. Requerido, máximo 10 caracteres.
 * @property {number} to_base_factor - Factor de conversión a la unidad base. Requerido, precisión 6 decimales.
 */
const createSchema = Joi.object({
  name:            Joi.string().max(30).required(),
  abbreviation:    Joi.string().max(10).required(),
  to_base_factor:  Joi.number().precision(6).required()
});

/**
 * Esquema de validación para la actualización de una unidad.
 * @const {Joi.ObjectSchema} updateSchema
 * @property {string} [name] - Nombre de la unidad. Opcional, máximo 30 caracteres.
 * @property {string} [abbreviation] - Abreviatura de la unidad. Opcional, máximo 10 caracteres.
 * @property {number} [to_base_factor] - Factor de conversión. Opcional, precisión 6 decimales.
 * Debe haber al menos un campo.
 */
const updateSchema = Joi.object({
  name:            Joi.string().max(30).optional(),
  abbreviation:    Joi.string().max(10).optional(),
  to_base_factor:  Joi.number().precision(6).optional()
}).min(1);

/**
 * Esquema de validación para la lista de unidades.
 * @const {Joi.ObjectSchema} listSchema
 * @property {number} [page] - Número de página. Opcional, entero, mínimo 1.
 * @property {number} [limit] - Límite de resultados por página. Opcional, entero, mínimo 1.
 * @property {object} [filter] - Objeto de filtro. Opcional.
 * @property {string} [filter.name] - Filtrar por nombre. Opcional.
 * @property {string} [filter.abbreviation] - Filtrar por abreviatura. Opcional.
 */
const listSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  filter: Joi.object({
    name:         Joi.string().optional(),
    abbreviation: Joi.string().optional()
  }).optional()
});

// Rutas públicas
/**
 * @route GET /api/units
 * @summary Lista todas las unidades con paginación y filtros.
 * @tags Units
 * @param {number} [page=1] - Número de página.
 * @param {number} [limit=10] - Límite de resultados por página.
 * @param {string} [filter.name] - Filtrar por nombre.
 * @param {string} [filter.abbreviation] - Filtrar por abreviatura.
 * @returns {object} 200 - Respuesta exitosa con la lista de unidades.
 * @returns {Error} 400 - Error de validación.
 * @returns {Error} 500 - Error del servidor.
 */
router.get('/',   validateQuery(listSchema), list);
/**
 * @route GET /api/units/{id}
 * @summary Obtiene una unidad por su ID.
 * @tags Units
 * @param {string} id.path.required - ID de la unidad.
 * @returns {object} 200 - Respuesta exitosa con la unidad.
 * @returns {Error} 404 - Unidad no encontrada.
 * @returns {Error} 500 - Error del servidor.
 */
router.get('/:id',               getById);

// A partir de aquí, solo admin
/**
 * Middleware para verificar que el usuario es administrador.
 * @private
 */
router.use(authMiddleware('admin'));

/**
 * @route POST /api/units
 * @summary Crea una nueva unidad. (Requiere rol admin)
 * @tags Units
 * @security BearerAuth
 * @param {object} request.body.required - Datos de la unidad.
 * @example request - {"name": "Kilogramo", "abbreviation": "kg", "to_base_factor": 1}
 * @returns {object} 201 - Unidad creada exitosamente.
 * @returns {Error} 400 - Error de validación o datos incorrectos.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 500 - Error del servidor.
 */
router.post('/',    validateBody(createSchema), create);
/**
 * @route PUT /api/units/{id}
 * @summary Actualiza una unidad existente. (Requiere rol admin)
 * @tags Units
 * @security BearerAuth
 * @param {string} id.path.required - ID de la unidad a actualizar.
 * @param {object} request.body.required - Datos a actualizar.
 * @example request - {"name": "Gramo", "abbreviation": "gr"}
 * @returns {object} 200 - Unidad actualizada exitosamente.
 * @returns {Error} 400 - Error de validación o no se pudo actualizar.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Unidad no encontrada.
 * @returns {Error} 500 - Error del servidor.
 */
router.put('/:id',  validateBody(updateSchema), update);
/**
 * @route DELETE /api/units/{id}
 * @summary Elimina una unidad. (Requiere rol admin)
 * @tags Units
 * @security BearerAuth
 * @param {string} id.path.required - ID de la unidad a eliminar.
 * @returns {object} 200 - Mensaje de confirmación.
 * @example response - {"message": "Unidad eliminada correctamente"}
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Unidad no encontrada.
 * @returns {Error} 500 - Error del servidor.
 */
router.delete('/:id',                   remove);

export default router;
