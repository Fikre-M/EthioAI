import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, validateRefreshToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../schemas/auth.schemas';

const router = Router();

/**
 * Authentication Routes
 * All routes are prefixed with /api/auth
 */

// Public routes (no authentication required)
router.post('/register', validate({ body: registerSchema }), AuthController.register);
router.post('/login', validate({ body: loginSchema }), AuthController.login);
router.post('/forgot-password', validate({ body: forgotPasswordSchema }), AuthController.forgotPassword);
router.post('/reset-password', validate({ body: resetPasswordSchema }), AuthController.resetPassword);
router.post('/refresh', validate({ body: refreshTokenSchema }), AuthController.refreshToken);

// Protected routes (authentication required)
router.get('/me', authenticate, AuthController.getCurrentUser);
router.post('/logout', authenticate, AuthController.logout);
router.put('/profile', authenticate, validate({ body: updateProfileSchema }), AuthController.updateProfile);
router.put('/change-password', authenticate, validate({ body: changePasswordSchema }), AuthController.changePassword);
router.post('/verify-email', authenticate, AuthController.verifyEmail);

export default router;