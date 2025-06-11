import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @typedef {object} MealTypeAttributes Atributos para el modelo MealType.
 * @property {number} id   - ID del tipo de comida. Autoincremental y clave primaria.
 * @property {string} name - Nombre del tipo de comida (ej. Desayuno, Almuerzo). Debe ser único y no nulo.
 */

/**
 * Modelo Sequelize para la tabla `meal_types`.
 * Representa los diferentes tipos de comidas que se pueden registrar en el sistema.
 * @exports MealType
 */
const MealType = sequelize.define('MealType', {
  /**
   * @type {number}
   * Identificador único del tipo de comida.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  /**
   * @type {string}
   * Nombre del tipo de comida.
   * Limitado a 30 caracteres, no puede ser nulo y debe ser único.
   */
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'meal_types',
  underscored: true,
  timestamps: false // solo id y name, no created_at ni updated_at
});

export default MealType;
