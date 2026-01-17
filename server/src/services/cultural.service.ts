import { PrismaClient, CulturalContent, ContentStatus, Prisma } from '@prisma/client';
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
import { 
  NotFoundError, 
  ValidationError, 
  ForbiddenError 
} from '../middlewares/error.middleware';
import { calculatePagination, PaginationMeta } from '../utils/response';
import { log } from '../utils/logger';

const prisma = new PrismaClient();

export class CulturalService {
  /**
   * Generate slug from title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /**
   * Create cultural content
   */
  static async createContent(
    data: CreateCulturalContentInput, 
    userId?: string
  ): Promise<CulturalContent> {
    // Generate slug
    const slug = this.generateSlug(data.title);

    // Check if slug already exists
    const existingContent = await prisma.culturalContent.findUnique({
      where: { slug },
    });

    if (existingContent) {
      throw new ValidationError('Content with similar title already exists');
    }

    // Create content
    const content = await prisma.culturalContent.create({
      data: {
        ...data,
        slug,
        images: data.images || [],
        tags: data.tags || [],
        status: 'DRAFT',
        authorId: userId,
      },
    });

    log.info('Cultural content created', {
      contentId: content.id,
      userId,
      title: content.title,
      type: content.type,
      category: content.category,
    });

    return content;
  }

  /**
   * Get cultural content with filtering and pagination
   */
  static async getContent(query: CulturalContentQueryInput): Promise<{
    content: CulturalContent[];
    pagination: PaginationMeta;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      type,
      category,
      language,
      status,
      featured,
      startDate,
      endDate,
      search,
      tags,
      authorName,
    } = query;

    // Build where clause
    const where: Prisma.CulturalContentWhereInput = {
      // Only show published content for public queries (unless status is specified)
      status: status || 'PUBLISHED',
    };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = { contains: category };
    }

    if (language) {
      where.language = language;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (authorName) {
      where.authorName = { contains: authorName };
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } },
        { category: { contains: search } },
        { authorName: { contains: search } },
      ];
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      where.tags = {
        hasSome: tagArray,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build order by clause
    const orderBy: Prisma.CulturalContentOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    // Execute queries
    const [content, total] = await Promise.all([
      prisma.culturalContent.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.culturalContent.count({ where }),
    ]);

    const pagination = calculatePagination(page, limit, total);

    return {
      content,
      pagination,
    };
  }

  /**
   * Get content by ID or slug
   */
  static async getContentById(identifier: string): Promise<CulturalContent> {
    // Check if identifier is UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    
    const content = await prisma.culturalContent.findUnique({
      where: isUuid ? { id: identifier } : { slug: identifier },
    });

    if (!content) {
      throw new NotFoundError('Cultural content not found');
    }

    return content;
  }

  /**
   * Update cultural content
   */
  static async updateContent(
    id: string, 
    data: UpdateCulturalContentInput, 
    userId?: string
  ): Promise<CulturalContent> {
    // Check if content exists
    const existingContent = await prisma.culturalContent.findUnique({
      where: { id },
    });

    if (!existingContent) {
      throw new NotFoundError('Cultural content not found');
    }

    // Verify ownership (if userId provided)
    if (userId && existingContent.authorId && existingContent.authorId !== userId) {
      throw new ForbiddenError('You do not have permission to update this content');
    }

    // Generate new slug if title is being updated
    let updateData: any = { ...data };
    if (data.title) {
      const slug = this.generateSlug(data.title);

      // Check if new slug conflicts with existing content (excluding current content)
      const conflictingContent = await prisma.culturalContent.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (conflictingContent) {
        throw new ValidationError('Content with similar title already exists');
      }

      updateData.slug = slug;
    }

    const content = await prisma.culturalContent.update({
      where: { id },
      data: updateData,
    });

    log.info('Cultural content updated', { 
      contentId: id, 
      userId, 
      title: content.title 
    });

    return content;
  }

  /**
   * Delete cultural content
   */
  static async deleteContent(id: string, userId?: string): Promise<void> {
    // Check if content exists
    const content = await prisma.culturalContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundError('Cultural content not found');
    }

    // Verify ownership (if userId provided)
    if (userId && content.authorId && content.authorId !== userId) {
      throw new ForbiddenError('You do not have permission to delete this content');
    }

    await prisma.culturalContent.delete({
      where: { id },
    });

    log.info('Cultural content deleted', { 
      contentId: id, 
      userId, 
      title: content.title 
    });
  }

  /**
   * Update content status
   */
  static async updateContentStatus(
    id: string, 
    data: UpdateContentStatusInput, 
    userId?: string
  ): Promise<CulturalContent> {
    const content = await prisma.culturalContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundError('Cultural content not found');
    }

    // Verify ownership (if userId provided)
    if (userId && content.authorId && content.authorId !== userId) {
      throw new ForbiddenError('You do not have permission to update this content');
    }

    const updatedContent = await prisma.culturalContent.update({
      where: { id },
      data: { status: data.status },
    });

    log.info('Cultural content status updated', {
      contentId: id,
      userId,
      oldStatus: content.status,
      newStatus: data.status,
      reason: data.reason,
    });

    return updatedContent;
  }

  /**
   * Get featured content
   */
  static async getFeaturedContent(limit: number = 8): Promise<CulturalContent[]> {
    return prisma.culturalContent.findMany({
      where: {
        featured: true,
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get content by type
   */
  static async getContentByType(
    type: string, 
    limit: number = 12
  ): Promise<CulturalContent[]> {
    return prisma.culturalContent.findMany({
      where: {
        type,
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get content by category
   */
  static async getContentByCategory(
    category: string, 
    limit: number = 12
  ): Promise<CulturalContent[]> {
    return prisma.culturalContent.findMany({
      where: {
        category: { contains: category },
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Search content
   */
  static async searchContent(
    query: string, 
    filters?: Partial<CulturalContentQueryInput>
  ): Promise<CulturalContent[]> {
    const searchQuery: CulturalContentQueryInput = {
      search: query,
      ...filters,
      limit: filters?.limit || 20,
    };

    const result = await this.getContent(searchQuery);
    return result.content;
  }

  /**
   * Get content recommendations
   */
  static async getRecommendations(
    data: ContentRecommendationInput
  ): Promise<CulturalContent[]> {
    const { contentId, interests, language, type, limit = 5 } = data;

    let where: Prisma.CulturalContentWhereInput = {
      status: 'PUBLISHED',
    };

    // Exclude current content if provided
    if (contentId) {
      where.id = { not: contentId };
    }

    if (language) {
      where.language = language;
    }

    if (type) {
      where.type = type;
    }

    // If interests provided, search in tags and content
    if (interests && interests.length > 0) {
      where.OR = [
        { tags: { hasSome: interests } },
        { content: { contains: interests.join(' ') } },
        { category: { in: interests } },
      ];
    }

    return prisma.culturalContent.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });
  }

  /**
   * Track content interaction
   */
  static async trackInteraction(
    data: ContentInteractionInput, 
    userId?: string
  ): Promise<void> {
    // For now, just log the interaction
    // In a real implementation, you might store this in a separate table
    log.info('Content interaction tracked', {
      contentId: data.contentId,
      userId,
      interactionType: data.interactionType,
      metadata: data.metadata,
    });

    // You could implement view counting, like tracking, etc. here
    if (data.interactionType === 'view') {
      // Increment view count in metadata or separate table
      // This is a simplified implementation
    }
  }

  /**
   * Get content statistics
   */
  static async getContentStats(query: CulturalContentStatsQueryInput = {}): Promise<any> {
    const where: Prisma.CulturalContentWhereInput = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.category) {
      where.category = { contains: query.category };
    }

    if (query.language) {
      where.language = query.language;
    }

    if (query.authorName) {
      where.authorName = { contains: query.authorName };
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = query.startDate;
      if (query.endDate) where.createdAt.lte = query.endDate;
    }

    const [
      totalContent,
      publishedContent,
      draftContent,
      archivedContent,
      featuredContent,
      contentByType,
      contentByLanguage,
    ] = await Promise.all([
      prisma.culturalContent.count({ where }),
      prisma.culturalContent.count({ where: { ...where, status: 'PUBLISHED' } }),
      prisma.culturalContent.count({ where: { ...where, status: 'DRAFT' } }),
      prisma.culturalContent.count({ where: { ...where, status: 'ARCHIVED' } }),
      prisma.culturalContent.count({ where: { ...where, featured: true } }),
      prisma.culturalContent.groupBy({
        by: ['type'],
        where,
        _count: { id: true },
      }),
      prisma.culturalContent.groupBy({
        by: ['language'],
        where,
        _count: { id: true },
      }),
    ]);

    return {
      totalContent,
      publishedContent,
      draftContent,
      archivedContent,
      featuredContent,
      contentByType: contentByType.reduce((acc, item) => {
        acc[item.type] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      contentByLanguage: contentByLanguage.reduce((acc, item) => {
        acc[item.language] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  /**
   * Get popular content (most viewed/interacted)
   */
  static async getPopularContent(limit: number = 10): Promise<CulturalContent[]> {
    // For now, return featured content as popular
    // In a real implementation, you'd sort by view count or interaction metrics
    return this.getFeaturedContent(limit);
  }

  /**
   * Get recent content
   */
  static async getRecentContent(limit: number = 10): Promise<CulturalContent[]> {
    return prisma.culturalContent.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get content categories (unique categories)
   */
  static async getCategories(): Promise<Array<{ category: string; count: number }>> {
    const categories = await prisma.culturalContent.groupBy({
      by: ['category'],
      where: {
        status: 'PUBLISHED',
      },
      _count: { id: true },
      orderBy: {
        _count: { id: 'desc' },
      },
    });

    return categories.map(cat => ({
      category: cat.category,
      count: cat._count.id,
    }));
  }

  /**
   * Get content tags (popular tags)
   */
  static async getPopularTags(limit: number = 20): Promise<Array<{ tag: string; count: number }>> {
    // This is a simplified implementation
    // In a real-world scenario, you'd use more sophisticated tag analysis
    const content = await prisma.culturalContent.findMany({
      where: { status: 'PUBLISHED' },
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    
    content.forEach(item => {
      const tags = item.tags as string[];
      tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));
  }

  /**
   * Bulk operations on content
   */
  static async bulkOperation(
    data: ContentBulkOperationInput, 
    userId?: string
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const { contentIds, operation, reason } = data;
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const contentId of contentIds) {
      try {
        const content = await prisma.culturalContent.findUnique({
          where: { id: contentId },
        });

        if (!content) {
          errors.push(`Content ${contentId} not found`);
          failed++;
          continue;
        }

        // Verify ownership if userId provided
        if (userId && content.authorId && content.authorId !== userId) {
          errors.push(`No permission to modify content ${contentId}`);
          failed++;
          continue;
        }

        // Perform operation
        switch (operation) {
          case 'publish':
            await prisma.culturalContent.update({
              where: { id: contentId },
              data: { status: 'PUBLISHED' },
            });
            break;
          case 'archive':
            await prisma.culturalContent.update({
              where: { id: contentId },
              data: { status: 'ARCHIVED' },
            });
            break;
          case 'delete':
            await prisma.culturalContent.delete({
              where: { id: contentId },
            });
            break;
          case 'feature':
            await prisma.culturalContent.update({
              where: { id: contentId },
              data: { featured: true },
            });
            break;
          case 'unfeature':
            await prisma.culturalContent.update({
              where: { id: contentId },
              data: { featured: false },
            });
            break;
        }

        success++;

      } catch (error: any) {
        errors.push(`Error processing content ${contentId}: ${error.message}`);
        failed++;
      }
    }

    log.info('Bulk content operation completed', {
      userId,
      operation,
      success,
      failed,
      reason,
    });

    return { success, failed, errors };
  }
}