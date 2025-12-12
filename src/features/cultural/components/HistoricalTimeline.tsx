import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCrown, FaChurch,
  FaArrowLeft, FaArrowRight, FaExpand, FaPlay, FaImage,
  FaBook, FaGlobe, FaFilter, FaSearch
} from 'react-icons/fa'

interface TimelineEvent {
  id: string
  year: number
  title: string
  description: string
  category: 'political' | 'religious' | 'cultural' | 'economic' | 'social'
  location?: string
  significance: string
  image?: string
  relatedEvents?: string[]
  sources?: string[]
  keyFigures?: string[]
}

interface HistoricalTimelineProps {
  events?: TimelineEvent[]
  className?: string
}

const HistoricalTimeline: React.FC<HistoricalTimelineProps> = ({
  events: propEvents,
  className = ''
}) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline')

  // Mock historical events data
  const mockEvents: TimelineEvent[] = propEvents || [
    {
      id: '1',
      year: -3000000,
      title: 'Lucy (Australopithecus afarensis)',
      description: 'Discovery site of Lucy, one of the most complete early human ancestor fossils, found in the Afar region.',
      category: 'cultural',
      location: 'Afar Region',
      significance: 'Provides crucial evidence for human evolution and Ethiopia as the cradle of humanity.',
      image: '/images/timeline/lucy.jpg',
      keyFigures: ['Donald Johanson', 'Tom Gray'],
      sources: ['Nature Journal, 1974', 'National Geographic']
    },
    {
      id: '2',
      year: -1000,
      title: 'Kingdom of D\'mt',
      description: 'Establishment of the Kingdom of D\'mt, one of the earliest known kingdoms in the Ethiopian highlands.',
      category: 'political',
      location: 'Northern Ethiopia',
      significance: 'First organized state in Ethiopian history, precursor to the Axumite Empire.',
      image: '/images/timeline/dmt.jpg'
    },
    {
      id: '3',
      year: 100,
      title: 'Rise of the Axumite Empire',
      description: 'The Axumite Empire emerges as a major trading power, controlling trade routes between Africa and Arabia.',
      category: 'political',
      location: 'Axum, Tigray',
      significance: 'Established Ethiopia as a major ancient civilization and trading empire.',
      image: '/images/timeline/axum.jpg',
      keyFigures: ['King Ezana'],
      relatedEvents: ['4']
    },
    {
      id: '4',
      year: 330,
      title: 'Conversion to Christianity',
      description: 'King Ezana of Axum converts to Christianity, making Ethiopia one of the first Christian nations.',
      category: 'religious',
      location: 'Axum',
      significance: 'Established Ethiopian Orthodox Christianity as a defining feature of Ethiopian culture.',
      image: '/images/timeline/christianity.jpg',
      keyFigures: ['King Ezana', 'Frumentius'],
      relatedEvents: ['3', '5']
    },
    {
      id: '5',
      year: 1200,
      title: 'Construction of Lalibela Churches',
      description: 'King Lalibela orders the construction of the famous rock-hewn churches in Lalibela.',
      category: 'religious',
      location: 'Lalibela, Amhara',
      significance: 'Created one of the world\'s most remarkable architectural achievements and pilgrimage sites.',
      image: '/images/timeline/lalibela.jpg',
      keyFigures: ['King Lalibela'],
      relatedEvents: ['4']
    },
    {
      id: '6',
      year: 1270,
      title: 'Solomonic Dynasty',
      description: 'Establishment of the Solomonic Dynasty, claiming descent from King Solomon and Queen of Sheba.',
      category: 'political',
      location: 'Ethiopian Highlands',
      significance: 'Longest-ruling dynasty in Ethiopian history, lasting until 1974.',
      image: '/images/timeline/solomonic.jpg',
      keyFigures: ['Yekuno Amlak']
    },
    {
      id: '7',
      year: 1896,
      title: 'Battle of Adwa',
      description: 'Ethiopian forces defeat Italian colonial army, maintaining Ethiopia\'s independence.',
      category: 'political',
      location: 'Adwa, Tigray',
      significance: 'Symbol of African resistance to colonialism and Ethiopian sovereignty.',
      image: '/images/timeline/adwa.jpg',
      keyFigures: ['Emperor Menelik II', 'Empress Taytu']
    },
    {
      id: '8',
      year: 1930,
      title: 'Coronation of Haile Selassie',
      description: 'Ras Tafari is crowned as Emperor Haile Selassie I of Ethiopia.',
      category: 'political',
      location: 'Addis Ababa',
      significance: 'Last emperor of Ethiopia and central figure in Rastafarian religion.',
      image: '/images/timeline/haile-selassie.jpg',
      keyFigures: ['Haile Selassie I']
    },
    {
      id: '9',
      year: 1974,
      title: 'Ethiopian Revolution',
      description: 'Military coup overthrows Emperor Haile Selassie, ending the Solomonic Dynasty.',
      category: 'political',
      location: 'Addis Ababa',
      significance: 'Marked the end of imperial rule and beginning of socialist government.',
      image: '/images/timeline/revolution.jpg'
    },
    {
      id: '10',
      year: 1991,
      title: 'Fall of the Derg',
      description: 'Ethiopian People\'s Revolutionary Democratic Front overthrows the military government.',
      category: 'political',
      location: 'Addis Ababa',
      significance: 'Beginning of the current federal democratic system.',
      image: '/images/timeline/eprdf.jpg'
    }
  ]

  const filteredEvents = mockEvents.filter(event => {
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedEvents = filteredEvents.sort((a, b) => a.year - b.year)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'political': return <FaCrown className="text-purple-600" />
      case 'religious': return <FaChurch className="text-blue-600" />
      case 'cultural': return <FaUsers className="text-green-600" />
      case 'economic': return <FaGlobe className="text-yellow-600" />
      case 'social': return <FaBook className="text-red-600" />
      default: return <FaCalendarAlt className="text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'political': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'religious': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cultural': return 'bg-green-100 text-green-800 border-green-200'
      case 'economic': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'social': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatYear = (year: number) => {
    if (year < 0) {
      return `${Math.abs(year).toLocaleString()} BCE`
    }
    return `${year} CE`
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            Ethiopian Historical Timeline
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'timeline' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
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
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="political">Political</option>
              <option value="religious">Religious</option>
              <option value="cultural">Cultural</option>
              <option value="economic">Economic</option>
              <option value="social">Social</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredEvents.length} of {mockEvents.length} events
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="p-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-8">
              {sortedEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start space-x-6">
                  {/* Timeline Dot */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${getCategoryColor(event.category).replace('text-', 'bg-').replace('-800', '-500')}`}>
                    {getCategoryIcon(event.category)}
                  </div>
                  
                  {/* Event Content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                         onClick={() => setSelectedEvent(event)}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl font-bold text-blue-600">
                              {formatYear(event.year)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                              {event.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                        </div>
                        {event.image && (
                          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center ml-4">
                            <FaImage className="text-white text-2xl" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {event.location && (
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              {event.location}
                            </div>
                          )}
                          {event.keyFigures && (
                            <div className="flex items-center">
                              <FaUsers className="mr-1" />
                              {event.keyFigures.length} key figures
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <FaExpand className="mr-1" />
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

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(event.category).replace('text-', 'bg-').replace('-800', '-500')}`}>
                    {getCategoryIcon(event.category)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{formatYear(event.year)}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                
                {event.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1" />
                    {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getCategoryColor(selectedEvent.category).replace('text-', 'bg-').replace('-800', '-500')}`}>
                    {getCategoryIcon(selectedEvent.category)}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatYear(selectedEvent.year)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(selectedEvent.category)}`}>
                      {selectedEvent.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Historical Significance</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedEvent.significance}</p>
                  </div>

                  {selectedEvent.keyFigures && selectedEvent.keyFigures.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Figures</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.keyFigures.map(figure => (
                          <span key={figure} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {figure}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {selectedEvent.location && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        Location
                      </h4>
                      <p className="text-gray-700">{selectedEvent.location}</p>
                    </div>
                  )}

                  {selectedEvent.sources && selectedEvent.sources.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Sources</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedEvent.sources.map((source, index) => (
                          <li key={index}>• {source}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedEvent.relatedEvents && selectedEvent.relatedEvents.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Related Events</h4>
                      <div className="space-y-2">
                        {selectedEvent.relatedEvents.map(eventId => {
                          const relatedEvent = mockEvents.find(e => e.id === eventId)
                          return relatedEvent ? (
                            <button
                              key={eventId}
                              onClick={() => setSelectedEvent(relatedEvent)}
                              className="block w-full text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                            >
                              <div className="text-sm font-medium text-blue-600">
                                {formatYear(relatedEvent.year)}
                              </div>
                              <div className="text-sm text-gray-700">{relatedEvent.title}</div>
                            </button>
                          ) : null
                        })}
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

export default HistoricalTimeline