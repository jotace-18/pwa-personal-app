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
} from './nutrients.controller.js';

/**
 * @file Define las rutas para la API de nutrientes.
 * @module routes/nutrientRoutes
 * @requires express
 * @requires joi
 * @requires middlewares/validationMiddleware
 * @requires middlewares/authMiddleware
 * @requires modules/nutrients/nutrients.controller
 */

const router = Router();

/**
 * Esquema de validación para la creación de un nutriente.
 * @const {Joi.ObjectSchema} createSchema
 * @property {string} name - Nombre del nutriente. Requerido, máximo 50 caracteres.
 */
const createSchema = Joi.object({
  name: Joi.string().max(50).required()
});

/**
 * Esquema de validación para la actualización de un nutriente.
 * @const {Joi.ObjectSchema} updateSchema
 * @property {string} [name] - Nombre del nutriente. Opcional, máximo 50 caracteres. Debe haber al menos un campo.
 */
const updateSchema = Joi.object({
  name: Joi.string().max(50).optional()
}).min(1);

/**
 * Esquema de validación para la lista de nutrientes.
 * @const {Joi.ObjectSchema} listSchema
 * @property {number} [page] - Número de página. Opcional, entero, mínimo 1.
 * @property {number} [limit] - Límite de resultados por página. Opcional, entero, mínimo 1.
 * @property {object} [filter] - Objeto de filtro. Opcional.
 * @property {string} [filter.name] - Filtrar por nombre. Opcional.
 */
const listSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  filter: Joi.object({
    name: Joi.string().optional()
  }).optional()
});

// Rutas públicas
/**
 * @route GET /api/nutrients
 * @summary Lista todos los nutrientes con paginación y filtros.
 * @tags Nutrients
 * @param {number} [page=1] - Número de página.
 * @param {number} [limit=10] - Límite de resultados por página.
 * @param {string} [filter.name] - Filtrar por nombre.
 * @returns {object} 200 - Respuesta exitosa con la lista de nutrientes.
 * @returns {Error} 400 - Error de validación.
 * @returns {Error} 500 - Error del servidor.
 */
router.get('/',   validateQuery(listSchema), list);
/**
 * @route GET /api/nutrients/{id}
 * @summary Obtiene un nutriente por su ID.
 * @tags Nutrients
 * @param {string} id.path.required - ID del nutriente.
 * @returns {object} 200 - Respuesta exitosa con el nutriente.
 * @returns {Error} 404 - Nutriente no encontrado.
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
 * @route POST /api/nutrients
 * @summary Crea un nuevo nutriente. (Requiere rol admin)
 * @tags Nutrients
 * @security BearerAuth
 * @param {object} request.body.required - Datos del nutriente.
 * @example request - {"name": "Proteína"}
 * @returns {object} 201 - Nutriente creado exitosamente.
 * @returns {Error} 400 - Error de validación o datos incorrectos.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 500 - Error del servidor.
 */
router.post('/',    validateBody(createSchema), create);
/**
 * @route PUT /api/nutrients/{id}
 * @summary Actualiza un nutriente existente. (Requiere rol admin)
 * @tags Nutrients
 * @security BearerAuth
 * @param {string} id.path.required - ID del nutriente a actualizar.
 * @param {object} request.body.required - Datos a actualizar.
 * @example request - {"name": "Carbohidratos"}
 * @returns {object} 200 - Nutriente actualizado exitosamente.
 * @returns {Error} 400 - Error de validación o no se pudo actualizar.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Nutriente no encontrado.
 * @returns {Error} 500 - Error del servidor.
 */
router.put('/:id',  validateBody(updateSchema), update);
/**
 * @route DELETE /api/nutrients/{id}
 * @summary Elimina un nutriente. (Requiere rol admin)
 * @tags Nutrients
 * @security BearerAuth
 * @param {string} id.path.required - ID del nutriente a eliminar.
 * @returns {object} 200 - Mensaje de confirmación.
 * @example response - {"message": "Nutriente eliminado correctamente"}
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Nutriente no encontrado.
 * @returns {Error} 500 - Error del servidor.
 */
router.delete('/:id',                   remove);

export default router;
