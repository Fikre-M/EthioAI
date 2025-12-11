import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import { DayPlanData, ItineraryItem } from '../pages/ItineraryPage'
import {
  FaPlane, FaHotel, FaMapMarkerAlt, FaClock, FaDollarSign,
  FaEdit, FaTrash, FaPlus, FaGripVertical, FaCheck,
  FaUtensils, FaCar, FaCamera, FaTicketAlt, FaStickyNote,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa'

interface DayPlanProps {
  day: DayPlanData
  dayNumber: number
  isEditing: boolean
  onUpdate: (updatedDay: DayPlanData) => void
}

const DayPlan: React.FC<DayPlanProps> = ({
  day,
  dayNumber,
  isEditing,
  onUpdate
}) => {
  const [showAddItem, setShowAddItem] = useState(false)
  const [dayNotes, setDayNotes] = useState(day.notes || '')

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

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = day.items.filter(item => item.id !== itemId)
    const updatedDay = {
      ...day,
      items: updatedItems,
      totalCost: updatedItems.reduce((sum, item) => sum + item.price, 0),
      totalDuration: updatedItems.reduce((sum, item) => sum + item.duration, 0)
    }
    onUpdate(updatedDay)
  }

  const handleUpdateNotes = () => {
    onUpdate({
      ...day,
      notes: dayNotes
    })
  }

  const handleAddNewItem = () => {
    const newItem: ItineraryItem = {
      id: `item-${Date.now()}`,
      type: 'activity',
      title: 'New Activity',
      description: 'Add description...',
      location: 'Location',
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      price: 0,
      category: 'Activity',
      bookingStatus: 'pending'
    }

    const updatedItems = [...day.items, newItem]
    const updatedDay = {
      ...day,
      items: updatedItems,
      totalCost: updatedItems.reduce((sum, item) => sum + item.price, 0),
      totalDuration: updatedItems.reduce((sum, item) => sum + item.duration, 0)
    }
    onUpdate(updatedDay)
    setShowAddItem(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Day Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Day {dayNumber}</h2>
            <p className="text-purple-100">{formatDate(day.date)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${day.totalCost}</div>
            <div className="text-purple-100">{day.items.length} activities</div>
          </div>
        </div>
        
        {/* Day Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold">{formatDuration(day.totalDuration)}</div>
            <div className="text-xs text-purple-200">Total Duration</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{day.items.length}</div>
            <div className="text-xs text-purple-200">Activities</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {day.items.filter(item => item.bookingStatus === 'confirmed').length}
            </div>
            <div className="text-xs text-purple-200">Confirmed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {day.items.filter(item => item.bookingStatus === 'pending').length}
            </div>
            <div className="text-xs text-purple-200">Pending</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        {day.items.length === 0 ? (
          <div className="text-center py-12">
            <FaMapMarkerAlt className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No activities planned</h3>
            <p className="text-gray-500 mb-4">Start building your day by adding activities, tours, or meals.</p>
            {isEditing && (
              <Button
                onClick={() => setShowAddItem(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <FaPlus className="mr-2" />
                Add First Activity
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {day.items
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((item) => {
                const IconComponent = getItemIcon(item.type)
                return (
                  <div
                    key={item.id}
                    className={`border-2 rounded-xl p-4 transition-all ${getItemColor(item.type)} ${
                      isEditing ? 'hover:shadow-md' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        {isEditing && (
                          <div className="mr-3 mt-1 cursor-move">
                            <FaGripVertical className="text-gray-400" />
                          </div>
                        )}
                        
                        <div className="mr-4 mt-1">
                          <IconComponent className="text-lg" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-lg mr-3">{item.title}</h4>
                            {getStatusIcon(item.bookingStatus)}
                          </div>
                          
                          <p className="text-sm mb-3 opacity-90">{item.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
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
                          
                          {item.notes && (
                            <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-sm">
                              <FaStickyNote className="inline mr-2 opacity-70" />
                              {item.notes}
                            </div>
                          )}
                          
                          {item.bookingReference && (
                            <div className="mt-2 text-xs opacity-75">
                              Booking: {item.bookingReference}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alert('Edit functionality coming soon!')}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {/* Add New Item Button */}
        {isEditing && day.items.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => setShowAddItem(true)}
              variant="outline"
              className="border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <FaPlus className="mr-2" />
              Add Activity
            </Button>
          </div>
        )}

        {/* Day Notes */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center">
              <FaStickyNote className="mr-2 text-gray-500" />
              Day Notes
            </h4>
            {isEditing && (
              <Button
                size="sm"
                onClick={handleUpdateNotes}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <FaCheck className="mr-1" />
                Save
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <textarea
              value={dayNotes}
              onChange={(e) => setDayNotes(e.target.value)}
              placeholder="Add notes for this day..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
              {day.notes || 'No notes added for this day.'}
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Activity</h3>
            <p className="text-gray-600 mb-6">
              Choose what type of activity you'd like to add to this day.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { type: 'tour', label: 'Tour', icon: FaTicketAlt },
                { type: 'restaurant', label: 'Restaurant', icon: FaUtensils },
                { type: 'activity', label: 'Activity', icon: FaCamera },
                { type: 'transport', label: 'Transport', icon: FaCar },
                { type: 'hotel', label: 'Hotel', icon: FaHotel },
                { type: 'flight', label: 'Flight', icon: FaPlane }
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={handleAddNewItem}
                  className="p-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
                >
                  <Icon className="mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium">{label}</div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAddItem(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DayPlan