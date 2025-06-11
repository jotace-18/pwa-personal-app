import * as storeService from './stores.service.js';

/**
 * @file Controlador para gestionar las operaciones CRUD de las tiendas.
 * @module controllers/storeController
 */

/**
 * Controlador para gestionar las operaciones CRUD de las tiendas.
 * @namespace StoreController
 */

/**
 * Crea una nueva tienda.
 * @async
 * @function create
 * @memberof StoreController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} req.body.name - Nombre de la tienda.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const create = async (req, res, next) => {
  try {
    const store = await storeService.createStore(req.body);
    res.status(201).json(store);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista las tiendas con paginación y filtros.
 * @async
 * @function list
 * @memberof StoreController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.query - Parámetros de consulta de la solicitud.
 * @param {number} [req.query.page=1] - Número de página.
 * @param {number} [req.query.limit=10] - Límite de resultados por página.
 * @param {object} [req.query.filter] - Objeto de filtro.
 * @param {string} [req.query.filter.name] - Filtrar por nombre de la tienda.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const list = async (req, res, next) => {
  try {
    const page   = req.query.page  ? parseInt(req.query.page, 10)  : 1;
    const limit  = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const filter = req.query.filter || {};
    const data   = await storeService.listStores({ filter, page, limit });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una tienda por su ID.
 * @async
 * @function getById
 * @memberof StoreController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID de la tienda.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const getById = async (req, res, next) => {
  try {
    const store = await storeService.getStoreById(req.params.id);
    res.json(store);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza una tienda existente.
 * @async
 * @function update
 * @memberof StoreController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID de la tienda a actualizar.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} [req.body.name] - Nuevo nombre de la tienda.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const update = async (req, res, next) => {
  try {
    const updated = await storeService.updateStore(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina una tienda por su ID.
 * @async
 * @function remove
 * @memberof StoreController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID de la tienda a eliminar.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const remove = async (req, res, next) => {
  try {
    const result = await storeService.deleteStore(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
