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
    if (!receta) return null;

    // Conviertes la instancia de Sequelize a un objeto plano
    const recetaJSON = receta.toJSON();

    // Mapeas Alimentos a ingredientes
    recetaJSON.ingredientes = recetaJSON.Alimentos.map((ali) => {
      return {
        id_alimento: ali.id_alimento,
        nombre_alimento: ali.nombre_alimento,
        calorias: ali.calorias,
        nutrientes: ali.Nutrientes, // si tu modelo trae estos datos
        cantidad: ali.RecetaAlimento.cantidad,
        unidad: ali.RecetaAlimento.unidad,
      };
    });

    // Si quieres, puedes quitar Alimentos para no confundir
    delete recetaJSON.Alimentos;

    return recetaJSON;
  } catch (error) {
    console.error("Error al obtener la receta:", error);
    throw new Error("No se pudo obtener la receta");
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

export const updateReceta = async (id, recetaData, ingredientes) => {
  try {
    // Buscar la receta a actualizar
    const receta = await Receta.findByPk(id);
    if (!receta) {
      throw new Error("Receta no encontrada");
    }
    // Actualizar la receta principal
    await receta.update(recetaData);
    
    // Eliminar las relaciones antiguas en receta_alimento
    await RecetaAlimento.destroy({
      where: { id_receta: id },
    });
    
    // Crear nuevas relaciones para los ingredientes actualizados
    for (const ingrediente of ingredientes) {
      let id_alimento;
      // Cada ingrediente debe tener "nombre_alimento"
      if (ingrediente.nombre_alimento) {
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
      
      await RecetaAlimento.create({
        id_receta: receta.id_receta,
        id_alimento,
        cantidad: ingrediente.cantidad,
        unidad: ingrediente.unidad,
      });
    }
    
    return receta;
  } catch (error) {
    console.error("Error al actualizar la receta:", error);
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