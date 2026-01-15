import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

/**
 * Generate access token
 */
export const generateAccessToken = (userId: string, role: UserRole): string => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId,
    role,
    type: 'access',
  };

  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: string, role: UserRole): string => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId,
    role,
    type: 'refresh',
  };

  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

/**
 * Generate token pair (access + refresh)
 */
export const generateTokenPair = (userId: string, role: UserRole) => {
  return {
    accessToken: generateAccessToken(userId, role),
    refreshToken: generateRefreshToken(userId, role),
  };
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

/**
 * Get token expiration date
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return expiration < new Date();
};