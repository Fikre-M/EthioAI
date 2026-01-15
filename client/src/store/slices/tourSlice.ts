import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { tourService, Tour, TourFilters as ServiceTourFilters } from '@/services/tour.service'

// Types
export interface TourFilters {
  search?: string
  category?: string
  difficulty?: 'Easy' | 'Moderate' | 'Challenging'
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  maxGroupSize?: number
  tags?: string
  featured?: boolean
  guideId?: string
}

export interface TourPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface TourState {
  tours: Tour[]
  featuredTours: Tour[]
  popularTours: Tour[]
  selectedTour: Tour | null
  wishlist: string[] // Tour IDs
  comparison: string[] // Tour IDs (max 3)
  filters: TourFilters
  pagination: TourPagination
  sortBy: 'createdAt' | 'price' | 'duration' | 'title' | 'rating'
  sortOrder: 'asc' | 'desc'
  loading: boolean
  error: string | null
  searchResults: Tour[]
  categories: Array<{ name: string; count: number }>
}

const initialState: TourState = {
  tours: [],
  featuredTours: [],
  popularTours: [],
  selectedTour: null,
  wishlist: JSON.parse(localStorage.getItem('tour_wishlist') || '[]'),
  comparison: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  loading: false,
  error: null,
  searchResults: [],
  categories: [],
}

// Async Thunks
export const fetchTours = createAsyncThunk(
  'tours/fetchTours',
  async (params: { filters?: TourFilters; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const serviceFilters: ServiceTourFilters = {
        page: params.page || 1,
        limit: params.limit || 12,
        ...params.filters,
      }
      
      const response = await tourService.getTours(serviceFilters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tours')
    }
  }
)

export const fetchTourById = createAsyncThunk(
  'tours/fetchTourById',
  async (tourId: string, { rejectWithValue }) => {
    try {
      const tour = await tourService.getTourById(tourId)
      return tour
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tour details')
    }
  }
)

export const fetchFeaturedTours = createAsyncThunk(
  'tours/fetchFeaturedTours',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const tours = await tourService.getFeaturedTours(limit)
      return tours
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured tours')
    }
  }
)

export const fetchPopularTours = createAsyncThunk(
  'tours/fetchPopularTours',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const tours = await tourService.getPopularTours(limit)
      return tours
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch popular tours')
    }
  }
)

export const searchTours = createAsyncThunk(
  'tours/searchTours',
  async (params: { query: string; filters?: Omit<TourFilters, 'search'> }, { rejectWithValue }) => {
    try {
      const tours = await tourService.searchTours(params.query, params.filters)
      return tours
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Search failed')
    }
  }
)

export const fetchToursByCategory = createAsyncThunk(
  'tours/fetchToursByCategory',
  async (params: { category: string; limit?: number }, { rejectWithValue }) => {
    try {
      const tours = await tourService.getToursByCategory(params.category, params.limit)
      return tours
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tours by category')
    }
  }
)

export const fetchTourCategories = createAsyncThunk(
  'tours/fetchTourCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await tourService.getTourCategories()
      return categories
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories')
    }
  }
)

export const checkTourAvailability = createAsyncThunk(
  'tours/checkAvailability',
  async (params: { tourId: string; startDate: string; endDate: string; groupSize: number }, { rejectWithValue }) => {
    try {
      const availability = await tourService.checkAvailability(params.tourId, {
        startDate: params.startDate,
        endDate: params.endDate,
        groupSize: params.groupSize,
      })
      return availability
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check availability')
    }
  }
)

// Slice
const tourSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    // Filters
    setFilters: (state, action: PayloadAction<TourFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1 // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {}
      state.pagination.page = 1
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
      state.pagination.page = 1
    },

    // Sorting
    setSortBy: (state, action: PayloadAction<TourState['sortBy']>) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'
    },

    // Pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.page = 1
    },

    // Wishlist (with localStorage persistence)
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const tourId = action.payload
      const index = state.wishlist.indexOf(tourId)
      if (index > -1) {
        state.wishlist.splice(index, 1)
      } else {
        state.wishlist.push(tourId)
      }
      // Persist to localStorage
      localStorage.setItem('tour_wishlist', JSON.stringify(state.wishlist))
    },
    clearWishlist: (state) => {
      state.wishlist = []
      localStorage.removeItem('tour_wishlist')
    },

    // Comparison
    addToComparison: (state, action: PayloadAction<string>) => {
      const tourId = action.payload
      if (state.comparison.length < 3 && !state.comparison.includes(tourId)) {
        state.comparison.push(tourId)
      }
    },
    removeFromComparison: (state, action: PayloadAction<string>) => {
      state.comparison = state.comparison.filter((id) => id !== action.payload)
    },
    clearComparison: (state) => {
      state.comparison = []
    },

    // Selected Tour
    setSelectedTour: (state, action: PayloadAction<Tour | null>) => {
      state.selectedTour = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = []
    },
  },
  extraReducers: (builder) => {
    // Fetch Tours
    builder
      .addCase(fetchTours.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false
        state.tours = action.payload.tours
        state.pagination = action.payload.pagination
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch Tour by ID
    builder
      .addCase(fetchTourById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTourById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedTour = action.payload
      })
      .addCase(fetchTourById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch Featured Tours
    builder
      .addCase(fetchFeaturedTours.fulfilled, (state, action) => {
        state.featuredTours = action.payload
      })
      .addCase(fetchFeaturedTours.rejected, (state, action) => {
        state.error = action.payload as string
      })

    // Fetch Popular Tours
    builder
      .addCase(fetchPopularTours.fulfilled, (state, action) => {
        state.popularTours = action.payload
      })
      .addCase(fetchPopularTours.rejected, (state, action) => {
        state.error = action.payload as string
      })

    // Search Tours
    builder
      .addCase(searchTours.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchTours.fulfilled, (state, action) => {
        state.loading = false
        state.searchResults = action.payload
      })
      .addCase(searchTours.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch Tours by Category
    builder
      .addCase(fetchToursByCategory.fulfilled, (state, action) => {
        // Could store category-specific tours if needed
        state.tours = action.payload
      })
      .addCase(fetchToursByCategory.rejected, (state, action) => {
        state.error = action.payload as string
      })

    // Fetch Categories
    builder
      .addCase(fetchTourCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(fetchTourCategories.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

// Actions
export const {
  setFilters,
  clearFilters,
  setSearchFilter,
  setSortBy,
  setSortOrder,
  toggleSortOrder,
  setPage,
  setLimit,
  toggleWishlist,
  clearWishlist,
  addToComparison,
  removeFromComparison,
  clearComparison,
  setSelectedTour,
  clearError,
  clearSearchResults,
} = tourSlice.actions

// Selectors
export const selectTours = (state: { tours: TourState }) => state.tours.tours
export const selectFeaturedTours = (state: { tours: TourState }) => state.tours.featuredTours
export const selectPopularTours = (state: { tours: TourState }) => state.tours.popularTours
export const selectSelectedTour = (state: { tours: TourState }) => state.tours.selectedTour
export const selectWishlist = (state: { tours: TourState }) => state.tours.wishlist
export const selectComparison = (state: { tours: TourState }) => state.tours.comparison
export const selectFilters = (state: { tours: TourState }) => state.tours.filters
export const selectPagination = (state: { tours: TourState }) => state.tours.pagination
export const selectSorting = (state: { tours: TourState }) => ({
  sortBy: state.tours.sortBy,
  sortOrder: state.tours.sortOrder,
})
export const selectLoading = (state: { tours: TourState }) => state.tours.loading
export const selectError = (state: { tours: TourState }) => state.tours.error
export const selectSearchResults = (state: { tours: TourState }) => state.tours.searchResults
export const selectCategories = (state: { tours: TourState }) => state.tours.categories

// Helper selectors
export const selectIsInWishlist = (tourId: string) => (state: { tours: TourState }) =>
  state.tours.wishlist.includes(tourId)

export const selectIsInComparison = (tourId: string) => (state: { tours: TourState }) =>
  state.tours.comparison.includes(tourId)

export const selectWishlistTours = (state: { tours: TourState }) =>
  state.tours.tours.filter((tour) => state.tours.wishlist.includes(tour.id))

export const selectComparisonTours = (state: { tours: TourState }) =>
  state.tours.tours.filter((tour) => state.tours.comparison.includes(tour.id))

export default tourSlice.reducer
