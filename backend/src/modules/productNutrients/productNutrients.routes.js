/**
 * @fileoverview Define las rutas para la gestión de la relación entre productos y nutrientes.
 * Utiliza Express Router y middleware de validación y autenticación.
 * @module routes/productNutrients
 */

import { Router } from 'express';
import Joi from 'joi';
import { validateBody, validateQuery } from '../../middlewares/validationMiddleware.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import {
  upsert,
  list,
  getByIds,
  remove
} from './productNutrients.controller.js';

const router = Router();

/**
 * Esquema de validación Joi para la creación o actualización (upsert) de un nutriente de producto.
 * @const {Joi.ObjectSchema} upsertSchema
 */
const upsertSchema = Joi.object({
  nutrient_id: Joi.number().integer().required(),
  product_id:  Joi.number().integer().required(),
  amount_100g: Joi.number().precision(4).required()
});

/**
 * Esquema de validación Joi para la consulta de listado de nutrientes de productos.
 * Permite paginación y filtrado por `nutrient_id` y `product_id`.
 * @const {Joi.ObjectSchema} listSchema
 */
const listSchema = Joi.object({
  page:  Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  filter: Joi.object({
    nutrient_id: Joi.number().integer().optional(),
    product_id:  Joi.number().integer().optional()
  }).optional()
});

// Rutas públicas
/**
 * @openapi
 * /api/product-nutrients:
 *   get:
 *     summary: Lista las asociaciones entre productos y nutrientes.
 *     description: Obtiene una lista paginada de las relaciones producto-nutriente, con opción de filtrado.
 *     tags: [ProductNutrients]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Cantidad de resultados por página.
 *       - in: query
 *         name: filter
 *         style: deepObject
 *         explode: true
 *         schema:
 *           type: object
 *           properties:
 *             nutrient_id:
 *               type: integer
 *               description: Filtrar por ID de nutriente.
 *             product_id:
 *               type: integer
 *               description: Filtrar por ID de producto.
 *         description: Objeto de filtro para `nutrient_id` o `product_id`.
 *     responses:
 *       200:
 *         description: Una lista de asociaciones producto-nutriente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productNutrients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductNutrient'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.get('/', validateQuery(listSchema), list);

/**
 * @openapi
 * /api/product-nutrients/{nutrient_id}/{product_id}:
 *   get:
 *     summary: Obtiene una asociación producto-nutriente específica.
 *     description: Recupera los detalles de una relación producto-nutriente por sus IDs.
 *     tags: [ProductNutrients]
 *     parameters:
 *       - in: path
 *         name: nutrient_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nutriente.
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto.
 *     responses:
 *       200:
 *         description: Detalles de la asociación producto-nutriente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductNutrient'
 *       404:
 *         description: Asociación no encontrada.
 */
router.get('/:nutrient_id/:product_id', getByIds);

// Rutas admin
/**
 * Middleware de autenticación para rutas de administrador.
 * @name AdminAuthMiddleware
 * @function
 * @memberof module:routes/productNutrients
 * @inner
 * @param {import('express').Request} req - Objeto de solicitud.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @param {import('express').NextFunction} next - Función `next` de Express.
 */
router.use(authMiddleware('admin'));

/**
 * @openapi
 * /api/product-nutrients:
 *   post:
 *     summary: Crea o actualiza una asociación producto-nutriente.
 *     description: Permite crear una nueva relación producto-nutriente o actualizar una existente si ya está registrada. Requiere rol de administrador.
 *     tags: [ProductNutrients]
 *     security:
 *       - bearerAuth: [] # Indica que se requiere autenticación Bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductNutrientUpsert'
 *     responses:
 *       201:
 *         description: Asociación creada o actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductNutrient'
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 */
router.post('/',   validateBody(upsertSchema), upsert);

/**
 * @openapi
 * /api/product-nutrients:
 *   put:
 *     summary: Crea o actualiza una asociación producto-nutriente (similar a POST).
 *     description: Permite crear una nueva relación producto-nutriente o actualizar una existente. Requiere rol de administrador. Este endpoint es funcionalmente idéntico al POST para `upsert`.
 *     tags: [ProductNutrients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductNutrientUpsert'
 *     responses:
 *       201:
 *         description: Asociación creada o actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductNutrient'
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 */
router.put('/',    validateBody(upsertSchema), upsert);

/**
 * @openapi
 * /api/product-nutrients/{nutrient_id}/{product_id}:
 *   delete:
 *     summary: Elimina una asociación producto-nutriente.
 *     description: Elimina una relación específica entre un producto y un nutriente. Requiere rol de administrador.
 *     tags: [ProductNutrients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nutrient_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nutriente a eliminar.
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto asociado al nutriente a eliminar.
 *     responses:
 *       200:
 *         description: Asociación eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ProductNutrient eliminado correctamente
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Asociación no encontrada.
 */
router.delete('/:nutrient_id/:product_id', remove);

export default router;
