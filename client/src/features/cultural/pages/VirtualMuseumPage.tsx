import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaPlay, FaPause, FaSearch, FaSearchPlus, FaSearchMinus,
  FaUndo, FaRedo, FaCompass, FaCamera, FaInfoCircle,
  FaMousePointer, FaHeadphones, FaBackward, FaForward, FaHome,
  FaShare, FaDownload, FaHeart, FaBookmark, FaEye, FaUsers,
  FaMapMarkerAlt, FaStar, FaGlobe, FaArrowLeft
} from 'react-icons/fa'

// Enhanced interfaces for museum data
interface InteractivePoint {
  id: string
  x: number
  y: number
  title: string
  description: string
  type: 'info' | 'zoom' | 'audio' | 'video' | 'link'
  content?: string
  audioUrl?: string
  videoUrl?: string
  linkUrl?: string
}

interface AudioSegment {
  id: string
  title: string
  startTime: number
  duration: number
  description: string
}

interface AudioGuide {
  id: string
  title: string
  duration: number
  segments: AudioSegment[]
}

interface Artifact {
  id: string
  name: string
  description: string
  image: string
  period: string
  material: string
  dimensions: string
  significance: string
  audioDescription: string
  images360?: string[]
  interactivePoints?: InteractivePoint[]
  zoomLevels?: number[]
  audioGuide?: AudioGuide
  tags?: string[]
  location?: string
  discoveryDate?: string
  currentLocation?: string
}

interface Museum {
  id: string
  title: string
  description: string
  location: string
  established: string
  artifacts: Artifact[]
  totalVisitors: number
  rating: number
  virtualTours: number
}

const VirtualMuseumPage: React.FC = () => {
  const { museumId } = useParams<{ museumId: string }>()
  const navigate = useNavigate()
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // State management
  const [museum, setMuseum] = useState<Museum | null>(null)
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [, setCurrentArtifactIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'gallery' | 'detail' | '360'>('gallery')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [current360Index, setCurrent360Index] = useState(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioSegmentIndex, setAudioSegmentIndex] = useState(0)
  const [showInteractivePoints, setShowInteractivePoints] = useState(true)
  const [selectedPoint, setSelectedPoint] = useState<InteractivePoint | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock museum data with enhanced features
  const mockMuseum: Museum = {
    id: 'national-museum-ethiopia',
    title: 'National Museum of Ethiopia - Virtual Experience',
    description: 'Explore the treasures of Ethiopian history including Lucy, ancient manuscripts, royal artifacts, and cultural heritage spanning over 3 million years.',
    location: 'Addis Ababa, Ethiopia',
    established: '1958',
    totalVisitors: 125000,
    rating: 4.8,
    virtualTours: 15,
    artifacts: [
      {
        id: 'lucy',
        name: 'Lucy (Dinkinesh)',
        description: 'The famous 3.2 million-year-old hominid fossil discovered in 1974, representing one of the most complete early human ancestors.',
        image: '/images/lucy-fossil.jpg',
        period: '3.2 million years ago',
        material: 'Fossilized bone',
        dimensions: '1.1 meters tall',
        significance: 'Key evidence in human evolution studies',
        audioDescription: '/audio/lucy-description.mp3',
        discoveryDate: '1974',
        currentLocation: 'National Museum of Ethiopia',
        tags: ['paleontology', 'evolution', 'archaeology', 'famous'],
        images360: ['/images/360/lucy-front.jpg', '/images/360/lucy-side.jpg', '/images/360/lucy-back.jpg'],
        interactivePoints: [
          { id: '1', x: 30, y: 40, title: 'Skull Fragment', description: 'Well-preserved cranial remains showing brain capacity', type: 'info' },
          { id: '2', x: 50, y: 60, title: 'Pelvis Structure', description: 'Evidence of bipedal locomotion', type: 'zoom' },
          { id: '3', x: 70, y: 30, title: 'Audio Guide', description: 'Listen to detailed explanation', type: 'audio', audioUrl: '/audio/lucy-pelvis.mp3' }
        ],
        zoomLevels: [1, 2, 4, 8],
        audioGuide: {
          id: 'lucy-guide',
          title: 'Lucy: Our Ancient Ancestor',
          duration: 480,
          segments: [
            { id: '1', title: 'Discovery', startTime: 0, duration: 120, description: 'The story of Lucy\'s discovery in 1974' },
            { id: '2', title: 'Significance', startTime: 120, duration: 180, description: 'Why Lucy changed our understanding of human evolution' },
            { id: '3', title: 'Analysis', startTime: 300, duration: 180, description: 'Scientific analysis and findings' }
          ]
        }
      },
      {
        id: 'axum-obelisk',
        name: 'Axum Obelisk Model',
        description: 'A detailed model of the famous Axum obelisks, representing the ancient Kingdom of Axum\'s architectural achievements.',
        image: '/images/axum-obelisk.jpg',
        period: '4th century CE',
        material: 'Granite stone (model: bronze)',
        dimensions: '24 meters tall (original)',
        significance: 'Symbol of Axumite civilization and engineering prowess',
        audioDescription: '/audio/axum-description.mp3',
        discoveryDate: 'Ancient times',
        currentLocation: 'Axum, Tigray (original)',
        tags: ['architecture', 'ancient', 'kingdom', 'monument'],
        images360: ['/images/360/obelisk-1.jpg', '/images/360/obelisk-2.jpg'],
        interactivePoints: [
          { id: '1', x: 25, y: 20, title: 'Carved Inscriptions', description: 'Ancient Ge\'ez script and symbols', type: 'info' },
          { id: '2', x: 50, y: 80, title: 'Base Structure', description: 'Foundation and architectural details', type: 'zoom' }
        ],
        zoomLevels: [1, 2, 4]
      },
      {
        id: 'manuscript',
        name: 'Illuminated Manuscript',
        description: 'A beautiful example of Ethiopian Orthodox religious art featuring intricate illustrations and ancient Ge\'ez text.',
        image: '/images/manuscript.jpg',
        period: '15th century CE',
        material: 'Parchment, natural pigments',
        dimensions: '30 x 25 cm',
        significance: 'Represents Ethiopian Orthodox artistic tradition',
        audioDescription: '/audio/manuscript-description.mp3',
        discoveryDate: '1920s',
        currentLocation: 'National Museum of Ethiopia',
        tags: ['art', 'religion', 'manuscript', 'orthodox'],
        images360: ['/images/360/manuscript-1.jpg', '/images/360/manuscript-2.jpg'],
        interactivePoints: [
          { id: '1', x: 40, y: 30, title: 'Illuminated Letters', description: 'Decorated initial letters in gold leaf', type: 'zoom' },
          { id: '2', x: 60, y: 50, title: 'Religious Imagery', description: 'Saints and biblical scenes', type: 'info' },
          { id: '3', x: 30, y: 70, title: 'Ge\'ez Text', description: 'Ancient Ethiopian script', type: 'info' }
        ],
        zoomLevels: [1, 3, 6, 10]
      }
    ]
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setMuseum(mockMuseum)
      setLoading(false)
    }, 1000)
  }, [museumId])

  useEffect(() => {
    if (museum && museum.artifacts.length > 0) {
      setSelectedArtifact(museum.artifacts[0])
    }
  }, [museum])

  // Audio control functions
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsAudioPlaying(!isAudioPlaying)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: museum?.title,
        text: museum?.description,
        url: window.location.href
      })
    }
  }

  const handleDownload = () => {
    alert('Download feature will be implemented')
  }

  const handleZoomIn = () => {
    if (selectedArtifact?.zoomLevels) {
      const currentIndex = selectedArtifact.zoomLevels.indexOf(zoomLevel)
      if (currentIndex < selectedArtifact.zoomLevels.length - 1) {
        setZoomLevel(selectedArtifact.zoomLevels[currentIndex + 1])
      }
    }
  }

  const handleZoomOut = () => {
    if (selectedArtifact?.zoomLevels) {
      const currentIndex = selectedArtifact.zoomLevels.indexOf(zoomLevel)
      if (currentIndex > 0) {
        setZoomLevel(selectedArtifact.zoomLevels[currentIndex - 1])
      }
    }
  }

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90)
  }

  const handleRotateRight = () => {
    setRotation(prev => prev + 90)
  }

  const handle360Navigation = (direction: 'next' | 'prev') => {
    if (selectedArtifact?.images360) {
      if (direction === 'next') {
        setCurrent360Index(prev => 
          prev < selectedArtifact.images360!.length - 1 ? prev + 1 : 0
        )
      } else {
        setCurrent360Index(prev => 
          prev > 0 ? prev - 1 : selectedArtifact.images360!.length - 1
        )
      }
    }
  }

  const handleAudioSegmentSelect = (segmentIndex: number) => {
    setAudioSegmentIndex(segmentIndex)
    if (selectedArtifact?.audioGuide) {
      setAudioCurrentTime(selectedArtifact.audioGuide.segments[segmentIndex].startTime)
    }
  }

  const handleInteractivePointClick = (point: InteractivePoint) => {
    setSelectedPoint(point)
    if (point.type === 'audio') {
      setIsAudioPlaying(true)
    } else if (point.type === 'zoom') {
      handleZoomIn()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const filteredArtifacts = museum?.artifacts.filter(artifact => {
    const matchesSearch = searchTerm === '' || 
      artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
      artifact.tags?.includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  }) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Virtual Museum</h2>
          <p className="text-gray-600">Preparing your immersive experience...</p>
        </div>
      </div>
    )
  }

  if (!museum) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Museum Not Found</h2>
          <p className="text-gray-600 mb-4">The requested museum could not be loaded.</p>
          <Button onClick={() => navigate('/cultural')} variant="primary">
            Return to Culture Hub
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/cultural')}
              className="border-white text-white hover:bg-white hover:text-blue-900"
            >
              <FaArrowLeft className="mr-2" />
              Back to Culture Hub
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleShare}
                className="border-white text-white hover:bg-white hover:text-blue-900"
              >
                <FaShare className="mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="border-white text-white hover:bg-white hover:text-blue-900"
              >
                <FaDownload className="mr-2" />
                Download Guide
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                  🏛️ Virtual Museum
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ {museum.rating} Rating
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{museum.title}</h1>
              <p className="text-xl text-gray-200 mb-6">{museum.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{museum.artifacts.length}</div>
                  <div className="text-sm text-gray-300">Artifacts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{museum.virtualTours}</div>
                  <div className="text-sm text-gray-300">Virtual Tours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{(museum.totalVisitors / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-gray-300">Visitors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{museum.established}</div>
                  <div className="text-sm text-gray-300">Established</div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-yellow-400" />
                Museum Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Location:</span>
                  <span className="font-medium">{museum.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Established:</span>
                  <span className="font-medium">{museum.established}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Collections:</span>
                  <span className="font-medium">{museum.artifacts.length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Virtual Tours:</span>
                  <span className="font-medium">{museum.virtualTours} available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Selector */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('gallery')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'gallery' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaCamera className="mr-2 inline" />
                Gallery View
              </button>
              <button
                onClick={() => setViewMode('detail')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'detail' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaInfoCircle className="mr-2 inline" />
                Detail View
              </button>
              <button
                onClick={() => setViewMode('360')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === '360' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaCompass className="mr-2 inline" />
                360° View
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInteractivePoints(!showInteractivePoints)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showInteractivePoints ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FaMousePointer className="mr-1 inline" />
                Interactive Points
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery Grid View */}
            {viewMode === 'gallery' && museum && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Museum Gallery</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search artifacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="paleontology">Paleontology</option>
                      <option value="archaeology">Archaeology</option>
                      <option value="art">Art</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArtifacts.map((artifact, index) => (
                    <div
                      key={artifact.id}
                      onClick={() => {
                        setSelectedArtifact(artifact)
                        setCurrentArtifactIndex(index)
                        setViewMode('detail')
                        setZoomLevel(1)
                        setRotation(0)
                        setCurrent360Index(0)
                      }}
                      className="group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-amber-400 to-orange-600 relative">
                        <div className="flex items-center justify-center h-48">
                          <span className="text-4xl group-hover:scale-110 transition-transform">
                            {artifact.id === 'lucy' ? '🦴' : 
                             artifact.id === 'axum-obelisk' ? '🗿' :
                             artifact.id === 'manuscript' ? '📜' : '🏺'}
                          </span>
                        </div>
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                            <FaEye className="text-2xl mb-2 mx-auto" />
                            <p className="text-sm font-medium">View Details</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{artifact.name}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{artifact.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500">{artifact.period}</span>
                          <span className="text-xs text-gray-500">{artifact.material}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {artifact.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {artifact.images360 && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                360°
                              </span>
                            )}
                            {artifact.audioGuide && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                🎧 Audio
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredArtifacts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No artifacts found</h4>
                    <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
                  </div>
                )}
              </div>
            )}

            {/* Detail View */}
            {viewMode === 'detail' && selectedArtifact && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <div 
                      className="flex items-center justify-center h-64 bg-gradient-to-br from-amber-400 to-orange-600 relative overflow-hidden cursor-move"
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <span className="text-6xl">
                        {selectedArtifact.id === 'lucy' ? '🦴' : 
                         selectedArtifact.id === 'axum-obelisk' ? '🗿' :
                         selectedArtifact.id === 'manuscript' ? '📜' : '🏺'}
                      </span>
                      
                      {/* Interactive Points */}
                      {showInteractivePoints && selectedArtifact.interactivePoints?.map(point => (
                        <button
                          key={point.id}
                          onClick={() => handleInteractivePointClick(point)}
                          className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg hover:bg-blue-600 transition-colors animate-pulse hover:animate-none"
                          style={{ left: `${point.x}%`, top: `${point.y}%` }}
                          title={point.title}
                        >
                          <span className="sr-only">{point.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Image Controls */}
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                      disabled={!selectedArtifact.zoomLevels || zoomLevel === selectedArtifact.zoomLevels[0]}
                    >
                      <FaSearchMinus />
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                      disabled={!selectedArtifact.zoomLevels || zoomLevel === selectedArtifact.zoomLevels[selectedArtifact.zoomLevels.length - 1]}
                    >
                      <FaSearchPlus />
                    </button>
                    <button
                      onClick={handleRotateLeft}
                      className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                    >
                      <FaUndo />
                    </button>
                    <button
                      onClick={handleRotateRight}
                      className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                    >
                      <FaRedo />
                    </button>
                    {selectedArtifact.images360 && (
                      <button
                        onClick={() => setViewMode('360')}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaCompass />
                      </button>
                    )}
                  </div>
                  
                  {/* Zoom Level Indicator */}
                  {zoomLevel > 1 && (
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium">{zoomLevel}x Zoom</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedArtifact.name}</h3>
                      <p className="text-gray-600 mb-4">{selectedArtifact.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <FaHeart className="mr-2" />
                        Like
                      </Button>
                      <Button variant="outline" size="sm">
                        <FaBookmark className="mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>

                  {/* Artifact Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Historical Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Period:</span>
                            <span className="font-medium">{selectedArtifact.period}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Material:</span>
                            <span className="font-medium">{selectedArtifact.material}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dimensions:</span>
                            <span className="font-medium">{selectedArtifact.dimensions}</span>
                          </div>
                          {selectedArtifact.discoveryDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Discovery:</span>
                              <span className="font-medium">{selectedArtifact.discoveryDate}</span>
                            </div>
                          )}
                          {selectedArtifact.currentLocation && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium">{selectedArtifact.currentLocation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cultural Significance</h4>
                        <p className="text-sm text-gray-600">{selectedArtifact.significance}</p>
                      </div>
                      
                      {selectedArtifact.tags && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedArtifact.tags.map(tag => (
                              <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Point Details */}
                  {selectedPoint && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">{selectedPoint.title}</h4>
                          <p className="text-blue-800 text-sm">{selectedPoint.description}</p>
                          {selectedPoint.type === 'audio' && selectedPoint.audioUrl && (
                            <div className="mt-3">
                              <Button variant="primary" size="sm" onClick={toggleAudio}>
                                <FaPlay className="mr-2" />
                                Play Audio
                              </Button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedPoint(null)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Audio Guide Player */}
                  {selectedArtifact.audioGuide && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <FaHeadphones className="mr-2 text-blue-600" />
                          Audio Guide
                        </h4>
                        <span className="text-sm text-gray-600">
                          {formatTime(selectedArtifact.audioGuide.duration)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {selectedArtifact.audioGuide.segments.map((segment, index) => (
                          <button
                            key={segment.id}
                            onClick={() => handleAudioSegmentSelect(index)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              audioSegmentIndex === index
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{segment.title}</div>
                                <div className="text-sm text-gray-600">{segment.description}</div>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatTime(segment.duration)}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleAudio}
                          className="flex items-center"
                        >
                          {isAudioPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                          {isAudioPlaying ? 'Pause' : 'Play'}
                        </Button>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(audioCurrentTime / selectedArtifact.audioGuide.duration) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatTime(audioCurrentTime)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 360° View */}
            {viewMode === '360' && selectedArtifact?.images360 && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9 bg-black">
                    <div className="flex items-center justify-center h-96 bg-gradient-to-br from-indigo-900 to-purple-900 relative">
                      <span className="text-8xl animate-pulse">🌐</span>
                      
                      {/* 360° Navigation */}
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                          onClick={() => handle360Navigation('prev')}
                          className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                        >
                          <FaBackward />
                        </button>
                        <button
                          onClick={() => handle360Navigation('next')}
                          className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                        >
                          <FaForward />
                        </button>
                      </div>
                      
                      {/* 360° Indicator */}
                      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FaCompass className="animate-spin" />
                          <span className="text-sm font-medium">360° View</span>
                        </div>
                      </div>
                      
                      {/* View Counter */}
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                        <span className="text-sm">
                          {current360Index + 1} / {selectedArtifact.images360.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    360° View: {selectedArtifact.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Explore this artifact from all angles. Use your mouse or touch to rotate the view and discover hidden details.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setViewMode('detail')}
                      >
                        <FaCamera className="mr-2" />
                        Standard View
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setViewMode('gallery')}
                      >
                        <FaHome className="mr-2" />
                        Back to Gallery
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      View {current360Index + 1} of {selectedArtifact.images360.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Artifact Navigation */}
            {museum && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCompass className="mr-2 text-blue-600" />
                  Navigate Collection
                </h3>
                
                <div className="space-y-3">
                  {museum.artifacts.map((artifact, index) => (
                    <button
                      key={artifact.id}
                      onClick={() => {
                        setSelectedArtifact(artifact)
                        setCurrentArtifactIndex(index)
                        setViewMode('detail')
                        setZoomLevel(1)
                        setRotation(0)
                        setCurrent360Index(0)
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedArtifact?.id === artifact.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {artifact.id === 'lucy' ? '🦴' : 
                           artifact.id === 'axum-obelisk' ? '🗿' :
                           artifact.id === 'manuscript' ? '📜' : '🏺'}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{artifact.name}</div>
                          <div className="text-sm text-gray-600">{artifact.period}</div>
                        </div>
                        {artifact.images360 && (
                          <span className="text-purple-600">
                            <FaGlobe />
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Museum Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUsers className="mr-2 text-green-600" />
                Museum Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Artifacts</span>
                  <span className="font-semibold text-gray-900">{museum?.artifacts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">360° Views Available</span>
                  <span className="font-semibold text-gray-900">
                    {museum?.artifacts.filter(a => a.images360).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Audio Guides</span>
                  <span className="font-semibold text-gray-900">
                    {museum?.artifacts.filter(a => a.audioGuide).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Interactive Points</span>
                  <span className="font-semibold text-gray-900">
                    {museum?.artifacts.reduce((total, a) => total + (a.interactivePoints?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Virtual Visitors</span>
                  <span className="font-semibold text-gray-900">{museum?.totalVisitors.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-semibold text-gray-900">{museum?.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  onClick={() => setViewMode('gallery')}
                >
                  <FaCamera className="mr-2" />
                  View All Artifacts
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleShare}
                >
                  <FaShare className="mr-2" />
                  Share Museum
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleDownload}
                >
                  <FaDownload className="mr-2" />
                  Download Guide
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/cultural')}
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Culture Hub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setAudioCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => setIsAudioPlaying(false)}
        className="hidden"
      >
        <source src={selectedArtifact?.audioDescription} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default VirtualMuseumPage