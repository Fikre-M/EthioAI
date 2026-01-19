import { Router } from 'express';
import { TourController } from '../controllers/tour.controller';
import { authenticate, optionalAuth, requireRoles } from '../middlewares/auth.middleware';
import { validate, commonSchemas } from '../middlewares/validation.middleware';
import { cache, publicCache, userCache, invalidateCache } from '../middlewares/cache.middleware';
import { CacheTTL } from '../services/cache.service';
import {
  createTourSchema,
  updateTourSchema,
  tourQuerySchema,
  checkAvailabilitySchema,
  updateTourStatusSchema,
} from '../schemas/tour.schemas';

const router = Router();

/**
 * Tour Routes
 * All routes are prefixed with /api/tours
 */

// Public routes (no authentication required) - with caching
router.get('/search', 
  publicCache(CacheTTL.SHORT), // Cache search results for 5 minutes
  validate({ query: tourQuerySchema }), 
  TourController.searchTours
);

router.get('/featured', 
  publicCache(CacheTTL.LONG), // Cache featured tours for 1 hour
  TourController.getFeaturedTours
);

router.get('/popular', 
  publicCache(CacheTTL.MEDIUM), // Cache popular tours for 30 minutes
  TourController.getPopularTours
);

router.get('/categories', 
  publicCache(CacheTTL.VERY_LONG), // Cache categories for 24 hours
  TourController.getTourCategories
);

router.get('/category/:category', 
  publicCache(CacheTTL.LONG), // Cache category results for 1 hour
  TourController.getToursByCategory
);

// Public routes with optional authentication (for personalized results)
router.get('/', 
  optionalAuth, 
  cache({ 
    ttl: CacheTTL.MEDIUM,
    keyGenerator: (req) => {
      const authReq = req as any;
      const userId = authReq.userId || 'anonymous';
      return `tours:list:${userId}:${JSON.stringify(req.query)}`;
    }
  }),
  validate({ query: tourQuerySchema }), 
  TourController.getTours
);

router.get('/:id', 
  optionalAuth, 
  cache({
    ttl: CacheTTL.LONG,
    keyGenerator: (req) => {
      const authReq = req as any;
      const userId = authReq.userId || 'anonymous';
      return `tour:${req.params.id}:${userId}`;
    }
  }),
  TourController.getTourById
);

// Semi-public routes (anyone can check availability)
router.post('/:id/availability', 
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: checkAvailabilitySchema 
  }), 
  TourController.checkAvailability
);

// Protected routes (authentication required) - with cache invalidation
router.post('/', 
  authenticate, 
  requireRoles.guideOrAdmin,
  invalidateCache(['tours:*', 'tour:*']), // Invalidate tour caches when creating
  validate({ body: createTourSchema }), 
  TourController.createTour
);

router.put('/:id', 
  authenticate, 
  requireRoles.guideOrAdmin,
  invalidateCache((req) => [`tour:${req.params.id}:*`, 'tours:*']), // Invalidate specific tour and lists
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateTourSchema 
  }), 
  TourController.updateTour
);

router.delete('/:id', 
  authenticate, 
  requireRoles.guideOrAdmin,
  invalidateCache((req) => [`tour:${req.params.id}:*`, 'tours:*']), // Invalidate specific tour and lists
  validate({ params: commonSchemas.uuidParam.params }), 
  TourController.deleteTour
);

router.patch('/:id/status', 
  authenticate, 
  requireRoles.admin,
  invalidateCache((req) => [`tour:${req.params.id}:*`, 'tours:*']), // Invalidate specific tour and lists
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateTourStatusSchema 
  }), 
  TourController.updateTourStatus
);

// Admin routes - with caching
router.get('/admin/stats', 
  authenticate, 
  requireRoles.admin,
  cache({ ttl: CacheTTL.SHORT }), // Cache stats for 5 minutes
  TourController.getTourStats
);

export default router;