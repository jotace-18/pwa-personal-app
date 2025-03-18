import { createAlimento, getAllAlimentos } from './alimentosService.js';

export const addAlimento = async (req, res) => {
  try {
    const { nombre_alimento, tipo, supermercado, precio, calorias, nutrientes } = req.body;
    
    // Validación básica: todos los campos son requeridos, incluyendo al menos un nutriente
    if (!nombre_alimento || !tipo || !supermercado || precio === undefined || calorias === undefined || !nutrientes || !nutrientes.length) {
      return res.status(400).json({ message: 'Faltan campos obligatorios, incluido el nutriente.' });
    }
    
    const newAlimento = await createAlimento({ nombre_alimento, tipo, supermercado, precio, calorias, nutrientes });
    
    res.status(201).json({ message: 'Alimento creado exitosamente', data: newAlimento });
  } catch (error) {
    console.error("Error al crear alimento:", error);
    res.status(500).json({ message: 'Error al crear alimento' });
  }
};

export const getAlimentos = async (req, res) => {
  try {
    const alimentos = await getAllAlimentos();
    res.json(alimentos);  // Retorna un array de objetos con id_alimento y nombre_alimento
  } catch (error) {
    console.error("Error al obtener alimentos:", error);
    res.status(500).json({ message: 'Error al obtener la lista de alimentos.' });
  }
};

export default { addAlimento, getAlimentos };
