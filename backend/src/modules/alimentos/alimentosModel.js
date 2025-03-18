import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Alimento = sequelize.define('Alimento', {
  id_alimento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_alimento: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  supermercado: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  calorias: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  ultima_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  freezeTableName: true,
  tableName: 'alimento',
  timestamps: false,
});

export default Alimento;
