import { Op } from 'sequelize';
import Nutrient from './nutrients.model.js';

/**
 * @file Lógica de negocio para la gestión de nutrientes.
 * @module services/nutrientService
 */

/**
 * @typedef {object} NutrientData
 * @property {string} name - Nombre del nutriente.
 */

/**
 * @typedef {object} ListNutrientsOptions
 * @property {object} [filter={}] - Opciones de filtro.
 * @property {string} [filter.name] - Filtrar por nombre (búsqueda insensible a mayúsculas/minúsculas y parcial).
 * @property {number} [page=1] - Número de página.
 * @property {number} [limit=10] - Límite de resultados por página.
 */

/**
 * @typedef {object} ListNutrientsResult
 * @property {Array<import('./nutrients.model.js').NutrientAttributes>} nutrients - Array de nutrientes.
 * @property {number} total - Número total de nutrientes que coinciden con el filtro.
 * @property {number} page - Página actual.
 * @property {number} limit - Límite de resultados por página.
 */

/**
 * Crea un nuevo nutriente.
 * @async
 * @function createNutrient
 * @param {NutrientData} nutrientData - Datos para el nuevo nutriente.
 * @returns {Promise<import('./nutrients.model.js').NutrientAttributes>} El nutriente creado.
 * @throws {Error} Si ocurre un error durante la creación.
 */
export async function createNutrient({ name }) {
  return await Nutrient.create({ name });
}

/**
 * Lista nutrientes con paginación y filtro opcional por nombre.
 * @async
 * @function listNutrients
 * @param {ListNutrientsOptions} options - Opciones para listar y filtrar.
 * @returns {Promise<ListNutrientsResult>} Un objeto con la lista de nutrientes y metadatos de paginación.
 */
export async function listNutrients({ filter = {}, page = 1, limit = 10 }) {
  const where = {};
  if (filter.name) {
    where.name = { [Op.iLike]: `%${filter.name}%` };
  }
  const offset = (page - 1) * limit;
  const { rows, count } = await Nutrient.findAndCountAll({ where, offset, limit });
  return { nutrients: rows, total: count, page, limit };
}

/**
 * Obtiene un nutriente por su ID.
 * @async
 * @function getNutrientById
 * @param {number} id - ID del nutriente.
 * @returns {Promise<import('./nutrients.model.js').NutrientAttributes>} El nutriente encontrado.
 * @throws {Error} Con estado 404 si el nutriente no se encuentra.
 */
export async function getNutrientById(id) {
  const nut = await Nutrient.findByPk(id);
  if (!nut) {
    const error = new Error('Nutriente no encontrado');
    error.status = 404;
    throw error;
  }
  return nut;
}

/**
 * Actualiza el nombre de un nutriente.
 * @async
 * @function updateNutrient
 * @param {number} id - ID del nutriente a actualizar.
 * @param {Partial<NutrientData>} fields - Campos a actualizar (actualmente solo 'name').
 * @returns {Promise<import('./nutrients.model.js').NutrientAttributes>} El nutriente actualizado.
 * @throws {Error} Con estado 400 si no se actualiza ningún registro (ej. ID no existe o datos no cambian).
 */
export async function updateNutrient(id, fields) {
  const [count, [updated]] = await Nutrient.update(fields, {
    where: { id },
    returning: true
  });
  if (count === 0) {
    const error = new Error('No se pudo actualizar el nutriente');
    error.status = 400;
    throw error;
  }
  return updated;
}

/**
 * Elimina un nutriente por su ID.
 * @async
 * @function deleteNutrient
 * @param {number} id - ID del nutriente a eliminar.
 * @returns {Promise<{message: string}>} Mensaje de confirmación.
 * @throws {Error} Con estado 404 si el nutriente no se encuentra y no se puede eliminar.
 */
export async function deleteNutrient(id) {
  const count = await Nutrient.destroy({ where: { id } });
  if (count === 0) {
    const error = new Error('Nutriente no encontrado');
    error.status = 404;
    throw error;
  }
  return { message: 'Nutriente eliminado correctamente' };
}
