import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Dieta = sequelize.define('Dieta', {
  id_dieta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre_dieta: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipo_dieta: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  freezeTableName: true,
  tableName: 'dieta',
  timestamps: false,
});

export default Dieta;