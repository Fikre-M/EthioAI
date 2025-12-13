import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaPlay, FaPause, FaExpand, FaCompress,
  FaArrowLeft, FaArrowRight, FaSearchPlus, FaSearchMinus, FaUndo,
  FaRedo, FaCompass, FaShare, FaDownload, FaHeart, FaBookmark,
  FaEye, FaClock, FaHeadphones,
  FaMousePointer, FaInfoCircle, FaCamera, FaGlobe, FaUsers, FaTag
} from 'react-icons/fa'

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

interface RelatedArtifact {
  id: string
  name: string
  period: string
  image: string
}

interface Artifact {
  id: string
  name: string
  description: string
  detailedDescription: string
  image: string
  period: string
  material: string
  dimensions: string
  weight?: string
  significance: string
  audioDescription: string
  images360?: string[]
  interactivePoints?: InteractivePoint[]
  zoomLevels?: number[]
  audioGuide?: AudioGuide
  tags?: string[]
  location?: string
  discoveryDate?: string
  discoveredBy?: string
  currentLocation?: string
  conservationStatus?: string
  culturalContext?: string
  historicalSignificance?: string
  relatedArtifacts?: RelatedArtifact[]
  views?: number
  likes?: number
  bookmarks?: number
}

const ArtifactDetailPage: React.FC = () => {
  const { artifactId } = useParams<{ artifactId: string }>()
  const navigate = useNavigate()
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // State management
  const [artifact, setArtifact] = useState<Artifact | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'standard' | '360' | 'detail'>('standard')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [current360Index, setCurrent360Index] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioSegmentIndex, setAudioSegmentIndex] = useState(0)
  const [showInteractivePoints, setShowInteractivePoints] = useState(true)
  const [selectedPoint, setSelectedPoint] = useState<InteractivePoint | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'conservation' | 'related'>('overview')

  // Mock artifact data
  const mockArtifact: Artifact = {
    id: 'lucy',
    name: 'Lucy (Dinkinesh)',
    description: 'The famous 3.2 million-year-old hominid fossil discovered in 1974, representing one of the most complete early human ancestors.',
    detailedDescription: 'Lucy is a collection of several hundred pieces of fossilized bone representing 40 percent of the skeleton of a female of the hominin species Australopithecus afarensis. The specimen was discovered in the Afar Triangle of Ethiopia by paleoanthropologist Donald Johanson and his team in 1974. Lucy is estimated to have lived 3.2 million years ago and is one of the most complete early human ancestor fossils ever discovered.',
    image: '/images/lucy-fossil.jpg',
    period: '3.2 million years ago',
    material: 'Fossilized bone (calcium phosphate)',
    dimensions: '1.1 meters tall (estimated living height)',
    weight: 'Approximately 29 kg (estimated living weight)',
    significance: 'Key evidence in human evolution studies, proving bipedalism in early hominins',
    audioDescription: '/audio/lucy-description.mp3',
    discoveryDate: 'November 24, 1974',
    discoveredBy: 'Donald Johanson and Tom Gray',
    currentLocation: 'National Museum of Ethiopia, Addis Ababa',
    conservationStatus: 'Excellent - stored in climate-controlled environment',
    culturalContext: 'Named "Dinkinesh" (meaning "you are marvelous" in Amharic) by the Ethiopian people',
    historicalSignificance: 'Revolutionary discovery that changed our understanding of human evolution and the timeline of bipedalism',
    tags: ['paleontology', 'evolution', 'archaeology', 'famous', 'bipedalism', 'hominid'],
    views: 45230,
    likes: 3420,
    bookmarks: 1250,
    images360: [
      '/images/360/lucy-front.jpg',
      '/images/360/lucy-side.jpg', 
      '/images/360/lucy-back.jpg',
      '/images/360/lucy-skull.jpg'
    ],
    interactivePoints: [
      {
        id: '1',
        x: 30,
        y: 40,
        title: 'Skull Fragment',
        description: 'Well-preserved cranial remains showing brain capacity of approximately 375-500 cubic centimeters',
        type: 'info',
        content: 'The skull fragments of Lucy provide crucial insights into the brain size and structure of early hominins. The cranial capacity suggests a brain about one-third the size of modern humans.'
      },
      {
        id: '2',
        x: 50,
        y: 60,
        title: 'Pelvis Structure',
        description: 'Evidence of bipedal locomotion - the key discovery that proved early human ancestors walked upright',
        type: 'zoom',
        content: 'The pelvis is the most significant part of Lucy\'s skeleton, as it clearly shows adaptations for upright walking, including a broader, shorter pelvis compared to apes.'
      },
      {
        id: '3',
        x: 70,
        y: 30,
        title: 'Femur Bone',
        description: 'Thigh bone showing angle adaptation for bipedal walking',
        type: 'info',
        content: 'The femur shows the characteristic angle that allows for efficient bipedal locomotion, a key evolutionary adaptation.'
      },
      {
        id: '4',
        x: 40,
        y: 75,
        title: 'Audio Guide',
        description: 'Listen to detailed explanation of Lucy\'s discovery and significance',
        type: 'audio',
        audioUrl: '/audio/lucy-discovery.mp3'
      }
    ],
    zoomLevels: [1, 2, 4, 8, 16],
    audioGuide: {
      id: 'lucy-guide',
      title: 'Lucy: Our Ancient Ancestor',
      duration: 720,
      segments: [
        {
          id: '1',
          title: 'The Discovery',
          startTime: 0,
          duration: 180,
          description: 'The remarkable story of how Lucy was discovered in the Afar Triangle in 1974'
        },
        {
          id: '2',
          title: 'Anatomical Significance',
          startTime: 180,
          duration: 200,
          description: 'Understanding Lucy\'s anatomy and what it tells us about early human evolution'
        },
        {
          id: '3',
          title: 'Bipedalism Revolution',
          startTime: 380,
          duration: 160,
          description: 'How Lucy proved that our ancestors walked upright millions of years ago'
        },
        {
          id: '4',
          title: 'Cultural Impact',
          startTime: 540,
          duration: 180,
          description: 'Lucy\'s impact on science, culture, and our understanding of human origins'
        }
      ]
    },
    relatedArtifacts: [
      {
        id: 'ardi',
        name: 'Ardipithecus ramidus (Ardi)',
        period: '4.4 million years ago',
        image: '/images/ardi-fossil.jpg'
      },
      {
        id: 'selam',
        name: 'Selam (Lucy\'s Baby)',
        period: '3.3 million years ago',
        image: '/images/selam-fossil.jpg'
      },
      {
        id: 'homo-erectus',
        name: 'Homo erectus skull',
        period: '1.9 million years ago',
        image: '/images/homo-erectus.jpg'
      }
    ]
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setArtifact(mockArtifact)
      setLoading(false)
    }, 1000)
  }, [artifactId])

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

  const handleZoomIn = () => {
    if (artifact?.zoomLevels) {
      const currentIndex = artifact.zoomLevels.indexOf(zoomLevel)
      if (currentIndex < artifact.zoomLevels.length - 1) {
        setZoomLevel(artifact.zoomLevels[currentIndex + 1])
      }
    }
  }

  const handleZoomOut = () => {
    if (artifact?.zoomLevels) {
      const currentIndex = artifact.zoomLevels.indexOf(zoomLevel)
      if (currentIndex > 0) {
        setZoomLevel(artifact.zoomLevels[currentIndex - 1])
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
    if (artifact?.images360) {
      if (direction === 'next') {
        setCurrent360Index(prev => 
          prev < artifact.images360!.length - 1 ? prev + 1 : 0
        )
      } else {
        setCurrent360Index(prev => 
          prev > 0 ? prev - 1 : artifact.images360!.length - 1
        )
      }
    }
  }

  const handleAudioSegmentSelect = (segmentIndex: number) => {
    setAudioSegmentIndex(segmentIndex)
    if (artifact?.audioGuide) {
      setAudioCurrentTime(artifact.audioGuide.segments[segmentIndex].startTime)
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artifact?.name,
        text: artifact?.description,
        url: window.location.href
      })
    }
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
    // TODO: Implement like functionality
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: Implement bookmark functionality
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Artifact</h2>
          <p className="text-gray-600">Preparing detailed view...</p>
        </div>
      </div>
    )
  }

  if (!artifact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏺</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Artifact Not Found</h2>
          <p className="text-gray-600 mb-4">The requested artifact could not be loaded.</p>
          <Button onClick={() => navigate('/cultural/museum')} variant="primary">
            Return to Museum
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-orange-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/cultural/museum')}
              className="border-white text-white hover:bg-white hover:text-amber-900"
            >
              <FaArrowLeft className="mr-2" />
              Back to Museum
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={toggleLike}
                className={`border-white hover:bg-white hover:text-amber-900 ${
                  isLiked ? 'bg-white text-amber-900' : 'text-white'
                }`}
              >
                <FaHeart className="mr-2" />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="outline"
                onClick={toggleBookmark}
                className={`border-white hover:bg-white hover:text-amber-900 ${
                  isBookmarked ? 'bg-white text-amber-900' : 'text-white'
                }`}
              >
                <FaBookmark className="mr-2" />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="border-white text-white hover:bg-white hover:text-amber-900"
              >
                <FaShare className="mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                  🦴 Paleontology
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Featured Artifact
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{artifact.name}</h1>
              <p className="text-xl text-gray-200 mb-6">{artifact.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{artifact.views?.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{artifact.likes?.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Likes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{artifact.bookmarks?.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Bookmarks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">4.9</div>
                  <div className="text-sm text-gray-300">Rating</div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-yellow-400" />
                Quick Facts
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Period:</span>
                  <span className="font-medium">{artifact.period}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Discovered:</span>
                  <span className="font-medium">{artifact.discoveryDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Location:</span>
                  <span className="font-medium">{artifact.currentLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Material:</span>
                  <span className="font-medium">{artifact.material}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Mode Selector */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setViewMode('standard')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'standard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaCamera className="mr-2 inline" />
                    Standard View
                  </button>
                  <button
                    onClick={() => setViewMode('detail')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'detail' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaSearchPlus className="mr-2 inline" />
                    Detail View
                  </button>
                  {artifact.images360 && (
                    <button
                      onClick={() => setViewMode('360')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        viewMode === '360' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaCompass className="mr-2 inline" />
                      360° View
                    </button>
                  )}
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

            {/* Artifact Viewer */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="relative">
                {viewMode === 'standard' && (
                  <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-amber-400 to-orange-600">
                    <div className="flex items-center justify-center h-96">
                      <span className="text-8xl">🦴</span>
                    </div>
                  </div>
                )}

                {viewMode === 'detail' && (
                  <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-amber-400 to-orange-600 relative overflow-hidden">
                    <div 
                      className="flex items-center justify-center h-96 cursor-move"
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <span className="text-8xl">🦴</span>
                      
                      {/* Interactive Points */}
                      {showInteractivePoints && artifact.interactivePoints?.map(point => (
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
                )}

                {viewMode === '360' && artifact.images360 && (
                  <div className="aspect-w-16 aspect-h-12 bg-black">
                    <div className="flex items-center justify-center h-96 bg-gradient-to-br from-indigo-900 to-purple-900 relative">
                      <span className="text-8xl animate-pulse">🌐</span>
                      
                      {/* 360° Navigation */}
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                          onClick={() => handle360Navigation('prev')}
                          className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                        >
                          <FaArrowLeft />
                        </button>
                        <button
                          onClick={() => handle360Navigation('next')}
                          className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                        >
                          <FaArrowRight />
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
                          {current360Index + 1} / {artifact.images360.length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  {viewMode === 'detail' && (
                    <>
                      <button
                        onClick={handleZoomOut}
                        className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                        disabled={!artifact.zoomLevels || zoomLevel === artifact.zoomLevels[0]}
                      >
                        <FaSearchMinus />
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                        disabled={!artifact.zoomLevels || zoomLevel === artifact.zoomLevels[artifact.zoomLevels.length - 1]}
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
                    </>
                  )}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                  >
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>

                {/* Zoom Level Indicator */}
                {viewMode === 'detail' && zoomLevel > 1 && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium">{zoomLevel}x Zoom</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Point Details */}
            {selectedPoint && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2 text-lg">{selectedPoint.title}</h4>
                    <p className="text-blue-800 mb-4">{selectedPoint.description}</p>
                    {selectedPoint.content && (
                      <p className="text-blue-700 text-sm mb-4">{selectedPoint.content}</p>
                    )}
                    {selectedPoint.type === 'audio' && selectedPoint.audioUrl && (
                      <div className="flex items-center space-x-3">
                        <Button variant="primary" size="sm" onClick={toggleAudio}>
                          {isAudioPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                          {isAudioPlaying ? 'Pause Audio' : 'Play Audio'}
                        </Button>
                        <span className="text-sm text-blue-700">Listen to detailed explanation</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedPoint(null)}
                    className="text-blue-600 hover:text-blue-800 text-xl font-bold ml-4"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Detailed Information Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: FaInfoCircle },
                    { id: 'history', label: 'History', icon: FaClock },
                    { id: 'conservation', label: 'Conservation', icon: FaUsers },
                    { id: 'related', label: 'Related', icon: FaGlobe }
                  ].map(tab => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="mr-2 inline" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Detailed Description</h4>
                      <p className="text-gray-700 leading-relaxed">{artifact.detailedDescription}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Physical Characteristics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dimensions:</span>
                            <span className="font-medium">{artifact.dimensions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Material:</span>
                            <span className="font-medium">{artifact.material}</span>
                          </div>
                          {artifact.weight && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Weight:</span>
                              <span className="font-medium">{artifact.weight}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Period:</span>
                            <span className="font-medium">{artifact.period}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Cultural Significance</h4>
                        <p className="text-sm text-gray-700">{artifact.significance}</p>
                        
                        {artifact.culturalContext && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">Cultural Context</h5>
                            <p className="text-sm text-gray-700">{artifact.culturalContext}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {artifact.tags && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {artifact.tags.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                              <FaTag className="mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Discovery Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-600">Discovery Date:</span>
                            <p className="font-medium">{artifact.discoveryDate}</p>
                          </div>
                          {artifact.discoveredBy && (
                            <div>
                              <span className="text-sm text-gray-600">Discovered By:</span>
                              <p className="font-medium">{artifact.discoveredBy}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-sm text-gray-600">Current Location:</span>
                            <p className="font-medium">{artifact.currentLocation}</p>
                          </div>
                        </div>
                        <div>
                          {artifact.historicalSignificance && (
                            <div>
                              <span className="text-sm text-gray-600">Historical Significance:</span>
                              <p className="text-sm text-gray-700 mt-1">{artifact.historicalSignificance}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'conservation' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Conservation Status</h4>
                      {artifact.conservationStatus && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span className="font-medium text-green-900">Status: Excellent</span>
                          </div>
                          <p className="text-green-800 text-sm mt-2">{artifact.conservationStatus}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Preservation Efforts</h4>
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h5 className="font-medium text-gray-900">Climate Control</h5>
                          <p className="text-sm text-gray-700">Maintained in temperature and humidity controlled environment to prevent deterioration.</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <h5 className="font-medium text-gray-900">Digital Preservation</h5>
                          <p className="text-sm text-gray-700">High-resolution 3D scanning and photography for research and virtual access.</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h5 className="font-medium text-gray-900">Research Access</h5>
                          <p className="text-sm text-gray-700">Controlled access for scientific research while ensuring artifact protection.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'related' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Related Artifacts</h4>
                      {artifact.relatedArtifacts && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {artifact.relatedArtifacts.map(related => (
                            <div
                              key={related.id}
                              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                              onClick={() => navigate(`/cultural/artifact/${related.id}`)}
                            >
                              <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg mb-3">
                                <div className="flex items-center justify-center h-24">
                                  <span className="text-2xl">🦴</span>
                                </div>
                              </div>
                              <h5 className="font-medium text-gray-900 mb-1">{related.name}</h5>
                              <p className="text-sm text-gray-600">{related.period}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Audio Guide */}
            {artifact.audioGuide && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaHeadphones className="mr-2 text-blue-600" />
                  Audio Guide
                </h3>
                
                <div className="space-y-3 mb-4">
                  {artifact.audioGuide.segments.map((segment, index) => (
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
                    variant="primary"
                    onClick={toggleAudio}
                    className="flex items-center"
                  >
                    {isAudioPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                    {isAudioPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(audioCurrentTime / artifact.audioGuide.duration) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatTime(audioCurrentTime)} / {formatTime(artifact.audioGuide.duration)}
                  </span>
                </div>
              </div>
            )}

            {/* Artifact Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaEye className="mr-2 text-green-600" />
                Engagement
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold text-gray-900">{artifact.views?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Likes</span>
                  <span className="font-semibold text-gray-900">{artifact.likes?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bookmarks</span>
                  <span className="font-semibold text-gray-900">{artifact.bookmarks?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Interactive Points</span>
                  <span className="font-semibold text-gray-900">{artifact.interactivePoints?.length || 0}</span>
                </div>
                {artifact.images360 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">360° Views</span>
                    <span className="font-semibold text-gray-900">{artifact.images360.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  onClick={handleShare}
                >
                  <FaShare className="mr-2" />
                  Share Artifact
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {/* TODO: Implement download */}}
                >
                  <FaDownload className="mr-2" />
                  Download Info
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/cultural/museum')}
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Museum
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
        <source src={artifact.audioDescription} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default ArtifactDetailPage