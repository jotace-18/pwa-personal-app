import Alimento from './alimentosModel.js';
import Nutriente from '../nutrientes/nutrienteModel.js';
import AlimentoNutriente from '../alimentos_nutrientes/alimentoNutrienteModel.js';

export const createAlimento = async (data) => {
  try {
    // Crear el alimento
    const newAlimento = await Alimento.create({
      nombre_alimento: data.nombre_alimento,
      tipo: data.tipo,
      supermercado: data.supermercado,
      precio: data.precio,
      calorias: data.calorias,
    });

    // Procesar cada nutriente enviado
    for (const nutrientData of data.nutrientes) {
      // Buscar el nutriente por nombre
      let nutrient = await Nutriente.findOne({
        where: { nombre_nutriente: nutrientData.nombre_nutriente }
      });
      if (!nutrient) {
        // Si no existe, se crea
        nutrient = await Nutriente.create({
          nombre_nutriente: nutrientData.nombre_nutriente,
          unidad: nutrientData.unidad,
        });
      }
      // Insertar la relación en la tabla alimento_nutriente
      await AlimentoNutriente.create({
        id_alimento: newAlimento.id_alimento,
        id_nutriente: nutrient.id_nutriente,
        cantidad: nutrientData.cantidad,
      });
    }

    return newAlimento;
  } catch (error) {
    throw error;
  }
};

export const getAllAlimentos = async () => {
  try {
    // Devuelve solo 'id_alimento' y 'nombre_alimento'
    const alimentos = await Alimento.findAll({
      attributes: ['id_alimento', 'nombre_alimento']
    });
    return alimentos;
  } catch (error) {
    throw error;
  }
};