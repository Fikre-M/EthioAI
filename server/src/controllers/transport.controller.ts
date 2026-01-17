import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TransportService } from '../services/transport.service';
import { ResponseUtil } from '../utils/response';
import { log } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';
import { 
  FlightSearchInput, 
  CarRentalSearchInput, 
  BusSearchInput,
  TransportBookingInput,
  TransportBookingQueryInput,
  UpdateTransportBookingInput,
  TransportStatsQueryInput,
  PopularRoutesQueryInput
} from '../schemas/transport.schemas';

export class TransportController {
  /**
   * Search flights
   * POST /api/transport/flights/search
   */
  static searchFlights = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: FlightSearchInput = req.body;
    
    const flights = await TransportService.searchFlights(data);
    
    log.info('Flight search performed via API', { 
      origin: data.origin,
      destination: data.destination,
      resultsCount: flights.length,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { flights }, 'Flight search completed successfully');
  });

  /**
   * Search car rentals
   * POST /api/transport/cars/search
   */
  static searchCarRentals = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CarRentalSearchInput = req.body;
    
    const cars = await TransportService.searchCarRentals(data);
    
    log.info('Car rental search performed via API', { 
      pickupLocation: data.pickupLocation,
      resultsCount: cars.length,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { cars }, 'Car rental search completed successfully');
  });

  /**
   * Search buses
   * POST /api/transport/buses/search
   */
  static searchBuses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: BusSearchInput = req.body;
    
    const buses = await TransportService.searchBuses(data);
    
    log.info('Bus search performed via API', { 
      origin: data.origin,
      destination: data.destination,
      resultsCount: buses.length,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { buses }, 'Bus search completed successfully');
  });

  /**
   * Create transport booking
   * POST /api/transport/bookings
   */
  static createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: TransportBookingInput = req.body;
    const userId = req.userId!;
    
    const booking = await TransportService.createBooking(data, userId);
    
    log.info('Transport booking created via API', { 
      bookingId: booking.id,
      userId,
      transportType: data.transportType,
      ip: req.ip 
    });

    return ResponseUtil.created(res, { booking }, 'Transport booking created successfully');
  });

  /**
   * Get transport bookings
   * GET /api/transport/bookings
   */
  static getBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: TransportBookingQueryInput = req.query as any;
    const userId = req.userId;
    
    const result = await TransportService.getBookings(query, userId);
    
    return ResponseUtil.paginated(
      res, 
      result.bookings, 
      result.pagination, 
      'Transport bookings retrieved successfully'
    );
  });

  /**
   * Get booking by ID
   * GET /api/transport/bookings/:id
   */
  static getBookingById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    
    const booking = await TransportService.getBookingById(id, userId);
    
    return ResponseUtil.success(res, { booking }, 'Transport booking retrieved successfully');
  });

  /**
   * Update transport booking
   * PUT /api/transport/bookings/:id
   */
  static updateBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateTransportBookingInput = req.body;
    const userId = req.userId!;
    
    const booking = await TransportService.updateBooking(id, data, userId);
    
    log.info('Transport booking updated via API', { bookingId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, { booking }, 'Transport booking updated successfully');
  });

  /**
   * Cancel transport booking
   * POST /api/transport/bookings/:id/cancel
   */
  static cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.userId!;
    
    const booking = await TransportService.cancelBooking(id, userId, reason);
    
    log.info('Transport booking cancelled via API', { bookingId: id, userId, reason, ip: req.ip });

    return ResponseUtil.success(res, { booking }, 'Transport booking cancelled successfully');
  });

  /**
   * Get popular routes
   * GET /api/transport/popular-routes
   */
  static getPopularRoutes = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: PopularRoutesQueryInput = req.query as any;
    
    const routes = await TransportService.getPopularRoutes(query);
    
    return ResponseUtil.success(res, { routes }, 'Popular routes retrieved successfully');
  });

  /**
   * Get transport statistics (admin only)
   * GET /api/transport/stats
   */
  static getTransportStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: TransportStatsQueryInput = req.query as any;
    
    const stats = await TransportService.getTransportStats(query);
    
    return ResponseUtil.success(res, stats, 'Transport statistics retrieved successfully');
  });

  /**
   * Get user's transport bookings
   * GET /api/transport/my-bookings
   */
  static getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const query: TransportBookingQueryInput = req.query as any;
    
    const result = await TransportService.getBookings(query, userId);
    
    return ResponseUtil.paginated(
      res, 
      result.bookings, 
      result.pagination, 
      'Your transport bookings retrieved successfully'
    );
  });

  /**
   * Get upcoming bookings
   * GET /api/transport/upcoming
   */
  static getUpcomingBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    
    // Filter for upcoming bookings
    const query: TransportBookingQueryInput = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'asc',
      status: 'confirmed',
      startDate: new Date().toISOString().split('T')[0], // Today onwards
    };
    
    const result = await TransportService.getBookings(query, userId);
    
    return ResponseUtil.success(
      res, 
      { bookings: result.bookings }, 
      'Upcoming transport bookings retrieved successfully'
    );
  });

  /**
   * Get booking history
   * GET /api/transport/history
   */
  static getBookingHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const query: TransportBookingQueryInput = req.query as any;
    
    // Filter for completed bookings
    const historyQuery: TransportBookingQueryInput = {
      ...query,
      status: 'completed',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    
    const result = await TransportService.getBookings(historyQuery, userId);
    
    return ResponseUtil.paginated(
      res, 
      result.bookings, 
      result.pagination, 
      'Transport booking history retrieved successfully'
    );
  });

  /**
   * Search all transport types
   * POST /api/transport/search
   */
  static searchAllTransport = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { type, ...searchData } = req.body;
    
    let results: any = {};
    
    try {
      switch (type) {
        case 'flight':
          results.flights = await TransportService.searchFlights(searchData as FlightSearchInput);
          break;
        case 'car':
          results.cars = await TransportService.searchCarRentals(searchData as CarRentalSearchInput);
          break;
        case 'bus':
          results.buses = await TransportService.searchBuses(searchData as BusSearchInput);
          break;
        case 'all':
          // Search all types (simplified for demo)
          const [flights, cars, buses] = await Promise.allSettled([
            TransportService.searchFlights(searchData as FlightSearchInput).catch(() => []),
            TransportService.searchCarRentals(searchData as CarRentalSearchInput).catch(() => []),
            TransportService.searchBuses(searchData as BusSearchInput).catch(() => []),
          ]);
          
          results = {
            flights: flights.status === 'fulfilled' ? flights.value : [],
            cars: cars.status === 'fulfilled' ? cars.value : [],
            buses: buses.status === 'fulfilled' ? buses.value : [],
          };
          break;
        default:
          return ResponseUtil.badRequest(res, 'Invalid transport type');
      }
      
      log.info('Transport search performed via API', { 
        type,
        resultsCount: Object.values(results).flat().length,
        ip: req.ip 
      });

      return ResponseUtil.success(res, results, 'Transport search completed successfully');
      
    } catch (error: any) {
      log.error('Transport search error', { error: error.message, type, searchData });
      return ResponseUtil.error(res, 'Transport search failed', 500);
    }
  });

  /**
   * Get transport options for a route
   * GET /api/transport/route-options
   */
  static getRouteOptions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { origin, destination, date } = req.query;
    
    if (!origin || !destination) {
      return ResponseUtil.badRequest(res, 'Origin and destination are required');
    }
    
    try {
      // Search multiple transport types for the route
      const searchPromises = [];
      
      // Flight search
      if (typeof origin === 'string' && typeof destination === 'string' && origin.length === 3 && destination.length === 3) {
        searchPromises.push(
          TransportService.searchFlights({
            origin: origin.toUpperCase(),
            destination: destination.toUpperCase(),
            departureDate: (date as string) || new Date().toISOString().split('T')[0],
            passengers: { adults: 1, children: 0, infants: 0 },
            class: 'economy',
            tripType: 'one_way',
            directFlightsOnly: false,
            currency: 'USD',
          }).catch(() => [])
        );
      }
      
      // Bus search
      searchPromises.push(
        TransportService.searchBuses({
          origin: origin as string,
          destination: destination as string,
          departureDate: (date as string) || new Date().toISOString().split('T')[0],
          passengers: 1,
          currency: 'ETB',
        }).catch(() => [])
      );
      
      const [flights = [], buses = []] = await Promise.all(searchPromises);
      
      const options = {
        flights,
        buses,
        route: { origin, destination, date },
        totalOptions: flights.length + buses.length,
      };
      
      return ResponseUtil.success(res, options, 'Route transport options retrieved successfully');
      
    } catch (error: any) {
      log.error('Route options error', { error: error.message, origin, destination });
      return ResponseUtil.error(res, 'Failed to get route options', 500);
    }
  });
}