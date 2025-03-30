import { getAllDietas } from './dietaService.js';

export const getDietas = async (req, res) => {
  try {
    const dietas = await getAllDietas();
    res.status(200).json(dietas);
  } catch (error) {
    console.error("Error al obtener las dietas:", error);
    res.status(500).json({ message: "Error al obtener las dietas" });
  }
};

export default { getDietas };