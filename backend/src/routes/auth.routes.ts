import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from '@/controllers/auth.controller.js';
import { authenticate } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema,
} from '@/types/auth.types.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateUserSchema), updateProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
