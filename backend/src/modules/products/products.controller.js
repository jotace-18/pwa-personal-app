import * as productsService from './products.service.js';

/**
 * @file Controlador para gestionar las operaciones CRUD de los productos.
 * @module controllers/productController
 */

/**
 * Controlador para gestionar las operaciones CRUD de los productos.
 * @namespace ProductController
 */

/**
 * Crea un nuevo producto.
 * @async
 * @function create
 * @memberof ProductController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {number} req.body.food_id - ID del alimento asociado.
 * @param {number} req.body.store_id - ID de la tienda asociada.
 * @param {string} req.body.brand - Marca del producto.
 * @param {number} req.body.price_per_100g - Precio por 100g.
 * @param {number} [req.body.calories_per_100g] - Calorías por 100g (opcional).
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const create = async (req, res, next) => {
  try {
    const prod = await productsService.createProduct(req.body);
    res.status(201).json(prod);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista los productos con paginación y filtros.
 * @async
 * @function list
 * @memberof ProductController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.query - Parámetros de consulta de la solicitud.
 * @param {number} [req.query.page=1] - Número de página.
 * @param {number} [req.query.limit=10] - Límite de resultados por página.
 * @param {object} [req.query.filter] - Objeto de filtro.
 * @param {number} [req.query.filter.food_id] - Filtrar por ID de alimento.
 * @param {number} [req.query.filter.store_id] - Filtrar por ID de tienda.
 * @param {string} [req.query.filter.brand] - Filtrar por marca.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const list = async (req, res, next) => {
  try {
    const page   = req.query.page  ? parseInt(req.query.page, 10)  : 1;
    const limit  = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const filter = req.query.filter || {};
    const data   = await productsService.listProducts({ filter, page, limit });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un producto por su ID.
 * @async
 * @function getById
 * @memberof ProductController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.product_id - ID del producto.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const getById = async (req, res, next) => {
  try {
    const prod = await productsService.getProductById(req.params.product_id);
    res.json(prod);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un producto existente.
 * @async
 * @function update
 * @memberof ProductController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.product_id - ID del producto a actualizar.
 * @param {object} req.body - Cuerpo de la solicitud con los campos a actualizar.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const update = async (req, res, next) => {
  try {
    const updated = await productsService.updateProduct(req.params.product_id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un producto por su ID.
 * @async
 * @function remove
 * @memberof ProductController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.product_id - ID del producto a eliminar.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const remove = async (req, res, next) => {
  try {
    const result = await productsService.deleteProduct(req.params.product_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
