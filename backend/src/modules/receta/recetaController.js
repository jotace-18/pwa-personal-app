import { addReceta, getAllRecetas, getRecetaById, deleteReceta as deleteRecetaService } from './recetaService.js';

export const createReceta = async (req, res) => {
  try {
    const { nombre, descripcion, instrucciones, tiempo_preparacion, user_id, ingredientes } = req.body;
    const recetaData = {
      nombre,
      descripcion,
      instrucciones,
      tiempo_preparacion,
      user_id,
    };
    const nuevaReceta = await addReceta(recetaData, ingredientes);
    res.status(201).json(nuevaReceta);
  } catch (error) {
    console.error("Error al crear la receta:", error);
    res.status(500).json({ message: "Error al crear la receta" });
  }
};

export const getRecetas = async (req, res) => {
  try {
    const recetas = await getAllRecetas();
    res.status(200).json(recetas);
  } catch (error) {
    console.error("Error al obtener las recetas:", error);
    res.status(500).json({ message: "Error al obtener las recetas" });
  }
};

export const getRecetaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const receta = await getRecetaById(id);
    if (!receta) {
      return res.status(404).json({ message: "No se encontró la receta" });
    }
    res.json(receta);
  } catch (error) {
    console.error("Error al obtener la receta por id:", error);
    res.status(500).json({ message: "Error al obtener la receta" });
  }
};

export const deleteReceta = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRecetaService(id);
    res.status(200).json({ message: "Receta eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la receta:", error);
    res.status(500).json({ message: "Error al eliminar la receta" });
  }
};

export default { createReceta, getRecetas, deleteReceta };