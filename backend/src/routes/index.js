import express from 'express';
import usuarioRoutes from '../modules/usuarios/usuarioRoutes.js';
import alimentosRoutes from '../modules/alimentos/alimentosRoutes.js';
import dietaRoutes from '../modules/dieta/dietaRoutes.js';
import recetaRoutes from '../modules/receta/recetaRoutes.js';
import '../modules/associations.js'; // Importa las asociaciones para inicializarlas

const router = express.Router();

router.use('/usuario', usuarioRoutes);
router.use('/alimentos', alimentosRoutes);
router.use('/dieta', dietaRoutes);
router.use('/recetas', recetaRoutes);

export default router;
