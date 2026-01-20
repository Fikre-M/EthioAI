import { PrismaClient, User, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { config } from '../config/index';
import { log } from '../utils/logger';
import { EmailService } from './email.service';
import { PasswordResetService } from './password-reset.service';
import { EmailVerificationService } from './email-verification.service';
import { 
  RegisterInput, 
  LoginInput, 
  ForgotPasswordInput, 
  ResetPasswordInput,
  ChangePasswordInput,
  UpdateProfileInput 
} from '../schemas/auth.schemas';
import { 
  ConflictError, 
  UnauthorizedError, 
  NotFoundError, 
  ValidationError 
} from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterInput): Promise<{
    user: Omit<User, 'passwordHash'>;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, config.security.bcryptSaltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone,
        role: 'USER',
      },
    });

    // Generate tokens
    const tokens = generateTokenPair(user.id, user.role);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Send welcome email with verification
    try {
      const verificationResult = await EmailVerificationService.sendVerificationEmail(user.id);
      log.info('Welcome email sent', { userId: user.id, email: user.email });
    } catch (emailError) {
      log.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  /**
   * Login user
   */
  static async login(data: LoginInput): Promise<{
    user: Omit<User, 'passwordHash'>;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokenPair(user.id, user.role);

    // Store refresh token (remove old ones if not remembering)
    if (!data.rememberMe) {
      await prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      });
    }

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + (data.rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
      },
    });

    log.auth('User logged in', user.id, { email: user.email, rememberMe: data.rememberMe });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  /**
   * Logout user (invalidate refresh token)
   */
  static async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Remove specific refresh token
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Remove all refresh tokens for user
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }

    log.auth('User logged out', userId);
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired or invalid');
    }

    // Generate new token pair
    const tokens = generateTokenPair(storedToken.user.id, storedToken.user.role);

    // Update refresh token in database
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    log.auth('Token refreshed', storedToken.user.id);

    return tokens;
  }

  /**
   * Get current user
   */
  static async getCurrentUser(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, data: UpdateProfileInput): Promise<Omit<User, 'passwordHash'>> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.dateOfBirth !== undefined) {
      updateData.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    log.auth('Profile updated', userId);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Change password
   */
  static async changePassword(userId: string, data: ChangePasswordInput): Promise<void> {
    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(data.newPassword, config.security.bcryptSaltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate all refresh tokens (force re-login on all devices)
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    log.auth('Password changed', userId);
  }

  /**
   * Forgot password (generate reset token)
   */
  static async forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }> {
    return PasswordResetService.requestPasswordReset(data.email);
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    return PasswordResetService.resetPassword(data.token, data.newPassword);
  }

  /**
   * Verify email (complete implementation)
   */
  static async verifyEmail(userId: string, token: string): Promise<void> {
    const result = await EmailVerificationService.verifyEmail(token);
    
    if (result.user.id !== userId) {
      throw new UnauthorizedError('Token does not belong to this user');
    }
  }
}