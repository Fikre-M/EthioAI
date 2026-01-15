import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger';
import { AuthRequest } from './auth.middleware';

/**
 * Request logging middleware
 * Logs all incoming requests with timing and user context
 */
export const requestLogger = (req: AuthRequest, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, originalUrl, ip, headers } = req;
  const userAgent = headers['user-agent'] || 'Unknown';

  // Log request start
  log.http(`${method} ${originalUrl} - Started`, {
    method,
    url: originalUrl,
    ip,
    userAgent,
    userId: req.userId,
  });

  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any) {
    const responseTime = Date.now() - startTime;
    const { statusCode } = res;

    // Log request completion
    log.api(method, originalUrl, statusCode, responseTime, req.userId);

    // Log slow requests as warnings
    if (responseTime > 1000) {
      log.performance(`Slow request: ${method} ${originalUrl}`, responseTime, {
        statusCode,
        userId: req.userId,
        ip,
      });
    }

    // Log errors
    if (statusCode >= 400) {
      const level = statusCode >= 500 ? 'error' : 'warn';
      log[level](`${method} ${originalUrl} - ${statusCode}`, {
        method,
        url: originalUrl,
        statusCode,
        responseTime,
        userId: req.userId,
        ip,
        userAgent,
      });
    }

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Error logging middleware
 * Logs detailed error information
 */
export const errorLogger = (error: Error, req: AuthRequest, res: Response, next: NextFunction) => {
  const { method, originalUrl, ip, headers } = req;
  const userAgent = headers['user-agent'] || 'Unknown';

  log.error(`Unhandled error in ${method} ${originalUrl}`, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    request: {
      method,
      url: originalUrl,
      ip,
      userAgent,
      userId: req.userId,
      body: req.body,
      query: req.query,
      params: req.params,
    },
  });

  next(error);
};

/**
 * Security event logging middleware
 */
export const securityLogger = {
  /**
   * Log authentication attempts
   */
  authAttempt: (req: Request, success: boolean, email?: string, reason?: string) => {
    const { ip, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';

    if (success) {
      log.auth('Login successful', email, { ip, userAgent });
    } else {
      log.security('Failed login attempt', ip, userAgent, {
        email,
        reason,
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * Log suspicious activity
   */
  suspiciousActivity: (req: Request, activity: string, details?: any) => {
    const { ip, headers, originalUrl, method } = req;
    const userAgent = headers['user-agent'] || 'Unknown';

    log.security(`Suspicious activity: ${activity}`, ip, userAgent, {
      url: originalUrl,
      method,
      details,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log rate limit violations
   */
  rateLimitViolation: (req: Request, limit: number, windowMs: number) => {
    const { ip, headers, originalUrl, method } = req;
    const userAgent = headers['user-agent'] || 'Unknown';

    log.security('Rate limit exceeded', ip, userAgent, {
      url: originalUrl,
      method,
      limit,
      windowMs,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log permission violations
   */
  permissionViolation: (req: AuthRequest, requiredRole: string, userRole?: string) => {
    const { ip, headers, originalUrl, method, userId } = req;
    const userAgent = headers['user-agent'] || 'Unknown';

    log.security('Permission violation', ip, userAgent, {
      url: originalUrl,
      method,
      userId,
      requiredRole,
      userRole,
      timestamp: new Date().toISOString(),
    });
  },
};

export default requestLogger;