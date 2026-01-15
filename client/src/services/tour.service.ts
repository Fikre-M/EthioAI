import { api } from "@/api/axios.config";
import { API_ENDPOINTS } from "@/utils/constants";

// Updated Tour interface to match server response
export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  status: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED' | 'ARCHIVED';
  featured: boolean;
  startLocation: {
    name: string;
    coordinates: [number, number];
    address?: string;
  };
  locations: Array<{
    name: string;
    coordinates: [number, number];
    description?: string;
  }>;
  included: string[];
  excluded?: string[];
  itinerary: Array<{
    day: number;
    title: string;
    activities: string[];
    accommodation?: string;
    meals?: string[];
  }>;
  tags?: string[];
  category: string;
  language: string;
  metaTitle?: string;
  metaDescription?: string;
  guideId?: string;
  guide?: {
    id: string;
    user: {
      name: string;
      avatar?: string;
      phone?: string;
    };
    experience: number;
    languages: string[];
    specialties: string[];
    rating?: number;
    totalReviews: number;
    isVerified: boolean;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    title?: string;
    comment: string;
    user: {
      name: string;
      avatar?: string;
    };
    createdAt: string;
  }>;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TourFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'duration' | 'title' | 'rating';
  sortOrder?: 'asc' | 'desc';
  category?: string;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  maxGroupSize?: number;
  search?: string;
  tags?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED' | 'ARCHIVED';
  featured?: boolean;
  latitude?: number;
  longitude?: number;
  radius?: number;
  guideId?: string;
}

export interface TourAvailability {
  available: boolean;
  message: string;
  conflictingBookings?: number;
}

export interface CreateTourData {
  title: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  startLocation: {
    name: string;
    coordinates: [number, number];
    address?: string;
  };
  locations: Array<{
    name: string;
    coordinates: [number, number];
    description?: string;
  }>;
  included: string[];
  excluded?: string[];
  itinerary: Array<{
    day: number;
    title: string;
    activities: string[];
    accommodation?: string;
    meals?: string[];
  }>;
  tags?: string[];
  category: string;
  language?: string;
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
  guideId?: string;
}

export const tourService = {
  /**
   * Get all tours with filtering and pagination
   */
  async getTours(filters?: TourFilters): Promise<{
    tours: Tour[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`${API_ENDPOINTS.TOURS.LIST}?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get tour by ID or slug
   */
  async getTourById(id: string): Promise<Tour> {
    const response = await api.get(API_ENDPOINTS.TOURS.DETAIL(id));
    return response.data.data.tour;
  },

  /**
   * Create a new tour (requires guide or admin role)
   */
  async createTour(tourData: CreateTourData): Promise<Tour> {
    const response = await api.post(API_ENDPOINTS.TOURS.LIST, tourData);
    return response.data.data.tour;
  },

  /**
   * Update tour (requires guide or admin role)
   */
  async updateTour(id: string, tourData: Partial<CreateTourData>): Promise<Tour> {
    const response = await api.put(API_ENDPOINTS.TOURS.DETAIL(id), tourData);
    return response.data.data.tour;
  },

  /**
   * Delete tour (requires guide or admin role)
   */
  async deleteTour(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.TOURS.DETAIL(id));
  },

  /**
   * Check tour availability
   */
  async checkAvailability(id: string, data: {
    startDate: string;
    endDate: string;
    groupSize: number;
  }): Promise<TourAvailability> {
    const response = await api.post(`${API_ENDPOINTS.TOURS.DETAIL(id)}/availability`, data);
    return response.data.data;
  },

  /**
   * Get featured tours
   */
  async getFeaturedTours(limit?: number): Promise<Tour[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/api/tours/featured${params}`);
    return response.data.data.tours;
  },

  /**
   * Get tours by category
   */
  async getToursByCategory(category: string, limit?: number): Promise<Tour[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/api/tours/category/${category}${params}`);
    return response.data.data.tours;
  },

  /**
   * Search tours
   */
  async searchTours(query: string, filters?: Omit<TourFilters, 'search'>): Promise<Tour[]> {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`${API_ENDPOINTS.TOURS.SEARCH}?${params.toString()}`);
    return response.data.data.tours;
  },

  /**
   * Get popular tours
   */
  async getPopularTours(limit?: number): Promise<Tour[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/api/tours/popular${params}`);
    return response.data.data.tours;
  },

  /**
   * Get tour categories
   */
  async getTourCategories(): Promise<Array<{ name: string; count: number }>> {
    const response = await api.get('/api/tours/categories');
    return response.data.data.categories;
  },

  /**
   * Update tour status (admin only)
   */
  async updateTourStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED' | 'ARCHIVED', reason?: string): Promise<Tour> {
    const response = await api.patch(`${API_ENDPOINTS.TOURS.DETAIL(id)}/status`, { status, reason });
    return response.data.data.tour;
  },
};
