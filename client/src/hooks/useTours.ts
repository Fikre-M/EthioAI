import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { AppDispatch } from '@/store/store'
import {
  fetchTours,
  fetchTourById,
  searchTours,
  addToWishlist,
  removeFromWishlist,
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
  applyLocalFilters,
  clearError,
  selectTours,
  selectFilteredTours,
  selectSelectedTour,
  selectWishlist,
  selectComparison,
  selectFilters,
  selectPagination,
  selectSorting,
  selectLoading,
  selectError,
  selectSearchSuggestions,
  selectIsInWishlist,
  selectIsInComparison,
  selectWishlistTours,
  selectComparisonTours,
  selectPaginatedTours,
  TourFilters,
} from '@/store/slices/tourSlice'

export const useTours = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Selectors
  const tours = useSelector(selectTours)
  const filteredTours = useSelector(selectFilteredTours)
  const selectedTour = useSelector(selectSelectedTour)
  const wishlist = useSelector(selectWishlist)
  const comparison = useSelector(selectComparison)
  const filters = useSelector(selectFilters)
  const pagination = useSelector(selectPagination)
  const sorting = useSelector(selectSorting)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const searchSuggestions = useSelector(selectSearchSuggestions)
  const wishlistTours = useSelector(selectWishlistTours)
  const comparisonTours = useSelector(selectComparisonTours)
  const paginatedTours = useSelector(selectPaginatedTours)

  // Actions
  const loadTours = useCallback(
    (params?: { filters?: TourFilters; page?: number; limit?: number }) => {
      return dispatch(fetchTours(params || {}))
    },
    [dispatch]
  )

  const loadTourById = useCallback(
    (tourId: string) => {
      return dispatch(fetchTourById(tourId))
    },
    [dispatch]
  )

  const search = useCallback(
    (query: string) => {
      return dispatch(searchTours(query))
    },
    [dispatch]
  )

  const updateFilters = useCallback(
    (newFilters: TourFilters) => {
      dispatch(setFilters(newFilters))
      dispatch(applyLocalFilters())
    },
    [dispatch]
  )

  const resetFilters = useCallback(() => {
    dispatch(clearFilters())
    dispatch(applyLocalFilters())
  }, [dispatch])

  const updateSearch = useCallback(
    (searchQuery: string) => {
      dispatch(setSearchFilter(searchQuery))
      dispatch(applyLocalFilters())
    },
    [dispatch]
  )

  const updateSortBy = useCallback(
    (sortBy: 'price' | 'rating' | 'duration' | 'popularity') => {
      dispatch(setSortBy(sortBy))
      dispatch(applyLocalFilters())
    },
    [dispatch]
  )

  const updateSortOrder = useCallback(
    (order: 'asc' | 'desc') => {
      dispatch(setSortOrder(order))
      dispatch(applyLocalFilters())
    },
    [dispatch]
  )

  const toggleSort = useCallback(() => {
    dispatch(toggleSortOrder())
    dispatch(applyLocalFilters())
  }, [dispatch])

  const changePage = useCallback(
    (page: number) => {
      dispatch(setPage(page))
    },
    [dispatch]
  )

  const changeLimit = useCallback(
    (limit: number) => {
      dispatch(setLimit(limit))
    },
    [dispatch]
  )

  const toggleTourWishlist = useCallback(
    (tourId: string) => {
      dispatch(toggleWishlist(tourId))
    },
    [dispatch]
  )

  const addTourToWishlist = useCallback(
    (tourId: string) => {
      return dispatch(addToWishlist(tourId))
    },
    [dispatch]
  )

  const removeTourFromWishlist = useCallback(
    (tourId: string) => {
      return dispatch(removeFromWishlist(tourId))
    },
    [dispatch]
  )

  const resetWishlist = useCallback(() => {
    dispatch(clearWishlist())
  }, [dispatch])

  const addTourToComparison = useCallback(
    (tourId: string) => {
      dispatch(addToComparison(tourId))
    },
    [dispatch]
  )

  const removeTourFromComparison = useCallback(
    (tourId: string) => {
      dispatch(removeFromComparison(tourId))
    },
    [dispatch]
  )

  const resetComparison = useCallback(() => {
    dispatch(clearComparison())
  }, [dispatch])

  const applyFilters = useCallback(() => {
    dispatch(applyLocalFilters())
  }, [dispatch])

  const dismissError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Helper functions
  const isInWishlist = useCallback(
    (tourId: string) => {
      return wishlist.includes(tourId)
    },
    [wishlist]
  )

  const isInComparison = useCallback(
    (tourId: string) => {
      return comparison.includes(tourId)
    },
    [comparison]
  )

  const canAddToComparison = useCallback(() => {
    return comparison.length < 3
  }, [comparison])

  return {
    // State
    tours,
    filteredTours,
    selectedTour,
    wishlist,
    comparison,
    filters,
    pagination,
    sorting,
    loading,
    error,
    searchSuggestions,
    wishlistTours,
    comparisonTours,
    paginatedTours,

    // Actions
    loadTours,
    loadTourById,
    search,
    updateFilters,
    resetFilters,
    updateSearch,
    updateSortBy,
    updateSortOrder,
    toggleSort,
    changePage,
    changeLimit,
    toggleTourWishlist,
    addTourToWishlist,
    removeTourFromWishlist,
    resetWishlist,
    addTourToComparison,
    removeTourFromComparison,
    resetComparison,
    applyFilters,
    dismissError,

    // Helpers
    isInWishlist,
    isInComparison,
    canAddToComparison,
  }
}
