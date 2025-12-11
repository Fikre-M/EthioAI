import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import DayPlan from '../components/DayPlan'
import {
  FaCalendarAlt, FaPlus, FaMapMarkedAlt, FaSave, FaShare,
  FaClock, FaUsers, FaRoute,
  FaEdit
} from 'react-icons/fa'

export interface ItineraryItem {
  id: string
  type: 'flight' | 'hotel' | 'activity' | 'restaurant' | 'transport' | 'tour'
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  duration: number // in minutes
  price: number
  category: string
  notes?: string
  bookingStatus: 'pending' | 'confirmed' | 'cancelled'
  bookingReference?: string
}

export interface DayPlanData {
  date: string
  items: ItineraryItem[]
  totalCost: number
  totalDuration: number
  notes?: string
}

export interface Itinerary {
  id: string
  title: string
  description: string
  destination: string
  startDate: string
  endDate: string
  travelers: number
  days: DayPlanData[]
  totalBudget: number
  actualCost: number
  status: 'draft' | 'confirmed' | 'completed'
  createdAt: string
  updatedAt: string
}

const ItineraryPage: React.FC = () => {
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [selectedDay, setSelectedDay] = useState(0)
  const [isEditing, setIsEditing] = useState(false)

  // Mock itinerary data
  const mockItinerary: Itinerary = {
    id: 'itin-001',
    title: 'Ethiopian Historical Circuit',
    description: 'Explore the ancient wonders of Ethiopia including Lalibela, Gondar, and Axum',
    destination: 'Ethiopia',
    startDate: '2024-02-15',
    endDate: '2024-02-22',
    travelers: 2,
    totalBudget: 2500,
    actualCost: 2180,
    status: 'draft',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    days: [
      {
        date: '2024-02-15',
        totalCost: 320,
        totalDuration: 480,
        items: [
          {
            id: 'item-001',
            type: 'flight',
            title: 'Flight to Lalibela',
            description: 'Ethiopian Airlines ET 101 - Addis Ababa to Lalibela',
            location: 'Bole International Airport',
            startTime: '08:30',
            endTime: '09:45',
            duration: 75,
            price: 189,
            category: 'Transportation',
            bookingStatus: 'confirmed',
            bookingReference: 'ET101-ABC123'
          },
          {
            id: 'item-002',
            type: 'hotel',
            title: 'Check-in at Lalibela Hotel',
            description: 'Traditional Ethiopian hotel with mountain views',
            location: 'Lalibela',
            startTime: '11:00',
            endTime: '11:30',
            duration: 30,
            price: 85,
            category: 'Accommodation',
            bookingStatus: 'confirmed'
          },
          {
            id: 'item-003',
            type: 'tour',
            title: 'Rock Churches Tour - Group 1',
            description: 'Visit Bet Giyorgis, Bet Maryam, and other famous rock-hewn churches',
            location: 'Lalibela Rock Churches',
            startTime: '14:00',
            endTime: '17:30',
            duration: 210,
            price: 45,
            category: 'Sightseeing',
            bookingStatus: 'pending',
            notes: 'Bring comfortable walking shoes'
          }
        ],
        notes: 'First day in Lalibela - take it easy and adjust to altitude'
      },
      {
        date: '2024-02-16',
        totalCost: 180,
        totalDuration: 420,
        items: [
          {
            id: 'item-004',
            type: 'tour',
            title: 'Rock Churches Tour - Group 2',
            description: 'Continue exploring the remaining rock churches',
            location: 'Lalibela Rock Churches',
            startTime: '09:00',
            endTime: '12:00',
            duration: 180,
            price: 45,
            category: 'Sightseeing',
            bookingStatus: 'pending'
          },
          {
            id: 'item-005',
            type: 'restaurant',
            title: 'Traditional Ethiopian Lunch',
            description: 'Authentic Ethiopian cuisine with injera and various stews',
            location: 'Seven Olives Hotel Restaurant',
            startTime: '12:30',
            endTime: '13:30',
            duration: 60,
            price: 25,
            category: 'Dining',
            bookingStatus: 'pending'
          },
          {
            id: 'item-006',
            type: 'activity',
            title: 'Local Market Visit',
            description: 'Explore local crafts and souvenirs at Lalibela market',
            location: 'Lalibela Market',
            startTime: '15:00',
            endTime: '17:00',
            duration: 120,
            price: 0,
            category: 'Cultural',
            bookingStatus: 'pending'
          }
        ]
      }
    ]
  }

  useEffect(() => {
    // Load itinerary data (mock for now)
    setItinerary(mockItinerary)
  }, [])

  const handleAddDay = () => {
    if (!itinerary) return
    
    const lastDate = new Date(itinerary.days[itinerary.days.length - 1]?.date || itinerary.startDate)
    const newDate = new Date(lastDate)
    newDate.setDate(newDate.getDate() + 1)
    
    const newDay: DayPlanData = {
      date: newDate.toISOString().split('T')[0],
      items: [],
      totalCost: 0,
      totalDuration: 0
    }
    
    setItinerary({
      ...itinerary,
      days: [...itinerary.days, newDay]
    })
  }

  const handleUpdateDay = (dayIndex: number, updatedDay: DayPlanData) => {
    if (!itinerary) return
    
    const updatedDays = [...itinerary.days]
    updatedDays[dayIndex] = updatedDay
    
    // Recalculate total cost
    const actualCost = updatedDays.reduce((total, day) => total + day.totalCost, 0)
    
    setItinerary({
      ...itinerary,
      days: updatedDays,
      actualCost,
      updatedAt: new Date().toISOString()
    })
  }

  const handleSaveItinerary = () => {
    // Save itinerary logic will be implemented with backend
    alert('Itinerary saved successfully!')
  }

  const handleShareItinerary = () => {
    // Share itinerary logic
    if (navigator.share) {
      navigator.share({
        title: itinerary?.title,
        text: itinerary?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Itinerary link copied to clipboard!')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDayNumber = (dateString: string) => {
    if (!itinerary) return 1
    const startDate = new Date(itinerary.startDate)
    const currentDate = new Date(dateString)
    const diffTime = currentDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-900 mr-4">{itinerary.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  itinerary.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  itinerary.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{itinerary.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaMapMarkedAlt className="mr-1" />
                  {itinerary.destination}
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-1" />
                  {itinerary.travelers} travelers
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  {itinerary.days.length} days
                </div>
              </div>
            </div>
            
            <div className="flex flex-col lg:items-end">
              <div className="mb-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">${itinerary.actualCost}</div>
                  <div className="text-sm text-gray-500">of ${itinerary.totalBudget} budget</div>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (itinerary.actualCost / itinerary.totalBudget) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <FaEdit className="mr-2" />
                  {isEditing ? 'View Mode' : 'Edit'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareItinerary}
                >
                  <FaShare className="mr-2" />
                  Share
                </Button>
                <Button
                  onClick={handleSaveItinerary}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FaSave className="mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Day Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Days</h2>
                <Button
                  size="sm"
                  onClick={handleAddDay}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FaPlus className="mr-1" />
                  Add Day
                </Button>
              </div>
              
              <div className="space-y-3">
                {itinerary.days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedDay === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      Day {getDayNumber(day.date)}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {formatDate(day.date)}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{day.items.length} items</span>
                      <span className="font-medium text-purple-600">${day.totalCost}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3">Trip Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Days:</span>
                    <span className="font-medium">{itinerary.days.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="font-medium text-purple-600">${itinerary.actualCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget Left:</span>
                    <span className={`font-medium ${
                      itinerary.totalBudget - itinerary.actualCost >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${itinerary.totalBudget - itinerary.actualCost}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Day Plan */}
          <div className="lg:col-span-3">
            {itinerary.days[selectedDay] && (
              <DayPlan
                day={itinerary.days[selectedDay]}
                dayNumber={getDayNumber(itinerary.days[selectedDay].date)}
                isEditing={isEditing}
                onUpdate={(updatedDay) => handleUpdateDay(selectedDay, updatedDay)}
              />
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-6 right-6 flex items-center space-x-3">
          <Button
            variant="outline"
            className="bg-white shadow-lg"
            onClick={() => navigate('/transport')}
          >
            <FaRoute className="mr-2" />
            Add Transport
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
            onClick={() => alert('Add activity functionality coming soon!')}
          >
            <FaPlus className="mr-2" />
            Add Activity
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ItineraryPage