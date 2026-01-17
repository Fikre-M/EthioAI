import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ItineraryService } from '../services/itinerary.service';
import { ResponseUtil } from '../utils/response';
import { log } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';
import { 
  CreateItineraryInput, 
  UpdateItineraryInput, 
  ItineraryQueryInput,
  ShareItineraryInput,
  ItineraryStatsQueryInput,
  ItineraryRecommendationInput,
  ItineraryExportInput,
  ItineraryOptimizationInput
} from '../schemas/itinerary.schemas';

export class ItineraryController {
  /**
   * Create itinerary
   * POST /api/itinerary
   */
  static createItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CreateItineraryInput = req.body;
    const userId = req.userId!;
    
    const itinerary = await ItineraryService.createItinerary(data, userId);
    
    log.info('Itinerary created via API', { 
      itineraryId: itinerary.id, 
      userId, 
      title: itinerary.title,
      ip: req.ip 
    });

    return ResponseUtil.created(res, { itinerary }, 'Itinerary created successfully');
  });

  /**
   * Get itineraries with filtering and pagination
   * GET /api/itinerary
   */
  static getItineraries = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: ItineraryQueryInput = req.query as any;
    const userId = req.userId;
    
    const result = await ItineraryService.getItineraries(query, userId);
    
    return ResponseUtil.paginated(
      res, 
      result.itineraries, 
      result.pagination, 
      'Itineraries retrieved successfully'
    );
  });

  /**
   * Get itinerary by ID or share token
   * GET /api/itinerary/:id
   */
  static getItineraryById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    
    const itinerary = await ItineraryService.getItineraryById(id, userId);
    
    return ResponseUtil.success(res, { itinerary }, 'Itinerary retrieved successfully');
  });

  /**
   * Update itinerary
   * PUT /api/itinerary/:id
   */
  static updateItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateItineraryInput = req.body;
    const userId = req.userId!;
    
    const itinerary = await ItineraryService.updateItinerary(id, data, userId);
    
    log.info('Itinerary updated via API', { itineraryId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, { itinerary }, 'Itinerary updated successfully');
  });

  /**
   * Delete itinerary
   * DELETE /api/itinerary/:id
   */
  static deleteItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;
    
    await ItineraryService.deleteItinerary(id, userId);
    
    log.info('Itinerary deleted via API', { itineraryId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, null, 'Itinerary deleted successfully');
  });

  /**
   * Share itinerary
   * POST /api/itinerary/:id/share
   */
  static shareItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: ShareItineraryInput = req.body;
    const userId = req.userId!;
    
    const shareInfo = await ItineraryService.shareItinerary(id, data, userId);
    
    log.info('Itinerary shared via API', { 
      itineraryId: id, 
      userId, 
      shareToken: shareInfo.shareToken,
      ip: req.ip 
    });

    return ResponseUtil.success(res, shareInfo, 'Itinerary shared successfully');
  });

  /**
   * Get itinerary recommendations
   * POST /api/itinerary/recommendations
   */
  static getRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: ItineraryRecommendationInput = req.body;
    
    const itineraries = await ItineraryService.getRecommendations(data);
    
    return ResponseUtil.success(res, { itineraries }, 'Itinerary recommendations retrieved successfully');
  });

  /**
   * Optimize itinerary
   * POST /api/itinerary/:id/optimize
   */
  static optimizeItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: ItineraryOptimizationInput = req.body;
    const userId = req.userId!;
    
    const itinerary = await ItineraryService.optimizeItinerary(id, data, userId);
    
    log.info('Itinerary optimized via API', { 
      itineraryId: id, 
      userId, 
      optimizeFor: data.optimizeFor,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { itinerary }, 'Itinerary optimized successfully');
  });

  /**
   * Export itinerary
   * GET /api/itinerary/:id/export
   */
  static exportItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: ItineraryExportInput = req.query as any;
    const userId = req.userId;
    
    const exportData = await ItineraryService.exportItinerary(id, data, userId);
    
    // Set appropriate headers for download
    const format = data.format || 'json';
    const filename = `itinerary-${id}-${new Date().toISOString().split('T')[0]}.${format}`;
    
    let contentType = 'application/json';
    if (format === 'csv') contentType = 'text/csv';
    else if (format === 'pdf') contentType = 'application/pdf';
    else if (format === 'ical') contentType = 'text/calendar';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    log.info('Itinerary exported via API', { 
      itineraryId: id, 
      userId, 
      format,
      ip: req.ip 
    });

    return res.send(exportData);
  });

  /**
   * Get user's itineraries
   * GET /api/itinerary/my-itineraries
   */
  static getMyItineraries = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const query: ItineraryQueryInput = req.query as any;
    
    // Force filter to user's itineraries only
    const userQuery = { ...query };
    
    const result = await ItineraryService.getItineraries(userQuery, userId);
    
    // Filter to only user's own itineraries
    const userItineraries = result.itineraries.filter(itinerary => itinerary.userId === userId);
    
    return ResponseUtil.paginated(
      res, 
      userItineraries, 
      { ...result.pagination, total: userItineraries.length }, 
      'Your itineraries retrieved successfully'
    );
  });

  /**
   * Get public itineraries
   * GET /api/itinerary/public
   */
  static getPublicItineraries = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: ItineraryQueryInput = { 
      ...req.query as any,
      isPublic: true 
    };
    
    const result = await ItineraryService.getItineraries(query);
    
    return ResponseUtil.paginated(
      res, 
      result.itineraries, 
      result.pagination, 
      'Public itineraries retrieved successfully'
    );
  });

  /**
   * Get shared itinerary by token
   * GET /api/itinerary/shared/:token
   */
  static getSharedItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { token } = req.params;
    
    const itinerary = await ItineraryService.getItineraryById(token);
    
    return ResponseUtil.success(res, { itinerary }, 'Shared itinerary retrieved successfully');
  });

  /**
   * Copy/clone itinerary
   * POST /api/itinerary/:id/copy
   */
  static copyItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.userId!;
    
    // Get the original itinerary
    const originalItinerary = await ItineraryService.getItineraryById(id, userId);
    
    // Create a copy
    const copyData: CreateItineraryInput = {
      title: title || `Copy of ${originalItinerary.title}`,
      description: originalItinerary.description || undefined,
      startDate: originalItinerary.startDate.toISOString().split('T')[0],
      endDate: originalItinerary.endDate.toISOString().split('T')[0],
      destinations: originalItinerary.destinations as any,
      activities: originalItinerary.activities as any,
      budget: originalItinerary.budget || undefined,
      isPublic: false, // Copies are private by default
    };
    
    const copiedItinerary = await ItineraryService.createItinerary(copyData, userId);
    
    log.info('Itinerary copied via API', { 
      originalId: id,
      copiedId: copiedItinerary.id,
      userId,
      ip: req.ip 
    });

    return ResponseUtil.created(res, { itinerary: copiedItinerary }, 'Itinerary copied successfully');
  });

  /**
   * Get itinerary statistics (admin only)
   * GET /api/itinerary/stats
   */
  static getItineraryStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: ItineraryStatsQueryInput = req.query as any;
    
    const stats = await ItineraryService.getItineraryStats(query);
    
    return ResponseUtil.success(res, stats, 'Itinerary statistics retrieved successfully');
  });

  /**
   * Get popular destinations from itineraries
   * GET /api/itinerary/popular-destinations
   */
  static getPopularDestinations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Get public itineraries to analyze destinations
    const result = await ItineraryService.getItineraries({ 
      isPublic: true, 
      limit: 100 
    });
    
    // Count destination occurrences
    const destinationCounts: { [name: string]: { count: number; destination: any } } = {};
    
    result.itineraries.forEach(itinerary => {
      const destinations = (itinerary.destinations as any[]) || [];
      destinations.forEach(dest => {
        if (dest.name) {
          if (!destinationCounts[dest.name]) {
            destinationCounts[dest.name] = { count: 0, destination: dest };
          }
          destinationCounts[dest.name].count++;
        }
      });
    });
    
    // Sort by popularity and return top destinations
    const popularDestinations = Object.values(destinationCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => ({
        ...item.destination,
        popularity: item.count,
      }));
    
    return ResponseUtil.success(res, { destinations: popularDestinations }, 'Popular destinations retrieved successfully');
  });

  /**
   * Search itineraries
   * GET /api/itinerary/search
   */
  static searchItineraries = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { q: search, ...filters } = req.query;
    
    if (!search || typeof search !== 'string') {
      return ResponseUtil.badRequest(res, 'Search query is required');
    }
    
    const query: ItineraryQueryInput = {
      search,
      isPublic: true, // Only search public itineraries
      ...filters as any,
    };
    
    const result = await ItineraryService.getItineraries(query);
    
    return ResponseUtil.paginated(
      res, 
      result.itineraries, 
      result.pagination, 
      'Itinerary search completed successfully'
    );
  });

  /**
   * Get itinerary overview/summary
   * GET /api/itinerary/overview
   */
  static getItineraryOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    
    // Get various itinerary data for overview
    const [
      publicItineraries,
      popularDestinations,
      stats,
    ] = await Promise.all([
      ItineraryService.getItineraries({ isPublic: true, limit: 6 }),
      ItineraryService.getItineraries({ isPublic: true, limit: 50 }).then(result => {
        // Extract popular destinations
        const destinationCounts: { [name: string]: number } = {};
        result.itineraries.forEach(itinerary => {
          const destinations = (itinerary.destinations as any[]) || [];
          destinations.forEach(dest => {
            if (dest.name) {
              destinationCounts[dest.name] = (destinationCounts[dest.name] || 0) + 1;
            }
          });
        });
        
        return Object.entries(destinationCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([name, count]) => ({ name, count }));
      }),
      ItineraryService.getItineraryStats(),
    ]);
    
    const overview = {
      featuredItineraries: publicItineraries.itineraries,
      popularDestinations,
      stats,
      totalPublicItineraries: publicItineraries.pagination.total,
    };
    
    return ResponseUtil.success(res, overview, 'Itinerary overview retrieved successfully');
  });
}