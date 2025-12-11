import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import { DayPlanData } from '../pages/ItineraryPage'
import { TripPreferencesData } from '../pages/GenerateItineraryPage'
import {
  FaPlane, FaHotel, FaMapMarkerAlt, FaClock, FaDollarSign,
  FaEdit, FaPlus, FaUtensils, FaCar, FaCamera, FaTicketAlt, 
  FaStickyNote, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, 
  FaHeart, FaThumbsUp, FaThumbsDown
} from 'react-icons/fa'

interface GeneratedDayPlanProps {
  day: DayPlanData
  dayNumber: number
  preferences: TripPreferencesData
}

const GeneratedDayPlan: React.FC<GeneratedDayPlanProps> = ({
  day,
  dayNumber,
  preferences
}) => {
  const [likedActivities, setLikedActivities] = useState<string[]>([])
  const [dislikedActivities, setDislikedActivities] = useState<string[]>([])

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flight': return FaPlane
      case 'hotel': return FaHotel
      case 'restaurant': return FaUtensils
      case 'transport': return FaCar
      case 'activity': return FaCamera
      case 'tour': return FaTicketAlt
      default: return FaMapMarkerAlt
    }
  }

  const getItemColor = (type: string) => {
    switch (type) {
      case 'flight': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'hotel': return 'bg-green-100 text-green-800 border-green-200'
      case 'restaurant': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'transport': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'activity': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'tour': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <FaCheckCircle className="text-green-500" />
      case 'cancelled': return <FaTimesCircle className="text-red-500" />
      case 'pending': return <FaExclamationTriangle className="text-yellow-500" />
      default: return null
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleLikeActivity = (itemId: string) => {
    setLikedActivities(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev.filter(id => id !== itemId), itemId]
    )
    setDislikedActivities(prev => prev.filter(id => id !== itemId))
  }

  const handleDislikeActivity = (itemId: string) => {
    setDislikedActivities(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev.filter(id => id !== itemId), itemId]
    )
    setLikedActivities(prev => prev.filter(id => id !== itemId))
  }

  const getAIRecommendationReason = (item: any) => {
    const reasons = []
    
    if (preferences.interests.includes('history') && item.category === 'Sightseeing') {
      reasons.push('Matches your interest in historical sites')
    }
    if (preferences.interests.includes('culture') && item.category === 'Cultural') {
      reasons.push('Perfect for cultural experiences')
    }
    if (preferences.interests.includes('food') && item.category === 'Dining') {
      reasons.push('Great for food enthusiasts')
    }
    if (preferences.interests.includes('nature') && (item.category === 'Nature' || item.category === 'Adventure')) {
      reasons.push('Ideal for nature lovers')
    }
    if (preferences.pace === 'relaxed' && item.duration <= 120) {
      reasons.push('Fits your relaxed travel pace')
    }
    if (preferences.pace === 'packed' && item.duration >= 180) {
      reasons.push('Maximizes your packed schedule')
    }
    
    return reasons.length > 0 ? reasons[0] : 'Recommended based on your preferences'
  }

  return (
    <div className="p-6">
      {/* Day Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Day {dayNumber}</h2>
            <p className="text-gray-600">{formatDate(day.date)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">${day.totalCost}</div>
            <div className="text-gray-600">{day.items.length} activities</div>
          </div>
        </div>
        
        {/* Day Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold">{formatDuration(day.totalDuration)}</div>
            <div className="text-xs text-gray-600">Total Duration</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{day.items.length}</div>
            <div className="text-xs text-gray-600">Activities</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {day.items.filter(item => item.bookingStatus === 'confirmed').length}
            </div>
            <div className="text-xs text-gray-600">Confirmed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {day.items.filter(item => item.bookingStatus === 'pending').length}
            </div>
            <div className="text-xs text-gray-600">To Book</div>
          </div>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="space-y-4">
        {day.items
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map((item) => {
            const IconComponent = getItemIcon(item.type)
            const isLiked = likedActivities.includes(item.id)
            const isDisliked = dislikedActivities.includes(item.id)
            
            return (
              <div
                key={item.id}
                className={`border-2 rounded-xl p-6 transition-all ${getItemColor(item.type)} ${
                  isLiked ? 'ring-2 ring-green-400' : isDisliked ? 'ring-2 ring-red-400' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="mr-4 mt-1">
                      <IconComponent className="text-2xl" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-semibold text-xl mr-3">{item.title}</h4>
                        {getStatusIcon(item.bookingStatus)}
                      </div>
                      
                      <p className="text-sm mb-4 opacity-90">{item.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 opacity-70" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2 opacity-70" />
                          <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaDollarSign className="mr-2 opacity-70" />
                          <span>${item.price}</span>
                        </div>
                      </div>
                      
                      {/* AI Recommendation Reason */}
                      <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
                        <div className="flex items-start">
                          <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-1">AI Recommendation</div>
                            <div className="text-xs text-gray-700">{getAIRecommendationReason(item)}</div>
                          </div>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="p-2 bg-white bg-opacity-50 rounded text-sm">
                          <FaStickyNote className="inline mr-2 opacity-70" />
                          {item.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Activity Actions */}
                  <div className="flex flex-col items-center space-y-2 ml-4">
                    {/* Like/Dislike */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLikeActivity(item.id)}
                        className={`p-2 rounded-full transition-all ${
                          isLiked 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white text-gray-400 hover:text-green-500'
                        }`}
                      >
                        <FaThumbsUp className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDislikeActivity(item.id)}
                        className={`p-2 rounded-full transition-all ${
                          isDisliked 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <FaThumbsDown className="text-sm" />
                      </button>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert('Edit activity functionality coming soon!')}
                        className="text-xs"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert('Replace activity functionality coming soon!')}
                        className="text-xs"
                      >
                        <FaPlus className="mr-1" />
                        Replace
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* Day Notes */}
      {day.notes && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <FaStickyNote className="text-blue-600 mr-2 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Day Notes</h4>
              <p className="text-blue-800 text-sm">{day.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Section */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start">
          <FaHeart className="text-yellow-600 mr-2 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">How does this day look?</h4>
            <p className="text-yellow-800 text-sm mb-3">
              Your feedback helps AI improve future recommendations. Like activities you're excited about!
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-green-700">
                <FaThumbsUp className="mr-1" />
                <span>{likedActivities.length} liked</span>
              </div>
              <div className="flex items-center text-red-700">
                <FaThumbsDown className="mr-1" />
                <span>{dislikedActivities.length} to improve</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneratedDayPlan