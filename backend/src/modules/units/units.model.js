import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @file Modelo Sequelize para la tabla `units`.
 * @module models/unit
 * @property {number} id             - ID de la unidad (PK, autoincremental).
 * @property {string} name           - Nombre de la unidad (ej. “Gramo”).
 * @property {string} abbreviation   - Abreviatura (ej. “g”).
 * @property {number} to_base_factor - Factor de conversión a unidad base (ej. 0.001 para gramos si la base es kg).
 */

/**
 * @typedef {object} UnitAttributes
 * @property {number} id             - ID de la unidad (PK, autoincremental).
 * @property {string} name           - Nombre de la unidad (ej. “Gramo”).
 * @property {string} abbreviation   - Abreviatura (ej. “g”).
 * @property {number} to_base_factor - Factor de conversión a unidad base (ej. 0.001 para gramos si la base es kg).
 */

/**
 * Modelo Sequelize para la tabla `units`.
 * Representa una unidad de medida en la base de datos.
 * @class Unit
 * @extends import('sequelize').Model<UnitAttributes>
 * @property {number} id
 * @property {string} name
 * @property {string} abbreviation
 * @property {number} to_base_factor
 */
const Unit = sequelize.define('Unit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  abbreviation: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  to_base_factor: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  }
}, {
  tableName: 'units',
  underscored: true,
  timestamps: false
});

export default Unit;
