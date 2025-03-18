import express from 'express';
import { addAlimento, getAlimentos } from './alimentosController.js';

const router = express.Router();

// La ruta base se monta en el router principal; por ejemplo, '/api/alimentos'
router.post('/', addAlimento);

// GET /api/alimentos
router.get('/', getAlimentos);

export default router;
