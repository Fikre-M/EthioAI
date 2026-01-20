import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { config } from '../config/index';
import { EmailService } from './email.service';
import { log } from '../utils/logger';
import { 
  NotFoundError, 
  ValidationError, 
  UnauthorizedError 
} from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export interface PasswordResetToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export class PasswordResetService {
  /**
   * Generate and send password reset token
   */
  static async requestPasswordReset(email: string, ip?: string, userAgent?: string): Promise<{ message: string }> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      // Always return success message for security (don't reveal if email exists)
      const successMessage = 'If an account with that email exists, a password reset link has been sent.';

      if (!user) {
        log.security('Password reset attempted for non-existent email', undefined, userAgent, { 
          email, 
          ip 
        });
        return { message: successMessage };
      }

      // Check for recent reset requests (rate limiting)
      const recentReset = await prisma.$queryRaw<any[]>`
        SELECT id FROM password_reset_tokens 
        WHERE userId = ${user.id} 
        AND createdAt > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
        AND used = false
        LIMIT 1
      `;

      if (recentReset.length > 0) {
        log.security('Password reset rate limit exceeded', user.id, userAgent, { 
          email, 
          ip 
        });
        return { message: successMessage };
      }

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token in database
      await prisma.$executeRaw`
        INSERT INTO password_reset_tokens (id, token, userId, expiresAt, used, createdAt, updatedAt)
        VALUES (${crypto.randomUUID()}, ${hashedToken}, ${user.id}, ${expiresAt}, false, NOW(), NOW())
      `;

      // Send reset email
      await EmailService.sendPasswordResetEmail(user.email, user.name || 'User', resetToken);

      log.auth('Password reset requested', user.id, { 
        email: user.email, 
        ip, 
        userAgent,
        expiresAt 
      });

      return { message: successMessage };
    } catch (error) {
      log.error('Password reset request failed:', error);
      throw error;
    }
  }

  /**
   * Verify reset token and update password
   */
  static async resetPassword(token: string, newPassword: string, ip?: string, userAgent?: string): Promise<{ message: string }> {
    try {
      // Hash the provided token to match stored hash
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      // Find valid reset token
      const resetRecord = await prisma.$queryRaw<any[]>`
        SELECT prt.*, u.id as userId, u.email, u.name
        FROM password_reset_tokens prt
        JOIN users u ON prt.userId = u.id
        WHERE prt.token = ${hashedToken}
        AND prt.expiresAt > NOW()
        AND prt.used = false
        LIMIT 1
      `;

      if (resetRecord.length === 0) {
        log.security('Invalid or expired password reset token used', undefined, userAgent, { 
          token: token.substring(0, 8) + '...', 
          ip 
        });
        throw new ValidationError('Invalid or expired reset token');
      }

      const reset = resetRecord[0];

      // Validate new password
      if (!newPassword || newPassword.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long');
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);

      // Update password and mark token as used
      await prisma.$transaction(async (tx) => {
        // Update user password
        await tx.$executeRaw`
          UPDATE users 
          SET passwordHash = ${passwordHash}, updatedAt = NOW()
          WHERE id = ${reset.userId}
        `;

        // Mark reset token as used
        await tx.$executeRaw`
          UPDATE password_reset_tokens 
          SET used = true, updatedAt = NOW()
          WHERE token = ${hashedToken}
        `;

        // Invalidate all refresh tokens (force re-login on all devices)
        await tx.$executeRaw`
          DELETE FROM refresh_tokens 
          WHERE userId = ${reset.userId}
        `;

        // Clean up old reset tokens for this user
        await tx.$executeRaw`
          DELETE FROM password_reset_tokens 
          WHERE userId = ${reset.userId} 
          AND (used = true OR expiresAt < NOW())
        `;
      });

      log.auth('Password reset completed', reset.userId, { 
        email: reset.email, 
        ip, 
        userAgent 
      });

      // Send confirmation email
      try {
        await EmailService.sendEmail({
          to: reset.email,
          subject: 'Password Reset Successful',
          html: this.getPasswordResetSuccessTemplate(reset.name || 'User'),
          text: `Hello ${reset.name || 'User'},\n\nYour password has been successfully reset.\n\nIf you didn't make this change, please contact support immediately.\n\nBest regards,\nThe EthioAI Tourism Team`
        });
      } catch (emailError) {
        log.error('Failed to send password reset confirmation email:', emailError);
        // Don't fail the reset if email fails
      }

      return { message: 'Password has been reset successfully. Please log in with your new password.' };
    } catch (error) {
      log.error('Password reset failed:', error);
      throw error;
    }
  }

  /**
   * Verify reset token validity (without using it)
   */
  static async verifyResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const resetRecord = await prisma.$queryRaw<any[]>`
        SELECT u.email
        FROM password_reset_tokens prt
        JOIN users u ON prt.userId = u.id
        WHERE prt.token = ${hashedToken}
        AND prt.expiresAt > NOW()
        AND prt.used = false
        LIMIT 1
      `;

      if (resetRecord.length === 0) {
        return { valid: false };
      }

      return { 
        valid: true, 
        email: resetRecord[0].email.replace(/(.{2}).*(@.*)/, '$1***$2') // Partially hide email
      };
    } catch (error) {
      log.error('Reset token verification failed:', error);
      return { valid: false };
    }
  }

  /**
   * Clean up expired reset tokens (should be run periodically)
   */
  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await prisma.$executeRaw`
        DELETE FROM password_reset_tokens 
        WHERE expiresAt < NOW() OR used = true
      `;

      log.info('Cleaned up expired password reset tokens', { count: result });
      return Number(result);
    } catch (error) {
      log.error('Failed to cleanup expired reset tokens:', error);
      return 0;
    }
  }

  /**
   * Get password reset success email template
   */
  private static getPasswordResetSuccessTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #27ae60; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Password Reset Successful</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your password has been successfully reset for your EthioAI Tourism Platform account.</p>
            
            <div class="warning">
              <strong>🔒 Security Notice:</strong>
              <ul>
                <li>You have been logged out of all devices for security</li>
                <li>Please log in again with your new password</li>
                <li>If you didn't make this change, contact support immediately</li>
              </ul>
            </div>
            
            <p>For your security, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Enabling two-factor authentication (coming soon)</li>
              <li>Not sharing your login credentials</li>
            </ul>
            
            <p>If you have any concerns about your account security, please contact our support team immediately at <a href="mailto:support@ethioai.com">support@ethioai.com</a>.</p>
            
            <p>Best regards,<br>The EthioAI Tourism Team</p>
          </div>
          <div class="footer">
            <p>© 2024 EthioAI Tourism Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Create the password_reset_tokens table if it doesn't exist
export async function createPasswordResetTable(): Promise<void> {
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id VARCHAR(36) PRIMARY KEY,
        token VARCHAR(64) NOT NULL UNIQUE,
        userId VARCHAR(36) NOT NULL,
        expiresAt DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_user_id (userId),
        INDEX idx_expires_at (expiresAt),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    log.info('Password reset tokens table created/verified');
  } catch (error) {
    log.error('Failed to create password reset tokens table:', error);
  }
}