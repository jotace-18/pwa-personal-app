import ProductNutrient from './productNutrients.model.js';

/**
 * Crea o actualiza (upsert) la cantidad de un nutriente específico en un producto determinado.
 * Si la combinación de `nutrient_id` y `product_id` ya existe, actualiza `amount_100g`.
 * Si no existe, crea un nuevo registro.
 *
 * @async
 * @function upsertProductNutrient
 * @param {object} data - Datos para la operación de upsert.
 * @param {number} data.nutrient_id - ID del nutriente.
 * @param {number} data.product_id - ID del producto.
 * @param {number} data.amount_100g - Cantidad del nutriente por cada 100g de producto.
 * @returns {Promise<ProductNutrient>} El registro de ProductNutrient creado o actualizado.
 */
export async function upsertProductNutrient({ nutrient_id, product_id, amount_100g }) {
  const existing = await ProductNutrient.findOne({ where: { nutrient_id, product_id } });
  if (existing) {
    existing.amount_100g = amount_100g;
    return await existing.save();
  } else {
    return await ProductNutrient.create({ nutrient_id, product_id, amount_100g });
  }
}

/**
 * Lista todas las asociaciones entre nutrientes y productos, con opciones de paginación y filtrado.
 *
 * @async
 * @function listProductNutrients
 * @param {object} options - Opciones para listar y paginar.
 * @param {object} [options.filter={}] - Objeto para filtrar los resultados. Puede contener `nutrient_id` y/o `product_id`.
 * @param {number} [options.page=1] - Número de página actual.
 * @param {number} [options.limit=50] - Cantidad de registros por página.
 * @returns {Promise<{productNutrients: ProductNutrient[], total: number, page: number, limit: number}>} Un objeto con la lista de ProductNutrients, el total de registros, la página actual y el límite por página.
 */
export async function listProductNutrients({ filter = {}, page = 1, limit = 50 }) {
  const where = {};
  if (filter.nutrient_id) where.nutrient_id = filter.nutrient_id;
  if (filter.product_id)  where.product_id  = filter.product_id;

  const offset = (page - 1) * limit;
  const { rows, count } = await ProductNutrient.findAndCountAll({ where, offset, limit });
  return { productNutrients: rows, total: count, page, limit };
}

/**
 * Obtiene una asociación específica de nutriente-producto por su clave compuesta (nutrient_id y product_id).
 *
 * @async
 * @function getProductNutrient
 * @param {number} nutrient_id - ID del nutriente.
 * @param {number} product_id - ID del producto.
 * @returns {Promise<ProductNutrient>} El registro de ProductNutrient encontrado.
 * @throws {Error} Si no se encuentra la asociación, lanza un error con estado 404.
 */
export async function getProductNutrient(nutrient_id, product_id) {
  const pn = await ProductNutrient.findOne({ where: { nutrient_id, product_id } });
  if (!pn) {
    const error = new Error('ProductNutrient no encontrado');
    error.status = 404;
    throw error;
  }
  return pn;
}

/**
 * Elimina una asociación específica de nutriente-producto por su clave compuesta.
 *
 * @async
 * @function deleteProductNutrient
 * @param {number} nutrient_id - ID del nutriente.
 * @param {number} product_id - ID del producto.
 * @returns {Promise<{message: string}>} Un mensaje confirmando la eliminación.
 * @throws {Error} Si no se encuentra la asociación para eliminar, lanza un error con estado 404.
 */
export async function deleteProductNutrient(nutrient_id, product_id) {
  const count = await ProductNutrient.destroy({ where: { nutrient_id, product_id } });
  if (count === 0) {
    const error = new Error('ProductNutrient no encontrado');
    error.status = 404;
    throw error;
  }
  return { message: 'ProductNutrient eliminado correctamente' };
}
