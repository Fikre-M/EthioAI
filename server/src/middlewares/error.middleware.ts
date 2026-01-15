import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';
import { log } from '../utils/logger';
import { ResponseUtil } from '../utils/response';
import { config } from '../config';
import { AuthRequest } from './auth.middleware';

interface ErrorWithStatus extends Error {
  statusCode?: number;
  code?: string;
  meta?: any;
}

/**
 * Global error handler middleware
 * Handles all types of errors and returns standardized responses
 */
export const errorHandler = (
  err: ErrorWithStatus,
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  log.error(`Error in ${req.method} ${req.originalUrl}`, {
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.userId,
      body: req.body,
      query: req.query,
      params: req.params,
    },
  });

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return handleZodError(err, res);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseUtil.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseUtil.unauthorized(res, 'Token expired');
  }

  // Handle custom application errors
  if (err.statusCode) {
    return ResponseUtil.error(
      res,
      err.message,
      err.statusCode,
      undefined,
      {
        code: err.code,
        ...(config.nodeEnv !== 'production' && { stack: err.stack }),
      }
    );
  }

  // Handle unexpected errors
  return ResponseUtil.internalError(
    res,
    config.nodeEnv === 'production' 
      ? 'Something went wrong' 
      : err.message
  );
};

/**
 * Handle Prisma database errors
 */
const handlePrismaError = (err: PrismaClientKnownRequestError, res: Response) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = err.meta?.target as string[] | undefined;
      const fieldName = field?.[0] || 'field';
      return ResponseUtil.conflict(res, `${fieldName} already exists`);

    case 'P2025':
      // Record not found
      return ResponseUtil.notFound(res, 'Record not found');

    case 'P2003':
      // Foreign key constraint violation
      return ResponseUtil.badRequest(res, 'Invalid reference to related record');

    case 'P2014':
      // Required relation violation
      return ResponseUtil.badRequest(res, 'Required relation is missing');

    case 'P2021':
      // Table does not exist
      return ResponseUtil.internalError(res, 'Database configuration error');

    case 'P2022':
      // Column does not exist
      return ResponseUtil.internalError(res, 'Database schema error');

    default:
      log.error('Unhandled Prisma error', { code: err.code, message: err.message });
      return ResponseUtil.internalError(res, 'Database operation failed');
  }
};

/**
 * Handle Zod validation errors
 */
const handleZodError = (err: ZodError, res: Response) => {
  const errors = err.errors.map((error) => ({
    field: error.path.join('.'),
    message: error.message,
    code: error.code,
    received: error.received,
  }));

  return ResponseUtil.validationError(res, errors, 'Validation failed');
};

/**
 * 404 Not Found handler
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  log.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  ResponseUtil.notFound(res, `Route ${req.method} ${req.originalUrl} not found`);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom error classes
 */
export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public meta?: any;

  constructor(message: string, statusCode: number = 500, code?: string, meta?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.meta = meta;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', meta?: any) {
    super(message, 400, 'VALIDATION_ERROR', meta);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}
