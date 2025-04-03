import express from 'express';
import { createReceta, getRecetas, deleteReceta, getRecetaPorId, updateReceta } from './recetaController.js';

const router = express.Router();

// Endpoint para crear receta
router.post('/crear-receta', createReceta);

// Endpoint para obtener todas las recetas
router.get('/', getRecetas);

// Endpoint para obtener una receta por su id
router.get('/:id', getRecetaPorId);

// Endpoint para actualizar receta
router.put('/:id', updateReceta);

// Endpoint para eliminar receta
router.delete('/:id', deleteReceta);

export default router;