import nodemailer from 'nodemailer';
import { config } from '../config/index';
import { log } from '../utils/logger';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;

  /**
   * Initialize email transporter
   */
  static async initialize(): Promise<void> {
    try {
      // Skip email initialization in development if not configured
      if (config.server.nodeEnv === 'development' && !config.email.user) {
        log.info('Email service skipped in development (no configuration)');
        return;
      }

      this.transporter = nodemailer.createTransporter({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.port === 465, // true for 465, false for other ports
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates in development
        },
      });

      // Verify connection
      await this.transporter.verify();
      log.info('Email service initialized successfully');
    } catch (error) {
      if (config.server.nodeEnv === 'production') {
        log.error('Failed to initialize email service:', error);
        throw error;
      } else {
        log.warn('Email service initialization failed (development mode):', error);
        // Don't throw in development
      }
    }
  }

  /**
   * Send email
   */
  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // Skip sending emails in development if not configured
      if (config.server.nodeEnv === 'development' && !this.transporter) {
        log.info('Email skipped in development', {
          to: options.to,
          subject: options.subject
        });
        return;
      }

      if (!this.transporter) {
        await this.initialize();
      }

      // If still no transporter, skip in development
      if (!this.transporter && config.server.nodeEnv === 'development') {
        log.info('Email skipped - no transporter available', {
          to: options.to,
          subject: options.subject
        });
        return;
      }

      const mailOptions = {
        from: `"EthioAI Tourism" <${config.email.from}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      log.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        messageId: result.messageId,
      });
    } catch (error) {
      log.error('Failed to send email:', error, {
        to: options.to,
        subject: options.subject,
      });
      
      // Don't throw in development
      if (config.server.nodeEnv === 'production') {
        throw error;
      }
    }
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(email: string, name: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${config.client.url}/verify-email?token=${verificationToken}`;
    
    const template = this.getWelcomeEmailTemplate(name, verificationUrl);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send email verification
   */
  static async sendEmailVerification(email: string, name: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${config.client.url}/verify-email?token=${verificationToken}`;
    
    const template = this.getEmailVerificationTemplate(name, verificationUrl);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<void> {
    const resetUrl = `${config.client.url}/reset-password?token=${resetToken}`;
    
    const template = this.getPasswordResetTemplate(name, resetUrl);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send booking confirmation email
   */
  static async sendBookingConfirmation(
    email: string, 
    name: string, 
    bookingDetails: {
      bookingNumber: string;
      tourTitle: string;
      startDate: string;
      endDate: string;
      totalPrice: number;
      participants: number;
    }
  ): Promise<void> {
    const template = this.getBookingConfirmationTemplate(name, bookingDetails);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send booking cancellation email
   */
  static async sendBookingCancellation(
    email: string, 
    name: string, 
    bookingNumber: string,
    tourTitle: string,
    refundAmount?: number
  ): Promise<void> {
    const template = this.getBookingCancellationTemplate(name, bookingNumber, tourTitle, refundAmount);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send payment confirmation email
   */
  static async sendPaymentConfirmation(
    email: string, 
    name: string, 
    paymentDetails: {
      amount: number;
      currency: string;
      paymentMethod: string;
      bookingNumber: string;
      tourTitle: string;
    }
  ): Promise<void> {
    const template = this.getPaymentConfirmationTemplate(name, paymentDetails);
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send admin notification email
   */
  static async sendAdminNotification(
    subject: string,
    message: string,
    data?: any
  ): Promise<void> {
    const adminEmails = config.admin.emails || ['admin@ethioai.com'];
    
    const template = this.getAdminNotificationTemplate(subject, message, data);
    
    for (const adminEmail of adminEmails) {
      await this.sendEmail({
        to: adminEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    }
  }

  // Email Templates

  private static getWelcomeEmailTemplate(name: string, verificationUrl: string): EmailTemplate {
    const subject = 'Welcome to EthioAI Tourism Platform!';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🇪🇹 Welcome to EthioAI Tourism!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Welcome to EthioAI Tourism Platform! We're excited to have you join our community of travelers exploring the beautiful landscapes and rich culture of Ethiopia.</p>
            
            <p>To get started, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>🏛️ Explore amazing tours and cultural experiences</li>
              <li>📅 Book your dream Ethiopian adventure</li>
              <li>🤖 Chat with our AI assistant for personalized recommendations</li>
              <li>🛍️ Shop authentic Ethiopian products in our marketplace</li>
              <li>📱 Access exclusive features and member benefits</li>
            </ul>
            
            <p>If you have any questions, our support team is here to help at <a href="mailto:support@ethioai.com">support@ethioai.com</a>.</p>
            
            <p>Happy travels!<br>The EthioAI Tourism Team</p>
          </div>
          <div class="footer">
            <p>If you didn't create an account, please ignore this email.</p>
            <p>© 2024 EthioAI Tourism Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to EthioAI Tourism Platform!
      
      Hello ${name}!
      
      Welcome to EthioAI Tourism Platform! We're excited to have you join our community of travelers exploring Ethiopia.
      
      Please verify your email address by visiting: ${verificationUrl}
      
      Once verified, you'll be able to explore tours, book adventures, chat with our AI assistant, and more!
      
      If you have questions, contact us at support@ethioai.com
      
      Happy travels!
      The EthioAI Tourism Team
    `;

    return { subject, html, text };
  }

  private static getEmailVerificationTemplate(name: string, verificationUrl: string): EmailTemplate {
    const subject = 'Verify Your Email Address';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Email Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Please verify your email address to complete your account setup and access all features of EthioAI Tourism Platform.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>This verification link will expire in 24 hours for security reasons.</p>
            
            <p>If you didn't request this verification, please ignore this email.</p>
            
            <p>Best regards,<br>The EthioAI Tourism Team</p>
          </div>
          <div class="footer">
            <p>© 2024 EthioAI Tourism Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Email Verification
      
      Hello ${name}!
      
      Please verify your email address by visiting: ${verificationUrl}
      
      This link expires in 24 hours.
      
      If you didn't request this, please ignore this email.
      
      Best regards,
      The EthioAI Tourism Team
    `;

    return { subject, html, text };
  }

  private static getPasswordResetTemplate(name: string, resetUrl: string): EmailTemplate {
    const subject = 'Reset Your Password';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We received a request to reset your password for your EthioAI Tourism Platform account.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password will remain unchanged until you create a new one</li>
              </ul>
            </div>
            
            <p>If you continue to have problems, please contact our support team at <a href="mailto:support@ethioai.com">support@ethioai.com</a>.</p>
            
            <p>Best regards,<br>The EthioAI Tourism Team</p>
          </div>
          <div class="footer">
            <p>© 2024 EthioAI Tourism Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request
      
      Hello ${name}!
      
      We received a request to reset your password.
      
      Reset your password by visiting: ${resetUrl}
      
      This link expires in 1 hour.
      
      If you didn't request this, please ignore this email.
      
      Best regards,
      The EthioAI Tourism Team
    `;

    return { subject, html, text };
  }

  private static getBookingConfirmationTemplate(name: string, booking: any): EmailTemplate {
    const subject = `Booking Confirmed - ${booking.tourTitle}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #27ae60; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Great news! Your booking has been confirmed. We're excited to help you explore Ethiopia!</p>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <div class="detail-row">
                <strong>Booking Number:</strong>
                <span>${booking.bookingNumber}</span>
              </div>
              <div class="detail-row">
                <strong>Tour:</strong>
                <span>${booking.tourTitle}</span>
              </div>
              <div class="detail-row">
                <strong>Start Date:</strong>
                <span>${booking.startDate}</span>
              </div>
              <div class="detail-row">
                <strong>End Date:</strong>
                <span>${booking.endDate}</span>
              </div>
              <div class="detail-row">
                <strong>Participants:</strong>
                <span>${booking.participants}</span>
              </div>
              <div class="detail-row">
                <strong>Total Price:</strong>
                <span>$${booking.totalPrice}</span>
              </div>
            </div>
            
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>📱 Download our mobile app for easy access to your booking</li>
              <li>📧 You'll receive additional details closer to your travel date</li>
              <li>🎒 Start preparing for your Ethiopian adventure!</li>
              <li>❓ Contact us anytime with questions</li>
            </ul>
            
            <p>Thank you for choosing EthioAI Tourism Platform!</p>
            
            <p>Safe travels,<br>The EthioAI Tourism Team</p>
          </div>
          <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@ethioai.com">support@ethioai.com</a></p>
            <p>© 2024 EthioAI Tourism Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Booking Confirmed!
      
      Hello ${name}!
      
      Your booking has been confirmed:
      
      Booking Number: ${booking.bookingNumber}
      Tour: ${booking.tourTitle}
      Start Date: ${booking.startDate}
      End Date: ${booking.endDate}
      Participants: ${booking.participants}
      Total Price: $${booking.totalPrice}
      
      Thank you for choosing EthioAI Tourism Platform!
      
      Safe travels,
      The EthioAI Tourism Team
    `;

    return { subject, html, text };
  }

  private static getBookingCancellationTemplate(
    name: string, 
    bookingNumber: string, 
    tourTitle: string, 
    refundAmount?: number
  ): EmailTemplate {
    const subject = `Booking Cancelled - ${tourTitle}`;
    
    const refundInfo = refundAmount 
      ? `<p><strong>💰 Refund Information:</strong><br>A refund of $${refundAmount} will be processed to your original payment method within 5-7 business days.</p>`
      : '<p><strong>💰 Refund Information:</strong><br>Please contact our support team regarding refund eligibility for this cancellation.</p>';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Booking Cancelled</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We're sorry to inform you that your booking has been cancelled.</p>
            
            <p><strong>Cancelled Booking:</strong></p>
            <ul>
              <li>Booking Number: ${bookingNumber}</li>
              <li>Tour: ${tourTitle}</li>
            </ul>
            
            ${refundInfo}
            
            <p>We hope to serve you again in the future. If you have any questions about this cancellation, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The EthioAI Tourism Team</p>
          </div>
          <div class="footer">
            <p>Contact us at <a href="mailto:support@ethioai.com">support@ethioai.com</a></p>
            <p>© 2024 EthioAI Tourism Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Booking Cancelled
      
      Hello ${name}!
      
      Your booking has been cancelled:
      
      Booking Number: ${bookingNumber}
      Tour: ${tourTitle}
      
      ${refundAmount ? `Refund of $${refundAmount} will be processed within 5-7 business days.` : 'Please contact support regarding refund eligibility.'}
      
      Best regards,
      The EthioAI Tourism Team
    `;

    return { subject, html, text };
  }

  private static getPaymentConfirmationTemplate(name: string, payment: any): EmailTemplate {
    const subject = 'Payment Confirmation';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #27ae60; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .payment-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Payment Confirmed</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your payment has been successfully processed!</p>
            
            <div class="payment-details">
              <h3>💰 Payment Details</h3>
              <p><strong>Amount:</strong> ${payment.amount} ${payment.currency}</p>
              <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
              <p><strong>Booking:</strong> ${payment.bookingNumber} - ${payment.tourTitle}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>Your booking is now confirmed and you'll receive additional details soon.</p>
            
            <p>Thank you for your business!</p>
            
            <p>Best regards,<br>The EthioAI Tourism Team</p>
          </div>
          <div class="footer">
            <p>© 2024 EthioAI Tourism Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Payment Confirmed
      
      Hello ${name}!
      
      Your payment has been successfully processed:
      
      Amount: ${payment.amount} ${payment.currency}
      Payment Method: ${payment.paymentMethod}
      Booking: ${payment.bookingNumber} - ${payment.tourTitle}
      
      Thank you for your business!
      
      Best regards,
      The EthioAI Tourism Team
    `;

    return { subject, html, text };
  }

  private static getAdminNotificationTemplate(subject: string, message: string, data?: any): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f39c12; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .data { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Admin Notification</h1>
          </div>
          <div class="content">
            <h2>${subject}</h2>
            <p>${message}</p>
            
            ${data ? `<div class="data"><pre>${JSON.stringify(data, null, 2)}</pre></div>` : ''}
            
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Admin Notification: ${subject}
      
      ${message}
      
      ${data ? `Data: ${JSON.stringify(data, null, 2)}` : ''}
      
      Timestamp: ${new Date().toISOString()}
    `;

    return { subject: `[ADMIN] ${subject}`, html, text };
  }

  /**
   * Strip HTML tags from string
   */
  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}