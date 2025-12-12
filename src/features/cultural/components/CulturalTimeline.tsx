import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaCalendarAlt, FaPlay, FaPause, FaFastForward, FaFastBackward,
  FaExpand, FaCompress, FaFilter, FaSearch, FaInfoCircle,
  FaGlobe, FaUsers, FaHome, FaBook, FaMusic, FaUtensils,
  FaArrowLeft, FaArrowRight, FaRandom, FaBookmark
} from 'react-icons/fa'

interface TimelineEvent {
  id: string
  title: string
  date: string
  period: string
  category: 'political' | 'cultural' | 'religious' | 'architectural' | 'artistic' | 'culinary'
  description: string
  significance: string
  location: string
  relatedEvents: string[]
  artifacts: string[]
  images: string[]
  sources: string[]
  impact: 'local' | 'regional' | 'national' | 'international'
}

interface TimePeriod {
  id: string
  name: string
  startYear: number
  endYear: number
  description: string
  keyCharacteristics: string[]
  majorEvents: string[]
  color: string
}

interface CulturalTimelineProps {
  onEventSelect?: (event: TimelineEvent) => void
  className?: string
}

export const CulturalTimeline: React.FC<CulturalTimelineProps> = ({
  onEventSelect,
  className = ''
}) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentYear, setCurrentYear] = useState(2024)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [viewMode, setViewMode] = useState<'timeline' | 'periods' | 'interactive'>('timeline')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Historical periods
  const timePeriods: TimePeriod[] = [
    {
      id: 'ancient',
      name: 'Ancient Period',
      startYear: -1000,
      endYear: 300,
      description: 'Early civilizations and the rise of the Kingdom of Aksum',
      keyCharacteristics: ['Trade networks', 'Early Christianity', 'Monumental architecture'],
      majorEvents: ['kingdom-of-aksum', 'christianity-introduction'],
      color: '#8B4513'
    },
    {
      id: 'medieval',
      name: 'Medieval Period',
      startYear: 300,
      endYear: 1270,
      description: 'Aksumite decline and the rise of the Zagwe dynasty',
      keyCharacteristics: ['Rock-hewn churches', 'Religious art', 'Pilgrimage traditions'],
      majorEvents: ['lalibela-construction', 'zagwe-dynasty'],
      color: '#4169E1'
    },
    {
      id: 'solomonic',
      name: 'Solomonic Period',
      startYear: 1270,
      endYear: 1855,
      description: 'Restoration of the Solomonic dynasty and cultural renaissance',
      keyCharacteristics: ['Imperial court culture', 'Manuscript traditions', 'Territorial expansion'],
      majorEvents: ['solomonic-restoration', 'gondar-period'],
      color: '#DAA520'
    },
    {
      id: 'modern',
      name: 'Modern Period',
      startYear: 1855,
      endYear: 1974,
      description: 'Modernization efforts and resistance to colonialism',
      keyCharacteristics: ['Educational reforms', 'Infrastructure development', 'Cultural preservation'],
      majorEvents: ['battle-of-adwa', 'haile-selassie-reign'],
      color: '#228B22'
    },
    {
      id: 'contemporary',
      name: 'Contemporary Period',
      startYear: 1974,
      endYear: 2024,
      description: 'Revolution, federal restructuring, and cultural revival',
      keyCharacteristics: ['Cultural diversity recognition', 'Language preservation', 'Heritage tourism'],
      majorEvents: ['derg-period', 'federal-system', 'cultural-renaissance'],
      color: '#FF6347'
    }
  ]

  // Timeline events
  const timelineEvents: TimelineEvent[] = [
    {
      id: 'kingdom-of-aksum',
      title: 'Rise of the Kingdom of Aksum',
      date: '100 CE',
      period: 'ancient',
      category: 'political',
      description: 'The Kingdom of Aksum emerges as a major trading power, controlling trade routes between the Roman Empire and Ancient India.',
      significance: 'Established Ethiopia as a significant civilization in the ancient world, laying foundations for Ethiopian identity.',
      location: 'Northern Ethiopia (Tigray)',
      relatedEvents: ['christianity-introduction'],
      artifacts: ['Aksumite coins', 'Obelisks', 'Inscriptions'],
      images: ['/images/timeline/aksum-1.jpg'],
      sources: ['Periplus of the Erythraean Sea', 'Aksumite inscriptions'],
      impact: 'international'
    },
    {
      id: 'christianity-introduction',
      title: 'Introduction of Christianity',
      date: '330 CE',
      period: 'ancient',
      category: 'religious',
      description: 'King Ezana of Aksum converts to Christianity, making Ethiopia one of the first Christian nations.',
      significance: 'Profoundly shaped Ethiopian culture, art, architecture, and social structures for centuries.',
      location: 'Aksum',
      relatedEvents: ['kingdom-of-aksum', 'lalibela-construction'],
      artifacts: ['Christian coins', 'Early churches', 'Religious manuscripts'],
      images: ['/images/timeline/christianity-1.jpg'],
      sources: ['Rufinus of Aquileia', 'Aksumite coins'],
      impact: 'national'
    },
    {
      id: 'lalibela-construction',
      title: 'Construction of Lalibela Churches',
      date: '1200 CE',
      period: 'medieval',
      category: 'architectural',
      description: 'King Lalibela orders the construction of eleven rock-hewn churches, creating a "New Jerusalem" in Ethiopia.',
      significance: 'Represents the pinnacle of Ethiopian religious architecture and remains a major pilgrimage site.',
      location: 'Lalibela, Amhara Region',
      relatedEvents: ['christianity-introduction', 'zagwe-dynasty'],
      artifacts: ['Rock-hewn churches', 'Religious art', 'Manuscripts'],
      images: ['/images/timeline/lalibela-1.jpg'],
      sources: ['Gadla Lalibela', 'Portuguese accounts'],
      impact: 'international'
    },
    {
      id: 'coffee-discovery',
      title: 'Discovery of Coffee',
      date: '850 CE',
      period: 'medieval',
      category: 'culinary',
      description: 'According to legend, Kaldi the goat herder discovers coffee in the Ethiopian highlands.',
      significance: 'Ethiopia becomes the birthplace of coffee culture, influencing global beverage traditions.',
      location: 'Ethiopian Highlands',
      relatedEvents: [],
      artifacts: ['Coffee plants', 'Traditional brewing tools'],
      images: ['/images/timeline/coffee-1.jpg'],
      sources: ['Ethiopian oral traditions', 'Arab chronicles'],
      impact: 'international'
    },
    {
      id: 'gondar-period',
      title: 'Gondar Imperial Period',
      date: '1636 CE',
      period: 'solomonic',
      category: 'architectural',
      description: 'Emperor Fasilides establishes Gondar as the imperial capital, beginning a golden age of architecture and arts.',
      significance: 'Created a unique architectural style blending Ethiopian, Portuguese, and Moorish influences.',
      location: 'Gondar, Amhara Region',
      relatedEvents: ['solomonic-restoration'],
      artifacts: ['Royal castles', 'Churches', 'Illuminated manuscripts'],
      images: ['/images/timeline/gondar-1.jpg'],
      sources: ['Royal chronicles', 'Jesuit accounts'],
      impact: 'national'
    },
    {
      id: 'battle-of-adwa',
      title: 'Battle of Adwa Victory',
      date: '1896 CE',
      period: 'modern',
      category: 'political',
      description: 'Emperor Menelik II defeats Italian forces, preserving Ethiopian independence and inspiring anti-colonial movements.',
      significance: 'Symbol of African resistance to colonialism and source of pan-African pride.',
      location: 'Adwa, Tigray Region',
      relatedEvents: ['haile-selassie-reign'],
      artifacts: ['Battle artifacts', 'Victory paintings', 'Commemorative items'],
      images: ['/images/timeline/adwa-1.jpg'],
      sources: ['Ethiopian chronicles', 'Italian military records'],
      impact: 'international'
    },
    {
      id: 'cultural-renaissance',
      title: 'Contemporary Cultural Renaissance',
      date: '1991 CE',
      period: 'contemporary',
      category: 'cultural',
      description: 'Federal system recognizes cultural diversity, leading to revival of regional languages, traditions, and arts.',
      significance: 'Promotes cultural pluralism and preservation of Ethiopia\'s diverse heritage.',
      location: 'Nationwide',
      relatedEvents: ['federal-system'],
      artifacts: ['Cultural festivals', 'Language materials', 'Traditional crafts'],
      images: ['/images/timeline/renaissance-1.jpg'],
      sources: ['Government policies', 'Cultural documentation'],
      impact: 'national'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Events', icon: FaGlobe, color: 'text-gray-600' },
    { id: 'political', name: 'Political', icon: FaUsers, color: 'text-blue-600' },
    { id: 'religious', name: 'Religious', icon: FaBook, color: 'text-purple-600' },
    { id: 'architectural', name: 'Architecture', icon: FaHome, color: 'text-green-600' },
    { id: 'cultural', name: 'Cultural', icon: FaMusic, color: 'text-orange-600' },
    { id: 'culinary', name: 'Culinary', icon: FaUtensils, color: 'text-red-600' }
  ]

  const filteredEvents = timelineEvents.filter(event => {
    const matchesCategory = activeCategory === 'all' || event.category === activeCategory
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPeriod = !selectedPeriod || event.period === selectedPeriod
    
    return matchesCategory && matchesSearch && matchesPeriod
  })

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event)
    if (onEventSelect) {
      onEventSelect(event)
    }
  }

  const getEventYear = (dateStr: string) => {
    const match = dateStr.match(/(\d+)\s*(CE|BCE)?/)
    if (match) {
      const year = parseInt(match[1])
      return match[2] === 'BCE' ? -year : year
    }
    return 0
  }

  const sortedEvents = [...filteredEvents].sort((a, b) => getEventYear(a.date) - getEventYear(b.date))

  const startAutoplay = () => {
    setIsPlaying(true)
    // Auto-advance through events
    const interval = setInterval(() => {
      setCurrentYear(prev => {
        const nextYear = prev + (10 * playbackSpeed)
        if (nextYear > 2024) {
          setIsPlaying(false)
          clearInterval(interval)
          return 2024
        }
        return nextYear
      })
    }, 1000 / playbackSpeed)
  }

  const stopAutoplay = () => {
    setIsPlaying(false)
  }

  const jumpToYear = (year: number) => {
    setCurrentYear(year)
  }

  const getVisibleEvents = () => {
    return sortedEvents.filter(event => {
      const eventYear = getEventYear(event.date)
      return eventYear <= currentYear
    })
  }

  useEffect(() => {
    if (isPlaying) {
      startAutoplay()
    }
    return () => stopAutoplay()
  }, [isPlaying, playbackSpeed])

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-3 text-purple-600" />
            Cultural Timeline of Ethiopia
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <FaCompress className="mr-2" /> : <FaExpand className="mr-2" />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>
            
            <select
              value={selectedPeriod || ''}
              onChange={(e) => setSelectedPeriod(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Periods</option>
              {timePeriods.map(period => (
                <option key={period.id} value={period.id}>{period.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {['timeline', 'periods', 'interactive'].map(view => (
              <Button
                key={view}
                variant={viewMode === view ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode(view as any)}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(category => {
            const IconComponent = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`text-sm ${category.color}`} />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            )
          })}
        </div>

        {/* Playback Controls */}
        {viewMode === 'interactive' && (
          <div className="flex items-center justify-center space-x-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => jumpToYear(-1000)}
            >
              <FaFastBackward />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentYear(prev => Math.max(-1000, prev - 100))}
            >
              <FaArrowLeft />
            </Button>
            
            <Button
              onClick={() => isPlaying ? stopAutoplay() : startAutoplay()}
              className={isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {isPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentYear(prev => Math.min(2024, prev + 100))}
            >
              <FaArrowRight />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => jumpToYear(2024)}
            >
              <FaFastForward />
            </Button>
            
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
            </select>
            
            <div className="text-sm text-gray-600">
              Current Year: <span className="font-medium">{currentYear > 0 ? `${currentYear} CE` : `${Math.abs(currentYear)} BCE`}</span>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Content */}
      <div className="p-6">
        {viewMode === 'timeline' && (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-8">
              {sortedEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start space-x-6">
                  <div 
                    className="flex-shrink-0 w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: timePeriods.find(p => p.id === event.period)?.color || '#gray' }}
                  >
                    <span className="text-white font-bold text-sm">
                      {getEventYear(event.date) > 0 ? 'CE' : 'BCE'}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div
                      onClick={() => handleEventClick(event)}
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg font-bold text-purple-600">{event.date}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              event.category === 'political' ? 'bg-blue-100 text-blue-800' :
                              event.category === 'religious' ? 'bg-purple-100 text-purple-800' :
                              event.category === 'architectural' ? 'bg-green-100 text-green-800' :
                              event.category === 'cultural' ? 'bg-orange-100 text-orange-800' :
                              event.category === 'culinary' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {event.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                        </div>
                        <Button variant="outline" size="sm">
                          <FaInfoCircle className="mr-1" />
                          Details
                        </Button>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaGlobe className="mr-1" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <FaBookmark className="mr-1" />
                            {event.impact} impact
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'periods' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timePeriods.map(period => (
              <div
                key={period.id}
                onClick={() => setSelectedPeriod(selectedPeriod === period.id ? null : period.id)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPeriod === period.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: period.color }}
                  ></div>
                  <h3 className="text-lg font-semibold text-gray-900">{period.name}</h3>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  {period.startYear < 0 ? `${Math.abs(period.startYear)} BCE` : `${period.startYear} CE`} - 
                  {period.endYear < 0 ? ` ${Math.abs(period.endYear)} BCE` : ` ${period.endYear} CE`}
                </div>
                
                <p className="text-gray-700 mb-4">{period.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Key Characteristics:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {period.keyCharacteristics.map(characteristic => (
                      <li key={characteristic} className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        {characteristic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'interactive' && (
          <div className="space-y-6">
            {/* Interactive Timeline Bar */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="relative h-8 bg-white rounded border">
                {timePeriods.map(period => {
                  const totalRange = 3024 // -1000 to 2024
                  const startPos = ((period.startYear + 1000) / totalRange) * 100
                  const width = ((period.endYear - period.startYear) / totalRange) * 100
                  
                  return (
                    <div
                      key={period.id}
                      className="absolute top-0 bottom-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                      style={{
                        left: `${startPos}%`,
                        width: `${width}%`,
                        backgroundColor: period.color
                      }}
                      onClick={() => jumpToYear(period.startYear)}
                      title={period.name}
                    ></div>
                  )
                })}
                
                {/* Current Year Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-red-600 z-10"
                  style={{ left: `${((currentYear + 1000) / 3024) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Visible Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getVisibleEvents().map(event => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-bold text-purple-600">{event.date}</span>
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      event.category === 'political' ? 'bg-blue-100 text-blue-800' :
                      event.category === 'religious' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
              <p className="text-gray-600">{selectedEvent.date} • {selectedEvent.location}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
              Close
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 mb-4 leading-relaxed">{selectedEvent.description}</p>
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Historical Significance</h4>
                <p className="text-gray-600 text-sm">{selectedEvent.significance}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Artifacts & Evidence</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedEvent.artifacts.map(artifact => (
                    <span key={artifact} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {artifact}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sources</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedEvent.sources.map(source => (
                    <li key={source} className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}