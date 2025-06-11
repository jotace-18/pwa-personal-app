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
} from './food.controller.js';

/**
 * @fileoverview Define las rutas para el módulo de alimentos.
 * Incluye rutas para crear, listar, obtener, actualizar y eliminar alimentos.
 * Algunas rutas requieren autenticación de administrador.
 * @module routes/food
 */

const router = Router();

/**
 * Esquema de validación Joi para la creación de un alimento.
 * @const {Joi.ObjectSchema} createSchema
 * @property {string} name - Nombre del alimento (requerido, máx 100 caracteres).
 * @property {string} category - Categoría del alimento (requerido, máx 30 caracteres).
 */
const createSchema = Joi.object({
  name:     Joi.string().max(100).required(),
  category: Joi.string().max(30).required()
});

/**
 * Esquema de validación Joi para la actualización de un alimento.
 * Todos los campos son opcionales, pero al menos uno debe estar presente.
 * @const {Joi.ObjectSchema} updateSchema
 * @property {string} [name] - Nuevo nombre del alimento (opcional, máx 100 caracteres).
 * @property {string} [category] - Nueva categoría del alimento (opcional, máx 30 caracteres).
 */
const updateSchema = Joi.object({
  name:     Joi.string().max(100).optional(),
  category: Joi.string().max(30).optional()
}).min(1);

/**
 * Esquema de validación Joi para los parámetros de consulta del listado de alimentos.
 * Permite paginación (`page`, `limit`) y filtrado (`filter.name`, `filter.category`).
 * @const {Joi.ObjectSchema} listSchema
 * @property {number} [page=1] - Número de página (opcional, entero, mín 1).
 * @property {number} [limit=10] - Número de elementos por página (opcional, entero, mín 1).
 * @property {object} [filter] - Objeto para filtrar resultados (opcional).
 * @property {string} [filter.name] - Filtrar por nombre (opcional).
 * @property {string} [filter.category] - Filtrar por categoría (opcional).
 */
const listSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  filter: Joi.object({
    name:     Joi.string().optional(),
    category: Joi.string().optional()
  }).optional()
});

// Rutas públicas
/**
 * @name GET /food
 * @description Ruta para listar alimentos con paginación y filtros.
 * Valida los parámetros de consulta usando `listSchema`.
 * @see {@link module:controllers/food.list}
 * @see {@link listSchema}
 */
router.get('/',   validateQuery(listSchema), list);
/**
 * @name GET /food/:id
 * @description Ruta para obtener un alimento específico por su ID.
 * @see {@link module:controllers/food.getById}
 */
router.get('/:id',               getById);

// A partir de aquí, sólo administradores
/**
 * Middleware de autenticación. Todas las rutas subsiguientes requieren que el usuario sea administrador.
 * @see {@link module:middlewares/authMiddleware}
 */
router.use(authMiddleware('admin'));

/**
 * @name POST /food
 * @description Ruta para crear un nuevo alimento. Requiere rol de administrador.
 * Valida el cuerpo de la solicitud usando `createSchema`.
 * @see {@link module:controllers/food.create}
 * @see {@link createSchema}
 */
router.post('/',          validateBody(createSchema), create);
/**
 * @name PUT /food/:id
 * @description Ruta para actualizar un alimento existente por su ID. Requiere rol de administrador.
 * Valida el cuerpo de la solicitud usando `updateSchema`.
 * @see {@link module:controllers/food.update}
 * @see {@link updateSchema}
 */
router.put('/:id',        validateBody(updateSchema), update);
/**
 * @name DELETE /food/:id
 * @description Ruta para eliminar un alimento por su ID. Requiere rol de administrador.
 * @see {@link module:controllers/food.remove}
 */
router.delete('/:id',                     remove);

export default router;
