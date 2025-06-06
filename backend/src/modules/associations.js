// associations.js
import Alimento from './alimentos/alimentosModel.js';
import Nutriente from './nutrientes/nutrienteModel.js';
import AlimentoNutriente from './alimentos_nutrientes/alimentoNutrienteModel.js';
import Dieta from './dieta/dietaModel.js';
import Usuario from './usuarios/usuarioModel.js';
import Receta from './receta/recetaModel.js';
import RecetaAlimento from './receta_alimento/receta_alimentoModel.js';

// Asociaciones de Alimentos con Nutrientes (muchos a muchos)
Alimento.belongsToMany(Nutriente, { 
  through: AlimentoNutriente, 
  foreignKey: 'id_alimento', 
  otherKey: 'id_nutriente' 
});
Nutriente.belongsToMany(Alimento, { 
  through: AlimentoNutriente, 
  foreignKey: 'id_nutriente', 
  otherKey: 'id_alimento' 
});

// Relación entre Dieta y Usuario: una dieta pertenece a un usuario (y el usuario tiene muchas dietas)
Dieta.belongsTo(Usuario, { 
  foreignKey: 'user_id', 
  onDelete: 'CASCADE' 
});
Usuario.hasMany(Dieta, { 
  foreignKey: 'user_id' 
});

// Asociaciones de Receta con Alimento (muchos a muchos)
Receta.belongsToMany(Alimento, {
  through: RecetaAlimento,
  foreignKey: 'id_receta',
  otherKey: 'id_alimento',
});
Alimento.belongsToMany(Receta, {
  through: RecetaAlimento,
  foreignKey: 'id_alimento',
  otherKey: 'id_receta',
});

// Si lo deseas, puedes asociar Receta con Usuario:
Receta.belongsTo(Usuario, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Usuario.hasMany(Receta, { foreignKey: 'user_id' });

// Exporta los modelos con las asociaciones ya configuradas
export {
  Alimento,
  Nutriente,
  AlimentoNutriente,
  Dieta,
  Usuario,
  Receta,
  RecetaAlimento
};
