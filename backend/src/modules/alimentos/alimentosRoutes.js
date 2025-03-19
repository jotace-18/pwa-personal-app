import express from 'express';
import { addAlimento, getAlimentos } from './alimentosController.js';
import { getAlimentoByName } from './alimentosController.js';

const router = express.Router();

// La ruta base se monta en el router principal; por ejemplo, '/api/alimentos'
router.post('/', addAlimento);

// GET /api/alimentos
router.get('/', getAlimentos);

// GET alimentos por nombre
router.get('/:nombre', getAlimentoByName)

export default router;
