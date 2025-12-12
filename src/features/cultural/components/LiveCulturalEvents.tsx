import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaVideo,
  FaHeart, FaShare, FaTicketAlt, FaGlobe, FaPlay, FaPause,
  FaVolumeUp, FaVolumeOff, FaExpand, FaComments, FaStar,
  FaFilter, FaSearch, FaBroadcastTower, FaUserFriends, FaUtensils, FaImage
} from 'react-icons/fa'

interface LiveEvent {
  id: string
  title: string
  description: string
  type: 'festival' | 'ceremony' | 'workshop' | 'performance' | 'discussion' | 'cooking'
  status: 'upcoming' | 'live' | 'ended'
  startTime: Date
  endTime: Date
  location: {
    type: 'physical' | 'virtual' | 'hybrid'
    address?: string
    coordinates?: { lat: number; lng: number }
    virtualLink?: string
  }
  host: {
    name: string
    avatar: string
    verified: boolean
    followers: number
  }
  participants: {
    registered: number
    attending: number
    capacity?: number
  }
  media: {
    thumbnail: string
    streamUrl?: string
    recordingUrl?: string
  }
  tags: string[]
  language: string
  isRecorded: boolean
  isFree: boolean
  price?: number
  rating: number
  reviews: number
}

interface CommunityPost {
  id: string
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  content: string
  images?: string[]
  timestamp: Date
  likes: number
  comments: number
  shares: number
  tags: string[]
  eventId?: string
}

interface LiveCulturalEventsProps {
  onEventJoin?: (event: LiveEvent) => void
  className?: string
}

export const LiveCulturalEvents: React.FC<LiveCulturalEventsProps> = ({
  onEventJoin,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'community' | 'my-events'>('live')
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set())
  const [favoriteEvents, setFavoriteEvents] = useState<Set<string>>(new Set())

  // Mock live events data
  const liveEvents: LiveEvent[] = [
    {
      id: 'timkat-2024',
      title: 'Timkat Festival Live from Gondar',
      description: 'Experience the colorful Ethiopian Orthodox Epiphany celebration with traditional processions, blessing ceremonies, and cultural performances.',
      type: 'festival',
      status: 'live',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // Ends in 4 hours
      location: {
        type: 'hybrid',
        address: 'Fasilides Bath, Gondar, Ethiopia',
        coordinates: { lat: 12.6089, lng: 37.4671 },
        virtualLink: 'https://stream.example.com/timkat-2024'
      },
      host: {
        name: 'Ethiopian Cultural Heritage Foundation',
        avatar: '/avatars/echf.jpg',
        verified: true,
        followers: 15420
      },
      participants: {
        registered: 8500,
        attending: 3200,
        capacity: 10000
      },
      media: {
        thumbnail: '/images/events/timkat-live.jpg',
        streamUrl: 'https://stream.example.com/timkat-2024/live',
        recordingUrl: 'https://stream.example.com/timkat-2024/recording'
      },
      tags: ['timkat', 'orthodox', 'festival', 'gondar', 'traditional'],
      language: 'Amharic',
      isRecorded: true,
      isFree: true,
      rating: 4.9,
      reviews: 245
    },
    {
      id: 'coffee-ceremony-workshop',
      title: 'Traditional Ethiopian Coffee Ceremony Workshop',
      description: 'Learn the art of Ethiopian coffee ceremony from master coffee roaster Almaz Tadesse. Interactive session with Q&A.',
      type: 'workshop',
      status: 'live',
      startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
      endTime: new Date(Date.now() + 90 * 60 * 1000), // Ends in 90 minutes
      location: {
        type: 'virtual',
        virtualLink: 'https://meet.example.com/coffee-ceremony'
      },
      host: {
        name: 'Almaz Tadesse',
        avatar: '/avatars/almaz.jpg',
        verified: true,
        followers: 2800
      },
      participants: {
        registered: 150,
        attending: 89,
        capacity: 200
      },
      media: {
        thumbnail: '/images/events/coffee-workshop.jpg',
        streamUrl: 'https://stream.example.com/coffee-ceremony/live'
      },
      tags: ['coffee', 'ceremony', 'workshop', 'traditional', 'interactive'],
      language: 'English',
      isRecorded: true,
      isFree: false,
      price: 25,
      rating: 4.8,
      reviews: 67
    },
    {
      id: 'injera-cooking-class',
      title: 'Injera Making Masterclass',
      description: 'Join Chef Meron for an authentic injera making class. Learn traditional fermentation techniques and cooking methods.',
      type: 'cooking',
      status: 'upcoming',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Starts in 2 hours
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // Ends in 5 hours
      location: {
        type: 'virtual',
        virtualLink: 'https://zoom.example.com/injera-class'
      },
      host: {
        name: 'Chef Meron Addis',
        avatar: '/avatars/meron.jpg',
        verified: true,
        followers: 5200
      },
      participants: {
        registered: 75,
        attending: 0,
        capacity: 100
      },
      media: {
        thumbnail: '/images/events/injera-class.jpg'
      },
      tags: ['injera', 'cooking', 'teff', 'traditional', 'recipe'],
      language: 'Amharic',
      isRecorded: true,
      isFree: false,
      price: 35,
      rating: 4.7,
      reviews: 23
    },
    {
      id: 'oromo-music-performance',
      title: 'Traditional Oromo Music & Dance Performance',
      description: 'Live performance featuring traditional Oromo instruments, songs, and dances by the Bishoftu Cultural Group.',
      type: 'performance',
      status: 'upcoming',
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // Starts in 6 hours
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // Ends in 8 hours
      location: {
        type: 'hybrid',
        address: 'Bishoftu Cultural Center, Oromia, Ethiopia',
        coordinates: { lat: 8.7500, lng: 38.9833 },
        virtualLink: 'https://stream.example.com/oromo-performance'
      },
      host: {
        name: 'Bishoftu Cultural Group',
        avatar: '/avatars/bishoftu.jpg',
        verified: true,
        followers: 3400
      },
      participants: {
        registered: 420,
        attending: 0,
        capacity: 500
      },
      media: {
        thumbnail: '/images/events/oromo-performance.jpg'
      },
      tags: ['oromo', 'music', 'dance', 'traditional', 'performance'],
      language: 'Oromo',
      isRecorded: true,
      isFree: true,
      rating: 4.6,
      reviews: 89
    }
  ]

  // Mock community posts
  const communityPosts: CommunityPost[] = [
    {
      id: 'post-1',
      author: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        verified: false
      },
      content: 'Just finished the coffee ceremony workshop! Amazing experience learning about the cultural significance. The three rounds - Abol, Tona, and Baraka - each have such deep meaning. 🇪🇹☕',
      images: ['/images/posts/coffee-setup.jpg'],
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      likes: 24,
      comments: 8,
      shares: 3,
      tags: ['coffee', 'ceremony', 'culture'],
      eventId: 'coffee-ceremony-workshop'
    },
    {
      id: 'post-2',
      author: {
        name: 'Dawit Alemayehu',
        avatar: '/avatars/dawit.jpg',
        verified: true
      },
      content: 'Watching the Timkat celebration from Gondar brings back so many childhood memories. The devotion and joy of the people is truly inspiring. Thank you for sharing this beautiful tradition with the world! 🙏',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      likes: 156,
      comments: 23,
      shares: 12,
      tags: ['timkat', 'gondar', 'tradition', 'memories'],
      eventId: 'timkat-2024'
    },
    {
      id: 'post-3',
      author: {
        name: 'Cultural Explorer',
        avatar: '/avatars/explorer.jpg',
        verified: false
      },
      content: 'Can\'t wait for the Oromo music performance tonight! I\'ve been learning about traditional instruments like the krar and masinko. The cultural diversity of Ethiopia is incredible! 🎵',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 67,
      comments: 15,
      shares: 8,
      tags: ['oromo', 'music', 'instruments', 'diversity'],
      eventId: 'oromo-music-performance'
    }
  ]

  const eventTypes = [
    { id: 'all', name: 'All Events', icon: FaGlobe },
    { id: 'festival', name: 'Festivals', icon: FaCalendarAlt },
    { id: 'ceremony', name: 'Ceremonies', icon: FaStar },
    { id: 'workshop', name: 'Workshops', icon: FaUsers },
    { id: 'performance', name: 'Performances', icon: FaPlay },
    { id: 'cooking', name: 'Cooking Classes', icon: FaUtensils }
  ]

  const filteredEvents = liveEvents.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesTab = 
      (activeTab === 'live' && event.status === 'live') ||
      (activeTab === 'upcoming' && event.status === 'upcoming') ||
      (activeTab === 'my-events' && joinedEvents.has(event.id)) ||
      activeTab === 'community'
    
    return matchesType && matchesSearch && matchesTab
  })

  const joinEvent = (eventId: string) => {
    const newJoined = new Set(joinedEvents)
    newJoined.add(eventId)
    setJoinedEvents(newJoined)
    localStorage.setItem('joined-events', JSON.stringify(Array.from(newJoined)))
    
    const event = liveEvents.find(e => e.id === eventId)
    if (event && onEventJoin) {
      onEventJoin(event)
    }
  }

  const toggleFavorite = (eventId: string) => {
    const newFavorites = new Set(favoriteEvents)
    if (newFavorites.has(eventId)) {
      newFavorites.delete(eventId)
    } else {
      newFavorites.add(eventId)
    }
    setFavoriteEvents(newFavorites)
    localStorage.setItem('favorite-events', JSON.stringify(Array.from(newFavorites)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800 border-red-200'
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ended': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTimeUntilEvent = (startTime: Date) => {
    const now = new Date()
    const diff = startTime.getTime() - now.getTime()
    
    if (diff < 0) return 'Started'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `Starts in ${hours}h ${minutes}m`
    } else {
      return `Starts in ${minutes}m`
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 60) {
      return `${minutes}m ago`
    } else {
      const hours = Math.floor(minutes / 60)
      return `${hours}h ago`
    }
  }

  useEffect(() => {
    // Load saved data
    const savedJoined = localStorage.getItem('joined-events')
    const savedFavorites = localStorage.getItem('favorite-events')
    
    if (savedJoined) {
      setJoinedEvents(new Set(JSON.parse(savedJoined)))
    }
    
    if (savedFavorites) {
      setFavoriteEvents(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaBroadcastTower className="mr-3 text-red-600" />
            Live Cultural Events
          </h2>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>{liveEvents.filter(e => e.status === 'live').length} Live Now</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          {[
            { id: 'live', label: 'Live Now', icon: FaBroadcastTower },
            { id: 'upcoming', label: 'Upcoming', icon: FaCalendarAlt },
            { id: 'community', label: 'Community', icon: FaUserFriends },
            { id: 'my-events', label: 'My Events', icon: FaTicketAlt }
          ].map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="text-sm" />
                <span className="font-medium">{tab.label}</span>
                {tab.id === 'live' && liveEvents.filter(e => e.status === 'live').length > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Filters */}
        {activeTab !== 'community' && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {eventTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredEvents.length} events
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Events Grid */}
        {activeTab !== 'community' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-gray-50 rounded-lg border hover:shadow-md transition-shadow"
              >
                {/* Event Thumbnail */}
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-red-400 to-purple-600 rounded-t-lg">
                    <div className="flex items-center justify-center h-48">
                      <FaPlay className="text-white text-4xl" />
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                      {event.status === 'live' && <FaBroadcastTower className="inline mr-1" />}
                      {event.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(event.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                      favoriteEvents.has(event.id)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                    }`}
                  >
                    <FaHeart />
                  </button>
                  
                  {/* Live Indicator */}
                  {event.status === 'live' && (
                    <div className="absolute bottom-3 left-3 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                  )}
                </div>

                {/* Event Info */}
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={event.host.avatar}
                      alt={event.host.name}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/default-avatar.png'
                      }}
                    />
                    <span className="text-sm text-gray-600">{event.host.name}</span>
                    {event.host.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <FaStar className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        {event.status === 'upcoming' ? getTimeUntilEvent(event.startTime) : 'Live Now'}
                      </div>
                      <div className="flex items-center">
                        <FaUsers className="mr-1" />
                        {event.participants.attending || event.participants.registered}
                      </div>
                    </div>
                    
                    {!event.isFree && (
                      <span className="font-medium text-green-600">${event.price}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400" />
                      <span className="text-sm text-gray-600">{event.rating}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {joinedEvents.has(event.id) ? (
                        <Button size="sm" variant="outline">
                          <FaVideo className="mr-1" />
                          Join
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => joinEvent(event.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {event.isFree ? 'Join Free' : `Join $${event.price}`}
                        </Button>
                      )}
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <FaShare />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community Feed */}
        {activeTab === 'community' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {communityPosts.map(post => (
              <div key={post.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png'
                    }}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{post.author.name}</span>
                      {post.author.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaStar className="text-white text-xs" />
                        </div>
                      )}
                      <span className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">{post.content}</p>
                    
                    {post.images && post.images.length > 0 && (
                      <div className="mb-3">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg">
                          <div className="flex items-center justify-center h-48">
                            <FaImage className="text-gray-400 text-2xl" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-red-600">
                        <FaHeart />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-600">
                        <FaComments />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-600">
                        <FaShare />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty States */}
        {filteredEvents.length === 0 && activeTab !== 'community' && (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}