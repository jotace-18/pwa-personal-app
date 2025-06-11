import { Op } from 'sequelize';
import Product from './products.model.js';

/**
 * @file Lógica de negocio para la gestión de productos.
 * @module services/productService
 */

/**
 * @typedef {object} ProductData
 * @property {number} food_id - ID del alimento asociado.
 * @property {number} store_id - ID de la tienda asociada.
 * @property {string} brand - Marca del producto.
 * @property {number} price_per_100g - Precio por 100g.
 * @property {number} [calories_per_100g=0] - Calorías por 100g.
 */

/**
 * @typedef {object} ListProductsOptions
 * @property {object} [filter={}] - Opciones de filtro.
 * @property {number} [filter.food_id] - Filtrar por ID de alimento.
 * @property {number} [filter.store_id] - Filtrar por ID de tienda.
 * @property {string} [filter.brand] - Filtrar por marca (búsqueda insensible a mayúsculas/minúsculas y parcial).
 * @property {number} [page=1] - Número de página.
 * @property {number} [limit=10] - Límite de resultados por página.
 */

/**
 * @typedef {object} ListProductsResult
 * @property {Array<import('./products.model.js').ProductAttributes>} products - Array de productos.
 * @property {number} total - Número total de productos que coinciden con el filtro.
 * @property {number} page - Página actual.
 * @property {number} limit - Límite de resultados por página.
 */

/**
 * Crea un nuevo producto.
 * @async
 * @function createProduct
 * @param {ProductData} productData - Datos para el nuevo producto.
 * @returns {Promise<import('./products.model.js').ProductAttributes>} El producto creado.
 * @throws {Error} Si ocurre un error durante la creación.
 */
export async function createProduct({ food_id, store_id, brand, price_per_100g, calories_per_100g }) {
  return await Product.create({ food_id, store_id, brand, price_per_100g, calories_per_100g });
}

/**
 * Lista productos con paginación y filtros opcionales.
 * @async
 * @function listProducts
 * @param {ListProductsOptions} options - Opciones para listar y filtrar.
 * @returns {Promise<ListProductsResult>} Un objeto con la lista de productos y metadatos de paginación.
 */
export async function listProducts({ filter = {}, page = 1, limit = 10 }) {
  const where = {};
  if (filter.food_id)  where.food_id  = filter.food_id;
  if (filter.store_id) where.store_id = filter.store_id;
  if (filter.brand)    where.brand    = { [Op.iLike]: `%${filter.brand}%` };

  const offset = (page - 1) * limit;
  const { rows, count } = await Product.findAndCountAll({ where, offset, limit });
  return { products: rows, total: count, page, limit };
}

/**
 * Obtiene un producto por su ID (`product_id`).
 * @async
 * @function getProductById
 * @param {number} product_id - ID del producto.
 * @returns {Promise<import('./products.model.js').ProductAttributes>} El producto encontrado.
 * @throws {Error} Con estado 404 si el producto no se encuentra.
 */
export async function getProductById(product_id) {
  const prod = await Product.findByPk(product_id);
  if (!prod) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }
  return prod;
}

/**
 * Actualiza un producto existente.
 * @async
 * @function updateProduct
 * @param {number} product_id - ID del producto a actualizar.
 * @param {Partial<ProductData>} fields - Campos a actualizar.
 * @returns {Promise<import('./products.model.js').ProductAttributes>} El producto actualizado.
 * @throws {Error} Con estado 400 si no se actualiza ningún registro (ej. ID no existe o datos no cambian).
 */
export async function updateProduct(product_id, fields) {
  const [count, [updated]] = await Product.update(fields, {
    where: { product_id },
    returning: true
  });
  if (count === 0) {
    const error = new Error('No se pudo actualizar el producto');
    error.status = 400;
    throw error;
  }
  return updated;
}

/**
 * Elimina un producto por su ID (`product_id`).
 * @async
 * @function deleteProduct
 * @param {number} product_id - ID del producto a eliminar.
 * @returns {Promise<{message: string}>} Mensaje de confirmación.
 * @throws {Error} Con estado 404 si el producto no se encuentra y no se puede eliminar.
 */
export async function deleteProduct(product_id) {
  const count = await Product.destroy({ where: { product_id } });
  if (count === 0) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }
  return { message: 'Producto eliminado correctamente' };
}
