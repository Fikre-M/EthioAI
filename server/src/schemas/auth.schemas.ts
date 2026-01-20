import { z } from 'zod';

/**
 * User registration schema
 */
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  phone: z.string().optional(),
  role: z.enum(['USER', 'GUIDE', 'VENDOR']).default('USER')
});

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false)
});

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase()
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
});

/**
 * Refresh token schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
});

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  location: z.string().max(100, 'Location too long').optional(),
  dateOfBirth: z.string().datetime().optional()
});

/**
 * Email verification schema
 */
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;