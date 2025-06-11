import { Op } from 'sequelize';
import Unit from './units.model.js';

/**
 * @file Lógica de negocio para la gestión de unidades de medida.
 * @module services/unitService
 */

/**
 * @typedef {object} UnitData
 * @property {string} name - Nombre de la unidad.
 * @property {string} abbreviation - Abreviatura de la unidad.
 * @property {number} to_base_factor - Factor de conversión a la unidad base.
 */

/**
 * @typedef {object} ListUnitsOptions
 * @property {object} [filter={}] - Opciones de filtro.
 * @property {string} [filter.name] - Filtrar por nombre (búsqueda insensible a mayúsculas/minúsculas y parcial).
 * @property {string} [filter.abbreviation] - Filtrar por abreviatura (búsqueda insensible a mayúsculas/minúsculas y parcial).
 * @property {number} [page=1] - Número de página.
 * @property {number} [limit=10] - Límite de resultados por página.
 */

/**
 * @typedef {object} ListUnitsResult
 * @property {Array<import('./units.model.js').UnitAttributes>} units - Array de unidades.
 * @property {number} total - Número total de unidades que coinciden con el filtro.
 * @property {number} page - Página actual.
 * @property {number} limit - Límite de resultados por página.
 */

/**
 * Crea una nueva unidad de medida.
 * @async
 * @function createUnit
 * @param {UnitData} unitData - Datos para la nueva unidad.
 * @returns {Promise<import('./units.model.js').UnitAttributes>} La unidad creada.
 * @throws {Error} Si ocurre un error durante la creación.
 */
export async function createUnit({ name, abbreviation, to_base_factor }) {
  return await Unit.create({ name, abbreviation, to_base_factor });
}

/**
 * Lista unidades de medida con paginación y filtro opcional por nombre o abreviatura.
 * @async
 * @function listUnits
 * @param {ListUnitsOptions} options - Opciones para listar y filtrar.
 * @returns {Promise<ListUnitsResult>} Un objeto con la lista de unidades y metadatos de paginación.
 */
export async function listUnits({ filter = {}, page = 1, limit = 10 }) {
  const where = {};
  if (filter.name) {
    where.name = { [Op.iLike]: `%${filter.name}%` };
  }
  if (filter.abbreviation) {
    where.abbreviation = { [Op.iLike]: `%${filter.abbreviation}%` };
  }
  const offset = (page - 1) * limit;
  const { rows, count } = await Unit.findAndCountAll({ where, offset, limit });
  return { units: rows, total: count, page, limit };
}

/**
 * Obtiene una unidad de medida por su ID.
 * @async
 * @function getUnitById
 * @param {number} id - ID de la unidad.
 * @returns {Promise<import('./units.model.js').UnitAttributes>} La unidad encontrada.
 * @throws {Error} Con estado 404 si la unidad no se encuentra.
 */
export async function getUnitById(id) {
  const unit = await Unit.findByPk(id);
  if (!unit) {
    const error = new Error('Unidad no encontrada');
    error.status = 404;
    throw error;
  }
  return unit;
}

/**
 * Actualiza una unidad de medida existente.
 * @async
 * @function updateUnit
 * @param {number} id - ID de la unidad a actualizar.
 * @param {Partial<UnitData>} fields - Campos a actualizar.
 * @returns {Promise<import('./units.model.js').UnitAttributes>} La unidad actualizada.
 * @throws {Error} Con estado 400 si no se actualiza ningún registro (ej. ID no existe o datos no cambian).
 */
export async function updateUnit(id, fields) {
  const [count, [updated]] = await Unit.update(fields, {
    where: { id },
    returning: true
  });
  if (count === 0) {
    const error = new Error('No se pudo actualizar la unidad');
    error.status = 400;
    throw error;
  }
  return updated;
}

/**
 * Elimina una unidad de medida por su ID.
 * @async
 * @function deleteUnit
 * @param {number} id - ID de la unidad a eliminar.
 * @returns {Promise<{message: string}>} Mensaje de confirmación.
 * @throws {Error} Con estado 404 si la unidad no se encuentra y no se puede eliminar.
 */
export async function deleteUnit(id) {
  const count = await Unit.destroy({ where: { id } });
  if (count === 0) {
    const error = new Error('Unidad no encontrada');
    error.status = 404;
    throw error;
  }
  return { message: 'Unidad eliminada correctamente' };
}
