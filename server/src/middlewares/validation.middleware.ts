import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ValidationError } from './error.middleware';

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Validation middleware using Zod schemas
 */
export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          throw new ValidationError('Request body validation failed', result.error.errors);
        }
        req.body = result.data;
      }

      // Validate query parameters
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          throw new ValidationError('Query parameters validation failed', result.error.errors);
        }
        req.query = result.data;
      }

      // Validate route parameters
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          throw new ValidationError('Route parameters validation failed', result.error.errors);
        }
        req.params = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Common validation schemas
 */
export const commonSchemas = {
  uuidParam: {
    params: z.object({
      id: z.string().uuid('Invalid UUID format')
    })
  },
  
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
  }),

  search: z.object({
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
};