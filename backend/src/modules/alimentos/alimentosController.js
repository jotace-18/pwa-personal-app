import { createAlimento, getAllAlimentos, getAlimentoByNameService } from './alimentosService.js';

export const addAlimento = async (req, res) => {
  try {
    const { nombre_alimento, tipo, supermercado, marca, precio, calorias, nutrientes } = req.body;
    
    // Validación básica: todos los campos son requeridos, incluyendo al menos un nutriente
    if (!nombre_alimento || !tipo || !supermercado || !marca || precio === undefined || calorias === undefined || !nutrientes || !nutrientes.length) {
      return res.status(400).json({ message: 'Faltan campos obligatorios, incluido el nutriente.' });
    }
    
    const newAlimento = await createAlimento({ nombre_alimento, tipo, supermercado, marca, precio, calorias, nutrientes });
    
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

export const getAlimentoByName = async (req, res) => {
  try {
    const { nombre } = req.params;
    const alimento = await getAlimentoByNameService(nombre);

    if (!alimento) {
      return res.status(404).json({ message: 'No se encontró el alimento' });
    }

    // Asegúrate de incluir "id_alimento" en el objeto resultado
    const resultado = {
      id_alimento: alimento.id_alimento,          // <-- ¡IMPORTANTE!
      nombre_alimento: alimento.nombre_alimento,
      tipo: alimento.tipo,
      supermercado: alimento.supermercado,
      marca: alimento.marca,
      precio: Number(alimento.precio),
      calorias: alimento.calorias,
      nutrientes: alimento.Nutrientes?.map((n) => ({
        nombre_nutriente: n.nombre_nutriente,
        cantidad: Number(n.AlimentoNutriente.cantidad),
      })) || [],
    };

    return res.json(resultado);

  } catch (error) {
    console.error('Error al obtener el alimento por nombre:', error);
    return res.status(500).json({ message: 'Error al obtener el alimento' });
  }
};

import { getNutrientesByAlimentoId } from './alimentosService.js';

export const getNutrientesByAlimento = async (req, res) => {
  try {
    const { id } = req.params;
    const nutrientes = await getNutrientesByAlimentoId(id);
    res.json(nutrientes);
  } catch (error) {
    console.error("Error al obtener nutrientes del alimento:", error);
    res.status(500).json({ message: "Error al obtener los nutrientes" });
  }
};


export const getAlimentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const alimento = await Alimento.findByPk(id, {
      include: [
        {
          model: Nutriente,
          attributes: ['nombre_nutriente'],
          through: { attributes: ['cantidad'] },
        },
      ],
    });

    if (!alimento) {
      return res.status(404).json({ message: 'Alimento no encontrado' });
    }

    res.json({
      calorias: alimento.calorias,
      nutrientes: alimento.Nutrientes?.map(n => ({
        nombre_nutriente: n.nombre_nutriente,
        cantidad: Number(n.AlimentoNutriente.cantidad),
      })) || [],
    });
  } catch (error) {
    console.error("Error al obtener alimento por ID:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

