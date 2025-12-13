import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import { Itinerary, ItineraryItem } from '../pages/ItineraryPage'
import {
  FaUsers, FaEdit, FaEye, FaSave, FaTimes, FaPlus, FaTrash,
  FaClock, FaMapMarkerAlt, FaDollarSign, FaCommentAlt,
  FaUserCircle, FaCircle
} from 'react-icons/fa'

interface CollaborativeEditorProps {
  itinerary: Itinerary
  onUpdate: (itinerary: Itinerary) => void
  userRole: 'owner' | 'editor' | 'viewer'
  isShared?: boolean
}

interface ActiveUser {
  id: string
  name: string
  avatar?: string
  color: string
  cursor?: { x: number; y: number }
  editing?: string // ID of item being edited
}

interface EditingState {
  itemId: string
  field: string
  value: string
  userId: string
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  itinerary,
  onUpdate,
  userRole,
  isShared = false
}) => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [editingStates, setEditingStates] = useState<EditingState[]>([])
  const [selectedDay, setSelectedDay] = useState(0)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValues, setTempValues] = useState<Record<string, string>>({})
  const [showActiveUsers, setShowActiveUsers] = useState(true)

  // Simulate active users for demo
  useEffect(() => {
    if (isShared) {
      const mockUsers: ActiveUser[] = [
        {
          id: 'user-1',
          name: 'Sarah Johnson',
          color: '#3B82F6',
          editing: undefined
        },
        {
          id: 'user-2',
          name: 'Mike Chen',
          color: '#10B981',
          editing: 'item-2'
        },
        {
          id: 'user-3',
          name: 'Emily Davis',
          color: '#8B5CF6',
          editing: undefined
        }
      ]
      setActiveUsers(mockUsers)

      // Simulate editing states
      const mockEditingStates: EditingState[] = [
        {
          itemId: 'item-2',
          field: 'description',
          value: 'Updated description...',
          userId: 'user-2'
        }
      ]
      setEditingStates(mockEditingStates)
    }
  }, [isShared])

  const canEdit = userRole === 'owner' || userRole === 'editor'

  const handleStartEdit = (itemId: string, field: string, currentValue: string) => {
    if (!canEdit) return
    
    setEditingItem(itemId)
    setEditingField(field)
    setTempValues({ ...tempValues, [`${itemId}-${field}`]: currentValue })
  }

  const handleSaveEdit = (itemId: string, field: string) => {
    const key = `${itemId}-${field}`
    const newValue = tempValues[key]
    
    if (newValue !== undefined) {
      const updatedItinerary = { ...itinerary }
      const dayIndex = selectedDay
      const itemIndex = updatedItinerary.days[dayIndex].items.findIndex(item => item.id === itemId)
      
      if (itemIndex !== -1) {
        updatedItinerary.days[dayIndex].items[itemIndex] = {
          ...updatedItinerary.days[dayIndex].items[itemIndex],
          [field]: field === 'price' ? parseFloat(newValue) || 0 : newValue
        }
        onUpdate(updatedItinerary)
      }
    }
    
    setEditingItem(null)
    setEditingField(null)
    const newTempValues = { ...tempValues }
    delete newTempValues[key]
    setTempValues(newTempValues)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditingField(null)
    setTempValues({})
  }

  const handleAddItem = () => {
    if (!canEdit) return
    
    const newItem: ItineraryItem = {
      id: `item-${Date.now()}`,
      type: 'activity',
      title: 'New Activity',
      description: '',
      location: '',
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      price: 0,
      category: 'Activity',
      bookingStatus: 'pending'
    }
    
    const updatedItinerary = { ...itinerary }
    updatedItinerary.days[selectedDay].items.push(newItem)
    onUpdate(updatedItinerary)
  }

  const handleDeleteItem = (itemId: string) => {
    if (!canEdit) return
    
    const updatedItinerary = { ...itinerary }
    updatedItinerary.days[selectedDay].items = updatedItinerary.days[selectedDay].items.filter(
      item => item.id !== itemId
    )
    onUpdate(updatedItinerary)
  }

  const getUserEditingItem = (itemId: string) => {
    const editingState = editingStates.find(state => state.itemId === itemId)
    if (editingState) {
      return activeUsers.find(user => user.id === editingState.userId)
    }
    return null
  }

  const isFieldBeingEdited = (itemId: string, field: string) => {
    return editingStates.some(state => 
      state.itemId === itemId && state.field === field
    )
  }

  const renderEditableField = (
    item: ItineraryItem,
    field: keyof ItineraryItem,
    label: string,
    type: 'text' | 'textarea' | 'time' | 'number' = 'text'
  ) => {
    const isEditing = editingItem === item.id && editingField === field
    const isBeingEdited = isFieldBeingEdited(item.id, field as string)
    const editingUser = getUserEditingItem(item.id)
    const key = `${item.id}-${field}`
    const value = isEditing ? (tempValues[key] ?? item[field]) : item[field]

    if (isEditing) {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <div className="flex items-center space-x-2">
            {type === 'textarea' ? (
              <textarea
                value={value as string}
                onChange={(e) => setTempValues({ ...tempValues, [key]: e.target.value })}
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                autoFocus
              />
            ) : (
              <input
                type={type}
                value={value as string}
                onChange={(e) => setTempValues({ ...tempValues, [key]: e.target.value })}
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            )}
            <Button
              onClick={() => handleSaveEdit(item.id, field as string)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FaSave />
            </Button>
            <Button
              onClick={handleCancelEdit}
              size="sm"
              variant="outline"
            >
              <FaTimes />
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div
          className={`group relative ${
            canEdit ? 'cursor-pointer hover:bg-gray-50' : ''
          } ${
            isBeingEdited ? 'bg-yellow-50 border border-yellow-200' : ''
          } p-2 rounded-lg transition-all`}
          onClick={() => canEdit && handleStartEdit(item.id, field as string, value as string)}
        >
          <div className="flex items-center justify-between">
            <span className={`${!value ? 'text-gray-400 italic' : 'text-gray-900'}`}>
              {value || `Enter ${label.toLowerCase()}...`}
            </span>
            {canEdit && (
              <FaEdit className="opacity-0 group-hover:opacity-100 text-gray-400 text-sm transition-opacity" />
            )}
          </div>
          
          {isBeingEdited && editingUser && (
            <div className="absolute -top-2 -right-2 flex items-center space-x-1 bg-white border border-gray-200 rounded-full px-2 py-1 text-xs">
              <FaCircle className="text-xs" style={{ color: editingUser.color }} />
              <span>{editingUser.name}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const currentDay = itinerary.days[selectedDay]

  return (
    <div className="space-y-6">
      {/* Active Users Bar */}
      {isShared && activeUsers.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaUsers className="text-blue-600" />
              <span className="font-medium">Active Collaborators</span>
              <span className="text-sm text-gray-500">({activeUsers.length} online)</span>
            </div>
            <Button
              onClick={() => setShowActiveUsers(!showActiveUsers)}
              variant="outline"
              size="sm"
            >
              {showActiveUsers ? <FaEye /> : <FaUsers />}
            </Button>
          </div>
          
          {showActiveUsers && (
            <div className="mt-3 flex items-center space-x-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      user.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{user.name}</div>
                    {user.editing && (
                      <div className="text-xs text-gray-500">Editing...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Day Navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {itinerary.days.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all ${
                  selectedDay === index
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div>Day {index + 1}</div>
                <div className="text-xs opacity-75">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Day Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Day {selectedDay + 1} - {new Date(currentDay.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <p className="text-gray-600">
                {currentDay.items.length} activities • ${currentDay.totalCost} total cost
              </p>
            </div>
            
            {canEdit && (
              <Button
                onClick={handleAddItem}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FaPlus className="mr-2" />
                Add Activity
              </Button>
            )}
          </div>

          {/* Activities */}
          <div className="space-y-4">
            {currentDay.items.map((item, index) => {
              const editingUser = getUserEditingItem(item.id)
              
              return (
                <div
                  key={item.id}
                  className={`bg-gray-50 rounded-xl p-6 transition-all ${
                    editingUser ? 'ring-2 ring-opacity-50' : ''
                  }`}
                  style={{
                    ringColor: editingUser?.color
                  }}
                >
                  {editingUser && (
                    <div className="flex items-center space-x-2 mb-4 text-sm">
                      <FaUserCircle style={{ color: editingUser.color }} />
                      <span className="text-gray-600">
                        {editingUser.name} is editing this activity
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderEditableField(item, 'title', 'Activity Title')}
                      {renderEditableField(item, 'location', 'Location')}
                    </div>
                    
                    {canEdit && (
                      <Button
                        onClick={() => handleDeleteItem(item.id)}
                        variant="outline"
                        size="sm"
                        className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {renderEditableField(item, 'startTime', 'Start Time', 'time')}
                    {renderEditableField(item, 'endTime', 'End Time', 'time')}
                    {renderEditableField(item, 'price', 'Price ($)', 'number')}
                  </div>

                  {renderEditableField(item, 'description', 'Description', 'textarea')}

                  {/* Activity Meta */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        {item.duration} min
                      </div>
                      <div className="flex items-center">
                        <FaDollarSign className="mr-1" />
                        ${item.price}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                        item.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.bookingStatus}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isShared && (
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <FaCommentAlt className="mr-1" />
                          Comment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Day Notes */}
          <div className="mt-6">
            {renderEditableField(
              { ...currentDay, id: `day-${selectedDay}` } as any,
              'notes',
              'Day Notes',
              'textarea'
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollaborativeEditor