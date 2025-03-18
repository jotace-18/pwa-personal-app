import express from 'express';
import usuarioController from './usuarioController.js';

const router = express.Router();

// Ruta de registro
router.post('/register', usuarioController.register);

export default router;
