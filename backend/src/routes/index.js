import express from 'express';
import usuarioRoutes from '../modules/usuarios/usuarioRoutes.js';
import alimentosRoutes from '../modules/alimentos/alimentosRoutes.js';

const router = express.Router();

// Usar las rutas de usuario
router.use('/usuario', usuarioRoutes);
router.use('/alimentos', alimentosRoutes);

export default router;
