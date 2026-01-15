import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TourService } from '../services/tour.service';
import { ResponseUtil } from '../utils/response';
import { log } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';
import { 
  CreateTourInput, 
  UpdateTourInput, 
  TourQueryInput,
  CheckAvailabilityInput,
  UpdateTourStatusInput,
  TourReviewInput 
} from '../schemas/tour.schemas';

export class TourController {
  /**
   * Create a new tour
   * POST /api/tours
   */
  static createTour = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CreateTourInput = req.body;
    const userId = req.userId!;
    
    const tour = await TourService.createTour(data, userId);
    
    log.info('Tour created via API', { tourId: tour.id, userId, ip: req.ip });

    return ResponseUtil.created(res, { tour }, 'Tour created successfully');
  });

  /**
   * Get all tours with filtering and pagination
   * GET /api/tours
   */
  static getTours = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: TourQueryInput = req.query as any;
    
    const result = await TourService.getTours(query);
    
    return ResponseUtil.paginated(
      res, 
      result.tours, 
      result.pagination, 
      'Tours retrieved successfully'
    );
  });

  /**
   * Get tour by ID or slug
   * GET /api/tours/:id
   */
  static getTourById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const tour = await TourService.getTourById(id);
    
    return ResponseUtil.success(res, { tour }, 'Tour retrieved successfully');
  });

  /**
   * Update tour
   * PUT /api/tours/:id
   */
  static updateTour = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateTourInput = req.body;
    const userId = req.userId!;
    
    const tour = await TourService.updateTour(id, data, userId);
    
    log.info('Tour updated via API', { tourId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, { tour }, 'Tour updated successfully');
  });

  /**
   * Delete tour
   * DELETE /api/tours/:id
   */
  static deleteTour = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;
    
    await TourService.deleteTour(id, userId);
    
    log.info('Tour deleted via API', { tourId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, null, 'Tour deleted successfully');
  });

  /**
   * Update tour status
   * PATCH /api/tours/:id/status
   */
  static updateTourStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateTourStatusInput = req.body;
    const userId = req.userId!;
    
    const tour = await TourService.updateTourStatus(id, data, userId);
    
    log.info('Tour status updated via API', { 
      tourId: id, 
      userId, 
      newStatus: data.status,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { tour }, 'Tour status updated successfully');
  });

  /**
   * Check tour availability
   * POST /api/tours/:id/availability
   */
  static checkAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: CheckAvailabilityInput = req.body;
    
    const availability = await TourService.checkAvailability(id, data);
    
    return ResponseUtil.success(res, availability, 'Availability checked successfully');
  });

  /**
   * Get featured tours
   * GET /api/tours/featured
   */
  static getFeaturedTours = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;
    
    const tours = await TourService.getFeaturedTours(limit);
    
    return ResponseUtil.success(res, { tours }, 'Featured tours retrieved successfully');
  });

  /**
   * Get tours by category
   * GET /api/tours/category/:category
   */
  static getToursByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const tours = await TourService.getToursByCategory(category, limit);
    
    return ResponseUtil.success(res, { tours }, `Tours in ${category} category retrieved successfully`);
  });

  /**
   * Search tours
   * GET /api/tours/search
   */
  static searchTours = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { q: query, ...filters } = req.query;
    
    if (!query || typeof query !== 'string') {
      return ResponseUtil.badRequest(res, 'Search query is required');
    }
    
    const tours = await TourService.searchTours(query, filters as any);
    
    return ResponseUtil.success(res, { tours, query }, 'Search completed successfully');
  });

  /**
   * Get tour statistics (for admin/analytics)
   * GET /api/tours/stats
   */
  static getTourStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    // This would typically require admin permissions
    const stats = {
      totalTours: await TourService.getTours({ limit: 1 }).then(r => r.pagination.total),
      publishedTours: await TourService.getTours({ status: 'PUBLISHED', limit: 1 }).then(r => r.pagination.total),
      draftTours: await TourService.getTours({ status: 'DRAFT', limit: 1 }).then(r => r.pagination.total),
      featuredTours: await TourService.getFeaturedTours(1000).then(tours => tours.length),
    };
    
    return ResponseUtil.success(res, stats, 'Tour statistics retrieved successfully');
  });

  /**
   * Get popular tours (most booked)
   * GET /api/tours/popular
   */
  static getPopularTours = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    
    // For now, return featured tours as popular
    // In a real implementation, you'd sort by booking count
    const tours = await TourService.getFeaturedTours(limit);
    
    return ResponseUtil.success(res, { tours }, 'Popular tours retrieved successfully');
  });

  /**
   * Get tour categories
   * GET /api/tours/categories
   */
  static getTourCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
    // This would typically come from a categories table or be computed
    const categories = [
      { name: 'Historical Tours', count: 0 },
      { name: 'Adventure Tours', count: 0 },
      { name: 'Cultural Tours', count: 0 },
      { name: 'Nature Tours', count: 0 },
      { name: 'City Tours', count: 0 },
      { name: 'Food Tours', count: 0 },
      { name: 'Photography Tours', count: 0 },
      { name: 'Religious Tours', count: 0 },
    ];
    
    // In a real implementation, you'd count tours per category
    return ResponseUtil.success(res, { categories }, 'Tour categories retrieved successfully');
  });
}