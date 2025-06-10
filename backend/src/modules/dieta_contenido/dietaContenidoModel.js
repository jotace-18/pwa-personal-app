// dietaContenidoModel.js

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const DietaAlimento = sequelize.define('dieta_alimento', {
  id_dieta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  id_alimento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  dia: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  comida: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  cantidad: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
}, {
  timestamps: false,
});

const DietaReceta = sequelize.define('dieta_receta', {
  id_dieta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  id_receta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  dia: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  comida: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  cantidad: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
}, {
  timestamps: false,
});

export { DietaAlimento, DietaReceta };