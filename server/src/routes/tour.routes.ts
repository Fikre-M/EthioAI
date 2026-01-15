import { Router } from 'express';
import { TourController } from '../controllers/tour.controller';
import { authenticate, optionalAuth, requireRoles } from '../middlewares/auth.middleware';
import { validate, commonSchemas } from '../middlewares/validation.middleware';
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

// Public routes (no authentication required)
router.get('/search', validate({ query: tourQuerySchema }), TourController.searchTours);
router.get('/featured', TourController.getFeaturedTours);
router.get('/popular', TourController.getPopularTours);
router.get('/categories', TourController.getTourCategories);
router.get('/category/:category', TourController.getToursByCategory);

// Public routes with optional authentication (for personalized results)
router.get('/', optionalAuth, validate({ query: tourQuerySchema }), TourController.getTours);
router.get('/:id', optionalAuth, TourController.getTourById);

// Semi-public routes (anyone can check availability)
router.post('/:id/availability', 
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: checkAvailabilitySchema 
  }), 
  TourController.checkAvailability
);

// Protected routes (authentication required)
router.post('/', 
  authenticate, 
  requireRoles.guideOrAdmin, 
  validate({ body: createTourSchema }), 
  TourController.createTour
);

router.put('/:id', 
  authenticate, 
  requireRoles.guideOrAdmin,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateTourSchema 
  }), 
  TourController.updateTour
);

router.delete('/:id', 
  authenticate, 
  requireRoles.guideOrAdmin,
  validate({ params: commonSchemas.uuidParam.params }), 
  TourController.deleteTour
);

router.patch('/:id/status', 
  authenticate, 
  requireRoles.admin,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateTourStatusSchema 
  }), 
  TourController.updateTourStatus
);

// Admin routes
router.get('/admin/stats', 
  authenticate, 
  requireRoles.admin, 
  TourController.getTourStats
);

export default router;