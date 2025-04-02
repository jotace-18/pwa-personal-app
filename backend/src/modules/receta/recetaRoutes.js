import express from 'express';
import { createReceta, getRecetas } from './recetaController.js';

const router = express.Router();

// Endpoint para crear receta
router.post('/crear-receta', createReceta);

// Endpoint para obtener todas las recetas
router.get('/', getRecetas);

export default router;