/**
 * @file Lógica de negocio para la gestión de tipos de comida.
 * @module services/mealTypeService
 */

import { Op } from 'sequelize';
import MealType from './mealType.model.js';

/**
 * @typedef {object} MealTypeData
 * @property {string} name - Nombre del tipo de comida.
 */

/**
 * @typedef {object} ListMealTypesOptions
 * @property {object} [filter={}] - Opciones de filtro.
 * @property {string} [filter.name] - Filtrar por nombre (búsqueda insensible a mayúsculas/minúsculas y parcial).
 * @property {number} [page=1] - Número de página.
 * @property {number} [limit=50] - Límite de resultados por página.
 */

/**
 * @typedef {object} ListMealTypesResult
 * @property {Array<MealTypeAttributes>} mealTypes - Array de tipos de comida.
 * @property {number} total - Número total de tipos de comida que coinciden con el filtro.
 * @property {number} page - Página actual.
 * @property {number} limit - Límite de resultados por página.
 */

/**
 * Crea un nuevo tipo de comida.
 * @async
 * @function createMealType
 * @param {MealTypeData} mealTypeData - Datos para el nuevo tipo de comida.
 * @returns {Promise<MealTypeAttributes>} El tipo de comida creado.
 * @throws {Error} Si ocurre un error durante la creación.
 */
export async function createMealType({ name }) {
  return await MealType.create({ name });
}

/**
 * Lista todos los tipos de comida, con paginación y filtro opcional por nombre.
 * @async
 * @function listMealTypes
 * @param {ListMealTypesOptions} options - Opciones para listar y filtrar.
 * @returns {Promise<ListMealTypesResult>} Un objeto con la lista de tipos de comida y metadatos de paginación.
 */
export async function listMealTypes({ filter = {}, page = 1, limit = 50 }) {
  const where = {};
  if (filter.name) {
    where.name = { [Op.iLike]: `%${filter.name}%` };
  }
  const offset = (page - 1) * limit;
  const { rows, count } = await MealType.findAndCountAll({ where, offset, limit });
  return { mealTypes: rows, total: count, page, limit };
}

/**
 * Obtiene un tipo de comida por su ID.
 * @async
 * @function getMealTypeById
 * @param {number} id - ID del tipo de comida.
 * @returns {Promise<MealTypeAttributes>} El tipo de comida encontrado.
 * @throws {Error} Con estado 404 si el tipo de comida no se encuentra.
 */
export async function getMealTypeById(id) {
  const mt = await MealType.findByPk(id);
  if (!mt) {
    const error = new Error('MealType no encontrado');
    error.status = 404;
    throw error;
  }
  return mt;
}

/**
 * Actualiza el nombre de un tipo de comida.
 * @async
 * @function updateMealType
 * @param {number} id - ID del tipo de comida a actualizar.
 * @param {Partial<MealTypeData>} fields - Campos a actualizar.
 * @returns {Promise<MealTypeAttributes>} El tipo de comida actualizado.
 * @throws {Error} Con estado 400 si no se actualiza ningún registro (ej. ID no existe o datos no cambian).
 */
export async function updateMealType(id, fields) {
  const [count, [updated]] = await MealType.update(fields, {
    where: { id },
    returning: true
  });
  if (count === 0) {
    const error = new Error('No se pudo actualizar MealType');
    error.status = 400;
    throw error;
  }
  return updated;
}

/**
 * Elimina un tipo de comida por su ID.
 * @async
 * @function deleteMealType
 * @param {number} id - ID del tipo de comida a eliminar.
 * @returns {Promise<{message: string}>} Mensaje de confirmación.
 * @throws {Error} Con estado 404 si el tipo de comida no se encuentra y no se puede eliminar.
 */
export async function deleteMealType(id) {
  const count = await MealType.destroy({ where: { id } });
  if (count === 0) {
    const error = new Error('MealType no encontrado');
    error.status = 404;
    throw error;
  }
  return { message: 'MealType eliminado correctamente' };
}
