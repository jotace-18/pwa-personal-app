import { addReceta, getAllRecetas } from './recetaService.js';

export const createReceta = async (req, res) => {
  try {
    const { nombre, descripcion, instrucciones, tiempo_preparacion, user_id, ingredientes } = req.body;
    const recetaData = {
      nombre,
      descripcion,
      instrucciones,
      tiempo_preparacion,
      user_id, // para este caso, siempre será 1
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

export default { createReceta, getRecetas };