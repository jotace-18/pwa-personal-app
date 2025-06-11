/**
 * @file Define las rutas para la API de tipos de comida.
 * @module routes/mealTypeRoutes
 * @requires express
 * @requires joi
 * @requires middlewares/validationMiddleware
 * @requires middlewares/authMiddleware
 * @requires modules/mealTypes/mealType.controller
 */

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
} from './mealType.controller.js';

const router = Router();

/**
 * Esquema de validación para la creación de un tipo de comida.
 * @const {Joi.ObjectSchema} createSchema
 * @property {string} name - Nombre del tipo de comida. Requerido, máximo 30 caracteres.
 */
const createSchema = Joi.object({
  name: Joi.string().max(30).required()
});

/**
 * Esquema de validación para la actualización de un tipo de comida.
 * @const {Joi.ObjectSchema} updateSchema
 * @property {string} [name] - Nombre del tipo de comida. Opcional, máximo 30 caracteres. Debe haber al menos un campo.
 */
const updateSchema = Joi.object({
  name: Joi.string().max(30).optional()
}).min(1);

/**
 * Esquema de validación para la lista de tipos de comida.
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
 * @route GET /api/meal-types
 * @summary Lista todos los tipos de comida con paginación y filtros.
 * @tags MealTypes
 * @param {number} [page=1] - Número de página.
 * @param {number} [limit=50] - Límite de resultados por página.
 * @param {string} [filter.name] - Filtrar por nombre.
 * @returns {object} 200 - Respuesta exitosa con la lista de tipos de comida.
 * @returns {Error} 400 - Error de validación.
 * @returns {Error} 500 - Error del servidor.
 */
router.get('/', validateQuery(listSchema), list);
/**
 * @route GET /api/meal-types/{id}
 * @summary Obtiene un tipo de comida por su ID.
 * @tags MealTypes
 * @param {string} id.path.required - ID del tipo de comida.
 * @returns {object} 200 - Respuesta exitosa con el tipo de comida.
 * @returns {Error} 404 - Tipo de comida no encontrado.
 * @returns {Error} 500 - Error del servidor.
 */
router.get('/:id',                getById);

// Rutas protegidas solo admin
/**
 * Middleware para verificar que el usuario es administrador.
 * @private
 */
router.use(authMiddleware('admin'));
/**
 * @route POST /api/meal-types
 * @summary Crea un nuevo tipo de comida. (Requiere rol admin)
 * @tags MealTypes
 * @security BearerAuth
 * @param {object} request.body.required - Datos del tipo de comida.
 * @example request - {"name": "Merienda"}
 * @returns {object} 201 - Tipo de comida creado exitosamente.
 * @returns {Error} 400 - Error de validación o datos incorrectos.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 500 - Error del servidor.
 */
router.post('/',    validateBody(createSchema), create);
/**
 * @route PUT /api/meal-types/{id}
 * @summary Actualiza un tipo de comida existente. (Requiere rol admin)
 * @tags MealTypes
 * @security BearerAuth
 * @param {string} id.path.required - ID del tipo de comida a actualizar.
 * @param {object} request.body.required - Datos a actualizar.
 * @example request - {"name": "Cena Ligera"}
 * @returns {object} 200 - Tipo de comida actualizado exitosamente.
 * @returns {Error} 400 - Error de validación o no se pudo actualizar.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Tipo de comida no encontrado.
 * @returns {Error} 500 - Error del servidor.
 */
router.put('/:id',  validateBody(updateSchema), update);
/**
 * @route DELETE /api/meal-types/{id}
 * @summary Elimina un tipo de comida. (Requiere rol admin)
 * @tags MealTypes
 * @security BearerAuth
 * @param {string} id.path.required - ID del tipo de comida a eliminar.
 * @returns {object} 200 - Mensaje de confirmación.
 * @example response - {"message": "MealType eliminado correctamente"}
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Tipo de comida no encontrado.
 * @returns {Error} 500 - Error del servidor.
 */
router.delete('/:id',                   remove);

export default router;
