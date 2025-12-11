import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import { TripPreferencesData } from './GenerateItineraryPage'
import { ItineraryItem, DayPlanData, Itinerary } from './ItineraryPage'
import GeneratedDayPlan from '../components/GeneratedDayPlan'
import {
  FaRobot, FaArrowLeft, FaSave, FaEdit, FaShoppingCart, FaShare,
  FaCalendarAlt, FaMapMarkedAlt, FaDollarSign, FaUsers, FaClock,
  FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaHeart
} from 'react-icons/fa'

const GeneratedItineraryPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const preferences = location.state?.preferences as TripPreferencesData
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(0)

  useEffect(() => {
    if (!preferences) {
      navigate('/itinerary/generate')
      return
    }
    
    generateItinerary()
  }, [preferences, navigate])

  const generateItinerary = async () => {
    setIsLoading(true)
    
    // Simulate AI generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock itinerary based on preferences
    const startDate = new Date(preferences.startDate)
    const endDate = new Date(preferences.endDate)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    const mockItinerary: Itinerary = {
      id: `ai-generated-${Date.now()}`,
      title: `AI-Generated Ethiopian Adventure`,
      description: `Personalized ${days}-day journey through Ethiopia's highlights`,
      destination: preferences.destination,
      startDate: preferences.startDate,
      endDate: preferences.endDate,
      travelers: preferences.travelers,
      totalBudget: preferences.budget,
      actualCost: Math.round(preferences.budget * 0.85), // 85% of budget used
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      days: generateDays(days, preferences)
    }
    
    setGeneratedItinerary(mockItinerary)
    setIsLoading(false)
  }

  const generateDays = (numDays: number, prefs: TripPreferencesData): DayPlanData[] => {
    const days: DayPlanData[] = []
    const startDate = new Date(prefs.startDate)
    
    // Sample activities based on interests
    const activityPool = createActivityPool(prefs.interests)
    
    for (let i = 0; i < numDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      
      const dayActivities = generateDayActivities(i, numDays, prefs, activityPool)
      const totalCost = dayActivities.reduce((sum, item) => sum + item.price, 0)
      const totalDuration = dayActivities.reduce((sum, item) => sum + item.duration, 0)
      
      days.push({
        date: currentDate.toISOString().split('T')[0],
        items: dayActivities,
        totalCost,
        totalDuration,
        notes: generateDayNotes(i, numDays, prefs)
      })
    }
    
    return days
  }

  const createActivityPool = (interests: string[]) => {
    const activities: { [key: string]: ItineraryItem[] } = {
      history: [
        {
          id: 'hist-1',
          type: 'tour',
          title: 'Lalibela Rock Churches Tour',
          description: 'Explore the famous rock-hewn churches of Lalibela',
          location: 'Lalibela',
          startTime: '09:00',
          endTime: '12:00',
          duration: 180,
          price: 45,
          category: 'Sightseeing',
          bookingStatus: 'pending'
        },
        {
          id: 'hist-2',
          type: 'tour',
          title: 'Gondar Castle Complex',
          description: 'Visit the royal enclosure and Fasil Ghebbi',
          location: 'Gondar',
          startTime: '10:00',
          endTime: '13:00',
          duration: 180,
          price: 35,
          category: 'Sightseeing',
          bookingStatus: 'pending'
        }
      ],
      culture: [
        {
          id: 'cult-1',
          type: 'activity',
          title: 'Traditional Coffee Ceremony',
          description: 'Experience authentic Ethiopian coffee culture',
          location: 'Local Family Home',
          startTime: '15:00',
          endTime: '16:30',
          duration: 90,
          price: 25,
          category: 'Cultural',
          bookingStatus: 'pending'
        },
        {
          id: 'cult-2',
          type: 'activity',
          title: 'Traditional Dance Performance',
          description: 'Watch authentic Ethiopian cultural dances',
          location: 'Cultural Center',
          startTime: '19:00',
          endTime: '20:30',
          duration: 90,
          price: 30,
          category: 'Cultural',
          bookingStatus: 'pending'
        }
      ],
      nature: [
        {
          id: 'nat-1',
          type: 'tour',
          title: 'Simien Mountains Day Hike',
          description: 'Hike in the stunning Simien Mountains National Park',
          location: 'Simien Mountains',
          startTime: '08:00',
          endTime: '16:00',
          duration: 480,
          price: 75,
          category: 'Adventure',
          bookingStatus: 'pending'
        },
        {
          id: 'nat-2',
          type: 'tour',
          title: 'Blue Nile Falls Visit',
          description: 'Visit the spectacular Blue Nile Falls',
          location: 'Bahir Dar',
          startTime: '09:00',
          endTime: '15:00',
          duration: 360,
          price: 55,
          category: 'Nature',
          bookingStatus: 'pending'
        }
      ],
      food: [
        {
          id: 'food-1',
          type: 'restaurant',
          title: 'Traditional Ethiopian Feast',
          description: 'Multi-course traditional meal with injera and various stews',
          location: 'Yod Abyssinia Restaurant',
          startTime: '18:00',
          endTime: '20:00',
          duration: 120,
          price: 35,
          category: 'Dining',
          bookingStatus: 'pending'
        },
        {
          id: 'food-2',
          type: 'activity',
          title: 'Cooking Class',
          description: 'Learn to cook traditional Ethiopian dishes',
          location: 'Cooking School',
          startTime: '14:00',
          endTime: '17:00',
          duration: 180,
          price: 50,
          category: 'Cultural',
          bookingStatus: 'pending'
        }
      ]
    }
    
    return activities
  }

  const generateDayActivities = (dayIndex: number, _totalDays: number, prefs: TripPreferencesData, activityPool: any): ItineraryItem[] => {
    const activities: ItineraryItem[] = []
    
    // First day - arrival
    if (dayIndex === 0) {
      activities.push({
        id: `arrival-${dayIndex}`,
        type: 'flight',
        title: 'Arrival in Addis Ababa',
        description: 'Arrive at Bole International Airport',
        location: 'Bole International Airport',
        startTime: '14:00',
        endTime: '15:00',
        duration: 60,
        price: 0,
        category: 'Transportation',
        bookingStatus: 'confirmed'
      })
      
      activities.push({
        id: `hotel-${dayIndex}`,
        type: 'hotel',
        title: 'Hotel Check-in',
        description: getAccommodationByType(prefs.accommodation),
        location: 'Addis Ababa',
        startTime: '16:00',
        endTime: '16:30',
        duration: 30,
        price: getAccommodationPrice(prefs.accommodation),
        category: 'Accommodation',
        bookingStatus: 'pending'
      })
    }
    
    // Add activities based on interests
    const dailyActivityCount = prefs.pace === 'relaxed' ? 2 : prefs.pace === 'moderate' ? 3 : 4
    const availableInterests = prefs.interests.filter(interest => activityPool[interest])
    
    for (let i = 0; i < dailyActivityCount && i < availableInterests.length; i++) {
      const interest = availableInterests[i % availableInterests.length]
      const interestActivities = activityPool[interest]
      if (interestActivities && interestActivities.length > 0) {
        const activity = { ...interestActivities[i % interestActivities.length] }
        activity.id = `${activity.id}-day${dayIndex}`
        activities.push(activity)
      }
    }
    
    return activities
  }

  const getAccommodationByType = (type: string) => {
    switch (type) {
      case 'budget': return 'Budget Guesthouse - Clean and comfortable accommodation'
      case 'luxury': return 'Luxury Resort - Premium accommodation with full amenities'
      default: return 'Mid-Range Hotel - Comfortable hotel with good facilities'
    }
  }

  const getAccommodationPrice = (type: string) => {
    switch (type) {
      case 'budget': return 30
      case 'luxury': return 150
      default: return 75
    }
  }

  const generateDayNotes = (dayIndex: number, totalDays: number, _prefs: TripPreferencesData) => {
    if (dayIndex === 0) return 'Welcome to Ethiopia! Take time to rest and adjust to the local time.'
    if (dayIndex === totalDays - 1) return 'Last day - pack souvenirs and prepare for departure.'
    return `Day ${dayIndex + 1} of your Ethiopian adventure. Enjoy the experiences!`
  }

  const handleSaveItinerary = () => {
    if (generatedItinerary) {
      // Save to user's itineraries
      navigate('/itinerary', { state: { savedItinerary: generatedItinerary } })
    }
  }

  const handleCustomizeItinerary = () => {
    if (generatedItinerary) {
      navigate('/itinerary', { state: { editItinerary: generatedItinerary } })
    }
  }

  const handleBookAll = () => {
    alert('Booking all activities functionality will be implemented with payment integration!')
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Preferences Found</h2>
          <p className="text-gray-600 mb-6">Please start the AI generation process from the beginning.</p>
          <Button onClick={() => navigate('/itinerary/generate')} className="bg-red-600 hover:bg-red-700 text-white">
            Start AI Generation
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <FaRobot className="text-8xl text-purple-600 mx-auto animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI is Creating Your Perfect Itinerary</h2>
          <p className="text-gray-600 mb-6">Analyzing your preferences and crafting personalized experiences...</p>
          <div className="w-64 bg-gray-200 rounded-full h-3 mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!generatedItinerary) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={() => navigate('/itinerary/generate')}
            variant="outline"
            className="mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Generator
          </Button>
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <FaRobot className="text-3xl text-green-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Your AI-Generated Itinerary</h1>
              <FaCheckCircle className="text-2xl text-green-500 ml-3" />
            </div>
            <p className="text-gray-600">Personalized for your preferences • Ready to customize and book</p>
          </div>
        </div>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎉 Your Itinerary is Ready!</h2>
              <p className="text-green-100">
                AI has created a personalized {generatedItinerary.days.length}-day Ethiopian adventure 
                matching your interests and budget.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${generatedItinerary.actualCost}</div>
              <div className="text-green-200">Total Cost</div>
            </div>
          </div>
        </div>    
    {/* Itinerary Overview */}
        <div className="grid lg:grid-cols-4 gap-8 mb-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <FaCalendarAlt className="text-3xl text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{generatedItinerary.days.length}</div>
              <div className="text-gray-600">Days</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <FaMapMarkedAlt className="text-3xl text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">
                {generatedItinerary.days.reduce((sum, day) => sum + day.items.length, 0)}
              </div>
              <div className="text-gray-600">Activities</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <FaDollarSign className="text-3xl text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">${generatedItinerary.actualCost}</div>
              <div className="text-gray-600">Total Cost</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <FaUsers className="text-3xl text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{generatedItinerary.travelers}</div>
              <div className="text-gray-600">Travelers</div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleSaveItinerary}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FaSave className="mr-2" />
                Save Itinerary
              </Button>
              
              <Button
                onClick={handleCustomizeItinerary}
                variant="outline"
                className="w-full"
              >
                <FaEdit className="mr-2" />
                Customize
              </Button>
              
              <Button
                onClick={handleBookAll}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <FaShoppingCart className="mr-2" />
                Book All Activities
              </Button>
              
              <Button
                onClick={() => alert('Share functionality coming soon!')}
                variant="outline"
                className="w-full"
              >
                <FaShare className="mr-2" />
                Share Itinerary
              </Button>
            </div>
          </div>

          {/* Day Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Day Tabs */}
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex overflow-x-auto">
                  {generatedItinerary.days.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all ${
                        selectedDay === index
                          ? 'bg-white text-purple-600 border-b-2 border-purple-600'
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

              {/* Selected Day Content */}
              {generatedItinerary.days[selectedDay] && (
                <GeneratedDayPlan
                  day={generatedItinerary.days[selectedDay]}
                  dayNumber={selectedDay + 1}
                  preferences={preferences}
                />
              )}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <FaLightbulb className="text-2xl text-yellow-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">AI Insights & Recommendations</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <FaClock className="text-blue-600 mb-2" />
              <h4 className="font-semibold text-blue-900 mb-1">Optimal Timing</h4>
              <p className="text-sm text-blue-800">
                Your itinerary is optimized for {preferences.pace} pace with 
                {preferences.pace === 'relaxed' ? ' 2-3' : preferences.pace === 'moderate' ? ' 3-4' : ' 4-5'} activities per day.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <FaDollarSign className="text-green-600 mb-2" />
              <h4 className="font-semibold text-green-900 mb-1">Budget Optimization</h4>
              <p className="text-sm text-green-800">
                Staying within ${preferences.budget} budget with {Math.round(((preferences.budget - generatedItinerary.actualCost) / preferences.budget) * 100)}% buffer for extras.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <FaHeart className="text-purple-600 mb-2" />
              <h4 className="font-semibold text-purple-900 mb-1">Interest Match</h4>
              <p className="text-sm text-purple-800">
                {preferences.interests.length} interests covered including {preferences.interests.slice(0, 2).join(', ')}.
              </p>
            </div>
          </div>
        </div>

        {/* Customization Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start">
            <FaLightbulb className="text-yellow-600 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Customization Tips</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Click "Customize" to modify activities, timing, or add personal touches</li>
                <li>• All activities are suggestions - you can replace or remove any item</li>
                <li>• Prices are estimates and may vary based on season and availability</li>
                <li>• Save your itinerary to access it later and make bookings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneratedItineraryPage