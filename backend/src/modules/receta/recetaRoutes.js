import express from 'express';
import { createReceta, getRecetas, deleteReceta, getRecetaPorId} from './recetaController.js';

const router = express.Router();

// Endpoint para crear receta
router.post('/crear-receta', createReceta);

// Endpoint para obtener todas las recetas
router.get('/', getRecetas);

// Endpoint para obtener una receta por su id
router.get('/:id', getRecetaPorId);

router.delete('/:id', deleteReceta);

export default router;