// src/routes/index.js

import express from 'express';
import userRoutes from '../modules/users/user.routes.js';
import foodRoutes from '../modules/food/food.routes.js';
import mealTypeRoutes from '../modules/mealTypes/mealType.routes.js';
import storeRoutes from '../modules/stores/stores.routes.js';
import unitsRoutes from '../modules/units/units.routes.js';
import nutrientsRoutes from '../modules/nutrients/nutrients.routes.js';
import productsRoutes from '../modules/products/products.routes.js';
import productNutrients from '../modules/productNutrients/productNutrients.routes.js';

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

// Rutas de comida
/**
 * @name /food
 * @description Monta las rutas relacionadas con la gestión de alimentos bajo el prefijo '/food'.
 * @see {@link module:../modules/food/food.routes}
 */
router.use('/food', foodRoutes);

// Rutas de tipos de comida
/**
 * @name /meal-types
 * @description Monta las rutas relacionadas con los tipos de comida bajo el prefijo '/meal-types'.
 * @see {@link module:../modules/mealTypes/mealType.routes}
 */
router.use('/meal-types', mealTypeRoutes);

// Rutas de tiendas
/**
 * @name /stores
 * @description Monta las rutas relacionadas con la gestión de tiendas bajo el prefijo '/stores'.
 * @see {@link module:../modules/stores/stores.routes}
 */
router.use('/stores', storeRoutes);

// Rutas de unidades
/**
 * @name /units
 * @description Monta las rutas relacionadas con la gestión de unidades bajo el prefijo '/units'.
 * @see {@link module:../modules/units/units.routes}
 */
router.use('/units', unitsRoutes);

// Rutas de nutrientes
/**
 * @name /nutrients
 * @description Monta las rutas relacionadas con la gestión de nutrientes bajo el prefijo '/nutrients'.
 * @see {@link module:../modules/nutrients/nutrients.routes}
 */
router.use('/nutrients', nutrientsRoutes);

// Rutas de productos
/**
 * @name /products
 * @description Monta las rutas relacionadas con la gestión de productos bajo el prefijo '/products'.
 * @see {@link module:../modules/products/products.routes}
 */
router.use('/products', productsRoutes);

// Rutas de nutrientes-productos
/**
 * @name /product-nutrients
 * @description Monta las rutas relacionadas con la gestión de nutrientes de productos bajo el prefijo '/product-nutrients'.
 * @see {@link module:../modules/productNutrients/productNutrients.routes}
 */
router.use('/product-nutrients', productNutrients);

export default router;
