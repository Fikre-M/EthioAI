import { Router } from 'express';
import { z } from 'zod';
import { TransportController } from '../controllers/transport.controller';
import { authenticate, optionalAuth, requireRoles } from '../middlewares/auth.middleware';
import { validate, commonSchemas } from '../middlewares/validation.middleware';

// Import schemas
import {
  flightSearchSchema,
  carRentalSearchSchema,
  busSearchSchema,
  transportBookingSchema,
  transportBookingQuerySchema,
  updateTransportBookingSchema,
  transportStatsQuerySchema,
  popularRoutesQuerySchema,
} from '../schemas/transport.schemas';

const router = Router();

/**
 * Transport Routes
 * All routes are prefixed with /api/transport
 */

// ===== PUBLIC SEARCH ROUTES =====

/**
 * Search flights
 * POST /api/transport/flights/search
 */
router.post('/flights/search', 
  optionalAuth,
  validate({ body: flightSearchSchema }),
  TransportController.searchFlights
);

/**
 * Search car rentals
 * POST /api/transport/cars/search
 */
router.post('/cars/search', 
  optionalAuth,
  validate({ body: carRentalSearchSchema }),
  TransportController.searchCarRentals
);

/**
 * Search buses
 * POST /api/transport/buses/search
 */
router.post('/buses/search', 
  optionalAuth,
  validate({ body: busSearchSchema }),
  TransportController.searchBuses
);

/**
 * Search all transport types
 * POST /api/transport/search
 */
router.post('/search', 
  optionalAuth,
  validate({ 
    body: z.object({
      type: z.enum(['flight', 'car', 'bus', 'all']),
      origin: z.string().optional(),
      destination: z.string().optional(),
      departureDate: z.string().optional(),
      returnDate: z.string().optional(),
      passengers: z.union([
        z.number().int().min(1),
        z.object({
          adults: z.number().int().min(1),
          children: z.number().int().min(0).optional(),
          infants: z.number().int().min(0).optional(),
        })
      ]).optional(),
      pickupLocation: z.string().optional(),
      dropoffLocation: z.string().optional(),
      pickupDate: z.string().optional(),
      dropoffDate: z.string().optional(),
      driverAge: z.number().int().min(18).optional(),
    })
  }),
  TransportController.searchAllTransport
);

/**
 * Get transport options for a route
 * GET /api/transport/route-options
 */
router.get('/route-options', 
  optionalAuth,
  validate({ 
    query: z.object({
      origin: z.string().min(1, 'Origin is required'),
      destination: z.string().min(1, 'Destination is required'),
      date: z.string().optional(),
    })
  }),
  TransportController.getRouteOptions
);

/**
 * Get popular routes
 * GET /api/transport/popular-routes
 */
router.get('/popular-routes', 
  optionalAuth,
  validate({ query: popularRoutesQuerySchema }),
  TransportController.getPopularRoutes
);

// ===== AUTHENTICATED USER ROUTES =====

/**
 * Create transport booking
 * POST /api/transport/bookings
 */
router.post('/bookings', 
  authenticate,
  validate({ body: transportBookingSchema }),
  TransportController.createBooking
);

/**
 * Get user's transport bookings
 * GET /api/transport/my-bookings
 */
router.get('/my-bookings', 
  authenticate,
  validate({ query: transportBookingQuerySchema }),
  TransportController.getMyBookings
);

/**
 * Get upcoming bookings
 * GET /api/transport/upcoming
 */
router.get('/upcoming', 
  authenticate,
  TransportController.getUpcomingBookings
);

/**
 * Get booking history
 * GET /api/transport/history
 */
router.get('/history', 
  authenticate,
  validate({ query: transportBookingQuerySchema }),
  TransportController.getBookingHistory
);

/**
 * Get specific booking by ID
 * GET /api/transport/bookings/:id
 */
router.get('/bookings/:id', 
  authenticate,
  validate({ params: commonSchemas.uuidParam.params }),
  TransportController.getBookingById
);

/**
 * Update transport booking
 * PUT /api/transport/bookings/:id
 */
router.put('/bookings/:id', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateTransportBookingSchema 
  }),
  TransportController.updateBooking
);

/**
 * Cancel transport booking
 * POST /api/transport/bookings/:id/cancel
 */
router.post('/bookings/:id/cancel', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: z.object({
      reason: z.string().max(500, 'Reason must not exceed 500 characters').optional(),
    }).optional().default({})
  }),
  TransportController.cancelBooking
);

// ===== ADMIN ROUTES =====

/**
 * Get all transport bookings (admin only)
 * GET /api/transport/bookings
 */
router.get('/bookings', 
  authenticate,
  requireRoles.admin,
  validate({ query: transportBookingQuerySchema }),
  TransportController.getBookings
);

/**
 * Get transport statistics (admin only)
 * GET /api/transport/stats
 */
router.get('/stats', 
  authenticate,
  requireRoles.admin,
  validate({ query: transportStatsQuerySchema }),
  TransportController.getTransportStats
);

export default router;