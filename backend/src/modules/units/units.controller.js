import * as unitService from './units.service.js';

/**
 * @file Controlador para gestionar las operaciones CRUD de las unidades de medida.
 * @module controllers/unitController
 */

/**
 * Controlador para gestionar las operaciones CRUD de las unidades de medida.
 * @namespace UnitController
 */

/**
 * Crea una nueva unidad de medida.
 * @async
 * @function create
 * @memberof UnitController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} req.body.name - Nombre de la unidad.
 * @param {string} req.body.abbreviation - Abreviatura de la unidad.
 * @param {number} req.body.to_base_factor - Factor de conversión a la unidad base.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const create = async (req, res, next) => {
  try {
    const unit = await unitService.createUnit(req.body);
    res.status(201).json(unit);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista las unidades de medida con paginación y filtros.
 * @async
 * @function list
 * @memberof UnitController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.query - Parámetros de consulta de la solicitud.
 * @param {number} [req.query.page=1] - Número de página.
 * @param {number} [req.query.limit=10] - Límite de resultados por página.
 * @param {object} [req.query.filter] - Objeto de filtro.
 * @param {string} [req.query.filter.name] - Filtrar por nombre de la unidad.
 * @param {string} [req.query.filter.abbreviation] - Filtrar por abreviatura de la unidad.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const list = async (req, res, next) => {
  try {
    const page   = req.query.page  ? parseInt(req.query.page, 10)  : 1;
    const limit  = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const filter = req.query.filter || {};
    const data   = await unitService.listUnits({ filter, page, limit });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una unidad de medida por su ID.
 * @async
 * @function getById
 * @memberof UnitController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID de la unidad.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const getById = async (req, res, next) => {
  try {
    const unit = await unitService.getUnitById(req.params.id);
    res.json(unit);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza una unidad de medida existente.
 * @async
 * @function update
 * @memberof UnitController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID de la unidad a actualizar.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} [req.body.name] - Nuevo nombre de la unidad.
 * @param {string} [req.body.abbreviation] - Nueva abreviatura de la unidad.
 * @param {number} [req.body.to_base_factor] - Nuevo factor de conversión.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const update = async (req, res, next) => {
  try {
    const updated = await unitService.updateUnit(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina una unidad de medida por su ID.
 * @async
 * @function remove
 * @memberof UnitController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID de la unidad a eliminar.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const remove = async (req, res, next) => {
  try {
    const result = await unitService.deleteUnit(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
