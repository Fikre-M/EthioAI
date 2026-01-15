import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation middleware factory
 * Creates middleware to validate request body, query, or params using Zod schemas
 */
export const validate = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Validate query parameters
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      // Validate route parameters
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      // Handle unexpected errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};

/**
 * Common validation schemas
 */
import { z } from 'zod';

export const commonSchemas = {
  // UUID parameter validation
  uuidParam: {
    params: z.object({
      id: z.string().uuid('Invalid ID format'),
    }),
  },

  // Pagination query validation
  pagination: {
    query: z.object({
      page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
      limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    }),
  },

  // Search query validation
  search: {
    query: z.object({
      q: z.string().min(1, 'Search query is required'),
      category: z.string().optional(),
      minPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
      maxPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
    }),
  },
};

export default validate;