import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AuthService } from '../services/auth.service';
import { ResponseUtil } from '../utils/response';
import { log } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';
import { 
  RegisterInput, 
  LoginInput, 
  ForgotPasswordInput, 
  ResetPasswordInput,
  RefreshTokenInput,
  ChangePasswordInput,
  UpdateProfileInput 
} from '../schemas/auth.schemas';

export class AuthController {
  /**
   * Register a new user
   */
  static register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: RegisterInput = req.body;
    
    const result = await AuthService.register(data);
    
    log.auth('User registration successful', result.user.id, {
      email: result.user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return ResponseUtil.created(res, {
      user: result.user,
      tokens: result.tokens,
    }, 'Account created successfully');
  });

  /**
   * Login user
   */
  static login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: LoginInput = req.body;
    
    try {
      const result = await AuthService.login(data);
      
      log.auth('User login successful', result.user.id, {
        email: result.user.email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        rememberMe: data.rememberMe,
      });

      return ResponseUtil.success(res, {
        user: result.user,
        tokens: result.tokens,
      }, 'Login successful');
    } catch (error: any) {
      // Log failed login attempt
      log.security('Failed login attempt', req.ip, req.get('User-Agent'), {
        email: data.email,
        reason: error.message,
      });
      throw error;
    }
  });

  /**
   * Logout user
   */
  static logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;
    const userId = req.userId!;
    
    await AuthService.logout(userId, refreshToken);
    
    log.auth('User logout successful', userId, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return ResponseUtil.success(res, null, 'Logout successful');
  });

  /**
   * Refresh access token
   */
  static refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: RefreshTokenInput = req.body;
    
    const tokens = await AuthService.refreshToken(data.refreshToken);
    
    return ResponseUtil.success(res, { tokens }, 'Token refreshed successfully');
  });

  /**
   * Get current user
   */
  static getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    
    const user = await AuthService.getCurrentUser(userId);
    
    return ResponseUtil.success(res, { user }, 'User retrieved successfully');
  });

  /**
   * Update user profile
   */
  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const data: UpdateProfileInput = req.body;
    
    const user = await AuthService.updateProfile(userId, data);
    
    log.auth('Profile update successful', userId, {
      updatedFields: Object.keys(data),
    });

    return ResponseUtil.success(res, { user }, 'Profile updated successfully');
  });

  /**
   * Change password
   */
  static changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const data: ChangePasswordInput = req.body;
    
    await AuthService.changePassword(userId, data);
    
    log.auth('Password change successful', userId, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return ResponseUtil.success(res, null, 'Password changed successfully');
  });

  /**
   * Forgot password
   */
  static forgotPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: ForgotPasswordInput = req.body;
    
    const result = await AuthService.forgotPassword(data);
    
    log.auth('Password reset requested', undefined, {
      email: data.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return ResponseUtil.success(res, null, result.message);
  });

  /**
   * Reset password
   */
  static resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: ResetPasswordInput = req.body;
    
    const result = await AuthService.resetPassword(data);
    
    return ResponseUtil.success(res, null, result.message);
  });

  /**
   * Verify email
   */
  static verifyEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { token } = req.body;
    
    await AuthService.verifyEmail(userId, token);
    
    log.auth('Email verification successful', userId);

    return ResponseUtil.success(res, null, 'Email verified successfully');
  });
}