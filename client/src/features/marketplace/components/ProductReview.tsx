import React, { useState, useRef } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaStar, FaCamera, FaTimes, FaThumbsUp, FaThumbsDown,
  FaFlag, FaCheckCircle, FaUser, FaImage, FaUpload,
  FaTrash, FaEdit, FaReply, FaHeart, FaShare
} from 'react-icons/fa'

interface ReviewPhoto {
  id: string
  url: string
  caption?: string
}

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  title: string
  comment: string
  photos: ReviewPhoto[]
  date: string
  verified: boolean
  helpful: number
  notHelpful: number
  replies: ReviewReply[]
  isEdited: boolean
}

interface ReviewReply {
  id: string
  userId: string
  userName: string
  userAvatar: string
  comment: string
  date: string
  isVendor: boolean
}

interface ProductReviewProps {
  productId: string
  reviews: Review[]
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'notHelpful' | 'replies' | 'isEdited'>) => void
  onUpdateReview: (reviewId: string, updates: Partial<Review>) => void
  onDeleteReview: (reviewId: string) => void
  onHelpfulVote: (reviewId: string, isHelpful: boolean) => void
  canReview?: boolean
  userHasPurchased?: boolean
}

const ProductReview: React.FC<ProductReviewProps> = ({
  productId,
  reviews,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  onHelpfulVote,
  canReview = true,
  userHasPurchased = false
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    photos: [] as File[]
  })
  const [photoPreview, setPhotoPreview] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest')
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRatingClick = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length + newReview.photos.length > 5) {
      alert('You can upload maximum 5 photos')
      return
    }

    const newPhotos = [...newReview.photos, ...files]
    setNewReview({ ...newReview, photos: newPhotos })

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPhotoPreview([...photoPreview, ...newPreviews])
  }

  const removePhoto = (index: number) => {
    const newPhotos = newReview.photos.filter((_, i) => i !== index)
    const newPreviews = photoPreview.filter((_, i) => i !== index)
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(photoPreview[index])
    
    setNewReview({ ...newReview, photos: newPhotos })
    setPhotoPreview(newPreviews)
  }

  const handleSubmitReview = () => {
    if (newReview.rating === 0) {
      alert('Please select a rating')
      return
    }
    if (newReview.comment.trim().length < 10) {
      alert('Please write at least 10 characters in your review')
      return
    }

    const reviewData = {
      userId: 'current-user-id',
      userName: 'Current User',
      userAvatar: '/avatars/current-user.jpg',
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      photos: newReview.photos.map((file, index) => ({
        id: `photo-${Date.now()}-${index}`,
        url: photoPreview[index],
        caption: ''
      })),
      verified: userHasPurchased
    }

    onAddReview(reviewData)
    
    // Reset form
    setNewReview({ rating: 0, title: '', comment: '', photos: [] })
    setPhotoPreview([])
    setShowReviewForm(false)
    
    alert('Review submitted successfully!')
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const getSortedAndFilteredReviews = () => {
    let filtered = reviews
    
    if (filterBy !== 'all') {
      filtered = reviews.filter(review => review.rating === parseInt(filterBy))
    }

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      case 'highest':
        return filtered.sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return filtered.sort((a, b) => a.rating - b.rating)
      case 'helpful':
        return filtered.sort((a, b) => b.helpful - a.helpful)
      default:
        return filtered
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const distribution = getRatingDistribution()
  const sortedReviews = getSortedAndFilteredReviews()

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 mr-2">
                  {calculateAverageRating()}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.floor(parseFloat(calculateAverageRating()))
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-gray-600">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {canReview && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Write a Review
            </Button>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-8">
                  {rating} ★
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${reviews.length > 0 ? (distribution[rating as keyof typeof distribution] / reviews.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {distribution[rating as keyof typeof distribution]}
                </span>
              </div>
            ))}
          </div>

          {/* Review Highlights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Verified purchases</span>
              <span className="text-sm font-medium text-green-600">
                {reviews.filter(r => r.verified).length} of {reviews.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">With photos</span>
              <span className="text-sm font-medium text-blue-600">
                {reviews.filter(r => r.photos.length > 0).length} reviews
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Most helpful</span>
              <span className="text-sm font-medium text-purple-600">
                {Math.max(...reviews.map(r => r.helpful), 0)} votes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                      className={`text-2xl ${
                        rating <= newReview.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-gray-600">
                    {newReview.rating > 0 && (
                      <>
                        {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength={100}
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  minLength={10}
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {newReview.comment.length}/1000 characters
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Photos (Optional)
                </label>
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="flex items-center"
                      disabled={newReview.photos.length >= 5}
                    >
                      <FaCamera className="mr-2" />
                      Add Photos ({newReview.photos.length}/5)
                    </Button>
                    <span className="text-sm text-gray-500">
                      Help others by showing the product
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {/* Photo Previews */}
                  {photoPreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Purchase Notice */}
              {userHasPurchased && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-sm text-green-800">
                      This review will be marked as "Verified Purchase"
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowReviewForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={newReview.rating === 0 || newReview.comment.trim().length < 10}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {sortedReviews.length} of {reviews.length} reviews
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-12">
            <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-6">Be the first to review this product</p>
            {canReview && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Write the First Review
              </Button>
            )}
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{review.userName}</h4>
                      {review.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          <FaCheckCircle className="inline mr-1" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.date)}
                        {review.isEdited && ' (edited)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                {review.title && (
                  <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                )}
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Photos */}
              {review.photos.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {review.photos.map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt="Review photo"
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        onClick={() => {
                          // Open photo in modal/lightbox
                          window.open(photo.url, '_blank')
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onHelpfulVote(review.id, true)}
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                  >
                    <FaThumbsUp className="mr-1" />
                    Helpful ({review.helpful})
                  </button>
                  <button
                    onClick={() => onHelpfulVote(review.id, false)}
                    className="flex items-center text-sm text-gray-600 hover:text-red-600"
                  >
                    <FaThumbsDown className="mr-1" />
                    ({review.notHelpful})
                  </button>
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                    <FaReply className="mr-1" />
                    Reply
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaShare />
                  </button>
                  <button className="text-gray-400 hover:text-red-500">
                    <FaFlag />
                  </button>
                </div>
              </div>

              {/* Replies */}
              {review.replies.length > 0 && (
                <div className="mt-4 pl-8 space-y-4">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={reply.userAvatar}
                          alt={reply.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{reply.userName}</span>
                            {reply.isVendor && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                Vendor
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(reply.date)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{reply.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProductReview