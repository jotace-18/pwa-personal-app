import Receta from './recetaModel.js';
import RecetaAlimento from '../receta_alimento/receta_alimentoModel.js';
import Alimento from '../alimentos/alimentosModel.js';

export const getAllRecetas = async () => {
  try {
    const recetas = await Receta.findAll({
      include: [
        {
          model: Alimento,
          through: { attributes: ["cantidad", "unidad"] },
        },
      ],
      order: [['nombre', 'ASC']]
    });
    return recetas;
  } catch (error) {
    console.error('Error al obtener las recetas:', error);
    throw new Error('No se pudieron obtener las recetas');
  }
};

export const getRecetaById = async (id) => {
  try {
    const receta = await Receta.findByPk(id, {
      include: [
        {
          model: Alimento,
          through: { attributes: ["cantidad", "unidad"] },
        },
      ],
    });
    return receta;
  } catch (error) {
    console.error('Error al obtener la receta:', error);
    throw new Error('No se pudo obtener la receta');
  }
};

export const addReceta = async (recetaData, ingredientes) => {
  try {
    // Crea la receta principal
    const nuevaReceta = await Receta.create(recetaData);
    
    // Itera por cada ingrediente que se ha enviado y obtiene el id_alimento a partir del nombre
    for (const ingrediente of ingredientes) {
      let id_alimento;
      
      // Se espera que cada ingrediente contenga: { nombre_alimento, cantidad, unidad }
      if (ingrediente.nombre_alimento) {
        // Busca en la tabla Alimento usando el nombre
        const alimento = await Alimento.findOne({
          where: { nombre_alimento: ingrediente.nombre_alimento },
        });
        if (!alimento) {
          throw new Error(`Alimento con nombre '${ingrediente.nombre_alimento}' no encontrado`);
        }
        id_alimento = alimento.id_alimento;
      } else {
        throw new Error("Cada ingrediente debe tener el campo 'nombre_alimento'");
      }
      
      // Crea la relación en la tabla receta_alimento
      await RecetaAlimento.create({
        id_receta: nuevaReceta.id_receta,
        id_alimento,
        cantidad: ingrediente.cantidad,
        unidad: ingrediente.unidad,
      });
    }
    
    return nuevaReceta;
  } catch (error) {
    console.error("Error al crear la receta:", error);
    throw error;
  }
};

export const deleteReceta = async (id) => {
  try {
    const result = await Receta.destroy({
      where: { id_receta: id }
    });
    return result;
  } catch (error) {
    console.error("Error al eliminar la receta:", error);
    throw error;
  }
};