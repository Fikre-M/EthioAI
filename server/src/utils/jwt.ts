import jwt from 'jsonwebtoken';
import { config } from '../config/index';

export interface TokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate access and refresh token pair
 */
export function generateTokenPair(userId: string, role: string): {
  accessToken: string;
  refreshToken: string;
} {
  const payload: TokenPayload = { userId, role };
  
  const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.expiresIn,
  });
  
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
  
  return { accessToken, refreshToken };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}