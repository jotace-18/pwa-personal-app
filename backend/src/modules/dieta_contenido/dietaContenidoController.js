import { getComidaDelDia, saveComidaDelDia } from './dietaContenidoService.js';

export const getContenidoDietaPorDiaComida = async (req, res) => {
  try {
    const { id_dieta, dia, comida } = req.params;
    const contenido = await getComidaDelDia(id_dieta, dia, comida);
    res.status(200).json(contenido);
  } catch (error) {
    console.error("Error al obtener contenido:", error);
    res.status(500).json({ message: "Error al obtener contenido de la dieta" });
  }
};

export const guardarContenidoDietaPorDiaComida = async (req, res) => {
  try {
    const { id_dieta, dia, comida } = req.params;
    const { alimentos = [], recetas = [] } = req.body;
    await saveComidaDelDia(id_dieta, dia, comida, alimentos, recetas);
    res.status(200).json({ message: "Contenido guardado correctamente" });
  } catch (error) {
    console.error("Error al guardar contenido:", error);
    res.status(500).json({ message: "Error al guardar contenido de la dieta" });
  }
};
