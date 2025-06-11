import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @file Modelo Sequelize para la tabla `products`.
 * @module models/product
 * @property {number} product_id        - ID del producto (PK, autoincremental).
 * @property {number} food_id           - FK a foods.id.
 * @property {number} store_id          - FK a stores.id.
 * @property {string} brand             - Marca del producto.
 * @property {number} price_per_100g    - Precio por 100 g.
 * @property {number} calories_per_100g - Calorías por 100 g.
 * @property {Date} created_at          - Fecha de creación.
 * @property {Date} updated_at          - Fecha de última actualización.
 */

/**
 * @typedef {object} ProductAttributes
 * @property {number} product_id        - ID del producto (PK, autoincremental).
 * @property {number} food_id           - FK a foods.id.
 * @property {number} store_id          - FK a stores.id.
 * @property {string} brand             - Marca del producto.
 * @property {number} price_per_100g    - Precio por 100 g.
 * @property {number} calories_per_100g - Calorías por 100 g.
 * @property {Date} created_at          - Fecha de creación.
 * @property {Date} updated_at          - Fecha de última actualización.
 */

/**
 * Modelo Sequelize para la tabla `products`.
 * Representa un producto específico de una tienda en la base de datos.
 * @class Product
 * @extends import('sequelize').Model<ProductAttributes>
 * @property {number} product_id
 * @property {number} food_id
 * @property {number} store_id
 * @property {string} brand
 * @property {number} price_per_100g
 * @property {number} calories_per_100g
 * @property {Date} created_at
 * @property {Date} updated_at
 */
const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  food_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'foods', key: 'id' }
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'stores', key: 'id' }
  },
  brand: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  price_per_100g: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false
  },
  calories_per_100g: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'products',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Product;
