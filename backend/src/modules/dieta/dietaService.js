import { Op } from "sequelize";
import Dieta from './dietaModel.js';
import Usuario from '../usuarios/usuarioModel.js';

export const getAllDietas = async () => {
  try {
    const dietas = await Dieta.findAll({
      attributes: ['id_dieta', 'user_id', 'nombre_dieta', 'descripcion', 'tipo_dieta', 'fecha_creacion', 'fecha_inicio', 'activa'],
      include: [
        {
          model: Usuario,
          attributes: ['id_user', 'nombre'],
        },
      ],
      order: [['activa', 'DESC'], ['fecha_creacion', 'DESC']]
    });
    return dietas;
  } catch (error) {
    console.error('Error al obtener las dietas:', error);
    throw new Error('No se pudieron obtener las dietas');
  }
};

export const addDieta = async (dietaData) => {
  try {
    // Crea una nueva dieta en la tabla
    const newDieta = await Dieta.create(dietaData);
    return newDieta;
  } catch (error) {
    console.error('Error al agregar la dieta:', error);
    throw new Error('No se pudo agregar la dieta');
  }
};

export const updateDietaActivation = async (id, activa) => {
  try {
    // Si se activa la dieta, desactivar las demás
    if (activa) {
      await Dieta.update(
        { activa: false },
        { where: { id_dieta: { [Op.ne]: id } } }
      );
    }
    // Actualizar la dieta clicada; podrías actualizar también fecha_inicio
    await Dieta.update(
      { activa, fecha_inicio: activa ? new Date() : new Date() },
      { where: { id_dieta: id } }
    );
    const updatedDieta = await Dieta.findByPk(id);
    return updatedDieta;
  } catch (error) {
    console.error("Error al actualizar la activación de la dieta:", error);
    throw new Error("No se pudo actualizar la dieta");
  }
};

export const deleteDieta = async (id) => {
  try {
    const deleted = await Dieta.destroy({ where: { id_dieta: id } });
    if (deleted === 0) {
      throw new Error("Dieta no encontrada");
    }
    return deleted;
  } catch (error) {
    console.error("Error al eliminar la dieta:", error);
    throw new Error("No se pudo eliminar la dieta");
  }
};