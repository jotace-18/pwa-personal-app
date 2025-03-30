import Dieta from './dietaModel.js';
import Usuario from '../usuarios/usuarioModel.js';

export const getAllDietas = async () => {
  try {
    // Obtiene todas las dietas de la tabla, incluyendo la columna activa
    const dietas = await Dieta.findAll({
      attributes: ['id_dieta', 'user_id', 'nombre_dieta', 'descripcion', 'tipo_dieta', 'fecha_creacion', 'fecha_inicio', 'activa'],
      include: [
        {
          model: Usuario,
          attributes: ['id_user', 'nombre'], // Incluye información básica del usuario relacionado
        },
      ],
    });
    return dietas;
  } catch (error) {
    console.error('Error al obtener las dietas:', error);
    throw new Error('No se pudieron obtener las dietas');
  }
};