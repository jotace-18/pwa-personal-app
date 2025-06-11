import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @typedef {object} StoreAttributes
 * @property {number} id        - ID de la tienda (PK, auto-incremental).
 * @property {string} name      - Nombre de la tienda (único).
 * @property {Date} created_at  - Fecha de creación.
 */

/**
 * Modelo Sequelize para la tabla `stores`.
 * Representa una tienda en la base de datos.
 * @class Store
 * @extends import('sequelize').Model<StoreAttributes>
 * @property {number} id
 * @property {string} name
 * @property {Date} created_at
 */
const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'stores',
    underscored: true,
    timestamps: true, // Habilita timestamps
    createdAt: 'created_at', // Mapea createdAt a created_at
    updatedAt: false // Deshabilita updatedAt ya que no existe en la tabla
});

export default Store;
