import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const RecetaAlimento = sequelize.define('RecetaAlimento', {
  id_receta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  id_alimento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unidad: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  freezeTableName: true,
  tableName: 'receta_alimento',
  timestamps: false,
});

export default RecetaAlimento;