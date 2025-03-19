// associations.js
import Alimento from '../alimentos/alimentosModel.js';
import Nutriente from '../nutrientes/nutrienteModel.js';
import AlimentoNutriente from '../alimentos_nutrientes/alimentoNutrienteModel.js';

Alimento.belongsToMany(Nutriente, { through: AlimentoNutriente, foreignKey: 'id_alimento', otherKey: 'id_nutriente' });
Nutriente.belongsToMany(Alimento, { through: AlimentoNutriente, foreignKey: 'id_nutriente', otherKey: 'id_alimento' });

// Named exports en lugar de export default
export { Alimento, Nutriente, AlimentoNutriente };
