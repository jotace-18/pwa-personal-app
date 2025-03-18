import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const AlimentoNutriente = sequelize.define('AlimentoNutriente', {
  id_alimento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  id_nutriente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  cantidad: {
    type: DataTypes.DECIMAL(6,2),
    allowNull: true,
    validate: {
      min: 0,
    },
  },
}, {
  freezeTableName: true,
  tableName: 'alimento_nutriente',
  timestamps: false,
});

export default AlimentoNutriente;
