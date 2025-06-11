import * as foodService from './food.service.js';

/**
 * @async
 * @function create
 * @description Controlador para crear un nuevo alimento.
 * Extrae los datos del alimento del cuerpo de la solicitud (`req.body`),
 * llama al servicio `createFood` y responde con el alimento creado y un estado 201.
 * Maneja errores pasándolos al siguiente middleware.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>}
 */
export const create = async (req, res, next) => {
  try {
    const food = await foodService.createFood(req.body);
    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function list
 * @description Controlador para listar alimentos con paginación y filtrado.
 * Extrae los parámetros de paginación (`page`, `limit`) y el objeto `filter` de `req.query`.
 * Llama al servicio `listFoods` y responde con la lista de alimentos y metadatos de paginación.
 * Maneja errores pasándolos al siguiente middleware.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>}
 */
export const list = async (req, res, next) => {
  try {
    const page   = req.query.page  ? parseInt(req.query.page, 10)  : 1;
    const limit  = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const filter = req.query.filter || {};
    const data   = await foodService.listFoods({ filter, page, limit });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getById
 * @description Controlador para obtener un alimento específico por su ID.
 * Extrae el ID del alimento de los parámetros de la ruta (`req.params.id`),
 * llama al servicio `getFoodById` y responde con el alimento encontrado.
 * Maneja errores pasándolos al siguiente middleware (ej. si el alimento no se encuentra).
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>}
 */
export const getById = async (req, res, next) => {
  try {
    const food = await foodService.getFoodById(req.params.id);
    res.json(food);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function update
 * @description Controlador para actualizar un alimento existente.
 * Extrae el ID del alimento de `req.params.id` y los campos a actualizar de `req.body`.
 * Llama al servicio `updateFood` y responde con el alimento actualizado.
 * Maneja errores pasándolos al siguiente middleware.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>}
 */
export const update = async (req, res, next) => {
  try {
    const updated = await foodService.updateFood(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function remove
 * @description Controlador para eliminar un alimento.
 * Extrae el ID del alimento de `req.params.id`.
 * Llama al servicio `deleteFood` y responde con un mensaje de éxito.
 * Maneja errores pasándolos al siguiente middleware.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>}
 */
export const remove = async (req, res, next) => {
  try {
    const result = await foodService.deleteFood(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
