import { z } from 'zod';

/**
 * Tour creation schema
 */
export const createTourSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().max(500, 'Short description too long').optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().positive('Discount price must be positive').optional(),
  duration: z.number().int().positive('Duration must be a positive integer'),
  maxGroupSize: z.number().int().positive('Max group size must be positive'),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging']),
  startLocation: z.object({
    name: z.string().min(1, 'Start location name is required'),
    coordinates: z.array(z.number()).length(2, 'Coordinates must be [lat, lng]'),
    address: z.string().min(1, 'Start location address is required')
  }),
  locations: z.array(z.object({
    name: z.string().min(1, 'Location name is required'),
    coordinates: z.array(z.number()).length(2, 'Coordinates must be [lat, lng]'),
    description: z.string().optional()
  })),
  included: z.array(z.string().min(1, 'Included item cannot be empty')),
  excluded: z.array(z.string().min(1, 'Excluded item cannot be empty')),
  itinerary: z.array(z.object({
    day: z.number().int().positive('Day must be positive'),
    title: z.string().min(1, 'Day title is required'),
    description: z.string().min(1, 'Day description is required'),
    activities: z.array(z.string()),
    accommodation: z.string().optional(),
    meals: z.array(z.string())
  })),
  tags: z.array(z.string()),
  category: z.string().min(1, 'Category is required'),
  language: z.string().default('en'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
});

/**
 * Tour update schema (all fields optional)
 */
export const updateTourSchema = createTourSchema.partial();

/**
 * Tour query schema for filtering and searching
 */
export const tourQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging']).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  duration: z.coerce.number().int().positive().optional(),
  featured: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'price', 'duration', 'title', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

/**
 * Check availability schema
 */
export const checkAvailabilitySchema = z.object({
  startDate: z.string().datetime('Invalid start date'),
  adults: z.number().int().min(1, 'At least 1 adult required'),
  children: z.number().int().min(0, 'Children count cannot be negative').default(0)
});

/**
 * Update tour status schema (admin only)
 */
export const updateTourStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED']),
  reason: z.string().optional()
});

/**
 * Tour review schema
 */
export const tourReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().max(100, 'Review title too long').optional(),
  comment: z.string().min(1, 'Review comment is required').max(1000, 'Review comment too long'),
  images: z.array(z.string().url('Invalid image URL')).optional()
});

export type CreateTourInput = z.infer<typeof createTourSchema>;
export type UpdateTourInput = z.infer<typeof updateTourSchema>;
export type TourQueryInput = z.infer<typeof tourQuerySchema>;
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type UpdateTourStatusInput = z.infer<typeof updateTourStatusSchema>;
export type TourReviewInput = z.infer<typeof tourReviewSchema>;