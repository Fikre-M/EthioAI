import { Router } from 'express';
import { z } from 'zod';
import { ItineraryController } from '../controllers/itinerary.controller';
import { authenticate, optionalAuth, requireRoles } from '../middlewares/auth.middleware';
import { validate, commonSchemas } from '../middlewares/validation.middleware';

// Import schemas
import {
  createItinerarySchema,
  updateItinerarySchema,
  itineraryQuerySchema,
  shareItinerarySchema,
  itineraryStatsQuerySchema,
  itineraryRecommendationSchema,
  itineraryExportSchema,
  itineraryOptimizationSchema,
} from '../schemas/itinerary.schemas';

const router = Router();

/**
 * Itinerary Routes
 * All routes are prefixed with /api/itinerary
 */

// ===== PUBLIC ROUTES =====

/**
 * Get itinerary overview (featured, popular destinations, stats)
 * GET /api/itinerary/overview
 */
router.get('/overview', 
  optionalAuth,
  ItineraryController.getItineraryOverview
);

/**
 * Get public itineraries
 * GET /api/itinerary/public
 */
router.get('/public', 
  optionalAuth,
  validate({ query: itineraryQuerySchema }),
  ItineraryController.getPublicItineraries
);

/**
 * Get shared itinerary by token
 * GET /api/itinerary/shared/:token
 */
router.get('/shared/:token', 
  optionalAuth,
  validate({ 
    params: z.object({
      token: z.string().min(1, 'Share token is required')
    })
  }),
  ItineraryController.getSharedItinerary
);

/**
 * Search itineraries
 * GET /api/itinerary/search
 */
router.get('/search', 
  optionalAuth,
  validate({ 
    query: z.object({
      q: z.string().min(1, 'Search query is required'),
      page: z.string().optional(),
      limit: z.string().optional(),
      sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'startDate']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      travelStyle: z.enum(['budget', 'mid-range', 'luxury', 'backpacking', 'family', 'business', 'adventure', 'cultural', 'relaxation']).optional(),
      minBudget: z.string().optional(),
      maxBudget: z.string().optional(),
      minDuration: z.string().optional(),
      maxDuration: z.string().optional(),
    })
  }),
  ItineraryController.searchItineraries
);

/**
 * Get popular destinations
 * GET /api/itinerary/popular-destinations
 */
router.get('/popular-destinations', 
  optionalAuth,
  validate({ 
    query: z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    }).optional().default({})
  }),
  ItineraryController.getPopularDestinations
);

/**
 * Get itinerary recommendations
 * POST /api/itinerary/recommendations
 */
router.post('/recommendations', 
  optionalAuth,
  validate({ body: itineraryRecommendationSchema }),
  ItineraryController.getRecommendations
);

/**
 * Get all itineraries with filtering
 * GET /api/itinerary
 */
router.get('/', 
  optionalAuth,
  validate({ query: itineraryQuerySchema }),
  ItineraryController.getItineraries
);

/**
 * Get specific itinerary by ID
 * GET /api/itinerary/:id
 */
router.get('/:id', 
  optionalAuth,
  validate({ params: commonSchemas.uuidParam.params }),
  ItineraryController.getItineraryById
);

// ===== AUTHENTICATED USER ROUTES =====

/**
 * Create itinerary
 * POST /api/itinerary
 */
router.post('/', 
  authenticate,
  validate({ body: createItinerarySchema }),
  ItineraryController.createItinerary
);

/**
 * Get user's itineraries
 * GET /api/itinerary/my-itineraries
 */
router.get('/my-itineraries', 
  authenticate,
  validate({ query: itineraryQuerySchema }),
  ItineraryController.getMyItineraries
);

/**
 * Update itinerary
 * PUT /api/itinerary/:id
 */
router.put('/:id', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateItinerarySchema 
  }),
  ItineraryController.updateItinerary
);

/**
 * Delete itinerary
 * DELETE /api/itinerary/:id
 */
router.delete('/:id', 
  authenticate,
  validate({ params: commonSchemas.uuidParam.params }),
  ItineraryController.deleteItinerary
);

/**
 * Share itinerary
 * POST /api/itinerary/:id/share
 */
router.post('/:id/share', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: shareItinerarySchema 
  }),
  ItineraryController.shareItinerary
);

/**
 * Copy/clone itinerary
 * POST /api/itinerary/:id/copy
 */
router.post('/:id/copy', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: z.object({
      title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    }).optional().default({})
  }),
  ItineraryController.copyItinerary
);

/**
 * Optimize itinerary
 * POST /api/itinerary/:id/optimize
 */
router.post('/:id/optimize', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: itineraryOptimizationSchema 
  }),
  ItineraryController.optimizeItinerary
);

/**
 * Export itinerary
 * GET /api/itinerary/:id/export
 */
router.get('/:id/export', 
  optionalAuth,
  validate({ 
    params: commonSchemas.uuidParam.params,
    query: itineraryExportSchema 
  }),
  ItineraryController.exportItinerary
);

// ===== ADMIN ROUTES =====

/**
 * Get itinerary statistics (admin only)
 * GET /api/itinerary/stats
 */
router.get('/admin/stats', 
  authenticate,
  requireRoles.admin,
  validate({ query: itineraryStatsQuerySchema }),
  ItineraryController.getItineraryStats
);

export default router;