// src/modules/users/userModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @typedef {object} UserAttributes
 * @property {number} id - El ID del usuario (clave primaria, autoincremental).
 * @property {string} username - El nombre de usuario (único, no nulo).
 * @property {string} email - El email del usuario (único, no nulo).
 * @property {string} password_hash - El hash de la contraseña del usuario (no nulo).
 * @property {string} [full_name] - El nombre completo del usuario.
 * @property {string} [birth_date] - La fecha de nacimiento del usuario (solo fecha).
 * @property {string} [gender] - El género del usuario.
 * @property {string} locale - La configuración regional del usuario (no nulo, por defecto 'es_ES').
 * @property {string} timezone - La zona horaria del usuario (no nulo, por defecto 'Europe/Madrid').
 * @property {string} unit_system - El sistema de unidades preferido por el usuario (no nulo, por defecto 'metric').
 * @property {number} [height_cm] - La altura del usuario en centímetros.
 * @property {number} [weight_kg] - El peso del usuario en kilogramos.
 * @property {string} [activity_level] - El nivel de actividad del usuario.
 * @property {number} [daily_cal_goal] - El objetivo diario de calorías del usuario.
 * @property {string} [diet_pref] - Las preferencias dietéticas del usuario.
 * @property {string} [avatar_url] - La URL del avatar del usuario.
 * @property {string} role - El rol del usuario (no nulo, por defecto 'user').
 * @property {Date} created_at - La fecha y hora de creación del registro.
 * @property {Date} updated_at - La fecha y hora de la última actualización del registro.
 */

/**
 * Modelo de Sequelize para la entidad 'User'.
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<UserAttributes, UserAttributes>>}
 */
const User = sequelize.define('User', {
  /**
   * El ID del usuario.
   * @type {number}
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  /**
   * El nombre de usuario. Debe ser único.
   * @type {string}
   */
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  /**
   * El email del usuario. Debe ser único.
   * @type {string}
   */
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  /**
   * El hash de la contraseña del usuario.
   * @type {string}
   */
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  /**
   * El nombre completo del usuario.
   * @type {?string}
   */
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  /**
   * La fecha de nacimiento del usuario.
   * @type {?string}
   */
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  /**
   * El género del usuario.
   * @type {?string}
   */
  gender: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  /**
   * La configuración regional del usuario.
   * @type {string}
   */
  locale: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'es_ES'
  },
  /**
   * La zona horaria del usuario.
   * @type {string}
   */
  timezone: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Europe/Madrid'
  },
  /**
   * El sistema de unidades preferido por el usuario (ej. métrico, imperial).
   * @type {string}
   */
  unit_system: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'metric'
  },
  /**
   * La altura del usuario en centímetros.
   * @type {?number}
   */
  height_cm: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },
  /**
   * El peso del usuario en kilogramos.
   * @type {?number}
   */
  weight_kg: {
    type: DataTypes.DECIMAL(6,2),
    allowNull: true
  },
  /**
   * El nivel de actividad del usuario (ej. sedentario, ligero, moderado, activo).
   * @type {?string}
   */
  activity_level: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  /**
   * El objetivo diario de calorías del usuario.
   * @type {?number}
   */
  daily_cal_goal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  /**
   * Las preferencias dietéticas del usuario.
   * @type {?string}
   */
  diet_pref: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  /**
   * La URL del avatar del usuario.
   * @type {?string}
   */
  avatar_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  /**
   * El rol del usuario (ej. user, admin).
   * @type {string}
   */
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  // Opciones del modelo
  tableName: 'users', // Nombre de la tabla en la base de datos
  underscored: true, // Usa snake_case para los nombres de las columnas generadas automáticamente (ej. created_at)
  timestamps: true, // Habilita los campos createdAt y updatedAt
  createdAt: 'created_at', // Nombre personalizado para el campo createdAt
  updatedAt: 'updated_at' // Nombre personalizado para el campo updatedAt
});

export default User;
