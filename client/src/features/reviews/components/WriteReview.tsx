import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import { Review } from '../pages/ReviewsPage'
import { FaTimes, FaStar } from 'react-icons/fa'

interface WriteReviewProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reviewData: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'notHelpful' | 'replies'>) => void
}

const WriteReview: React.FC<WriteReviewProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'tour' as const,
    itemId: '',
    itemName: '',
    itemImage: '',
    userId: 'current-user',
    userName: 'Current User',
    userAvatar: '',
    userLevel: 'Traveler' as const,
    rating: 5,
    title: '',
    content: '',
    photos: [],
    videos: [],
    visitDate: '',
    isVerified: false,
    isEdited: false,
    tags: [],
    language: 'en',
    tripType: 'solo' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Write a Review</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WriteReview