import { getAllDietas, addDieta, updateDietaActivation, deleteDieta } from './dietaService.js';

export const getDietas = async (req, res) => {
  try {
    const dietas = await getAllDietas();
    res.status(200).json(dietas);
  } catch (error) {
    console.error("Error al obtener las dietas:", error);
    res.status(500).json({ message: "Error al obtener las dietas" });
  }
};

export const createDieta = async (req, res) => {
  try {
    const { nombre_dieta, descripcion, tipo_dieta } = req.body;
    const dietaData = {
      user_id: 1,
      nombre_dieta,
      descripcion,
      tipo_dieta,
      fecha_inicio: new Date(),
      activa: false,
    };
    const newDieta = await addDieta(dietaData);
    return res.status(201).json(newDieta);
  } catch (error) {
    console.error("Error al crear la dieta:", error);
    return res.status(500).json({ message: "Error al crear la dieta" });
  }
};

export const activateDieta = async (req, res) => {
  try {
    const { id } = req.params;
    const { activa } = req.body;
    const updatedDieta = await updateDietaActivation(id, activa);
    return res.status(200).json(updatedDieta);
  } catch (error) {
    console.error("Error al activar/desactivar la dieta:", error);
    return res.status(500).json({ message: "Error al activar/desactivar la dieta" });
  }
};

export const deleteDietaController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDieta(id);
    return res.status(200).json({ message: "Dieta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la dieta:", error);
    return res.status(500).json({ message: "No se pudo eliminar la dieta" });
  }
};

export default { getDietas, createDieta, activateDieta, deleteDietaController };