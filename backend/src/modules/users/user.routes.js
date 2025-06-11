// src/modules/users/userRoutes.js

import { Router } from 'express';
import Joi from 'joi';
import {
  register,
  login,
  profile,
  updateProfile,
  doChangePassword,
  doRefreshToken,
  requestPasswordReset,
  doPasswordReset,
  removeUser,
  listAllUsers
} from './user.controller.js'; // Corrected import path
import { validateBody, validateQuery } from '../../middlewares/validationMiddleware.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = Router();

// Esquemas de validación de Joi para las rutas de usuario

const registerSchema = Joi.object({
  username:      Joi.string().required(),
  email:         Joi.string().email().required(),
  password:      Joi.string().min(6).required(),
  full_name:     Joi.string().optional(),
  birth_date:    Joi.date().optional(),
  gender:        Joi.string().valid('M','F','Otro').optional(),
  locale:        Joi.string().optional(),
  timezone:      Joi.string().optional(),
  unit_system:   Joi.string().optional(),
  height_cm:     Joi.number().optional(),
  weight_kg:     Joi.number().optional(),
  activity_level:Joi.string().optional(),
  daily_cal_goal:Joi.number().optional(),
  diet_pref:     Joi.string().optional(),
  avatar_url:    Joi.string().optional(),
  role:          Joi.string().optional()
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required()
});

const changePwdSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const refreshSchema = Joi.object({
  token: Joi.string().required()
});

const resetRequestSchema = Joi.object({
  email: Joi.string().email().required()
});

// Assuming a resetSchema is needed for doPasswordReset
const resetSchema = Joi.object({
  resetToken: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Esquema para actualizar el perfil: todos los campos opcionales
const updateProfileSchema = Joi.object({
  username:      Joi.string().optional(),
  email:         Joi.string().email().optional(),
  full_name:     Joi.string().optional(),
  birth_date:    Joi.date().optional(),
  gender:        Joi.string().valid('M','F','Otro').optional(),
  locale:        Joi.string().optional(),
  timezone:      Joi.string().optional(),
  unit_system:   Joi.string().optional(),
  height_cm:     Joi.number().optional(),
  weight_kg:     Joi.number().optional(),
  activity_level:Joi.string().optional(),
  daily_cal_goal:Joi.number().optional(),
  diet_pref:     Joi.string().optional(),
  avatar_url:    Joi.string().optional()
})
  // al menos un campo tiene que venir
  .min(1)
  .messages({
    'object.min': 'Debes especificar al menos un campo a actualizar'
  });

// Assuming a listSchema is needed for listAllUsers
const listSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    filter: Joi.object({
        email: Joi.string().email().optional(),
        role: Joi.string().optional()
    }).optional()
});


// PUBLIC
router.post('/register', validateBody(registerSchema), register);
router.post('/login',    validateBody(loginSchema),    login);
router.post('/refresh-token', validateBody(refreshSchema), doRefreshToken);
router.post('/request-password-reset', validateBody(resetRequestSchema), requestPasswordReset);
router.post('/reset-password',        validateBody(resetSchema), doPasswordReset);

// PROTECTED
// All routes below this line will use authMiddleware without specific role checks first
router.use(authMiddleware()); // Note: calling authMiddleware to get the actual middleware

router.get('/me',       profile);
router.put('/me',       validateBody(updateProfileSchema), updateProfile); // Use updateProfileSchema
router.post('/me/change-password', validateBody(changePwdSchema), doChangePassword);
router.delete('/me',    removeUser);

// ADMIN
// This route specifically requires 'admin' role
router.get('/admin/users', authMiddleware('admin'), validateQuery(listSchema), listAllUsers);

export default router;
