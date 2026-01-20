import nodemailer from 'nodemailer';
import { config } from '../config/index';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"EthioAI" <${config.email.from}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<boolean> => {
  const verificationUrl = `${config.client.url}/verify-email?token=${token}`;
  const subject = 'Verify Your Email';
  const html = `
    <h2>Welcome to EthioAI Tourism!</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>Or copy and paste this link in your browser:</p>
    <p>${verificationUrl}</p>
  `;

  return await sendEmail(email, subject, html);
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<boolean> => {
  const resetUrl = `${config.client.url}/reset-password?token=${token}`;
  const subject = 'Reset Your Password';
  const html = `
    <h2>Reset Your Password</h2>
    <p>You requested to reset your password. Click the link below to set a new password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>Or copy and paste this link in your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
  `;

  return await sendEmail(email, subject, html);
};
