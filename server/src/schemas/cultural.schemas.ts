import { z } from 'zod';

/**
 * Cultural Content validation schemas
 */

// Create cultural content schema
export const createCulturalContentSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(50000, 'Content must not exceed 50,000 characters'),
  excerpt: z.string()
    .max(500, 'Excerpt must not exceed 500 characters')
    .optional(),
  images: z.array(z.string().url('Invalid image URL'))
    .max(10, 'Maximum 10 images allowed')
    .optional()
    .default([]),
  type: z.enum(['article', 'recipe', 'artifact', 'tradition', 'festival', 'history', 'language', 'music', 'dance', 'craft'])
    .default('article'),
  category: z.string()
    .min(1, 'Category is required')
    .max(100, 'Category must not exceed 100 characters'),
  tags: z.array(z.string().max(50, 'Tag must not exceed 50 characters'))
    .max(20, 'Maximum 20 tags allowed')
    .optional()
    .default([]),
  language: z.enum(['en', 'am', 'om'])
    .default('en'),
  featured: z.boolean()
    .optional()
    .default(false),
  metaTitle: z.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .optional(),
  metaDescription: z.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .optional(),
  authorName: z.string()
    .max(100, 'Author name must not exceed 100 characters')
    .optional(),
});

// Update cultural content schema
export const updateCulturalContentSchema = createCulturalContentSchema.partial();

// Cultural content query schema
export const culturalContentQuerySchema = z.object({
  // Pagination
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  
  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'type', 'category'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  
  // Filtering
  type: z.enum(['article', 'recipe', 'artifact', 'tradition', 'festival', 'history', 'language', 'music', 'dance', 'craft'])
    .optional(),
  category: z.string().optional(),
  language: z.enum(['en', 'am', 'om']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  featured: z.string().optional().transform((val) => val === 'true'),
  
  // Date range
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  
  // Search
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  
  // Author filter
  authorName: z.string().optional(),
});

// Update content status schema
export const updateContentStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  reason: z.string()
    .max(500, 'Reason must not exceed 500 characters')
    .optional(),
});

// Cultural content statistics query schema
export const culturalContentStatsQuerySchema = z.object({
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  type: z.enum(['article', 'recipe', 'artifact', 'tradition', 'festival', 'history', 'language', 'music', 'dance', 'craft'])
    .optional(),
  category: z.string().optional(),
  language: z.enum(['en', 'am', 'om']).optional(),
  authorName: z.string().optional(),
});

// Content category schema
export const createContentCategorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must not exceed 100 characters'),
  slug: z.string()
    .min(1, 'Category slug is required')
    .max(100, 'Category slug must not exceed 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  image: z.string().url('Invalid image URL').optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional(),
});

// Update content category schema
export const updateContentCategorySchema = createContentCategorySchema.partial();

// Content category query schema
export const contentCategoryQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 20),
  sortBy: z.enum(['name', 'createdAt']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional(),
});

// Content recommendation schema
export const contentRecommendationSchema = z.object({
  contentId: z.string().uuid('Invalid content ID').optional(),
  interests: z.array(z.string()).optional(),
  language: z.enum(['en', 'am', 'om']).optional(),
  type: z.enum(['article', 'recipe', 'artifact', 'tradition', 'festival', 'history', 'language', 'music', 'dance', 'craft'])
    .optional(),
  limit: z.number().int().min(1).max(20).optional().default(5),
});

// Content interaction schema (for tracking views, likes, etc.)
export const contentInteractionSchema = z.object({
  contentId: z.string().uuid('Invalid content ID'),
  interactionType: z.enum(['view', 'like', 'share', 'bookmark']),
  metadata: z.record(z.any()).optional(),
});

// Content search schema
export const contentSearchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(200, 'Search query must not exceed 200 characters'),
  type: z.enum(['article', 'recipe', 'artifact', 'tradition', 'festival', 'history', 'language', 'music', 'dance', 'craft'])
    .optional(),
  category: z.string().optional(),
  language: z.enum(['en', 'am', 'om']).optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(50).optional().default(20),
});

// Content bulk operation schema
export const contentBulkOperationSchema = z.object({
  contentIds: z.array(z.string().uuid('Invalid content ID'))
    .min(1, 'At least one content ID is required')
    .max(100, 'Maximum 100 content items allowed'),
  operation: z.enum(['publish', 'archive', 'delete', 'feature', 'unfeature']),
  reason: z.string()
    .max(500, 'Reason must not exceed 500 characters')
    .optional(),
});

// Content import schema
export const contentImportSchema = z.object({
  format: z.enum(['json', 'csv', 'markdown']),
  data: z.string().min(1, 'Import data is required'),
  options: z.object({
    overwrite: z.boolean().optional().default(false),
    validateOnly: z.boolean().optional().default(false),
    defaultLanguage: z.enum(['en', 'am', 'om']).optional().default('en'),
    defaultType: z.enum(['article', 'recipe', 'artifact', 'tradition', 'festival', 'history', 'language', 'music', 'dance', 'craft'])
      .optional().default('article'),
  }).optional().default({}),
});

// Type exports for TypeScript
export type CreateCulturalContentInput = z.infer<typeof createCulturalContentSchema>;
export type UpdateCulturalContentInput = z.infer<typeof updateCulturalContentSchema>;
export type CulturalContentQueryInput = z.infer<typeof culturalContentQuerySchema>;
export type UpdateContentStatusInput = z.infer<typeof updateContentStatusSchema>;
export type CulturalContentStatsQueryInput = z.infer<typeof culturalContentStatsQuerySchema>;
export type CreateContentCategoryInput = z.infer<typeof createContentCategorySchema>;
export type UpdateContentCategoryInput = z.infer<typeof updateContentCategorySchema>;
export type ContentCategoryQueryInput = z.infer<typeof contentCategoryQuerySchema>;
export type ContentRecommendationInput = z.infer<typeof contentRecommendationSchema>;
export type ContentInteractionInput = z.infer<typeof contentInteractionSchema>;
export type ContentSearchInput = z.infer<typeof contentSearchSchema>;
export type ContentBulkOperationInput = z.infer<typeof contentBulkOperationSchema>;
export type ContentImportInput = z.infer<typeof contentImportSchema>;