/**
 * @file Rutas para la gestión de tipos de comida.
 * @module routes/mealTypeRoutes
 */

import * as mealTypeService from './mealType.service.js';

/**
 * Controlador para gestionar las operaciones CRUD de los tipos de comida.
 * @namespace MealTypeController
 */

/**
 * Crea un nuevo tipo de comida.
 * @async
 * @function create
 * @memberof MealTypeController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} req.body.name - Nombre del tipo de comida.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const create = async (req, res, next) => {
  try {
    const mt = await mealTypeService.createMealType(req.body);
    res.status(201).json(mt);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista los tipos de comida con paginación y filtros.
 * @async
 * @function list
 * @memberof MealTypeController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.query - Parámetros de consulta de la solicitud.
 * @param {number} [req.query.page=1] - Número de página.
 * @param {number} [req.query.limit=50] - Límite de resultados por página.
 * @param {object} [req.query.filter] - Objeto de filtro.
 * @param {string} [req.query.filter.name] - Filtrar por nombre del tipo de comida.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const list = async (req, res, next) => {
  try {
    const page   = req.query.page  ? parseInt(req.query.page, 10)  : 1;
    const limit  = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const filter = req.query.filter || {};
    const data   = await mealTypeService.listMealTypes({ filter, page, limit });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un tipo de comida por su ID.
 * @async
 * @function getById
 * @memberof MealTypeController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID del tipo de comida.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const getById = async (req, res, next) => {
  try {
    const mt = await mealTypeService.getMealTypeById(req.params.id);
    res.json(mt);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un tipo de comida existente.
 * @async
 * @function update
 * @memberof MealTypeController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID del tipo de comida a actualizar.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} [req.body.name] - Nuevo nombre del tipo de comida.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const update = async (req, res, next) => {
  try {
    const updated = await mealTypeService.updateMealType(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un tipo de comida por su ID.
 * @async
 * @function remove
 * @memberof MealTypeController
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.params - Parámetros de ruta de la solicitud.
 * @param {string} req.params.id - ID del tipo de comida a eliminar.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
export const remove = async (req, res, next) => {
  try {
    const result = await mealTypeService.deleteMealType(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
