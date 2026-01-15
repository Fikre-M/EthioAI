import { Response } from 'express';

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Response utility class for standardized API responses
 */
export class ResponseUtil {
  /**
   * Send success response
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: Partial<ApiResponse['meta']>
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    errors?: any[],
    meta?: Partial<ApiResponse['meta']>
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      meta: {
        pagination,
        timestamp: new Date().toISOString(),
      },
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send created response (201)
   */
  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  /**
   * Send no content response (204)
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Send bad request response (400)
   */
  static badRequest(
    res: Response,
    message: string = 'Bad request',
    errors?: any[]
  ): Response {
    return this.error(res, message, 400, errors);
  }

  /**
   * Send unauthorized response (401)
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): Response {
    return this.error(res, message, 401);
  }

  /**
   * Send forbidden response (403)
   */
  static forbidden(
    res: Response,
    message: string = 'Forbidden'
  ): Response {
    return this.error(res, message, 403);
  }

  /**
   * Send not found response (404)
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return this.error(res, message, 404);
  }

  /**
   * Send conflict response (409)
   */
  static conflict(
    res: Response,
    message: string = 'Resource conflict'
  ): Response {
    return this.error(res, message, 409);
  }

  /**
   * Send validation error response (422)
   */
  static validationError(
    res: Response,
    errors: any[],
    message: string = 'Validation failed'
  ): Response {
    return this.error(res, message, 422, errors);
  }

  /**
   * Send internal server error response (500)
   */
  static internalError(
    res: Response,
    message: string = 'Internal server error'
  ): Response {
    return this.error(res, message, 500);
  }
}

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Get pagination parameters from query
 */
export const getPaginationParams = (query: any) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Express middleware to add response utilities to res object
 */
export const responseMiddleware = (req: any, res: any, next: any) => {
  // Add utility methods to response object
  res.success = (data: any, message?: string, statusCode?: number, meta?: any) =>
    ResponseUtil.success(res, data, message, statusCode, meta);

  res.error = (message?: string, statusCode?: number, errors?: any[], meta?: any) =>
    ResponseUtil.error(res, message, statusCode, errors, meta);

  res.paginated = (data: any[], pagination: PaginationMeta, message?: string) =>
    ResponseUtil.paginated(res, data, pagination, message);

  res.created = (data: any, message?: string) =>
    ResponseUtil.created(res, data, message);

  res.noContent = () => ResponseUtil.noContent(res);
  res.badRequest = (message?: string, errors?: any[]) =>
    ResponseUtil.badRequest(res, message, errors);
  res.unauthorized = (message?: string) => ResponseUtil.unauthorized(res, message);
  res.forbidden = (message?: string) => ResponseUtil.forbidden(res, message);
  res.notFound = (message?: string) => ResponseUtil.notFound(res, message);
  res.conflict = (message?: string) => ResponseUtil.conflict(res, message);
  res.validationError = (errors: any[], message?: string) =>
    ResponseUtil.validationError(res, errors, message);
  res.internalError = (message?: string) => ResponseUtil.internalError(res, message);

  next();
};

export default ResponseUtil;