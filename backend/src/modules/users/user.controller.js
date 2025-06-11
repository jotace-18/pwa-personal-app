// backend/src/modules/users/user.controller.js
import * as userService from './user.service.js';

/**
 * @async
 * @function register
 * @description Controlador para registrar un nuevo usuario.
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const register = async (req, res, next) => {
  try {
    const { user, token } = await userService.registerUser(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function login
 * @description Controlador para iniciar sesión de un usuario.
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const login = async (req, res, next) => {
  try {
    const { user, token } = await userService.loginUser(req.body);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function profile
 * @description Controlador para obtener el perfil del usuario autenticado.
 * @param {object} req - Objeto de solicitud Express, se espera `req.user.id` del middleware de autenticación.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const profile = async (req, res, next) => {
  try {
    // Assuming authMiddleware sets req.user with an id property
    const userProfile = await userService.getUserProfile(req.user.id);
    res.json(userProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function updateProfile
 * @description Controlador para actualizar el perfil del usuario autenticado.
 * @param {object} req - Objeto de solicitud Express, se espera `req.user.id` y `req.body` con los datos a actualizar.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function doChangePassword
 * @description Controlador para cambiar la contraseña del usuario autenticado.
 * @param {object} req - Objeto de solicitud Express, se espera `req.user.id` y `req.body` con `oldPassword` y `newPassword`.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const doChangePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const message = await userService.changePassword(req.user.id, oldPassword, newPassword);
    res.json(message);
  } catch (error) {
    next(error);
  }
};

/**
 * @function doRefreshToken
 * @description Controlador para refrescar un token de acceso.
 * @param {object} req - Objeto de solicitud Express, se espera `req.body.token`.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const doRefreshToken = (req, res, next) => {
  try {
    // Assuming refreshToken service function expects the token string directly
    const tokenData = userService.refreshToken(req.body.token);
    res.json(tokenData);
  } catch (error) {
    next(error);
  }
};

/**
 * @function requestPasswordReset
 * @description Controlador para solicitar un restablecimiento de contraseña.
 * @param {object} req - Objeto de solicitud Express, se espera `req.body.email`.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const requestPasswordReset = (req, res, next) => {
  try {
    // Assuming initiatePasswordReset service function expects email directly
    const resetData = userService.initiatePasswordReset(req.body.email);
    res.json(resetData);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function doPasswordReset
 * @description Controlador para completar un restablecimiento de contraseña.
 * @param {object} req - Objeto de solicitud Express, se espera `req.body` con `resetToken` y `newPassword`.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const doPasswordReset = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    const message = await userService.completePasswordReset(resetToken, newPassword);
    res.json(message);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function removeUser
 * @description Controlador para eliminar el perfil del usuario autenticado.
 * @param {object} req - Objeto de solicitud Express, se espera `req.user.id`.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const removeUser = async (req, res, next) => {
  try {
    const message = await userService.deleteUser(req.user.id);
    res.json(message);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function listAllUsers
 * @description Controlador para listar todos los usuarios (ruta de administrador).
 * @param {object} req - Objeto de solicitud Express, se espera `req.query` con `page`, `limit` y `filter`.
 * @param {object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware next de Express.
 */
export const listAllUsers = async (req, res, next) => {
  try {
    // Extract filter, page, limit from req.query, providing defaults
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const filter = req.query.filter || {}; // Assuming filter is an object or undefined

    const usersData = await userService.listUsers({ filter, page, limit });
    res.json(usersData);
  } catch (error) {
    next(error);
  }
};
