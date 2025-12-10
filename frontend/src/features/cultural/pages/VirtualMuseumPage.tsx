import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import { FaArrowLeft, FaExpand, FaVolumeUp, FaDownload, FaShare, FaHeart, FaEye, FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa'

interface MuseumExhibit {
  id: string
  title: string
  description: string
  image: string
  audioGuide?: string
  videoTour?: string
  artifacts: Artifact[]
  category: string
  period: string
  significance: string
  location: string
  curator: string
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
  audioDescription?: string
}

// Mock museum data
const mockMuseums: MuseumExhibit[] = [
  {
    id: '1',
    title: 'National Museum of Ethiopia',
    description: 'Explore the treasures of Ethiopian history including Lucy, ancient manuscripts, and royal artifacts.',
    image: '/images/national-museum.jpg',
    audioGuide: '/audio/national-museum-guide.mp3',
    videoTour: '/videos/national-museum-tour.mp4',
    category: 'National Heritage',
    period: 'Prehistoric to Modern',
    significance: 'Houses Lucy (Australopithecus afarensis) and other significant archaeological finds',
    location: 'Addis Ababa',
    curator: 'Dr. Yonas Beyene',
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
        audioDescription: '/audio/lucy-description.mp3'
      },
      {
        id: 'crown',
        name: 'Imperial Crown of Ethiopia',
        description: 'The ceremonial crown worn by Ethiopian emperors, featuring intricate goldwork and precious stones.',
        image: '/images/imperial-crown.jpg',
        period: '19th-20th century',
        material: 'Gold, precious stones',
        dimensions: '25cm height, 20cm diameter',
        significance: 'Symbol of Ethiopian imperial power and sovereignty'
      },
      {
        id: 'manuscripts',
        name: 'Ancient Ge\'ez Manuscripts',
        description: 'Collection of religious and historical texts written in the ancient Ge\'ez script.',
        image: '/images/geez-manuscripts.jpg',
        period: '14th-18th century',
        material: 'Parchment, natural inks',
        dimensions: 'Various sizes',
        significance: 'Preserves Ethiopian Orthodox Christian literature and history'
      }
    ]
  },
  {
    id: '2',
    title: 'Ethnological Museum',
    description: 'Discover Ethiopian cultural diversity through traditional clothing, musical instruments, and ceremonial objects.',
    image: '/images/ethnological-museum.jpg',
    category: 'Cultural Heritage',
    period: 'Traditional to Contemporary',
    significance: 'Showcases the diversity of Ethiopian ethnic groups and their cultural practices',
    location: 'Addis Ababa University',
    curator: 'Prof. Girma Fisseha',
    artifacts: [
      {
        id: 'traditional-dress',
        name: 'Traditional Ethiopian Clothing',
        description: 'Collection of traditional garments from various Ethiopian ethnic groups.',
        image: '/images/traditional-clothing.jpg',
        period: '19th-20th century',
        material: 'Cotton, silk, leather',
        dimensions: 'Various sizes',
        significance: 'Represents cultural identity and craftsmanship of Ethiopian peoples'
      },
      {
        id: 'musical-instruments',
        name: 'Traditional Musical Instruments',
        description: 'Krar, masinko, washint, and other traditional Ethiopian instruments.',
        image: '/images/musical-instruments.jpg',
        period: 'Traditional',
        material: 'Wood, animal skin, metal',
        dimensions: 'Various sizes',
        significance: 'Central to Ethiopian music and cultural expression'
      }
    ]
  }
]

const VirtualMuseumPage: React.FC = () => {
  const { museumId } = useParams<{ museumId?: string }>()
  const navigate = useNavigate()
  
  const [museum, setMuseum] = useState<MuseumExhibit | null>(null)
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [currentArtifactIndex, setCurrentArtifactIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchMuseum = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (museumId) {
        const foundMuseum = mockMuseums.find(m => m.id === museumId)
        setMuseum(foundMuseum || mockMuseums[0])
        if (foundMuseum && foundMuseum.artifacts.length > 0) {
          setSelectedArtifact(foundMuseum.artifacts[0])
        }
      } else {
        setMuseum(mockMuseums[0])
        setSelectedArtifact(mockMuseums[0].artifacts[0])
      }
      
      setLoading(false)
    }

    fetchMuseum()
  }, [museumId])

  const handleArtifactSelect = (artifact: Artifact, index: number) => {
    setSelectedArtifact(artifact)
    setCurrentArtifactIndex(index)
  }

  const handleNextArtifact = () => {
    if (museum && currentArtifactIndex < museum.artifacts.length - 1) {
      const nextIndex = currentArtifactIndex + 1
      setSelectedArtifact(museum.artifacts[nextIndex])
      setCurrentArtifactIndex(nextIndex)
    }
  }

  const handlePreviousArtifact = () => {
    if (museum && currentArtifactIndex > 0) {
      const prevIndex = currentArtifactIndex - 1
      setSelectedArtifact(museum.artifacts[prevIndex])
      setCurrentArtifactIndex(prevIndex)
    }
  }

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying)
    // TODO: Implement actual audio playback
  }

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying)
    // TODO: Implement actual video playback
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
    // TODO: Implement download functionality
    alert('Download feature will be implemented')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading virtual museum...</p>
        </div>
      </div>
    )
  }

  if (!museum) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Museum Not Found</h2>
          <p className="text-gray-600 mb-6">The requested museum could not be found.</p>
          <Button variant="primary" onClick={() => navigate('/cultural')}>
            Back to Cultural Hub
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/cultural')}
                className="flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                Back to Cultural Hub
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{museum.title}</h1>
                <p className="text-gray-600">{museum.location} • {museum.category}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleShare}>
                <FaShare className="mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <FaDownload className="mr-2" />
                Download Guide
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Museum Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Museum Overview</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FaEye className="mr-1" />
                    2,450 visitors
                  </span>
                  <span className="flex items-center">
                    <FaHeart className="mr-1" />
                    189 likes
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{museum.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Period:</span>
                  <span className="ml-2 text-gray-600">{museum.period}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Curator:</span>
                  <span className="ml-2 text-gray-600">{museum.curator}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-900">Significance:</span>
                  <span className="ml-2 text-gray-600">{museum.significance}</span>
                </div>
              </div>

              {/* Audio/Video Controls */}
              <div className="flex items-center space-x-4 mt-6 pt-4 border-t">
                {museum.audioGuide && (
                  <Button
                    variant="outline"
                    onClick={toggleAudio}
                    className="flex items-center"
                  >
                    <FaVolumeUp className="mr-2" />
                    {isAudioPlaying ? 'Pause' : 'Play'} Audio Guide
                  </Button>
                )}
                {museum.videoTour && (
                  <Button
                    variant="outline"
                    onClick={toggleVideo}
                    className="flex items-center"
                  >
                    {isVideoPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                    {isVideoPlaying ? 'Pause' : 'Play'} Video Tour
                  </Button>
                )}
              </div>
            </div>

            {/* Selected Artifact Detail */}
            {selectedArtifact && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <div className="flex items-center justify-center h-64 bg-gradient-to-br from-amber-400 to-orange-600">
                    <span className="text-6xl">🏺</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{selectedArtifact.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousArtifact}
                        disabled={currentArtifactIndex === 0}
                      >
                        <FaBackward />
                      </Button>
                      <span className="text-sm text-gray-600">
                        {currentArtifactIndex + 1} of {museum.artifacts.length}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextArtifact}
                        disabled={currentArtifactIndex === museum.artifacts.length - 1}
                      >
                        <FaForward />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{selectedArtifact.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-900">Period:</span>
                      <span className="ml-2 text-gray-600">{selectedArtifact.period}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Material:</span>
                      <span className="ml-2 text-gray-600">{selectedArtifact.material}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Dimensions:</span>
                      <span className="ml-2 text-gray-600">{selectedArtifact.dimensions}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="font-medium text-gray-900">Historical Significance:</span>
                    <p className="text-gray-600 mt-1">{selectedArtifact.significance}</p>
                  </div>

                  {selectedArtifact.audioDescription && (
                    <Button variant="outline" className="flex items-center">
                      <FaVolumeUp className="mr-2" />
                      Listen to Description
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Artifact Gallery */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Artifacts & Exhibits</h3>
              <div className="space-y-3">
                {museum.artifacts.map((artifact, index) => (
                  <button
                    key={artifact.id}
                    onClick={() => handleArtifactSelect(artifact, index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedArtifact?.id === artifact.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🏺</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{artifact.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{artifact.period}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Museum Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Visit Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Location:</span>
                  <p className="text-gray-600">{museum.location}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <p className="text-gray-600">{museum.category}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Virtual Tour Duration:</span>
                  <p className="text-gray-600">30-45 minutes</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <Button variant="primary" className="w-full">
                  Plan Physical Visit
                </Button>
              </div>
            </div>

            {/* Related Museums */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Other Museums</h3>
              <div className="space-y-3">
                {mockMuseums
                  .filter(m => m.id !== museum.id)
                  .map(otherMuseum => (
                    <button
                      key={otherMuseum.id}
                      onClick={() => navigate(`/cultural/museum/${otherMuseum.id}`)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900">{otherMuseum.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{otherMuseum.location}</p>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualMuseumPage