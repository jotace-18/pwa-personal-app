import * as nutrientService from './nutrients.service.js';

/**
 * @file Controlador para gestionar las operaciones CRUD de los nutrientes.
 * @module controllers/nutrientController
 */

/**
 * Controlador para gestionar las operaciones CRUD de los nutrientes.
 * @namespace NutrientController
 */

/**
 * Crea un nuevo nutriente.
 * @async
 * @function create
 * @memberof NutrientController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} req.body.name - Nombre del nutriente.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const create = async (req, res, next) => {
  try {
    const nut = await nutrientService.createNutrient(req.body);
    res.status(201).json(nut);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista los nutrientes con paginación y filtros.
 * @async
 * @function list
 * @memberof NutrientController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.query - Parámetros de consulta de la solicitud.
 * @param {number} [req.query.page=1] - Número de página.
 * @param {number} [req.query.limit=10] - Límite de resultados por página.
 * @param {object} [req.query.filter] - Objeto de filtro.
 * @param {string} [req.query.filter.name] - Filtrar por nombre del nutriente.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const list = async (req, res, next) => {
  try {
    const page   = req.query.page  ? parseInt(req.query.page, 10)  : 1;
    const limit  = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const filter = req.query.filter || {};
    const data   = await nutrientService.listNutrients({ filter, page, limit });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un nutriente por su ID.
 * @async
 * @function getById
 * @memberof NutrientController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID del nutriente.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const getById = async (req, res, next) => {
  try {
    const nut = await nutrientService.getNutrientById(req.params.id);
    res.json(nut);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un nutriente existente.
 * @async
 * @function update
 * @memberof NutrientController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID del nutriente a actualizar.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} [req.body.name] - Nuevo nombre del nutriente.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const update = async (req, res, next) => {
  try {
    const updated = await nutrientService.updateNutrient(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un nutriente por su ID.
 * @async
 * @function remove
 * @memberof NutrientController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID del nutriente a eliminar.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const remove = async (req, res, next) => {
  try {
    const result = await nutrientService.deleteNutrient(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
