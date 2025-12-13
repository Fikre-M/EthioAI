import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Tour } from '@/types/tour'

// Types
export interface TourFilters {
  search?: string
  category?: string
  difficulty?: string
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  region?: string
  startDate?: Date
  endDate?: Date
  tags?: string[]
}

export interface TourPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TourState {
  tours: Tour[]
  filteredTours: Tour[]
  selectedTour: Tour | null
  wishlist: string[] // Tour IDs
  comparison: string[] // Tour IDs (max 3)
  filters: TourFilters
  pagination: TourPagination
  sortBy: 'price' | 'rating' | 'duration' | 'popularity'
  sortOrder: 'asc' | 'desc'
  loading: boolean
  error: string | null
  searchSuggestions: string[]
}

const initialState: TourState = {
  tours: [],
  filteredTours: [],
  selectedTour: null,
  wishlist: [],
  comparison: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  sortBy: 'popularity',
  sortOrder: 'desc',
  loading: false,
  error: null,
  searchSuggestions: [],
}

// Async Thunks (will be connected to API later)
export const fetchTours = createAsyncThunk(
  'tours/fetchTours',
  async (params: { filters?: TourFilters; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/tours', { params })
      // return response.data
      
      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        tours: [],
        total: 0,
        page: params.page || 1,
        totalPages: 0,
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tours')
    }
  }
)

export const fetchTourById = createAsyncThunk(
  'tours/fetchTourById',
  async (tourId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get(`/api/tours/${tourId}`)
      // return response.data
      
      // Mock data for now
      console.log('Fetching tour:', tourId)
      await new Promise((resolve) => setTimeout(resolve, 300))
      return null
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tour details')
    }
  }
)

export const searchTours = createAsyncThunk(
  'tours/searchTours',
  async (query: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/tours/search', { params: { q: query } })
      // return response.data
      
      // Mock data for now
      console.log('Searching tours:', query)
      await new Promise((resolve) => setTimeout(resolve, 200))
      return {
        tours: [],
        suggestions: [],
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Search failed')
    }
  }
)

export const addToWishlist = createAsyncThunk(
  'tours/addToWishlist',
  async (tourId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.post('/api/users/wishlist', { tourId })
      // return response.data
      
      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 200))
      return tourId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist')
    }
  }
)

export const removeFromWishlist = createAsyncThunk(
  'tours/removeFromWishlist',
  async (tourId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.delete(`/api/users/wishlist/${tourId}`)
      // return response.data
      
      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 200))
      return tourId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist')
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

    // Wishlist (local state management)
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const tourId = action.payload
      const index = state.wishlist.indexOf(tourId)
      if (index > -1) {
        state.wishlist.splice(index, 1)
      } else {
        state.wishlist.push(tourId)
      }
    },
    clearWishlist: (state) => {
      state.wishlist = []
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

    // Local filtering (client-side)
    applyLocalFilters: (state) => {
      let filtered = [...state.tours]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (tour) =>
            tour.title.toLowerCase().includes(searchLower) ||
            tour.description.toLowerCase().includes(searchLower) ||
            tour.location.toLowerCase().includes(searchLower)
        )
      }

      // Apply category filter
      if (state.filters.category) {
        filtered = filtered.filter((tour) => tour.category === state.filters.category)
      }

      // Apply difficulty filter
      if (state.filters.difficulty) {
        filtered = filtered.filter((tour) => tour.difficulty === state.filters.difficulty)
      }

      // Apply price range filter
      if (state.filters.minPrice !== undefined) {
        filtered = filtered.filter((tour) => tour.price >= state.filters.minPrice!)
      }
      if (state.filters.maxPrice !== undefined) {
        filtered = filtered.filter((tour) => tour.price <= state.filters.maxPrice!)
      }

      // Apply duration filter
      if (state.filters.minDuration !== undefined) {
        filtered = filtered.filter((tour) => tour.durationDays >= state.filters.minDuration!)
      }
      if (state.filters.maxDuration !== undefined) {
        filtered = filtered.filter((tour) => tour.durationDays <= state.filters.maxDuration!)
      }

      // Apply region filter
      if (state.filters.region) {
        filtered = filtered.filter((tour) => tour.region === state.filters.region)
      }

      // Apply tags filter
      if (state.filters.tags && state.filters.tags.length > 0) {
        filtered = filtered.filter((tour) =>
          state.filters.tags!.some((tag) => tour.tags.includes(tag))
        )
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0
        switch (state.sortBy) {
          case 'price':
            comparison = a.price - b.price
            break
          case 'rating':
            comparison = a.rating - b.rating
            break
          case 'duration':
            comparison = a.durationDays - b.durationDays
            break
          case 'popularity':
            comparison = a.reviewCount - b.reviewCount
            break
        }
        return state.sortOrder === 'asc' ? comparison : -comparison
      })

      state.filteredTours = filtered
      state.pagination.total = filtered.length
      state.pagination.totalPages = Math.ceil(filtered.length / state.pagination.limit)
    },

    // Clear error
    clearError: (state) => {
      state.error = null
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
        state.filteredTours = action.payload.tours
        state.pagination.total = action.payload.total
        state.pagination.page = action.payload.page
        state.pagination.totalPages = action.payload.totalPages
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

    // Search Tours
    builder
      .addCase(searchTours.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchTours.fulfilled, (state, action) => {
        state.loading = false
        state.filteredTours = action.payload.tours
        state.searchSuggestions = action.payload.suggestions
      })
      .addCase(searchTours.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Add to Wishlist
    builder
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.wishlist.includes(action.payload)) {
          state.wishlist.push(action.payload)
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload as string
      })

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter((id) => id !== action.payload)
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
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
  applyLocalFilters,
  clearError,
} = tourSlice.actions

// Selectors
export const selectTours = (state: { tours: TourState }) => state.tours.tours
export const selectFilteredTours = (state: { tours: TourState }) => state.tours.filteredTours
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
export const selectSearchSuggestions = (state: { tours: TourState }) => state.tours.searchSuggestions

// Helper selectors
export const selectIsInWishlist = (tourId: string) => (state: { tours: TourState }) =>
  state.tours.wishlist.includes(tourId)

export const selectIsInComparison = (tourId: string) => (state: { tours: TourState }) =>
  state.tours.comparison.includes(tourId)

export const selectWishlistTours = (state: { tours: TourState }) =>
  state.tours.tours.filter((tour) => state.tours.wishlist.includes(tour.id))

export const selectComparisonTours = (state: { tours: TourState }) =>
  state.tours.tours.filter((tour) => state.tours.comparison.includes(tour.id))

export const selectPaginatedTours = (state: { tours: TourState }) => {
  const { filteredTours, pagination } = state.tours
  const start = (pagination.page - 1) * pagination.limit
  const end = start + pagination.limit
  return filteredTours.slice(start, end)
}

export default tourSlice.reducer
