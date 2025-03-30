import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Usuario = sequelize.define('Usuario', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    tableName: 'usuario',
    timestamps: false,
});

// Eliminamos asociaciones aquí para definirlas de forma centralizada

export default Usuario;
