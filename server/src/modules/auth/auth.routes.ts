import { Router } from 'express';
import { 
  register, 
  login, 
  forgotPassword, 
  getCurrentUser, 
  refreshToken, 
  logout 
} from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;
