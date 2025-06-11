/**
 * @fileoverview Lógica de negocio para la gestión de alimentos.
 * Interactúa con el modelo `Food` para realizar operaciones CRUD.
 * @module services/food
 */

import { Op } from 'sequelize';
import Food from './food.model.js';

/**
 * Crea un nuevo alimento genérico en la base de datos.
 * @async
 * @function createFood
 * @param {object} foodData - Datos del alimento a crear.
 * @param {string} foodData.name - Nombre del alimento.
 * @param {string} foodData.category - Categoría del alimento.
 * @returns {Promise<import('./food.model.js').FoodAttributes>} El alimento creado.
 */
export async function createFood({ name, category }) {
  return await Food.create({ name, category });
}

/**
 * Recupera un alimento por su ID.
 * @async
 * @function getFoodById
 * @param {number} id - El ID del alimento a recuperar.
 * @returns {Promise<import('./food.model.js').FoodAttributes>} El alimento encontrado.
 * @throws {Error} Error con estado 404 si el alimento no se encuentra.
 */
export async function getFoodById(id) {
  const food = await Food.findByPk(id);
  if (!food) {
    const error = new Error('Alimento no encontrado');
    error.status = 404;
    throw error;
  }
  return food;
}

/**
 * Actualiza un alimento existente.
 * @async
 * @function updateFood
 * @param {number} id - El ID del alimento a actualizar.
 * @param {Partial<import('./food.model.js').FoodAttributes>} fields - Los campos a actualizar en el alimento.
 * @returns {Promise<import('./food.model.js').FoodAttributes>} El alimento actualizado.
 * @throws {Error} Error con estado 400 si no se pudo actualizar el alimento (ej. no se encontró o no hubo cambios).
 */
export async function updateFood(id, fields) {
  const [count, [updated]] = await Food.update(fields, {
    where: { id },
    returning: true
  });
  if (count === 0) {
    const error = new Error('No se pudo actualizar el alimento');
    error.status = 400;
    throw error;
  }
  return updated;
}

/**
 * Elimina un alimento.
 * @async
 * @function deleteFood
 * @param {number} id - El ID del alimento a eliminar.
 * @returns {Promise<{message: string}>} Un mensaje de confirmación.
 * @throws {Error} Error con estado 404 si el alimento no se encuentra.
 */
export async function deleteFood(id) {
  const count = await Food.destroy({ where: { id } });
  if (count === 0) {
    const error = new Error('Alimento no encontrado');
    error.status = 404;
    throw error;
  }
  return { message: 'Alimento eliminado correctamente' };
}

/**
 * Lista alimentos con paginación y filtrado por nombre o categoría.
 * @async
 * @function listFoods
 * @param {object} options - Opciones para listar y paginar.
 * @param {object} [options.filter={}] - Objeto con los filtros a aplicar.
 * @param {string} [options.filter.name] - Filtrar por nombre (búsqueda parcial insensible a mayúsculas).
 * @param {string} [options.filter.category] - Filtrar por categoría (coincidencia exacta).
 * @param {number} [options.page=1] - Número de página para la paginación.
 * @param {number} [options.limit=10] - Número de alimentos por página.
 * @returns {Promise<{foods: Array<import('./food.model.js').FoodAttributes>, total: number, page: number, limit: number}>} Un objeto con la lista de alimentos y la información de paginación.
 */
export async function listFoods({ filter = {}, page = 1, limit = 10 }) {
  const where = {};
  if (filter.name) {
    where.name = { [Op.iLike]: `%${filter.name}%` };
  }
  if (filter.category) {
    where.category = filter.category;
  }
  const offset = (page - 1) * limit;
  const { rows, count } = await Food.findAndCountAll({ where, offset, limit });
  return { foods: rows, total: count, page, limit };
}
