import {
  upsertProductNutrient,
  listProductNutrients,
  getProductNutrient,
  deleteProductNutrient
} from './productNutrients.service.js';

/**
 * POST/PUT /api/product-nutrients
 */
export const upsert = async (req, res, next) => {
  try {
    const item = await upsertProductNutrient(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/product-nutrients
 */
export const list = async (req, res, next) => {
  try {
    const page   = req.query.page  ? parseInt(req.query.page, 10)  : 1;
    const limit  = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const filter = req.query.filter || {};
    const data   = await listProductNutrients({ filter, page, limit });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/product-nutrients/:nutrient_id/:product_id
 */
export const getByIds = async (req, res, next) => {
  try {
    const { nutrient_id, product_id } = req.params;
    const item = await getProductNutrient(nutrient_id, product_id);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/product-nutrients/:nutrient_id/:product_id
 */
export const remove = async (req, res, next) => {
  try {
    const { nutrient_id, product_id } = req.params;
    const result = await deleteProductNutrient(nutrient_id, product_id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * @async
 * @function upsert
 * @description Controlador para crear o actualizar un nutriente de producto.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función middleware `next` de Express.
 */

/**
 * @async
 * @function list
 * @description Controlador para listar los nutrientes de productos con paginación y filtros.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función middleware `next` de Express.
 */

/**
 * @async
 * @function getByIds
 * @description Controlador para obtener un nutriente de producto específico por IDs.
 * @param {import('express').Request} req - El objeto de solicitud de Express, con `nutrient_id` y `product_id` en los parámetros de la ruta.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función middleware `next` de Express.
 */

/**
 * @async
 * @function remove
 * @description Controlador para eliminar un nutriente de producto por IDs.
 * @param {import('express').Request} req - El objeto de solicitud de Express, con `nutrient_id` y `product_id` en los parámetros de la ruta.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función middleware `next` de Express.
 */
