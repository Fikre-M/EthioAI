import { z } from 'zod';

/**
 * Authentication validation schemas
 */

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), 'Invalid phone number format'),
});

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(100, 'New password must not exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'New password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim()
    .optional(),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), 'Invalid phone number format'),
  bio: z.string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional(),
  location: z.string()
    .max(100, 'Location must not exceed 100 characters')
    .optional(),
  dateOfBirth: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date format'),
});

// Type exports for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;