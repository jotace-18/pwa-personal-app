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
    // Si es necesario, agrega aquí los demás campos, como fecha_registro, avatar, etc.
}, {
    freezeTableName: true,       // No pluraliza el nombre de la tabla
    tableName: 'usuario',        // Nombre exacto de la tabla en la BD
    timestamps: false,           // Desactiva createdAt y updatedAt (ya que en el schema se usa fecha_registro)
});

export default Usuario;
