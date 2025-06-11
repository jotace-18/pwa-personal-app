import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @typedef {object} FoodAttributes
 * @property {number} id            - ID del ingrediente (PK, auto-incremental).
 * @property {string} name          - Nombre del ingrediente.
 * @property {string} category      - Categoría del ingrediente.
 * @property {Date} created_at      - Fecha de creación.
 * @property {Date} updated_at      - Fecha de última actualización.
 */

/**
 * Modelo Sequelize para la tabla `foods`.
 * Representa un alimento en la base de datos.
 * @class Food
 * @extends import('sequelize').Model<FoodAttributes>
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {Date} created_at
 * @property {Date} updated_at
 */
const Food = sequelize.define('Food', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(30),
    allowNull: false,
  }
}, {
  tableName: 'foods', // Correct table name
  underscored: true, // Keeps automatic snake_casing for other Sequelize-managed fields if any
  timestamps: true,    // Enable Sequelize timestamp handling
  createdAt: 'created_at',    // Map 'createdAt' to 'created_at'
  updatedAt: 'updated_at' // Tell Sequelize to use 'updated_at' for update timestamps
});

export default Food;
