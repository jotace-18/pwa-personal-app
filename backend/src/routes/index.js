import express from 'express';
import usuarioRoutes from '../modules/usuarios/usuarioRoutes.js';

const router = express.Router();

// Usar las rutas de usuario
router.use('/usuarios', usuarioRoutes);

export default router;
