import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/env.js';

/**
 * @function authMiddleware
 * @description Middleware para autenticar usuarios usando tokens JWT.
 *              Verifica el token JWT del encabezado de autorización.
 *              Si es válido, adjunta el payload decodificado (incluyendo `sub` como `id` y `role`) a `req.user`.
 *              Opcionalmente, puede verificar si el usuario tiene un rol específico.
 * @param {string} [requiredRole] - Rol opcional que el usuario debe tener para acceder a la ruta.
 * @returns {Function} Middleware de Express.
 */
const authMiddleware = (requiredRole) => (req, res, next) => { // Wrapped in a higher-order function
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Acceso denegado: No se proporcionó token o formato incorrecto.');
    err.status = 401;
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    const err = new Error('Acceso denegado: No se proporcionó token.');
    err.status = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    // El payload del token JWT contiene { sub: userId, role: userRole }
    req.user = {
        id: decoded.sub, // Mapear 'sub' (subject, que es el ID de usuario) a 'id'
        role: decoded.role,
        ...decoded // Incluir cualquier otro dato del payload si es necesario
    };

    // Si se requiere un rol específico, verificarlo
    if (requiredRole) {
      if (!req.user.role || req.user.role !== requiredRole) {
        const err = new Error('Acceso denegado: Permisos insuficientes.');
        err.status = 403; // Forbidden
        return next(err);
      }
    }

    next();
  } catch (error) {
    const err = new Error('Token inválido o expirado.');
    err.status = 401;
    if (error.name === 'TokenExpiredError') {
        err.message = 'Token expirado.';
    } else if (error.name === 'JsonWebTokenError') {
        err.message = 'Token inválido.';
    }
    return next(err);
  }
};

export default authMiddleware;
