import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CulturalService } from '../services/cultural.service';
import { ResponseUtil } from '../utils/response';
import { log } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';
import { 
  CreateCulturalContentInput, 
  UpdateCulturalContentInput, 
  CulturalContentQueryInput,
  UpdateContentStatusInput,
  CulturalContentStatsQueryInput,
  ContentRecommendationInput,
  ContentInteractionInput,
  ContentSearchInput,
  ContentBulkOperationInput
} from '../schemas/cultural.schemas';

export class CulturalController {
  /**
   * Create cultural content
   * POST /api/cultural/content
   */
  static createContent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CreateCulturalContentInput = req.body;
    const userId = req.userId;
    
    const content = await CulturalService.createContent(data, userId);
    
    log.info('Cultural content created via API', { 
      contentId: content.id, 
      userId, 
      ip: req.ip 
    });

    return ResponseUtil.created(res, { content }, 'Cultural content created successfully');
  });

  /**
   * Get cultural content with filtering and pagination
   * GET /api/cultural/content
   */
  static getContent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: CulturalContentQueryInput = req.query as any;
    
    const result = await CulturalService.getContent(query);
    
    return ResponseUtil.paginated(
      res, 
      result.content, 
      result.pagination, 
      'Cultural content retrieved successfully'
    );
  });

  /**
   * Get content by ID or slug
   * GET /api/cultural/content/:id
   */
  static getContentById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const content = await CulturalService.getContentById(id);
    
    // Track view interaction if user is authenticated
    if (req.userId) {
      await CulturalService.trackInteraction({
        contentId: content.id,
        interactionType: 'view',
      }, req.userId);
    }
    
    return ResponseUtil.success(res, { content }, 'Cultural content retrieved successfully');
  });

  /**
   * Update cultural content
   * PUT /api/cultural/content/:id
   */
  static updateContent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateCulturalContentInput = req.body;
    const userId = req.userId;
    
    const content = await CulturalService.updateContent(id, data, userId);
    
    log.info('Cultural content updated via API', { contentId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, { content }, 'Cultural content updated successfully');
  });

  /**
   * Delete cultural content
   * DELETE /api/cultural/content/:id
   */
  static deleteContent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    
    await CulturalService.deleteContent(id, userId);
    
    log.info('Cultural content deleted via API', { contentId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, null, 'Cultural content deleted successfully');
  });

  /**
   * Update content status
   * PATCH /api/cultural/content/:id/status
   */
  static updateContentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateContentStatusInput = req.body;
    const userId = req.userId;
    
    const content = await CulturalService.updateContentStatus(id, data, userId);
    
    log.info('Cultural content status updated via API', { 
      contentId: id, 
      userId, 
      newStatus: data.status,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { content }, 'Content status updated successfully');
  });

  /**
   * Get featured content
   * GET /api/cultural/featured
   */
  static getFeaturedContent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 8;
    
    const content = await CulturalService.getFeaturedContent(limit);
    
    return ResponseUtil.success(res, { content }, 'Featured content retrieved successfully');
  });

  /**
   * Get content by type
   * GET /api/cultural/type/:type
   */
  static getContentByType = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { type } = req.params;
    const limit = parseInt(req.query.limit as string) || 12;
    
    const content = await CulturalService.getContentByType(type, limit);
    
    return ResponseUtil.success(res, { content }, `${type} content retrieved successfully`);
  });

  /**
   * Get content by category
   * GET /api/cultural/category/:category
   */
  static getContentByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category } = req.params;
    const limit = parseInt(req.query.limit as string) || 12;
    
    const content = await CulturalService.getContentByCategory(category, limit);
    
    return ResponseUtil.success(res, { content }, `${category} content retrieved successfully`);
  });

  /**
   * Search cultural content
   * GET /api/cultural/search
   */
  static searchContent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { q: query, ...filters } = req.query;
    
    if (!query || typeof query !== 'string') {
      return ResponseUtil.badRequest(res, 'Search query is required');
    }
    
    const content = await CulturalService.searchContent(query, filters as any);
    
    return ResponseUtil.success(res, { content, query }, 'Search completed successfully');
  });

  /**
   * Get content recommendations
   * POST /api/cultural/recommendations
   */
  static getRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: ContentRecommendationInput = req.body;
    
    const content = await CulturalService.getRecommendations(data);
    
    return ResponseUtil.success(res, { content }, 'Recommendations retrieved successfully');
  });

  /**
   * Track content interaction
   * POST /api/cultural/content/:id/interact
   */
  static trackInteraction = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id: contentId } = req.params;
    const { interactionType, metadata } = req.body;
    const userId = req.userId;
    
    await CulturalService.trackInteraction({
      contentId,
      interactionType,
      metadata,
    }, userId);
    
    return ResponseUtil.success(res, null, 'Interaction tracked successfully');
  });

  /**
   * Get popular content
   * GET /api/cultural/popular
   */
  static getPopularContent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const content = await CulturalService.getPopularContent(limit);
    
    return ResponseUtil.success(res, { content }, 'Popular content retrieved successfully');
  });

  /**
   * Get recent content
   * GET /api/cultural/recent
   */
  static getRecentContent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const content = await CulturalService.getRecentContent(limit);
    
    return ResponseUtil.success(res, { content }, 'Recent content retrieved successfully');
  });

  /**
   * Get content categories
   * GET /api/cultural/categories
   */
  static getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
    const categories = await CulturalService.getCategories();
    
    return ResponseUtil.success(res, { categories }, 'Categories retrieved successfully');
  });

  /**
   * Get popular tags
   * GET /api/cultural/tags
   */
  static getPopularTags = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    
    const tags = await CulturalService.getPopularTags(limit);
    
    return ResponseUtil.success(res, { tags }, 'Popular tags retrieved successfully');
  });

  /**
   * Get content statistics (admin only)
   * GET /api/cultural/stats
   */
  static getContentStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: CulturalContentStatsQueryInput = req.query as any;
    
    const stats = await CulturalService.getContentStats(query);
    
    return ResponseUtil.success(res, stats, 'Content statistics retrieved successfully');
  });

  /**
   * Bulk operations on content (admin only)
   * POST /api/cultural/bulk
   */
  static bulkOperation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: ContentBulkOperationInput = req.body;
    const userId = req.userId;
    
    const result = await CulturalService.bulkOperation(data, userId);
    
    log.info('Bulk content operation completed via API', { 
      userId, 
      operation: data.operation,
      success: result.success,
      failed: result.failed,
      ip: req.ip 
    });

    return ResponseUtil.success(res, result, 'Bulk operation completed');
  });

  /**
   * Get content types with counts
   * GET /api/cultural/types
   */
  static getContentTypes = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Get content statistics to show type counts
    const stats = await CulturalService.getContentStats();
    
    const types = [
      { type: 'article', name: 'Articles', count: stats.contentByType.article || 0 },
      { type: 'recipe', name: 'Recipes', count: stats.contentByType.recipe || 0 },
      { type: 'artifact', name: 'Artifacts', count: stats.contentByType.artifact || 0 },
      { type: 'tradition', name: 'Traditions', count: stats.contentByType.tradition || 0 },
      { type: 'festival', name: 'Festivals', count: stats.contentByType.festival || 0 },
      { type: 'history', name: 'History', count: stats.contentByType.history || 0 },
      { type: 'language', name: 'Language', count: stats.contentByType.language || 0 },
      { type: 'music', name: 'Music', count: stats.contentByType.music || 0 },
      { type: 'dance', name: 'Dance', count: stats.contentByType.dance || 0 },
      { type: 'craft', name: 'Crafts', count: stats.contentByType.craft || 0 },
    ];
    
    return ResponseUtil.success(res, { types }, 'Content types retrieved successfully');
  });

  /**
   * Get content by multiple filters (advanced search)
   * POST /api/cultural/advanced-search
   */
  static advancedSearch = asyncHandler(async (req: AuthRequest, res: Response) => {
    const filters: CulturalContentQueryInput = req.body;
    
    const result = await CulturalService.getContent(filters);
    
    return ResponseUtil.paginated(
      res, 
      result.content, 
      result.pagination, 
      'Advanced search completed successfully'
    );
  });

  /**
   * Get content summary/overview
   * GET /api/cultural/overview
   */
  static getContentOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [
      featuredContent,
      recentContent,
      popularContent,
      categories,
      stats,
    ] = await Promise.all([
      CulturalService.getFeaturedContent(4),
      CulturalService.getRecentContent(6),
      CulturalService.getPopularContent(6),
      CulturalService.getCategories(),
      CulturalService.getContentStats(),
    ]);

    const overview = {
      featured: featuredContent,
      recent: recentContent,
      popular: popularContent,
      categories: categories.slice(0, 8), // Top 8 categories
      stats: {
        totalContent: stats.totalContent,
        publishedContent: stats.publishedContent,
        contentByType: stats.contentByType,
        contentByLanguage: stats.contentByLanguage,
      },
    };
    
    return ResponseUtil.success(res, overview, 'Content overview retrieved successfully');
  });
}