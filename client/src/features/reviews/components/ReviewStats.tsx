import React from 'react'
import { Review } from '../pages/ReviewsPage'
import { FaStar, FaImage, FaVideo, FaCheckCircle } from 'react-icons/fa'

interface ReviewStatsProps {
  reviews: Review[]
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ reviews }) => {
  const totalReviews = reviews.length
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews || 0
  const withMedia = reviews.filter(r => r.photos.length > 0 || r.videos.length > 0).length
  const verified = reviews.filter(r => r.isVerified).length

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0
  }))

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Review Statistics</h3>
      
      {/* Overall Rating */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex items-center justify-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`text-lg ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Based on {totalReviews} reviews
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2 mb-6">
        {ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center text-sm">
            <span className="w-8">{rating}</span>
            <FaStar className="text-yellow-400 mx-1" />
            <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-right">{count}</span>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <FaImage className="text-blue-600 mx-auto mb-1" />
          <div className="text-sm font-medium">{withMedia}</div>
          <div className="text-xs text-gray-600">With Media</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <FaCheckCircle className="text-green-600 mx-auto mb-1" />
          <div className="text-sm font-medium">{verified}</div>
          <div className="text-xs text-gray-600">Verified</div>
        </div>
      </div>
    </div>
  )
}

export default ReviewStats