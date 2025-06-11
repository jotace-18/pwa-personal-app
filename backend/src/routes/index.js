// src/routes/index.js

import express from 'express';
import userRoutes from '../modules/users/user.routes.js';

/**
 * Enrutador principal de la aplicación.
 * @type {express.Router}
 */
const router = express.Router();

// Rutas de autenticación y usuario
/**
 * @name /auth
 * @description Monta las rutas relacionadas con la autenticación y gestión de usuarios bajo el prefijo '/auth'.
 * @see {@link module:../modules/users/user.routes}
 */
router.use('/auth', userRoutes);

export default router;
