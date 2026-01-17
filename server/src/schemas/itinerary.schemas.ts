import { z } from 'zod';

/**
 * Itinerary validation schemas
 */

// Destination schema
const destinationSchema = z.object({
  id: z.string().uuid('Invalid destination ID').optional(),
  name: z.string().min(1, 'Destination name is required').max(200, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
  }),
  images: z.array(z.string().url('Invalid image URL')).max(10, 'Maximum 10 images').optional().default([]),
  visitDuration: z.number().positive('Visit duration must be positive').optional(), // in hours
  estimatedCost: z.number().min(0, 'Cost cannot be negative').optional(),
  category: z.enum(['attraction', 'restaurant', 'hotel', 'transport', 'activity', 'shopping', 'cultural', 'nature']).optional(),
  tags: z.array(z.string().max(50, 'Tag too long')).max(20, 'Maximum 20 tags').optional().default([]),
  notes: z.string().max(500, 'Notes too long').optional(),
  visitDate: z.string().optional(),
  visitTime: z.string().optional(),
  isBooked: z.boolean().optional().default(false),
  bookingReference: z.string().optional(),
});

// Activity schema
const activitySchema = z.object({
  id: z.string().uuid('Invalid activity ID').optional(),
  title: z.string().min(1, 'Activity title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  type: z.enum(['sightseeing', 'dining', 'shopping', 'entertainment', 'transport', 'accommodation', 'cultural', 'adventure', 'relaxation']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  duration: z.number().positive('Duration must be positive').optional(), // in minutes
  cost: z.number().min(0, 'Cost cannot be negative').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional().default('USD'),
  location: z.object({
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    address: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  isBooked: z.boolean().optional().default(false),
  bookingReference: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
});

// Create itinerary schema
export const createItinerarySchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters'),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  startDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid start date'),
  endDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid end date'),
  destinations: z.array(destinationSchema)
    .min(1, 'At least one destination is required')
    .max(50, 'Maximum 50 destinations allowed'),
  activities: z.array(activitySchema)
    .max(200, 'Maximum 200 activities allowed')
    .optional()
    .default([]),
  budget: z.number()
    .min(0, 'Budget cannot be negative')
    .optional(),
  currency: z.string()
    .length(3, 'Currency must be 3 characters')
    .optional()
    .default('USD'),
  isPublic: z.boolean()
    .optional()
    .default(false),
  tags: z.array(z.string().max(50, 'Tag too long'))
    .max(20, 'Maximum 20 tags allowed')
    .optional()
    .default([]),
  travelStyle: z.enum(['budget', 'mid-range', 'luxury', 'backpacking', 'family', 'business', 'adventure', 'cultural', 'relaxation'])
    .optional(),
  groupSize: z.number()
    .int('Group size must be a whole number')
    .min(1, 'Group size must be at least 1')
    .max(100, 'Group size cannot exceed 100')
    .optional()
    .default(1),
  transportation: z.object({
    primary: z.enum(['flight', 'bus', 'car', 'train', 'boat', 'walking', 'cycling', 'mixed']).optional(),
    preferences: z.array(z.string()).optional(),
    budget: z.number().min(0).optional(),
  }).optional(),
  accommodation: z.object({
    type: z.enum(['hotel', 'hostel', 'guesthouse', 'apartment', 'camping', 'homestay', 'resort', 'mixed']).optional(),
    budget: z.number().min(0).optional(),
    preferences: z.array(z.string()).optional(),
  }).optional(),
  preferences: z.object({
    dietary: z.array(z.string()).optional(),
    accessibility: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
  }).optional(),
});

// Update itinerary schema
export const updateItinerarySchema = createItinerarySchema.partial();

// Itinerary query schema
export const itineraryQuerySchema = z.object({
  // Pagination
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  
  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'startDate', 'endDate', 'budget'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  
  // Filtering
  isPublic: z.string().optional().transform((val) => val === 'true'),
  travelStyle: z.enum(['budget', 'mid-range', 'luxury', 'backpacking', 'family', 'business', 'adventure', 'cultural', 'relaxation'])
    .optional(),
  
  // Date range
  startDateFrom: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  startDateTo: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDateFrom: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDateTo: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  
  // Budget range
  minBudget: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  maxBudget: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  
  // Duration range (in days)
  minDuration: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  maxDuration: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  
  // Group size range
  minGroupSize: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  maxGroupSize: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  
  // Search
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  destinations: z.string().optional(), // Comma-separated destination names
  
  // Location-based
  nearLatitude: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  nearLongitude: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  radiusKm: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

// Share itinerary schema
export const shareItinerarySchema = z.object({
  shareToken: z.string()
    .min(1, 'Share token is required')
    .max(100, 'Share token too long')
    .optional(),
  isPublic: z.boolean()
    .optional(),
  allowComments: z.boolean()
    .optional()
    .default(true),
  allowCopy: z.boolean()
    .optional()
    .default(true),
  expiresAt: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid expiration date')
    .optional(),
});

// Itinerary collaboration schema
export const itineraryCollaborationSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  role: z.enum(['viewer', 'editor', 'admin'])
    .default('viewer'),
  message: z.string()
    .max(500, 'Message too long')
    .optional(),
});

// Itinerary statistics schema
export const itineraryStatsQuerySchema = z.object({
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  userId: z.string().uuid('Invalid user ID').optional(),
  travelStyle: z.enum(['budget', 'mid-range', 'luxury', 'backpacking', 'family', 'business', 'adventure', 'cultural', 'relaxation'])
    .optional(),
  isPublic: z.string().optional().transform((val) => val ? val === 'true' : undefined),
});

// Itinerary recommendation schema
export const itineraryRecommendationSchema = z.object({
  interests: z.array(z.string())
    .max(20, 'Maximum 20 interests')
    .optional(),
  budget: z.number()
    .min(0, 'Budget cannot be negative')
    .optional(),
  duration: z.number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration cannot exceed 365 days')
    .optional(),
  groupSize: z.number()
    .int('Group size must be a whole number')
    .min(1, 'Group size must be at least 1')
    .max(100, 'Group size cannot exceed 100')
    .optional(),
  travelStyle: z.enum(['budget', 'mid-range', 'luxury', 'backpacking', 'family', 'business', 'adventure', 'cultural', 'relaxation'])
    .optional(),
  startLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    name: z.string().optional(),
  }).optional(),
  preferredDestinations: z.array(z.string())
    .max(10, 'Maximum 10 preferred destinations')
    .optional(),
  avoidDestinations: z.array(z.string())
    .max(10, 'Maximum 10 destinations to avoid')
    .optional(),
  language: z.enum(['en', 'am', 'om'])
    .optional()
    .default('en'),
  limit: z.number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(20, 'Limit cannot exceed 20')
    .optional()
    .default(5),
});

// Itinerary export schema
export const itineraryExportSchema = z.object({
  format: z.enum(['pdf', 'json', 'csv', 'ical']),
  includeImages: z.boolean().optional().default(true),
  includeNotes: z.boolean().optional().default(true),
  includeActivities: z.boolean().optional().default(true),
  includeBudget: z.boolean().optional().default(true),
  language: z.enum(['en', 'am', 'om']).optional().default('en'),
});

// Itinerary import schema
export const itineraryImportSchema = z.object({
  format: z.enum(['json', 'csv', 'ical', 'google-trips']),
  data: z.string().min(1, 'Import data is required'),
  options: z.object({
    overwrite: z.boolean().optional().default(false),
    validateOnly: z.boolean().optional().default(false),
    mergeWithExisting: z.boolean().optional().default(false),
    defaultCurrency: z.string().length(3).optional().default('USD'),
  }).optional().default({}),
});

// Itinerary optimization schema
export const itineraryOptimizationSchema = z.object({
  optimizeFor: z.enum(['time', 'cost', 'distance', 'experience'])
    .default('experience'),
  constraints: z.object({
    maxDailyBudget: z.number().min(0).optional(),
    maxDailyDistance: z.number().min(0).optional(), // in km
    maxDailyActivities: z.number().int().min(1).max(20).optional(),
    preferredStartTime: z.string().optional(), // HH:MM format
    preferredEndTime: z.string().optional(), // HH:MM format
    breakDuration: z.number().min(0).optional(), // in minutes
    transportationMode: z.enum(['walking', 'driving', 'public', 'mixed']).optional(),
  }).optional(),
  preferences: z.object({
    prioritizePopular: z.boolean().optional().default(false),
    avoidCrowds: z.boolean().optional().default(false),
    includeRestTime: z.boolean().optional().default(true),
    groupSimilarActivities: z.boolean().optional().default(true),
  }).optional(),
});

// Type exports for TypeScript
export type CreateItineraryInput = z.infer<typeof createItinerarySchema>;
export type UpdateItineraryInput = z.infer<typeof updateItinerarySchema>;
export type ItineraryQueryInput = z.infer<typeof itineraryQuerySchema>;
export type ShareItineraryInput = z.infer<typeof shareItinerarySchema>;
export type ItineraryCollaborationInput = z.infer<typeof itineraryCollaborationSchema>;
export type ItineraryStatsQueryInput = z.infer<typeof itineraryStatsQuerySchema>;
export type ItineraryRecommendationInput = z.infer<typeof itineraryRecommendationSchema>;
export type ItineraryExportInput = z.infer<typeof itineraryExportSchema>;
export type ItineraryImportInput = z.infer<typeof itineraryImportSchema>;
export type ItineraryOptimizationInput = z.infer<typeof itineraryOptimizationSchema>;
export type DestinationInput = z.infer<typeof destinationSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;