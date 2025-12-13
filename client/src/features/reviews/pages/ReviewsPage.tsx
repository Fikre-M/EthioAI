import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import ReviewCard from '../components/ReviewCard'
import WriteReview from '../components/WriteReview'
import ReviewStats from '../components/ReviewStats'
import ReviewFilters from '../components/ReviewFilters'
import {
  FaStar, FaFilter, FaSearch, FaPlus
} from 'react-icons/fa'

export interface Review {
  id: string
  type: 'tour' | 'product' | 'guide' | 'destination'
  itemId: string
  itemName: string
  itemImage: string
  userId: string
  userName: string
  userAvatar: string
  userLevel: 'Traveler' | 'Explorer' | 'Adventurer' | 'Local Expert'
  rating: number
  title: string
  content: string
  photos: Array<{
    id: string
    url: string
    caption?: string
  }>
  videos: Array<{
    id: string
    url: string
    thumbnail: string
    caption?: string
    duration: number
  }>
  location?: {
    name: string
    coordinates: [number, number]
  }
  visitDate: string
  createdAt: string
  updatedAt?: string
  helpful: number
  notHelpful: number
  replies: number
  isVerified: boolean
  isEdited: boolean
  tags: string[]
  language: string
  tripType?: 'solo' | 'couple' | 'family' | 'friends' | 'business'
}

interface ReviewFiltersType {
  type: 'all' | 'tour' | 'product' | 'guide' | 'destination'
  rating: 'all' | '5' | '4' | '3' | '2' | '1'
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful' | 'trending'
  hasMedia: boolean
  verified: boolean
  language: 'all' | 'en' | 'am' | 'or'
  tripType: 'all' | 'solo' | 'couple' | 'family' | 'friends' | 'business'
  dateRange: 'all' | 'week' | 'month' | 'year'
  tags: string[]
}

const ReviewsPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ReviewFiltersType>({
    type: 'all',
    rating: 'all',
    sortBy: 'newest',
    hasMedia: false,
    verified: false,
    language: 'all',
    tripType: 'all',
    dateRange: 'all',
    tags: []
  })
  const [showFilters, setShowFilters] = useState(false)

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: 'review-001',
      type: 'tour',
      itemId: 'tour-001',
      itemName: 'Historic Route & Rock Churches of Lalibela',
      itemImage: '/tours/lalibela-tour.jpg',
      userId: 'user-001',
      userName: 'Sarah Johnson',
      userAvatar: '/avatars/sarah.jpg',
      userLevel: 'Explorer',
      rating: 5,
      title: 'Absolutely Life-Changing Experience!',
      content: 'The Lalibela tour exceeded all my expectations. Our guide was incredibly knowledgeable about the history and significance of each church. The early morning visit to Bet Giyorgis was magical - watching the sunrise illuminate this architectural marvel was unforgettable. The local coffee ceremony was a beautiful cultural touch. Highly recommend staying overnight to experience both sunrise and sunset at the churches.',
      photos: [
        { id: 'photo-001', url: '/reviews/lalibela-1.jpg', caption: 'Bet Giyorgis at sunrise' },
        { id: 'photo-002', url: '/reviews/lalibela-2.jpg', caption: 'Inside Bet Maryam' },
        { id: 'photo-003', url: '/reviews/lalibela-3.jpg', caption: 'Traditional coffee ceremony' }
      ],
      videos: [
        {
          id: 'video-001',
          url: '/reviews/lalibela-video.mp4',
          thumbnail: '/reviews/lalibela-video-thumb.jpg',
          caption: 'Walking through the underground tunnels',
          duration: 45
        }
      ],
      location: {
        name: 'Lalibela, Ethiopia',
        coordinates: [12.0317, 39.0473]
      },
      visitDate: '2024-01-15',
      createdAt: '2024-01-18T10:30:00Z',
      helpful: 47,
      notHelpful: 2,
      replies: 8,
      isVerified: true,
      isEdited: false,
      tags: ['historical', 'religious', 'architecture', 'cultural', 'unesco'],
      language: 'en',
      tripType: 'couple'
    },
    {
      id: 'review-002',
      type: 'product',
      itemId: 'prod-001',
      itemName: 'Ethiopian Coffee Experience Set',
      itemImage: '/products/coffee-set-1.jpg',
      userId: 'user-002',
      userName: 'Michael Chen',
      userAvatar: '/avatars/michael.jpg',
      userLevel: 'Adventurer',
      rating: 4,
      title: 'Great Quality, Authentic Experience',
      content: 'Purchased this coffee set after my trip to Ethiopia. The quality is excellent and it really brings back memories of the traditional coffee ceremonies I experienced. The beans are fresh and aromatic. The jebena is beautifully crafted. Only minor issue was the shipping took longer than expected, but the product quality makes up for it.',
      photos: [
        { id: 'photo-004', url: '/reviews/coffee-set-1.jpg', caption: 'Beautiful jebena and cups' },
        { id: 'photo-005', url: '/reviews/coffee-ceremony.jpg', caption: 'My home coffee ceremony' }
      ],
      videos: [],
      visitDate: '2024-01-10',
      createdAt: '2024-01-20T14:15:00Z',
      helpful: 23,
      notHelpful: 1,
      replies: 3,
      isVerified: true,
      isEdited: false,
      tags: ['coffee', 'authentic', 'quality', 'cultural'],
      language: 'en',
      tripType: 'solo'
    },
    {
      id: 'review-003',
      type: 'guide',
      itemId: 'guide-001',
      itemName: 'Dawit Tadesse - Cultural Heritage Guide',
      itemImage: '/guides/dawit.jpg',
      userId: 'user-003',
      userName: 'Emma Rodriguez',
      userAvatar: '/avatars/emma.jpg',
      userLevel: 'Local Expert',
      rating: 5,
      title: 'Outstanding Guide - Made Our Trip Unforgettable',
      content: 'Dawit was absolutely phenomenal! His deep knowledge of Ethiopian history and culture, combined with his warm personality, made our 5-day tour incredible. He went above and beyond, arranging special experiences like a traditional meal with a local family and teaching us basic Amharic phrases. His English is perfect and he has a great sense of humor. Book him without hesitation!',
      photos: [
        { id: 'photo-006', url: '/reviews/guide-dawit-1.jpg', caption: 'Dawit explaining church history' },
        { id: 'photo-007', url: '/reviews/local-family.jpg', caption: 'Dinner with local family' }
      ],
      videos: [
        {
          id: 'video-002',
          url: '/reviews/guide-explanation.mp4',
          thumbnail: '/reviews/guide-thumb.jpg',
          caption: 'Dawit explaining ancient traditions',
          duration: 120
        }
      ],
      location: {
        name: 'Addis Ababa, Ethiopia',
        coordinates: [9.0320, 38.7469]
      },
      visitDate: '2024-01-05',
      createdAt: '2024-01-12T16:45:00Z',
      helpful: 89,
      notHelpful: 0,
      replies: 15,
      isVerified: true,
      isEdited: false,
      tags: ['knowledgeable', 'friendly', 'cultural', 'professional', 'recommended'],
      language: 'en',
      tripType: 'family'
    }
  ]

  useEffect(() => {
    loadReviews()
    
    // Handle URL parameters
    const type = searchParams.get('type')
    if (type && ['tour', 'product', 'guide', 'destination'].includes(type)) {
      setFilters(prev => ({ ...prev, type: type as any }))
    }
  }, [searchParams])

  const loadReviews = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews)
      setIsLoading(false)
    }, 1000)
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      rating: 'all',
      sortBy: 'newest',
      hasMedia: false,
      verified: false,
      language: 'all',
      tripType: 'all',
      dateRange: 'all',
      tags: []
    })
  }

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'notHelpful' | 'replies'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0,
      replies: 0
    }
    setReviews([newReview, ...reviews])
    setShowWriteReview(false)
  }

  const handleHelpfulVote = (reviewId: string, isHelpful: boolean) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? {
            ...review,
            helpful: isHelpful ? review.helpful + 1 : review.helpful,
            notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ))
  }

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews.filter(review => {
      const matchesSearch = searchQuery === '' ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesType = filters.type === 'all' || review.type === filters.type
      const matchesRating = filters.rating === 'all' || review.rating >= parseInt(filters.rating)
      const matchesMedia = !filters.hasMedia || (review.photos.length > 0 || review.videos.length > 0)
      const matchesVerified = !filters.verified || review.isVerified
      const matchesLanguage = filters.language === 'all' || review.language === filters.language
      const matchesTripType = filters.tripType === 'all' || review.tripType === filters.tripType
      
      // Date range filter
      const matchesDateRange = (() => {
        if (filters.dateRange === 'all') return true
        const reviewDate = new Date(review.createdAt)
        const now = new Date()
        
        switch (filters.dateRange) {
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return reviewDate >= weekAgo
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return reviewDate >= monthAgo
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            return reviewDate >= yearAgo
          default:
            return true
        }
      })()

      // Tags filter
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.every(filterTag => 
          review.tags.some(reviewTag => reviewTag.toLowerCase().includes(filterTag.toLowerCase()))
        )

      return matchesSearch && matchesType && matchesRating && matchesMedia && 
             matchesVerified && matchesLanguage && matchesTripType && 
             matchesDateRange && matchesTags
    })

    // Sort reviews
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating)
        break
      case 'helpful':
        filtered.sort((a, b) => b.helpful - a.helpful)
        break
      case 'trending':
        filtered.sort((a, b) => (b.helpful + b.replies) - (a.helpful + a.replies))
        break
    }

    return filtered
  }

  const getReviewStats = () => {
    const totalReviews = reviews.length
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    const withMedia = reviews.filter(r => r.photos.length > 0 || r.videos.length > 0).length
    const verified = reviews.filter(r => r.isVerified).length

    return {
      total: totalReviews,
      average: averageRating.toFixed(1),
      withMedia,
      verified
    }
  }

  const filteredReviews = getFilteredAndSortedReviews()
  const stats = getReviewStats()

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Community Reviews</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Discover authentic experiences from fellow travelers
              </p>
            </div>
            <Button
              onClick={() => setShowWriteReview(true)}
              className="self-start bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <FaPlus className="mr-2" />
              <span className="hidden sm:inline">Write Review</span>
              <span className="sm:hidden">Write</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-lg sm:text-2xl font-bold text-gray-900">{stats.average}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.withMedia}</div>
              <div className="text-xs sm:text-sm text-gray-600">With Photos/Videos</div>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.verified}</div>
              <div className="text-xs sm:text-sm text-gray-600">Verified Reviews</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews, places, reviewers, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center"
            >
              <FaFilter className="mr-2" />
              Filters
              {Object.values(filters).some(f => f !== 'all' && f !== false && (Array.isArray(f) ? f.length > 0 : true)) && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Stats */}
            <ReviewStats reviews={reviews} />
            
            {/* Filters */}
            {showFilters && (
              <ReviewFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading reviews...</span>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || Object.values(filters).some(f => f !== 'all' && f !== false && (Array.isArray(f) ? f.length > 0 : true))
                    ? 'Try adjusting your search or filters'
                    : 'Be the first to share your experience!'
                  }
                </p>
                <Button
                  onClick={() => setShowWriteReview(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Write the First Review
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {filteredReviews.length} of {reviews.length} reviews
                  </div>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>
                
                {filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onHelpfulVote={handleHelpfulVote}
                    onReply={(reviewId) => console.log('Reply to:', reviewId)}
                    onShare={(reviewId) => console.log('Share:', reviewId)}
                    onReport={(reviewId) => console.log('Report:', reviewId)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Write Review Modal */}
        {showWriteReview && (
          <WriteReview
            isOpen={showWriteReview}
            onClose={() => setShowWriteReview(false)}
            onSubmit={handleAddReview}
          />
        )}
      </div>
    </div>
  )
}

export default ReviewsPage