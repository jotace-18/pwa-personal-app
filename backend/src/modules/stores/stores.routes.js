/**
 * @file Define las rutas para la API de tiendas.
 * @module routes/storeRoutes
 * @requires express
 * @requires joi
 * @requires middlewares/validationMiddleware
 * @requires middlewares/authMiddleware
 * @requires modules/stores/store.controller
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
} from './stores.controller.js';

const router = Router();

/**
 * Esquema de validación para la creación de una tienda.
 * @const {Joi.ObjectSchema} createSchema
 * @property {string} name - Nombre de la tienda. Requerido, máximo 100 caracteres.
 */
const createSchema = Joi.object({
  name: Joi.string().max(100).required()
});

/**
 * Esquema de validación para la actualización de una tienda.
 * @const {Joi.ObjectSchema} updateSchema
 * @property {string} [name] - Nombre de la tienda. Opcional, máximo 100 caracteres. Debe haber al menos un campo.
 */
const updateSchema = Joi.object({
  name: Joi.string().max(100).optional()
}).min(1);

/**
 * Esquema de validación para la lista de tiendas.
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
 * @route GET /api/stores
 * @summary Lista todas las tiendas con paginación y filtros.
 * @tags Stores
 * @param {number} [page=1] - Número de página.
 * @param {number} [limit=10] - Límite de resultados por página.
 * @param {string} [filter.name] - Filtrar por nombre.
 * @returns {object} 200 - Respuesta exitosa con la lista de tiendas.
 * @returns {Error} 400 - Error de validación.
 * @returns {Error} 500 - Error del servidor.
 */
router.get('/',   validateQuery(listSchema), list);
/**
 * @route GET /api/stores/{id}
 * @summary Obtiene una tienda por su ID.
 * @tags Stores
 * @param {string} id.path.required - ID de la tienda.
 * @returns {object} 200 - Respuesta exitosa con la tienda.
 * @returns {Error} 404 - Tienda no encontrada.
 * @returns {Error} 500 - Error del servidor.
 */
router.get('/:id',               getById);

// A partir de aquí, sólo admin
/**
 * Middleware para verificar que el usuario es administrador.
 * @private
 */
router.use(authMiddleware('admin'));

/**
 * @route POST /api/stores
 * @summary Crea una nueva tienda. (Requiere rol admin)
 * @tags Stores
 * @security BearerAuth
 * @param {object} request.body.required - Datos de la tienda.
 * @example request - {"name": "Mercadona"}
 * @returns {object} 201 - Tienda creada exitosamente.
 * @returns {Error} 400 - Error de validación o datos incorrectos.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 500 - Error del servidor.
 */
router.post('/',    validateBody(createSchema), create);
/**
 * @route PUT /api/stores/{id}
 * @summary Actualiza una tienda existente. (Requiere rol admin)
 * @tags Stores
 * @security BearerAuth
 * @param {string} id.path.required - ID de la tienda a actualizar.
 * @param {object} request.body.required - Datos a actualizar.
 * @example request - {"name": "Carrefour Express"}
 * @returns {object} 200 - Tienda actualizada exitosamente.
 * @returns {Error} 400 - Error de validación o no se pudo actualizar.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Tienda no encontrada.
 * @returns {Error} 500 - Error del servidor.
 */
router.put('/:id',  validateBody(updateSchema), update);
/**
 * @route DELETE /api/stores/{id}
 * @summary Elimina una tienda. (Requiere rol admin)
 * @tags Stores
 * @security BearerAuth
 * @param {string} id.path.required - ID de la tienda a eliminar.
 * @returns {object} 200 - Mensaje de confirmación.
 * @example response - {"message": "Tienda eliminada correctamente"}
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Tienda no encontrada.
 * @returns {Error} 500 - Error del servidor.
 */
router.delete('/:id',                   remove);

export default router;
