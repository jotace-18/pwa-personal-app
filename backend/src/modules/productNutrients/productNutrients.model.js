import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * Atributos para el modelo ProductNutrient.
 * @typedef {object} ProductNutrientAttributes
 * @property {number} nutrient_id - ID del nutriente (PK, FK a nutrients.id).
 * @property {number} product_id  - ID del producto (PK, FK a products.product_id).
 * @property {number} amount_100g - Cantidad del nutriente por 100g de producto.
 */

/**
 * Atributos para creación (omitidos timestamps).
 * @typedef {Omit<ProductNutrientAttributes, 'createdAt'|'updatedAt'>} ProductNutrientCreationAttributes
 */

class ProductNutrient extends Model {}

ProductNutrient.init({
  nutrient_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: { model: 'nutrients', key: 'id' }
  },
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: { model: 'products', key: 'product_id' }
  },
  amount_100g: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: false,
    field: 'amount_100g'
  }
}, {
  sequelize,
  modelName: 'ProductNutrient',
  tableName: 'product_nutrients',
  underscored: true,
  timestamps: false
});

export default ProductNutrient;
