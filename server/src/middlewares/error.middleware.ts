import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { log } from '../utils/logger';
import { ResponseUtil } from '../utils/response';

/**
 * Custom error classes
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public details: any;

  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'INTERNAL_ERROR');
  }
}

/**
 * Async handler wrapper to catch async errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let details: any = undefined;

  // Handle custom app errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    
    if (error instanceof ValidationError) {
      details = error.details;
    }
  }
  // Handle Zod validation errors
  else if (error instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));
  }
  // Handle Prisma errors
  else if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409;
        code = 'CONFLICT';
        message = 'Resource already exists';
        details = { field: prismaError.meta?.target };
        break;
      case 'P2025':
        statusCode = 404;
        code = 'NOT_FOUND';
        message = 'Resource not found';
        break;
      default:
        statusCode = 400;
        code = 'DATABASE_ERROR';
        message = 'Database operation failed';
    }
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid token';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Token expired';
  }
  // Handle other known errors
  else if (error.message) {
    message = error.message;
  }

  // Log error
  log.error('Request error', error, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).userId,
    statusCode,
    code
  });

  // Send error response
  ResponseUtil.error(res, statusCode, code, message, details);
};