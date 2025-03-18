import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Nutriente = sequelize.define('Nutriente', {
  id_nutriente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_nutriente: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  unidad: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  freezeTableName: true,
  tableName: 'nutriente',
  timestamps: false,
});

export default Nutriente;
