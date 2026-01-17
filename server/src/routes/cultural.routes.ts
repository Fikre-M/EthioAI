import { Router } from 'express';
import { z } from 'zod';
import { CulturalController } from '../controllers/cultural.controller';
import { authenticate, optionalAuth, requireRoles } from '../middlewares/auth.middleware';
import { validate, commonSchemas } from '../middlewares/validation.middleware';

// Import schemas
import {
  createCulturalContentSchema,
  updateCulturalContentSchema,
  culturalContentQuerySchema,
  updateContentStatusSchema,
  culturalContentStatsQuerySchema,
  contentRecommendationSchema,
  contentInteractionSchema,
  contentSearchSchema,
  contentBulkOperationSchema,
} from '../schemas/cultural.schemas';

const router = Router();

/**
 * Cultural Content Routes
 * All routes are prefixed with /api/cultural
 */

// ===== PUBLIC ROUTES =====

/**
 * Get cultural content overview (featured, recent, popular)
 * GET /api/cultural/overview
 */
router.get('/overview', 
  optionalAuth,
  CulturalController.getContentOverview
);

/**
 * Get featured cultural content
 * GET /api/cultural/featured
 */
router.get('/featured', 
  optionalAuth,
  validate({ 
    query: z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 8),
    }).optional().default({})
  }),
  CulturalController.getFeaturedContent
);

/**
 * Get popular cultural content
 * GET /api/cultural/popular
 */
router.get('/popular', 
  optionalAuth,
  validate({ 
    query: z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    }).optional().default({})
  }),
  CulturalController.getPopularContent
);

/**
 * Get recent cultural content
 * GET /api/cultural/recent
 */
router.get('/recent', 
  optionalAuth,
  validate({ 
    query: z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    }).optional().default({})
  }),
  CulturalController.getRecentContent
);

/**
 * Search cultural content
 * GET /api/cultural/search
 */
router.get('/search', 
  optionalAuth,
  validate({ 
    query: z.object({
      q: z.string().min(1, 'Search query is required'),
      type: z.enum(['article', 'recipe', 'artifact', 'tradition', 'festival', 'history', 'language', 'music', 'dance', 'craft']).optional(),
      category: z.string().optional(),
      language: z.enum(['en', 'am', 'om']).optional(),
      limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 20),
    })
  }),
  CulturalController.searchContent
);

/**
 * Get content categories
 * GET /api/cultural/categories
 */
router.get('/categories', 
  optionalAuth,
  CulturalController.getCategories
);

/**
 * Get content types with counts
 * GET /api/cultural/types
 */
router.get('/types', 
  optionalAuth,
  CulturalController.getContentTypes
);

/**
 * Get popular tags
 * GET /api/cultural/tags
 */
router.get('/tags', 
  optionalAuth,
  validate({ 
    query: z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 20),
    }).optional().default({})
  }),
  CulturalController.getPopularTags
);

/**
 * Get content by type
 * GET /api/cultural/type/:type
 */
router.get('/type/:type', 
  optionalAuth,
  validate({ 
    params: z.object({
      type: z.enum(['article', 'recipe', 'artifact', 'tradition', 'festival', 'history', 'language', 'music', 'dance', 'craft'])
    }),
    query: z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 12),
    }).optional().default({})
  }),
  CulturalController.getContentByType
);

/**
 * Get content by category
 * GET /api/cultural/category/:category
 */
router.get('/category/:category', 
  optionalAuth,
  validate({ 
    params: z.object({
      category: z.string().min(1, 'Category is required')
    }),
    query: z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 12),
    }).optional().default({})
  }),
  CulturalController.getContentByCategory
);

/**
 * Get all cultural content with filtering and pagination
 * GET /api/cultural/content
 */
router.get('/content', 
  optionalAuth,
  validate({ query: culturalContentQuerySchema }),
  CulturalController.getContent
);

/**
 * Get specific cultural content by ID or slug
 * GET /api/cultural/content/:id
 */
router.get('/content/:id', 
  optionalAuth,
  CulturalController.getContentById
);

/**
 * Get content recommendations
 * POST /api/cultural/recommendations
 */
router.post('/recommendations', 
  optionalAuth,
  validate({ body: contentRecommendationSchema }),
  CulturalController.getRecommendations
);

/**
 * Advanced search with multiple filters
 * POST /api/cultural/advanced-search
 */
router.post('/advanced-search', 
  optionalAuth,
  validate({ body: culturalContentQuerySchema }),
  CulturalController.advancedSearch
);

// ===== AUTHENTICATED USER ROUTES =====

/**
 * Track content interaction (view, like, share, bookmark)
 * POST /api/cultural/content/:id/interact
 */
router.post('/content/:id/interact', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: z.object({
      interactionType: z.enum(['view', 'like', 'share', 'bookmark']),
      metadata: z.record(z.any()).optional(),
    })
  }),
  CulturalController.trackInteraction
);

// ===== CONTENT CREATOR ROUTES =====

/**
 * Create cultural content
 * POST /api/cultural/content
 */
router.post('/content', 
  authenticate,
  validate({ body: createCulturalContentSchema }),
  CulturalController.createContent
);

/**
 * Update cultural content
 * PUT /api/cultural/content/:id
 */
router.put('/content/:id', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateCulturalContentSchema 
  }),
  CulturalController.updateContent
);

/**
 * Delete cultural content
 * DELETE /api/cultural/content/:id
 */
router.delete('/content/:id', 
  authenticate,
  validate({ params: commonSchemas.uuidParam.params }),
  CulturalController.deleteContent
);

/**
 * Update content status
 * PATCH /api/cultural/content/:id/status
 */
router.patch('/content/:id/status', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateContentStatusSchema 
  }),
  CulturalController.updateContentStatus
);

// ===== ADMIN ROUTES =====

/**
 * Get content statistics
 * GET /api/cultural/stats
 */
router.get('/stats', 
  authenticate,
  requireRoles.admin,
  validate({ query: culturalContentStatsQuerySchema }),
  CulturalController.getContentStats
);

/**
 * Bulk operations on content
 * POST /api/cultural/bulk
 */
router.post('/bulk', 
  authenticate,
  requireRoles.admin,
  validate({ body: contentBulkOperationSchema }),
  CulturalController.bulkOperation
);

export default router;