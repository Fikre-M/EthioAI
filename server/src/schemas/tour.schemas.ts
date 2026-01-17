import { z } from 'zod';

/**
 * Tour validation schemas
 */

// Location schema for reuse
const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  coordinates: z.array(z.number()).length(2, 'Coordinates must be [latitude, longitude]'),
  address: z.string().optional(),
  description: z.string().optional(),
});

// Tour creation schema
export const createTourSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  shortDescription: z.string()
    .max(500, 'Short description must not exceed 500 characters')
    .optional(),
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
  price: z.number()
    .positive('Price must be positive')
    .max(100000, 'Price must not exceed $100,000'),
  discountPrice: z.number()
    .positive('Discount price must be positive')
    .optional(),
  duration: z.number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration must not exceed 365 days'),
  maxGroupSize: z.number()
    .int('Group size must be a whole number')
    .min(1, 'Group size must be at least 1')
    .max(100, 'Group size must not exceed 100'),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging'], {
    errorMap: () => ({ message: 'Difficulty must be Easy, Moderate, or Challenging' })
  }),
  startLocation: locationSchema,
  locations: z.array(locationSchema)
    .min(1, 'At least one location is required'),
  included: z.array(z.string().min(1, 'Included item cannot be empty'))
    .min(1, 'At least one included item is required'),
  excluded: z.array(z.string().min(1, 'Excluded item cannot be empty'))
    .optional(),
  itinerary: z.array(z.object({
    day: z.number().int().positive(),
    title: z.string().min(1, 'Day title is required'),
    activities: z.array(z.string().min(1, 'Activity cannot be empty'))
      .min(1, 'At least one activity per day is required'),
    accommodation: z.string().optional(),
    meals: z.array(z.string()).optional(),
  })).min(1, 'Itinerary is required'),
  tags: z.array(z.string().min(1, 'Tag cannot be empty'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  category: z.string()
    .min(1, 'Category is required'),
  language: z.string()
    .min(2, 'Language code must be at least 2 characters')
    .default('en'),
  metaTitle: z.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .optional(),
  metaDescription: z.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .optional(),
  featured: z.boolean().default(false),
  guideId: z.string().uuid('Invalid guide ID').optional(),
}).refine(
  (data) => !data.discountPrice || data.discountPrice < data.price,
  {
    message: 'Discount price must be less than regular price',
    path: ['discountPrice'],
  }
);

// Tour update schema (all fields optional)
export const updateTourSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters')
    .optional(),
  shortDescription: z.string()
    .max(500, 'Short description must not exceed 500 characters')
    .optional(),
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed')
    .optional(),
  price: z.number()
    .positive('Price must be positive')
    .max(100000, 'Price must not exceed $100,000')
    .optional(),
  discountPrice: z.number()
    .positive('Discount price must be positive')
    .optional(),
  duration: z.number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration must not exceed 365 days')
    .optional(),
  maxGroupSize: z.number()
    .int('Group size must be a whole number')
    .min(1, 'Group size must be at least 1')
    .max(100, 'Group size must not exceed 100')
    .optional(),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging'], {
    errorMap: () => ({ message: 'Difficulty must be Easy, Moderate, or Challenging' })
  }).optional(),
  startLocation: locationSchema.optional(),
  locations: z.array(locationSchema)
    .min(1, 'At least one location is required')
    .optional(),
  included: z.array(z.string().min(1, 'Included item cannot be empty'))
    .min(1, 'At least one included item is required')
    .optional(),
  excluded: z.array(z.string().min(1, 'Excluded item cannot be empty'))
    .optional(),
  itinerary: z.array(z.object({
    day: z.number().int().positive(),
    title: z.string().min(1, 'Day title is required'),
    activities: z.array(z.string().min(1, 'Activity cannot be empty'))
      .min(1, 'At least one activity per day is required'),
    accommodation: z.string().optional(),
    meals: z.array(z.string()).optional(),
  })).min(1, 'Itinerary is required').optional(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  category: z.string()
    .min(1, 'Category is required')
    .optional(),
  language: z.string()
    .min(2, 'Language code must be at least 2 characters')
    .optional(),
  metaTitle: z.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .optional(),
  metaDescription: z.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .optional(),
  featured: z.boolean().optional(),
  guideId: z.string().uuid('Invalid guide ID').optional(),
}).refine(
  (data) => !data.discountPrice || !data.price || data.discountPrice < data.price,
  {
    message: 'Discount price must be less than regular price',
    path: ['discountPrice'],
  }
);

// Tour query/filter schema
export const tourQuerySchema = z.object({
  // Pagination
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  
  // Sorting
  sortBy: z.enum(['createdAt', 'price', 'duration', 'title', 'rating']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  
  // Filtering
  category: z.string().optional(),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging']).optional(),
  minPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  minDuration: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  maxDuration: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  maxGroupSize: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  
  // Search
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  
  // Status
  status: z.enum(['DRAFT', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED']).optional(),
  featured: z.string().optional().transform((val) => val === 'true'),
  
  // Location-based
  latitude: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  longitude: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  radius: z.string().optional().transform((val) => val ? parseFloat(val) : undefined), // in kilometers
  
  // Guide
  guideId: z.string().uuid('Invalid guide ID').optional(),
});

// Tour search schema
export const tourSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: tourQuerySchema.omit({ search: true }).optional(),
});

// Tour availability check schema
export const checkAvailabilitySchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid start date'),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid end date'),
  groupSize: z.number().int().min(1, 'Group size must be at least 1'),
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
).refine(
  (data) => new Date(data.startDate) > new Date(),
  {
    message: 'Start date must be in the future',
    path: ['startDate'],
  }
);

// Tour status update schema
export const updateTourStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED']),
  reason: z.string().optional(),
});

// Tour review schema (for tour-specific reviews)
export const tourReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must not exceed 5'),
  title: z.string().max(100, 'Review title must not exceed 100 characters').optional(),
  comment: z.string()
    .min(10, 'Review comment must be at least 10 characters')
    .max(1000, 'Review comment must not exceed 1000 characters'),
  images: z.array(z.string().url('Invalid image URL'))
    .max(5, 'Maximum 5 images allowed')
    .optional(),
});

// Type exports for TypeScript
export type CreateTourInput = z.infer<typeof createTourSchema>;
export type UpdateTourInput = z.infer<typeof updateTourSchema>;
export type TourQueryInput = z.infer<typeof tourQuerySchema>;
export type TourSearchInput = z.infer<typeof tourSearchSchema>;
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type UpdateTourStatusInput = z.infer<typeof updateTourStatusSchema>;
export type TourReviewInput = z.infer<typeof tourReviewSchema>;