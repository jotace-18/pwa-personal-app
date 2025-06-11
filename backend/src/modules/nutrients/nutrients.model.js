import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @file Modelo Sequelize para la tabla `nutrients`.
 * @module models/nutrient
 * @property {number} id    - ID del nutriente (PK, autoincremental).
 * @property {string} name  - Nombre del nutriente (único).
 */

/**
 * @typedef {object} NutrientAttributes
 * @property {number} id    - ID del nutriente (PK, autoincremental).
 * @property {string} name  - Nombre del nutriente (único).
 */

/**
 * Modelo Sequelize para la tabla `nutrients`.
 * Representa un nutriente en la base de datos.
 * @class Nutrient
 * @extends import('sequelize').Model<NutrientAttributes>
 * @property {number} id
 * @property {string} name
 */
const Nutrient = sequelize.define('Nutrient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'nutrients',
  underscored: true,
  timestamps: false
});

export default Nutrient;
