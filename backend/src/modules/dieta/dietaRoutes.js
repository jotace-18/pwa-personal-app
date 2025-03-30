import express from 'express';
import {getDietas} from './dietaController.js';

const router = express.Router();

router.get('/', getDietas);

export default router;