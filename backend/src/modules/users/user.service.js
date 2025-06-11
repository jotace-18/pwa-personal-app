// src/modules/users/user.service.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from './user.model.js';
import { jwtSecret } from '../../config/env.js';

// Constantes para los tiempos de expiración de los tokens
const ACCESS_TOKEN_EXPIRY = '7d'; // El token de acceso expira en 7 días
const RESET_TOKEN_EXPIRY  = '1h'; // El token de restablecimiento expira en 1 hora

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Los datos del usuario para el registro.
 * @param {string} userData.username - El nombre de usuario.
 * @param {string} userData.email - El email del usuario.
 * @param {string} userData.password - La contraseña del usuario.
 * @param {string} userData.full_name - El nombre completo del usuario.
 * @param {string} userData.birth_date - La fecha de nacimiento del usuario.
 * @param {string} userData.gender - El género del usuario.
 * @param {string} userData.locale - La configuración regional del usuario.
 * @param {string} userData.timezone - La zona horaria del usuario.
 * @param {string} userData.unit_system - El sistema de unidades preferido por el usuario.
 * @param {number} userData.height_cm - La altura del usuario en cm.
 * @param {number} userData.weight_kg - El peso del usuario en kg.
 * @param {string} userData.activity_level - El nivel de actividad del usuario.
 * @param {number} userData.daily_cal_goal - El objetivo diario de calorías del usuario.
 * @param {string} userData.diet_pref - Las preferencias dietéticas del usuario.
 * @param {string} userData.avatar_url - La URL del avatar del usuario.
 * @param {string} [userData.role='user'] - El rol del usuario (por defecto es 'user').
 * @returns {Promise<object>} Un objeto que contiene el nuevo usuario y un token de acceso.
 * @throws {Error} Si el email ya está registrado.
 */
export async function registerUser({
  username, email, password, full_name, birth_date, gender,
  locale, timezone, unit_system, height_cm, weight_kg,
  activity_level, daily_cal_goal, diet_pref, avatar_url, role = 'user'
}) {
  // Verifica si ya existe un usuario con el email proporcionado
  const exists = await User.findOne({ where: { email } });
  if (exists) {
    const err = new Error('Email ya registrado');
    err.status = 409; // Conflicto
    throw err;
  }
  // Hashea la contraseña antes de guardarla
  const password_hash = await bcrypt.hash(password, 12);
  // Crea el nuevo usuario en la base de datos
  const user = await User.create({
    username, email, password_hash, full_name, birth_date, gender,
    locale, timezone, unit_system, height_cm, weight_kg,
    activity_level, daily_cal_goal, diet_pref, avatar_url, role
  });
  // Genera un token de acceso JWT para el nuevo usuario
  const token = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
  return { user, token };
}

/**
 * Inicia sesión para un usuario existente.
 * @param {object} credentials - Las credenciales de inicio de sesión del usuario.
 * @param {string} credentials.email - El email del usuario.
 * @param {string} credentials.password - La contraseña del usuario.
 * @returns {Promise<object>} Un objeto que contiene el usuario y un token de acceso.
 * @throws {Error} Si no se encuentra el email o la contraseña es incorrecta.
 */
export async function loginUser({ email, password }) {
  // Busca el usuario por email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const err = new Error('Email no encontrado');
    err.status = 401; // No autorizado
    throw err;
  }
  // Compara la contraseña proporcionada con la contraseña hasheada almacenada
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Contraseña incorrecta');
    err.status = 401; // No autorizado
    throw err;
  }
  // Genera un token de acceso JWT para el usuario que ha iniciado sesión
  const token = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
  return { user, token };
}

/**
 * Obtiene la información del perfil de un usuario.
 * @param {string} userId - El ID del usuario a obtener.
 * @returns {Promise<object>} El objeto de usuario, excluyendo el hash de la contraseña.
 * @throws {Error} Si no se encuentra el usuario.
 */
export async function getUserProfile(userId) {
  // Busca el usuario por su clave primaria (ID)
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password_hash'] } // Excluye password_hash del resultado
  });
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404; // No encontrado
    throw err;
  }
  return user;
}

/**
 * Actualiza la información del perfil de un usuario.
 * @param {string} userId - El ID del usuario a actualizar.
 * @param {object} fields - Un objeto que contiene los campos a actualizar.
 * @returns {Promise<object>} El objeto de usuario actualizado, excluyendo el hash de la contraseña.
 * @throws {Error} Si no se pudo actualizar el perfil.
 */
export async function updateUserProfile(userId, fields) {
  // Evita la actualización directa del rol y password_hash a través de esta función
  delete fields.role;
  delete fields.password_hash;
  // Actualiza la información del usuario en la base de datos
  const [count, [updated]] = await User.update(fields, {
    where: { id: userId },
    returning: true, // Devuelve el registro actualizado
    individualHooks: true // Asegura que se activen los hooks de Sequelize
  });
  if (count === 0) {
    const err = new Error('No se pudo actualizar el perfil');
    err.status = 400; // Solicitud incorrecta
    throw err;
  }
  // Obtiene el objeto JavaScript simple de la instancia del modelo Sequelize
  const user = updated.get({ plain: true });
  // Elimina password_hash del objeto de usuario devuelto
  delete user.password_hash;
  return user;
}

/**
 * Cambia la contraseña de un usuario.
 * @param {string} userId - El ID del usuario.
 * @param {string} oldPassword - La contraseña actual del usuario.
 * @param {string} newPassword - La nueva contraseña a establecer.
 * @returns {Promise<object>} Un mensaje de éxito.
 * @throws {Error} Si no se encuentra el usuario o la contraseña antigua es incorrecta.
 */
export async function changePassword(userId, oldPassword, newPassword) {
  // Busca el usuario por su ID
  const user = await User.findByPk(userId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404; // No encontrado
    throw err;
  }
  // Compara la contraseña antigua proporcionada con la contraseña hasheada almacenada
  const matches = await bcrypt.compare(oldPassword, user.password_hash);
  if (!matches) {
    const err = new Error('Contraseña actual incorrecta');
    err.status = 401; // No autorizado
    throw err;
  }
  // Hashea la nueva contraseña
  const password_hash = await bcrypt.hash(newPassword, 12);
  // Actualiza el password_hash del usuario en la base de datos
  await user.update({ password_hash });
  return { message: 'Contraseña actualizada correctamente' };
}

/**
 * Refresca un token de acceso JWT existente.
 * @param {string} token - El token de acceso expirado o que está por expirar.
 * @returns {object} Un objeto que contiene un nuevo token de acceso.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
export function refreshToken(token) {
  try {
    // Verifica el token existente
    const payload = jwt.verify(token, jwtSecret);
    // Genera un nuevo token de acceso con el mismo payload
    const newToken = jwt.sign({ sub: payload.sub, role: payload.role }, jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
    return { token: newToken };
  } catch (e) {
    const err = new Error('Token inválido o expirado');
    err.status = 401; // No autorizado
    throw err;
  }
}

/**
 * Inicia el proceso de restablecimiento de contraseña para un usuario.
 * @param {string} email - El email del usuario que solicita un restablecimiento de contraseña.
 * @returns {object} Un objeto que contiene un token de restablecimiento de contraseña.
 */
export function initiatePasswordReset(email) {
  // Genera un token de restablecimiento JWT que contiene el email del usuario y un tipo 'reset'
  const resetToken = jwt.sign({ email, type: 'reset' }, jwtSecret, { expiresIn: RESET_TOKEN_EXPIRY });
  return { resetToken };
}

/**
 * Completa el proceso de restablecimiento de contraseña utilizando un token de restablecimiento.
 * @param {string} resetToken - El token de restablecimiento de contraseña.
 * @param {string} newPassword - La nueva contraseña a establecer.
 * @returns {Promise<object>} Un mensaje de éxito.
 * @throws {Error} Si el token de restablecimiento es inválido, ha expirado o no se encuentra el usuario.
 */
export async function completePasswordReset(resetToken, newPassword) {
  let payload;
  try {
    // Verifica el token de restablecimiento
    payload = jwt.verify(resetToken, jwtSecret);
  } catch {
    const err = new Error('Token de restablecimiento inválido o expirado');
    err.status = 401; // No autorizado
    throw err;
  }
  // Verifica si el token es un token de restablecimiento válido y contiene un email
  if (payload.type !== 'reset' || !payload.email) {
    const err = new Error('Token de restablecimiento no válido');
    err.status = 400; // Solicitud incorrecta
    throw err;
  }
  // Busca el usuario por el email en el payload del token
  const user = await User.findOne({ where: { email: payload.email } });
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404; // No encontrado
    throw err;
  }
  // Hashea la nueva contraseña
  const password_hash = await bcrypt.hash(newPassword, 12);
  // Actualiza el password_hash del usuario en la base de datos
  await user.update({ password_hash });
  return { message: 'Contraseña restablecida correctamente' };
}

/**
 * Elimina un usuario.
 * @param {string} userId - El ID del usuario a eliminar.
 * @returns {Promise<object>} Un mensaje de éxito.
 * @throws {Error} Si no se encuentra el usuario.
 */
export async function deleteUser(userId) {
  // Elimina el usuario de la base de datos
  const count = await User.destroy({ where: { id: userId } });
  if (count === 0) {
    const err = new Error('Usuario no encontrado');
    err.status = 404; // No encontrado
    throw err;
  }
  return { message: 'Usuario eliminado' };
}

/**
 * Lista usuarios con filtrado y paginación opcionales.
 * @param {object} options - Opciones para listar usuarios.
 * @param {object} [options.filter={}] - Criterios de filtrado.
 * @param {string} [options.filter.email] - Filtrar por email (coincidencia parcial, insensible a mayúsculas/minúsculas).
 * @param {string} [options.filter.role] - Filtrar por rol.
 * @param {number} [options.page=1] - El número de página para la paginación.
 * @param {number} [options.limit=10] - El número de usuarios por página.
 * @returns {Promise<object>} Un objeto que contiene la lista de usuarios, el recuento total, la página y el límite.
 */
export async function listUsers({ filter = {}, page = 1, limit = 10 }) {
  const where = {};
  // Aplica el filtro de email si se proporciona (búsqueda like insensible a mayúsculas/minúsculas)
  if (filter.email) where.email = { [Op.iLike]: `%${filter.email}%` };
  // Aplica el filtro de rol si se proporciona
  if (filter.role)  where.role  = filter.role;
  // Calcula el desplazamiento para la paginación
  const offset = (page - 1) * limit;
  // Busca y cuenta todos los usuarios que coinciden con los criterios con paginación
  const { rows, count } = await User.findAndCountAll({ where, offset, limit });
  return { users: rows, total: count, page, limit };
}
