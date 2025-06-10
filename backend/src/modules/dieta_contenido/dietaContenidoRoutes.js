import express from 'express';
import {
  getContenidoDietaPorDiaComida,
  guardarContenidoDietaPorDiaComida
} from './dietaContenidoController.js';

const router = express.Router();

router.get('/:id_dieta/dia/:dia/comida/:comida', getContenidoDietaPorDiaComida);
router.post('/:id_dieta/dia/:dia/comida/:comida', guardarContenidoDietaPorDiaComida);

export default router;
