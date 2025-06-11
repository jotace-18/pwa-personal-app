import { Op } from 'sequelize';
import Store from './stores.model.js';

/**
 * @file Lógica de negocio para la gestión de tiendas.
 * @module services/storeService
 */

/**
 * @typedef {object} StoreData
 * @property {string} name - Nombre de la tienda.
 */

/**
 * @typedef {object} ListStoresOptions
 * @property {object} [filter={}] - Opciones de filtro.
 * @property {string} [filter.name] - Filtrar por nombre (búsqueda insensible a mayúsculas/minúsculas y parcial).
 * @property {number} [page=1] - Número de página.
 * @property {number} [limit=10] - Límite de resultados por página.
 */

/**
 * @typedef {object} ListStoresResult
 * @property {Array<import('./stores.model.js').StoreAttributes>} stores - Array de tiendas.
 * @property {number} total - Número total de tiendas que coinciden con el filtro.
 * @property {number} page - Página actual.
 * @property {number} limit - Límite de resultados por página.
 */

/**
 * Crea una nueva tienda.
 * @async
 * @function createStore
 * @param {StoreData} storeData - Datos para la nueva tienda.
 * @returns {Promise<import('./stores.model.js').StoreAttributes>} La tienda creada.
 * @throws {Error} Si ocurre un error durante la creación.
 */
export async function createStore({ name }) {
  return await Store.create({ name });
}

/**
 * Lista tiendas con paginación y filtro opcional por nombre.
 * @async
 * @function listStores
 * @param {ListStoresOptions} options - Opciones para listar y filtrar.
 * @returns {Promise<ListStoresResult>} Un objeto con la lista de tiendas y metadatos de paginación.
 */
export async function listStores({ filter = {}, page = 1, limit = 10 }) {
  const where = {};
  if (filter.name) {
    where.name = { [Op.iLike]: `%${filter.name}%` };
  }
  const offset = (page - 1) * limit;
  const { rows, count } = await Store.findAndCountAll({ where, offset, limit });
  return { stores: rows, total: count, page, limit };
}

/**
 * Recupera una tienda por su ID.
 * @async
 * @function getStoreById
 * @param {number} id - ID de la tienda.
 * @returns {Promise<import('./stores.model.js').StoreAttributes>} La tienda encontrada.
 * @throws {Error} Con estado 404 si la tienda no se encuentra.
 */
export async function getStoreById(id) {
  const store = await Store.findByPk(id);
  if (!store) {
    const error = new Error('Tienda no encontrada');
    error.status = 404;
    throw error;
  }
  return store;
}

/**
 * Actualiza el nombre de una tienda.
 * @async
 * @function updateStore
 * @param {number} id - ID de la tienda a actualizar.
 * @param {Partial<StoreData>} fields - Campos a actualizar (actualmente solo 'name').
 * @returns {Promise<import('./stores.model.js').StoreAttributes>} La tienda actualizada.
 * @throws {Error} Con estado 400 si no se actualiza ningún registro (ej. ID no existe o datos no cambian).
 */
export async function updateStore(id, fields) {
  const [count, [updated]] = await Store.update(fields, {
    where: { id },
    returning: true
  });
  if (count === 0) {
    const error = new Error('No se pudo actualizar la tienda');
    error.status = 400;
    throw error;
  }
  return updated;
}

/**
 * Elimina una tienda por su ID.
 * @async
 * @function deleteStore
 * @param {number} id - ID de la tienda a eliminar.
 * @returns {Promise<{message: string}>} Mensaje de confirmación.
 * @throws {Error} Con estado 404 si la tienda no se encuentra y no se puede eliminar.
 */
export async function deleteStore(id) {
  const count = await Store.destroy({ where: { id } });
  if (count === 0) {
    const error = new Error('Tienda no encontrada');
    error.status = 404;
    throw error;
  }
  return { message: 'Tienda eliminada correctamente' };
}
