import React from 'react'
import { Button } from '@components/common/Button/Button'
import { FaFilter, FaStar, FaImage, FaCheckCircle } from 'react-icons/fa'

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

interface ReviewFiltersProps {
  filters: ReviewFiltersType
  onFilterChange: (key: string, value: any) => void
  onClearFilters: () => void
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaFilter className="text-blue-600 mr-2" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <Button
          onClick={onClearFilters}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        {/* Review Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Types</option>
            <option value="tour">Tours</option>
            <option value="product">Products</option>
            <option value="guide">Guides</option>
            <option value="destination">Destinations</option>
          </select>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <div className="space-y-2">
            {['all', '5', '4', '3', '2', '1'].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => onFilterChange('rating', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">
                  {rating === 'all' ? 'All Ratings' : (
                    <div className="flex items-center">
                      {Array.from({ length: parseInt(rating) }, (_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-xs mr-1" />
                      ))}
                      & up
                    </div>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.hasMedia}
              onChange={(e) => onFilterChange('hasMedia', e.target.checked)}
              className="mr-2"
            />
            <FaImage className="text-blue-600 mr-1" />
            <span className="text-sm">Has Photos/Videos</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={(e) => onFilterChange('verified', e.target.checked)}
              className="mr-2"
            />
            <FaCheckCircle className="text-green-600 mr-1" />
            <span className="text-sm">Verified Reviews</span>
          </label>
        </div>

        {/* Trip Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trip Type
          </label>
          <select
            value={filters.tripType}
            onChange={(e) => onFilterChange('tripType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Trip Types</option>
            <option value="solo">Solo Travel</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Time</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default ReviewFilters