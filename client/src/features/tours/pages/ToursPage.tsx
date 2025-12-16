import { useState, useEffect } from 'react'
import { TourGrid } from '../components/TourGrid'
import { EnhancedTourFilters } from '../components/EnhancedTourFilters'
import { TourSearchBar, SearchSuggestion } from '../components/TourSearchBar'
import { TourSortDropdown, SortOption } from '../components/TourSortDropdown'
import { Tour, TourFilters as TourFiltersType } from '@/types/tour'

// Mock data - replace with API call
const mockTours: Tour[] = [
  {
    id: '1',
    title: 'Historic Route: Lalibela, Gondar & Axum',
    description: 'Explore the ancient wonders of Northern Ethiopia',
    shortDescription: 'Visit rock-hewn churches, medieval castles, and ancient obelisks',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
    images: [],
    price: 5000,
    currency: 'ETB',
    duration: '7 days',
    durationDays: 7,
    location: 'Northern Ethiopia',
    region: 'Amhara',
    category: 'historical',
    difficulty: 'moderate',
    rating: 4.8,
    reviewCount: 124,
    maxGroupSize: 12,
    minAge: 12,
    highlights: ['Rock-hewn churches', 'Gondar castles', 'Axum obelisks'],
    included: ['Accommodation', 'Meals', 'Guide', 'Transport'],
    excluded: ['Flights', 'Personal expenses'],
    itinerary: [],
    guide: {
      id: '1',
      name: 'Abebe Kebede',
      avatar: '',
      languages: ['English', 'Amharic'],
      rating: 4.9,
      toursGuided: 150,
    },
    availability: [],
    tags: ['UNESCO', 'History', 'Culture'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Simien Mountains Trekking',
    description: 'Trek through stunning mountain landscapes',
    shortDescription: 'Experience breathtaking views and unique wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    images: [],
    price: 3500,
    currency: 'ETB',
    duration: '5 days',
    durationDays: 5,
    location: 'Simien Mountains',
    region: 'Amhara',
    category: 'trekking',
    difficulty: 'challenging',
    rating: 4.9,
    reviewCount: 89,
    maxGroupSize: 8,
    minAge: 16,
    highlights: ['Mountain peaks', 'Gelada baboons', 'Stunning views'],
    included: ['Camping gear', 'Meals', 'Guide', 'Porter'],
    excluded: ['Personal gear', 'Tips'],
    itinerary: [],
    guide: {
      id: '2',
      name: 'Tadesse Alemu',
      avatar: '',
      languages: ['English', 'Amharic'],
      rating: 5.0,
      toursGuided: 200,
    },
    availability: [],
    tags: ['Trekking', 'Nature', 'Adventure'],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Danakil Depression Adventure',
    description: 'Visit one of the hottest places on Earth',
    shortDescription: 'Explore colorful sulfur springs and salt flats',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    images: [],
    price: 4500,
    currency: 'ETB',
    duration: '4 days',
    durationDays: 4,
    location: 'Danakil Depression',
    region: 'Afar',
    category: 'adventure',
    difficulty: 'extreme',
    rating: 4.7,
    reviewCount: 67,
    maxGroupSize: 10,
    minAge: 18,
    highlights: ['Erta Ale volcano', 'Dallol sulfur springs', 'Salt mining'],
    included: ['4WD transport', 'Camping', 'Meals', 'Guide'],
    excluded: ['Flights', 'Insurance'],
    itinerary: [],
    guide: {
      id: '3',
      name: 'Mohammed Ali',
      avatar: '',
      languages: ['English', 'Afar'],
      rating: 4.8,
      toursGuided: 120,
    },
    availability: [],
    tags: ['Adventure', 'Extreme', 'Unique'],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const ToursPage = () => {
  const [tours, setTours] = useState<Tour[]>(mockTours)
  const [filteredTours, setFilteredTours] = useState<Tour[]>(mockTours)
  const [filters, setFilters] = useState<TourFiltersType>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('popularity')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])

  // Apply filters
  useEffect(() => {
    let result = [...tours]

    // Search
    if (searchQuery) {
      result = result.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      result = result.filter(tour => filters.category!.includes(tour.category))
    }

    // Price range
    if (filters.priceRange) {
      result = result.filter(tour =>
        tour.price >= filters.priceRange![0] && tour.price <= filters.priceRange![1]
      )
    }

    // Duration
    if (filters.duration) {
      result = result.filter(tour =>
        tour.durationDays >= filters.duration![0] && tour.durationDays <= filters.duration![1]
      )
    }

    // Difficulty
    if (filters.difficulty && filters.difficulty.length > 0) {
      result = result.filter(tour => filters.difficulty!.includes(tour.difficulty))
    }

    // Rating
    if (filters.rating) {
      result = result.filter(tour => tour.rating >= filters.rating!)
    }

    // Region
    if (filters.region && filters.region.length > 0) {
      result = result.filter(tour => filters.region!.includes(tour.region))
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'duration':
          return a.durationDays - b.durationDays
        case 'popularity':
          return b.reviewCount - a.reviewCount
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })

    setFilteredTours(result)
  }, [tours, filters, searchQuery, sortBy])

  const handleFiltersChange = (newFilters: TourFiltersType) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const handleSearch = (query: string) => {
    // Generate suggestions based on query
    const mockSuggestions: SearchSuggestion[] = [
      { id: '1', title: 'Lalibela Rock Churches', type: 'tour', icon: '🏛️' },
      { id: '2', title: 'Simien Mountains', type: 'location', icon: '📍' },
      { id: '3', title: 'Historical Tours', type: 'category', icon: '🏷️' },
    ]
    setSuggestions(mockSuggestions.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase())
    ))
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-6 sm:mb-8 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient-ethiopian mb-2 line-clamp-2">
          Discover Ethiopia Tours
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
          Explore our curated collection of tours across Ethiopia
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 min-w-0 overflow-hidden">
        {/* Search */}
        <div className="w-full min-w-0">
          <TourSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            suggestions={suggestions}
            isLoading={isLoading}
          />
        </div>

        {/* Sort */}
        <div className="w-full sm:w-auto sm:self-end flex-shrink-0">
          <TourSortDropdown
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
        Showing {filteredTours.length} of {tours.length} tours
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 min-w-0 overflow-hidden">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1 min-w-0">
          <EnhancedTourFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Tours Grid */}
        <div className="lg:col-span-3 order-1 lg:order-2 min-w-0 overflow-hidden">
          <TourGrid tours={filteredTours} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default ToursPage
