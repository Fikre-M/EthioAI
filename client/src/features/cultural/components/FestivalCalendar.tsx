import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaHeart,
  FaShare, FaSearch, FaChevronLeft, FaChevronRight,
  FaStar, FaInfoCircle, FaImage, FaMusic, FaUtensils
} from 'react-icons/fa'

interface Festival {
  id: string
  name: string
  description: string
  type: 'religious' | 'cultural' | 'seasonal' | 'harvest' | 'national'
  date: string
  duration: number
  location: string
  region: string
  ethnicity?: string
  significance: string
  activities: string[]
  traditionalFoods?: string[]
  images?: string[]
  isRecurring: boolean
  nextOccurrence?: string
  popularity: number
  attendees?: number
  history?: string
  culturalImpact?: string
  modernCelebration?: string
  relatedTours?: {
    id: string
    name: string
    price: number
    duration: string
    highlights: string[]
  }[]
}

interface FestivalCalendarProps {
  festivals?: Festival[]
  className?: string
}

const FestivalCalendar: React.FC<FestivalCalendarProps> = ({
  festivals: propFestivals,
  className = ''
}) => {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'timeline'>('calendar')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Mock festival data
  const mockFestivals: Festival[] = propFestivals || [
    {
      id: '1',
      name: 'Timkat (Ethiopian Epiphany)',
      description: 'The most important religious festival in Ethiopia, celebrating the baptism of Jesus Christ.',
      type: 'religious',
      date: '2025-01-19',
      duration: 3,
      location: 'Nationwide, especially Gondar and Lalibela',
      region: 'Nationwide',
      ethnicity: 'Ethiopian Orthodox Christians',
      significance: 'Commemorates the baptism of Jesus Christ in the Jordan River',
      activities: ['Processions', 'Blessing of water', 'Traditional dancing', 'Feasting'],
      traditionalFoods: ['Doro Wat', 'Injera', 'Honey wine'],
      images: ['/images/festivals/timkat-1.jpg', '/images/festivals/timkat-2.jpg'],
      isRecurring: true,
      nextOccurrence: '2025-01-19',
      popularity: 95,
      attendees: 500000,
      history: 'Timkat has been celebrated for over 1,600 years, dating back to the 4th century when Christianity was introduced to Ethiopia. The festival commemorates the baptism of Jesus Christ in the Jordan River by John the Baptist.',
      culturalImpact: 'Timkat is the most important religious festival in Ethiopia, bringing together millions of Orthodox Christians in a celebration of faith, community, and cultural identity.',
      modernCelebration: 'Today, Timkat is celebrated with elaborate processions, traditional music, and the blessing of water, maintaining its ancient traditions while adapting to modern times.',
      relatedTours: [
        {
          id: 'timkat-gondar-tour',
          name: 'Timkat Festival Experience in Gondar',
          price: 450,
          duration: '3 days / 2 nights',
          highlights: ['Festival procession', 'Fasilides Bath ceremony', 'Traditional music', 'Local cuisine']
        },
        {
          id: 'timkat-lalibela-tour',
          name: 'Timkat Pilgrimage to Lalibela',
          price: 650,
          duration: '4 days / 3 nights',
          highlights: ['Rock churches visit', 'Religious ceremonies', 'Cultural performances', 'Photography tour']
        }
      ]
    },
    {
      id: '2',
      name: 'Meskel (Finding of the True Cross)',
      description: 'Celebration of the discovery of the True Cross by Empress Helena in the 4th century.',
      type: 'religious',
      date: '2024-09-27',
      duration: 2,
      location: 'Nationwide, especially Addis Ababa',
      region: 'Nationwide',
      ethnicity: 'Ethiopian Orthodox Christians',
      significance: 'Celebrates the finding of the cross on which Jesus was crucified',
      activities: ['Bonfire lighting', 'Processions', 'Traditional songs', 'Dancing'],
      traditionalFoods: ['Roasted barley', 'Traditional bread'],
      isRecurring: true,
      nextOccurrence: '2025-09-27',
      popularity: 90,
      attendees: 300000
    },
    {
      id: '3',
      name: 'Irreecha (Oromo Thanksgiving)',
      description: 'Oromo thanksgiving festival celebrating the end of the rainy season and harvest.',
      type: 'cultural',
      date: '2024-10-06',
      duration: 1,
      location: 'Bishoftu (Debre Zeit), Oromia',
      region: 'Oromia',
      ethnicity: 'Oromo',
      significance: 'Thanksgiving to Waaqaa (God) for blessings and harvest',
      activities: ['Prayers by the lake', 'Traditional ceremonies', 'Cultural performances'],
      traditionalFoods: ['Roasted coffee', 'Traditional porridge'],
      isRecurring: true,
      nextOccurrence: '2025-10-05',
      popularity: 85,
      attendees: 200000
    }
  ]

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const filteredFestivals = mockFestivals.filter(festival => {
    const matchesType = filterType === 'all' || festival.type === filterType
    const matchesSearch = searchTerm === '' || 
      festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const getFestivalsForMonth = (month: number, year: number) => {
    return filteredFestivals.filter(festival => {
      const festivalDate = new Date(festival.nextOccurrence || festival.date)
      return festivalDate.getMonth() === month && festivalDate.getFullYear() === year
    })
  }

  const toggleFavorite = (festivalId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(festivalId)) {
      newFavorites.delete(festivalId)
    } else {
      newFavorites.add(festivalId)
    }
    setFavorites(newFavorites)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'religious': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cultural': return 'bg-green-100 text-green-800 border-green-200'
      case 'seasonal': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'harvest': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'national': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-3 text-green-600" />
            Ethiopian Festival Calendar
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search festivals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="religious">Religious</option>
              <option value="cultural">Cultural</option>
              <option value="seasonal">Seasonal</option>
              <option value="harvest">Harvest</option>
              <option value="national">National</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredFestivals.length} festivals found
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            
            <h3 className="text-xl font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, index) => {
              const firstDay = new Date(currentYear, currentMonth, 1).getDay()
              const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
              const dayNumber = index - firstDay + 1
              const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth
              const dayFestivals = isValidDay ? 
                getFestivalsForMonth(currentMonth, currentYear).filter(festival => {
                  const festivalDate = new Date(festival.nextOccurrence || festival.date)
                  return festivalDate.getDate() === dayNumber
                }) : []

              return (
                <div
                  key={index}
                  className={`min-h-20 p-2 border border-gray-200 rounded ${
                    isValidDay ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                  }`}
                >
                  {isValidDay && (
                    <>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {dayNumber}
                      </div>
                      {dayFestivals.map(festival => (
                        <div
                          key={festival.id}
                          onClick={() => setSelectedFestival(festival)}
                          className={`text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 ${getTypeColor(festival.type)}`}
                        >
                          {festival.name.length > 15 ? 
                            festival.name.substring(0, 15) + '...' : 
                            festival.name
                          }
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="p-6">
          <div className="space-y-4">
            {filteredFestivals.map(festival => (
              <div
                key={festival.id}
                onClick={() => setSelectedFestival(festival)}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{festival.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(festival.type)}`}>
                        {festival.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{festival.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {new Date(festival.nextOccurrence || festival.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        {festival.location}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        {festival.duration} day{festival.duration > 1 ? 's' : ''}
                      </div>
                      {festival.attendees && (
                        <div className="flex items-center">
                          <FaUsers className="mr-1" />
                          {festival.attendees.toLocaleString()} attendees
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(festival.id)
                      }}
                      className={`p-2 rounded-full hover:bg-gray-100 ${
                        favorites.has(festival.id) ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{festival.popularity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="p-6">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-8">
              {filteredFestivals
                .sort((a, b) => new Date(a.nextOccurrence || a.date).getTime() - new Date(b.nextOccurrence || b.date).getTime())
                .map((festival) => (
                <div key={festival.id} className="relative flex items-start space-x-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${getTypeColor(festival.type).replace('text-', 'bg-').replace('-800', '-500')}`}>
                    <FaCalendarAlt className="text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div
                      onClick={() => setSelectedFestival(festival)}
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg font-bold text-green-600">
                              {new Date(festival.nextOccurrence || festival.date).toLocaleDateString()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(festival.type)}`}>
                              {festival.type}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{festival.name}</h3>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{festival.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {festival.location}
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            {festival.duration} days
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <FaInfoCircle className="mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Festival Detail Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedFestival.name}</h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(selectedFestival.type)}`}>
                      {selectedFestival.type}
                    </span>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {new Date(selectedFestival.nextOccurrence || selectedFestival.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      {selectedFestival.duration} day{selectedFestival.duration > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFestival(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedFestival.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cultural Significance</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedFestival.significance}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Activities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedFestival.activities.map(activity => (
                        <div key={activity} className="flex items-center p-2 bg-green-50 rounded">
                          <FaMusic className="mr-2 text-green-600" />
                          <span className="text-sm text-gray-700">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedFestival.traditionalFoods && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Traditional Foods</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFestival.traditionalFoods.map(food => (
                          <span key={food} className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                            <FaUtensils className="mr-1" />
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Festival History */}
                  {selectedFestival.history && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Festival History</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedFestival.history}</p>
                    </div>
                  )}

                  {/* Related Tours */}
                  {selectedFestival.relatedTours && selectedFestival.relatedTours.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        Tours During This Festival
                      </h3>
                      <div className="space-y-3">
                        {selectedFestival.relatedTours.map(tour => (
                          <div key={tour.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{tour.name}</h4>
                              <span className="text-lg font-bold text-green-600">${tour.price}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{tour.duration}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {tour.highlights.map(highlight => (
                                <span key={highlight} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {highlight}
                                </span>
                              ))}
                            </div>
                            <Button size="sm" className="w-full">
                              Book Festival Tour
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-green-600" />
                      Location
                    </h4>
                    <p className="text-gray-700">{selectedFestival.location}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedFestival.region}</p>
                  </div>

                  {selectedFestival.ethnicity && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <FaUsers className="mr-2 text-blue-600" />
                        Community
                      </h4>
                      <p className="text-gray-700">{selectedFestival.ethnicity}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Popularity</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${selectedFestival.popularity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{selectedFestival.popularity}%</span>
                    </div>
                  </div>

                  {selectedFestival.attendees && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expected Attendees</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedFestival.attendees.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => toggleFavorite(selectedFestival.id)}
                    >
                      <FaHeart className={favorites.has(selectedFestival.id) ? 'text-red-500 mr-1' : 'mr-1'} />
                      {favorites.has(selectedFestival.id) ? 'Favorited' : 'Favorite'}
                    </Button>
                    <Button variant="outline">
                      <FaShare className="mr-1" />
                      Share
                    </Button>
                  </div>

                  {selectedFestival.images && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Gallery</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedFestival.images.map((_, index) => (
                          <div key={index} className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-green-400 to-blue-600 rounded">
                            <div className="flex items-center justify-center h-20">
                              <FaImage className="text-white text-xl" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FestivalCalendar