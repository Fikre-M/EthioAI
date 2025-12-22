import React from 'react'
import { Review } from '../pages/ReviewsPage'
import { FaStar, FaThumbsUp, FaThumbsDown, FaReply, FaShare, FaFlag, FaCheckCircle, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa'

interface ReviewCardProps {
  review: Review
  onHelpfulVote: (reviewId: string, isHelpful: boolean) => void
  onReply: (reviewId: string) => void
  onShare: (reviewId: string) => void
  onReport: (reviewId: string) => void
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpfulVote,
  onReply,
  onShare,
  onReport
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getUserLevelColor = (level: string) => {
    switch (level) {
      case 'Local Expert': return 'bg-purple-100 text-purple-800'
      case 'Adventurer': return 'bg-blue-100 text-blue-800'
      case 'Explorer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            {review.userAvatar ? (
              <img src={review.userAvatar} alt={review.userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-sm font-medium">
                {review.userName.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h4 className="font-semibold text-gray-900 truncate">{review.userName}</h4>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserLevelColor(review.userLevel)}`}>
                  {review.userLevel}
                </span>
                {review.isVerified && (
                  <FaCheckCircle className="text-blue-500 text-sm" title="Verified Review" />
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600 mt-1">
              <div className="flex items-center">
                {renderStars(review.rating)}
                <span className="ml-2 font-medium">{review.rating}/5</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-full capitalize">{review.type}</span>
          {review.tripType && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full capitalize">
              {review.tripType}
            </span>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{review.title}</h3>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{review.content}</p>
      </div>

      {/* Item Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={review.itemImage || '/placeholder-item.jpg'}
            alt={review.itemName}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h5 className="font-medium text-gray-900 truncate">{review.itemName}</h5>
            {review.location && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <FaMapMarkerAlt className="mr-1" />
                <span className="truncate">{review.location.name}</span>
              </div>
            )}
          </div>
          <div className="text-right text-sm text-gray-600">
            <div className="flex items-center">
              <FaCalendar className="mr-1" />
              <span>{formatDate(review.visitDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Media */}
      {(review.photos.length > 0 || review.videos.length > 0) && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {review.photos.slice(0, 4).map((photo) => (
              <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Review photo'}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                />
              </div>
            ))}
            {review.videos.slice(0, 2).map((video) => (
              <div key={video.id} className="aspect-square rounded-lg overflow-hidden relative">
                <img
                  src={video.thumbnail}
                  alt={video.caption || 'Review video'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-4 border-l-gray-800 border-y-2 border-y-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(review.photos.length + review.videos.length) > 4 && (
            <button className="text-blue-600 text-sm mt-2 hover:underline">
              View all {review.photos.length + review.videos.length} media
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onHelpfulVote(review.id, true)}
            className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            <FaThumbsUp className="mr-1" />
            <span>Helpful ({review.helpful})</span>
          </button>
          
          <button
            onClick={() => onReply(review.id)}
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaReply className="mr-1" />
            <span className="hidden sm:inline">Reply</span>
            <span className="sm:hidden">Reply</span>
            {review.replies > 0 && <span className="ml-1">({review.replies})</span>}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onShare(review.id)}
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaShare className="mr-1" />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <button
            onClick={() => onReport(review.id)}
            className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <FaFlag className="mr-1" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard