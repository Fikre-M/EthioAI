import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    isEmailVerified: boolean;
  };
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    
    // Check token type
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type',
        code: 'INVALID_TOKEN_TYPE'
      });
    }
    
    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Attach user info to request object
    req.userId = user.id;
    req.userRole = user.role;
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
        code: 'INVALID_TOKEN'
      });
    }
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication service error'
    });
  }
};

/**
 * Authorization middleware factory
 * Checks if user has required roles
 */
export const authorize = (roles: UserRole[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (roles.length && !roles.includes(req.userRole as UserRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.userRole
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user info if token is provided, but doesn't require it
 */
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token provided, continue without auth
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    
    if (decoded.type === 'access') {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
        },
      });

      if (user) {
        req.userId = user.id;
        req.userRole = user.role;
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // If token is invalid, continue without auth (optional)
    next();
  }
};

/**
 * Refresh token validation middleware
 */
export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload;
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Attach user info to request
    (req as any).userId = storedToken.userId;
    (req as any).user = storedToken.user;
    (req as any).refreshTokenId = storedToken.id;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired'
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    console.error('Refresh token validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Token validation service error'
    });
  }
};

/**
 * Role-based access control helpers
 */
export const requireRoles = {
  admin: authorize(['ADMIN']),
  vendor: authorize(['VENDOR', 'ADMIN']),
  guide: authorize(['GUIDE', 'ADMIN']),
  user: authorize(['USER', 'VENDOR', 'GUIDE', 'ADMIN']),
  vendorOrAdmin: authorize(['VENDOR', 'ADMIN']),
  guideOrAdmin: authorize(['GUIDE', 'ADMIN']),
};
