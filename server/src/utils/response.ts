import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function calculatePagination(page: number, limit: number, total: number): PaginationMeta {
  const pages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ResponseUtil {
  /**
   * Send success response
   */
  static success<T>(res: Response, data?: T, message?: string): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message
    };
    
    return res.status(200).json(response);
  }

  /**
   * Send created response
   */
  static created<T>(res: Response, data?: T, message?: string): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message: message || 'Resource created successfully'
    };
    
    return res.status(201).json(response);
  }

  /**
   * Send error response
   */
  static error(res: Response, statusCode: number, code: string, message: string, details?: any): Response {
    const response: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details
      }
    };
    
    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   */
  static validationError(res: Response, details: any): Response {
    return ResponseUtil.error(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return ResponseUtil.error(res, 401, 'UNAUTHORIZED', message);
  }

  /**
   * Send forbidden response
   */
  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return ResponseUtil.error(res, 403, 'FORBIDDEN', message);
  }

  /**
   * Send not found response
   */
  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return ResponseUtil.error(res, 404, 'NOT_FOUND', message);
  }

  /**
   * Send conflict response
   */
  static conflict(res: Response, message: string = 'Resource conflict'): Response {
    return ResponseUtil.error(res, 409, 'CONFLICT', message);
  }

  /**
   * Send internal server error response
   */
  static internalError(res: Response, message: string = 'Internal server error'): Response {
    return ResponseUtil.error(res, 500, 'INTERNAL_ERROR', message);
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response, 
    data: T[], 
    pagination: { page: number; limit: number; total: number; pages: number },
    message?: string
  ): Response {
    const response: ApiResponse<T[]> = {
      success: true,
      data,
      message,
      pagination
    };
    
    return res.status(200).json(response);
  }
}