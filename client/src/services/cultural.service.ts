import { api } from '@api/axios.config'

// Types
export interface CulturalContent {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  images: string[]
  type: 'article' | 'recipe' | 'artifact' | 'tradition' | 'festival' | 'history' | 'language' | 'music' | 'dance' | 'craft'
  category: string
  tags: string[]
  language: 'en' | 'am' | 'om'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured: boolean
  metaTitle?: string
  metaDescription?: string
  authorId?: string
  authorName?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCulturalContentRequest {
  title: string
  content: string
  excerpt?: string
  images?: string[]
  type?: 'article' | 'recipe' | 'artifact' | 'tradition' | 'festival' | 'history' | 'language' | 'music' | 'dance' | 'craft'
  category: string
  tags?: string[]
  language?: 'en' | 'am' | 'om'
  featured?: boolean
  metaTitle?: string
  metaDescription?: string
  authorName?: string
}

export interface UpdateCulturalContentRequest extends Partial<CreateCulturalContentRequest> {}

export interface CulturalContentQuery {
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'type' | 'category'
  sortOrder?: 'asc' | 'desc'
  type?: 'article' | 'recipe' | 'artifact' | 'tradition' | 'festival' | 'history' | 'language' | 'music' | 'dance' | 'craft'
  category?: string
  language?: 'en' | 'am' | 'om'
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured?: boolean
  startDate?: string
  endDate?: string
  search?: string
  tags?: string
  authorName?: string
}

export interface ContentRecommendationRequest {
  contentId?: string
  interests?: string[]
  language?: 'en' | 'am' | 'om'
  type?: 'article' | 'recipe' | 'artifact' | 'tradition' | 'festival' | 'history' | 'language' | 'music' | 'dance' | 'craft'
  limit?: number
}

export interface ContentInteractionRequest {
  interactionType: 'view' | 'like' | 'share' | 'bookmark'
  metadata?: Record<string, any>
}

export interface ContentOverview {
  featured: CulturalContent[]
  recent: CulturalContent[]
  popular: CulturalContent[]
  categories: Array<{ category: string; count: number }>
  stats: {
    totalContent: number
    publishedContent: number
    contentByType: Record<string, number>
    contentByLanguage: Record<string, number>
  }
}

export interface ContentCategory {
  category: string
  count: number
}

export interface ContentType {
  type: string
  name: string
  count: number
}

export interface ContentTag {
  tag: string
  count: number
}

// Cultural Service
export const culturalService = {
  /**
   * Get content overview (featured, recent, popular)
   * @returns Content overview with featured, recent, and popular content
   */
  getOverview: async (): Promise<ContentOverview> => {
    try {
      const response = await api.get<ContentOverview>('/cultural/overview')
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load content overview.'
      )
    }
  },

  /**
   * Get all cultural content with filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated cultural content
   */
  getContent: async (params?: CulturalContentQuery): Promise<{
    content: CulturalContent[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> => {
    try {
      const response = await api.get('/cultural/content', { params })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load cultural content.'
      )
    }
  },

  /**
   * Get specific cultural content by ID or slug
   * @param id - Content ID or slug
   * @returns Cultural content details
   */
  getContentById: async (id: string): Promise<CulturalContent> => {
    try {
      const response = await api.get<{ content: CulturalContent }>(`/cultural/content/${id}`)
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load cultural content.'
      )
    }
  },

  /**
   * Create new cultural content
   * @param data - Content creation data
   * @returns Created cultural content
   */
  createContent: async (data: CreateCulturalContentRequest): Promise<CulturalContent> => {
    try {
      const response = await api.post<{ content: CulturalContent }>('/cultural/content', data)
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to create cultural content.'
      )
    }
  },

  /**
   * Update cultural content
   * @param id - Content ID
   * @param data - Content update data
   * @returns Updated cultural content
   */
  updateContent: async (id: string, data: UpdateCulturalContentRequest): Promise<CulturalContent> => {
    try {
      const response = await api.put<{ content: CulturalContent }>(`/cultural/content/${id}`, data)
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update cultural content.'
      )
    }
  },

  /**
   * Delete cultural content
   * @param id - Content ID
   */
  deleteContent: async (id: string): Promise<void> => {
    try {
      await api.delete(`/cultural/content/${id}`)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete cultural content.'
      )
    }
  },

  /**
   * Update content status
   * @param id - Content ID
   * @param status - New status
   * @param reason - Optional reason for status change
   * @returns Updated cultural content
   */
  updateContentStatus: async (
    id: string, 
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED', 
    reason?: string
  ): Promise<CulturalContent> => {
    try {
      const response = await api.patch<{ content: CulturalContent }>(
        `/cultural/content/${id}/status`, 
        { status, reason }
      )
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update content status.'
      )
    }
  },

  /**
   * Get featured cultural content
   * @param limit - Number of featured items to retrieve
   * @returns Featured cultural content
   */
  getFeaturedContent: async (limit: number = 8): Promise<CulturalContent[]> => {
    try {
      const response = await api.get<{ content: CulturalContent[] }>('/cultural/featured', {
        params: { limit },
      })
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load featured content.'
      )
    }
  },

  /**
   * Get popular cultural content
   * @param limit - Number of popular items to retrieve
   * @returns Popular cultural content
   */
  getPopularContent: async (limit: number = 10): Promise<CulturalContent[]> => {
    try {
      const response = await api.get<{ content: CulturalContent[] }>('/cultural/popular', {
        params: { limit },
      })
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load popular content.'
      )
    }
  },

  /**
   * Get recent cultural content
   * @param limit - Number of recent items to retrieve
   * @returns Recent cultural content
   */
  getRecentContent: async (limit: number = 10): Promise<CulturalContent[]> => {
    try {
      const response = await api.get<{ content: CulturalContent[] }>('/cultural/recent', {
        params: { limit },
      })
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load recent content.'
      )
    }
  },

  /**
   * Search cultural content
   * @param query - Search query
   * @param filters - Additional search filters
   * @returns Search results
   */
  searchContent: async (
    query: string, 
    filters?: {
      type?: string
      category?: string
      language?: string
      limit?: number
    }
  ): Promise<CulturalContent[]> => {
    try {
      const response = await api.get<{ content: CulturalContent[] }>('/cultural/search', {
        params: { q: query, ...filters },
      })
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to search cultural content.'
      )
    }
  },

  /**
   * Get content by type
   * @param type - Content type
   * @param limit - Number of items to retrieve
   * @returns Content of specified type
   */
  getContentByType: async (
    type: string, 
    limit: number = 12
  ): Promise<CulturalContent[]> => {
    try {
      const response = await api.get<{ content: CulturalContent[] }>(`/cultural/type/${type}`, {
        params: { limit },
      })
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to load ${type} content.`
      )
    }
  },

  /**
   * Get content by category
   * @param category - Content category
   * @param limit - Number of items to retrieve
   * @returns Content in specified category
   */
  getContentByCategory: async (
    category: string, 
    limit: number = 12
  ): Promise<CulturalContent[]> => {
    try {
      const response = await api.get<{ content: CulturalContent[] }>(`/cultural/category/${category}`, {
        params: { limit },
      })
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to load ${category} content.`
      )
    }
  },

  /**
   * Get content recommendations
   * @param data - Recommendation parameters
   * @returns Recommended content
   */
  getRecommendations: async (data: ContentRecommendationRequest): Promise<CulturalContent[]> => {
    try {
      const response = await api.post<{ content: CulturalContent[] }>('/cultural/recommendations', data)
      return response.data.content
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load content recommendations.'
      )
    }
  },

  /**
   * Track content interaction
   * @param contentId - Content ID
   * @param data - Interaction data
   */
  trackInteraction: async (contentId: string, data: ContentInteractionRequest): Promise<void> => {
    try {
      await api.post(`/cultural/content/${contentId}/interact`, data)
    } catch (error: any) {
      // Silent fail for interactions - don't interrupt user experience
      console.error('Failed to track interaction:', error)
    }
  },

  /**
   * Get content categories
   * @returns List of content categories with counts
   */
  getCategories: async (): Promise<ContentCategory[]> => {
    try {
      const response = await api.get<{ categories: ContentCategory[] }>('/cultural/categories')
      return response.data.categories
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load content categories.'
      )
    }
  },

  /**
   * Get content types with counts
   * @returns List of content types with counts
   */
  getContentTypes: async (): Promise<ContentType[]> => {
    try {
      const response = await api.get<{ types: ContentType[] }>('/cultural/types')
      return response.data.types
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load content types.'
      )
    }
  },

  /**
   * Get popular tags
   * @param limit - Number of tags to retrieve
   * @returns Popular content tags
   */
  getPopularTags: async (limit: number = 20): Promise<ContentTag[]> => {
    try {
      const response = await api.get<{ tags: ContentTag[] }>('/cultural/tags', {
        params: { limit },
      })
      return response.data.tags
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load popular tags.'
      )
    }
  },

  /**
   * Advanced search with multiple filters
   * @param filters - Advanced search filters
   * @returns Filtered content with pagination
   */
  advancedSearch: async (filters: CulturalContentQuery): Promise<{
    content: CulturalContent[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> => {
    try {
      const response = await api.post('/cultural/advanced-search', filters)
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to perform advanced search.'
      )
    }
  },

  /**
   * Get content statistics (admin only)
   * @param params - Statistics query parameters
   * @returns Content statistics
   */
  getContentStats: async (params?: {
    startDate?: string
    endDate?: string
    type?: string
    category?: string
    language?: string
    authorName?: string
  }): Promise<{
    totalContent: number
    publishedContent: number
    draftContent: number
    archivedContent: number
    featuredContent: number
    contentByType: Record<string, number>
    contentByLanguage: Record<string, number>
  }> => {
    try {
      const response = await api.get('/cultural/stats', { params })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load content statistics.'
      )
    }
  },

  /**
   * Bulk operations on content (admin only)
   * @param data - Bulk operation data
   * @returns Operation results
   */
  bulkOperation: async (data: {
    contentIds: string[]
    operation: 'publish' | 'archive' | 'delete' | 'feature' | 'unfeature'
    reason?: string
  }): Promise<{
    success: number
    failed: number
    errors: string[]
  }> => {
    try {
      const response = await api.post('/cultural/bulk', data)
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to perform bulk operation.'
      )
    }
  },
}

export default culturalService