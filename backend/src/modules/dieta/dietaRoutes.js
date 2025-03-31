import express from 'express';
import { getDietas, createDieta, activateDieta, deleteDietaController } from './dietaController.js';

const router = express.Router();

router.get('/', getDietas);
router.post('/', createDieta);
router.put('/:id/activar', activateDieta);
router.delete('/:id', deleteDietaController);

export default router;