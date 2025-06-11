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
} from './products.controller.js';

/**
 * @file Define las rutas para la API de productos.
 * @module routes/productRoutes
 * @requires express
 * @requires joi
 * @requires middlewares/validationMiddleware
 * @requires middlewares/authMiddleware
 * @requires modules/products/products.controller
 */

const router = Router();

/**
 * Esquema de validación para la creación de un producto.
 * @const {Joi.ObjectSchema} createSchema
 * @property {number} food_id - ID del alimento. Requerido, entero.
 * @property {number} store_id - ID de la tienda. Requerido, entero.
 * @property {string} brand - Marca del producto. Requerido, máximo 50 caracteres.
 * @property {number} price_per_100g - Precio por 100g. Requerido, precisión 2 decimales.
 * @property {number} [calories_per_100g] - Calorías por 100g. Opcional, precisión 2 decimales.
 */
const createSchema = Joi.object({
  food_id:           Joi.number().integer().required(),
  store_id:          Joi.number().integer().required(),
  brand:             Joi.string().max(50).required(),
  price_per_100g:    Joi.number().precision(2).required(),
  calories_per_100g: Joi.number().precision(2).optional()
});

/**
 * Esquema de validación para la actualización de un producto.
 * @const {Joi.ObjectSchema} updateSchema
 * @property {number} [food_id] - ID del alimento. Opcional, entero.
 * @property {number} [store_id] - ID de la tienda. Opcional, entero.
 * @property {string} [brand] - Marca del producto. Opcional, máximo 50 caracteres.
 * @property {number} [price_per_100g] - Precio por 100g. Opcional, precisión 2 decimales.
 * @property {number} [calories_per_100g] - Calorías por 100g. Opcional, precisión 2 decimales.
 * Debe haber al menos un campo.
 */
const updateSchema = Joi.object({
  food_id:           Joi.number().integer().optional(),
  store_id:          Joi.number().integer().optional(),
  brand:             Joi.string().max(50).optional(),
  price_per_100g:    Joi.number().precision(2).optional(),
  calories_per_100g: Joi.number().precision(2).optional()
}).min(1);

/**
 * Esquema de validación para la lista de productos.
 * @const {Joi.ObjectSchema} listSchema
 * @property {number} [page] - Número de página. Opcional, entero, mínimo 1.
 * @property {number} [limit] - Límite de resultados por página. Opcional, entero, mínimo 1.
 * @property {object} [filter] - Objeto de filtro. Opcional.
 * @property {number} [filter.food_id] - Filtrar por ID de alimento. Opcional, entero.
 * @property {number} [filter.store_id] - Filtrar por ID de tienda. Opcional, entero.
 * @property {string} [filter.brand] - Filtrar por marca. Opcional.
 */
const listSchema = Joi.object({
  page:   Joi.number().integer().min(1).optional(),
  limit:  Joi.number().integer().min(1).optional(),
  filter: Joi.object({
    food_id:           Joi.number().integer().optional(),
    store_id:          Joi.number().integer().optional(),
    brand:             Joi.string().optional()
  }).optional()
});

// Rutas públicas
/**
 * @route GET /api/products
 * @summary Lista todos los productos con paginación y filtros.
 * @tags Products
 * @param {number} [page=1] - Número de página.
 * @param {number} [limit=10] - Límite de resultados por página.
 * @param {number} [filter.food_id] - Filtrar por ID de alimento.
 * @param {number} [filter.store_id] - Filtrar por ID de tienda.
 * @param {string} [filter.brand] - Filtrar por marca.
 * @returns {object} 200 - Respuesta exitosa con la lista de productos.
 * @returns {Error} 400 - Error de validación.
 * @returns {Error} 500 - Error del servidor.
 */
router.get('/',   validateQuery(listSchema), list);
/**
 * @route GET /api/products/{product_id}
 * @summary Obtiene un producto por su ID.
 * @tags Products
 * @param {string} product_id.path.required - ID del producto.
 * @returns {object} 200 - Respuesta exitosa con el producto.
 * @returns {Error} 404 - Producto no encontrado.
 * @returns {Error} 500 - Error del servidor.
 */
router.get('/:product_id', getById);

// Rutas admin
/**
 * Middleware para verificar que el usuario es administrador.
 * @private
 */
router.use(authMiddleware('admin'));
/**
 * @route POST /api/products
 * @summary Crea un nuevo producto. (Requiere rol admin)
 * @tags Products
 * @security BearerAuth
 * @param {object} request.body.required - Datos del producto.
 * @example request - {"food_id": 1, "store_id": 2, "brand": "Hacendado", "price_per_100g": 1.50, "calories_per_100g": 250}
 * @returns {object} 201 - Producto creado exitosamente.
 * @returns {Error} 400 - Error de validación o datos incorrectos.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 500 - Error del servidor.
 */
router.post('/',    validateBody(createSchema), create);
/**
 * @route PUT /api/products/{product_id}
 * @summary Actualiza un producto existente. (Requiere rol admin)
 * @tags Products
 * @security BearerAuth
 * @param {string} product_id.path.required - ID del producto a actualizar.
 * @param {object} request.body.required - Datos a actualizar.
 * @example request - {"brand": "Marca Blanca", "price_per_100g": 1.25}
 * @returns {object} 200 - Producto actualizado exitosamente.
 * @returns {Error} 400 - Error de validación o no se pudo actualizar.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Producto no encontrado.
 * @returns {Error} 500 - Error del servidor.
 */
router.put('/:product_id', validateBody(updateSchema), update);
/**
 * @route DELETE /api/products/{product_id}
 * @summary Elimina un producto. (Requiere rol admin)
 * @tags Products
 * @security BearerAuth
 * @param {string} product_id.path.required - ID del producto a eliminar.
 * @returns {object} 200 - Mensaje de confirmación.
 * @example response - {"message": "Producto eliminado correctamente"}
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Prohibido (rol incorrecto).
 * @returns {Error} 404 - Producto no encontrado.
 * @returns {Error} 500 - Error del servidor.
 */
router.delete('/:product_id', remove);

export default router;
