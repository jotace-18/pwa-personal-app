import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Receta = sequelize.define('Receta', {
  id_receta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  instrucciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tiempo_preparacion: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Puedes agregar la referencia al modelo Usuario si lo deseas, o definir la asociación en el archivo central.
  },
}, {
  freezeTableName: true,
  tableName: 'receta',
  timestamps: false,
});

export default Receta;