import React, { useState } from 'react'
import {
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress,
  FaArrowLeft, FaArrowRight, FaDownload, FaShare, FaEye, FaHeart,
  FaBookmark, FaExternalLinkAlt, FaQuoteLeft, FaInfoCircle
} from 'react-icons/fa'
import { Button } from '@components/common/Button/Button'

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnail?: string
  title?: string
  description?: string
  duration?: number
  size?: string
}

interface ImageGalleryProps {
  images: MediaItem[]
  title?: string
  className?: string
}

interface VideoPlayerProps {
  video: MediaItem
  autoPlay?: boolean
  className?: string
}

interface AudioPlayerProps {
  audio: MediaItem
  autoPlay?: boolean
  className?: string
}

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
}

interface QuoteBlockProps {
  quote: string
  author?: string
  source?: string
  className?: string
}

interface InfoBoxProps {
  title: string
  content: string
  type?: 'info' | 'warning' | 'success' | 'error'
  className?: string
}

// Image Gallery Component
export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  title, 
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsLightboxOpen(true)
  }

  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      
      {/* Main Image */}
      <div className="relative">
        <div 
          className="aspect-w-16 aspect-h-9 bg-gray-200 cursor-pointer"
          onClick={() => openLightbox(currentIndex)}
        >
          <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-400 to-purple-600">
            <span className="text-4xl text-white">🖼️</span>
          </div>
        </div>
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <FaArrowRight />
            </button>
          </>
        )}
        
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentIndex ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                  <span className="text-xs">📷</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Info */}
      {images[currentIndex] && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {images[currentIndex].title && (
                <h4 className="font-medium text-gray-900">{images[currentIndex].title}</h4>
              )}
              {images[currentIndex].description && (
                <p className="text-sm text-gray-600 mt-1">{images[currentIndex].description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <FaDownload className="mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <FaShare className="mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors z-10"
            >
              ✕
            </button>
            
            <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center h-96">
              <span className="text-8xl text-white">🖼️</span>
            </div>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <FaArrowRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Video Player Component
export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  autoPlay = false, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(video.duration || 300)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-black rounded-lg overflow-hidden ${className}`}>
      <div className="relative aspect-w-16 aspect-h-9">
        <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-800 to-black">
          <span className="text-6xl text-white">🎬</span>
        </div>
        
        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center group">
          <button
            onClick={togglePlay}
            className="p-4 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isPlaying ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl ml-1" />}
          </button>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            
            <div className="flex-1 bg-gray-600 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            
            <button onClick={toggleMute} className="text-white hover:text-gray-300">
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4 bg-gray-900 text-white">
        <div className="flex items-center justify-between">
          <div>
            {video.title && <h4 className="font-medium">{video.title}</h4>}
            {video.description && <p className="text-sm text-gray-300 mt-1">{video.description}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
              <FaDownload className="mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
              <FaShare className="mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Audio Player Component
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audio, 
  autoPlay = false, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(audio.duration || 180)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white ${className}`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
        >
          {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl ml-1" />}
        </button>
        
        <div className="flex-1">
          {audio.title && <h4 className="font-medium mb-1">{audio.title}</h4>}
          
          <div className="flex items-center space-x-3">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <div className="flex-1 bg-white bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-600">
            <FaDownload className="mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-600">
            <FaShare className="mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      {audio.description && (
        <p className="text-sm text-white text-opacity-90 mt-3">{audio.description}</p>
      )}
    </div>
  )
}

// Share Buttons Component
export const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  url, 
  title, 
  description, 
  className = '' 
}) => {
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  const shareOnTwitter = () => {
    const text = `${title} ${description ? '- ' + description : ''}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    // TODO: Show toast notification
  }

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url
      })
    }
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm text-gray-600 font-medium">Share:</span>
      
      {navigator.share && (
        <Button variant="outline" size="sm" onClick={shareNative}>
          <FaShare className="mr-1" />
          Share
        </Button>
      )}
      
      <button
        onClick={shareOnFacebook}
        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        title="Share on Facebook"
      >
        📘
      </button>
      
      <button
        onClick={shareOnTwitter}
        className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
        title="Share on Twitter"
      >
        🐦
      </button>
      
      <button
        onClick={shareOnLinkedIn}
        className="p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
        title="Share on LinkedIn"
      >
        💼
      </button>
      
      <button
        onClick={copyToClipboard}
        className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        title="Copy Link"
      >
        🔗
      </button>
    </div>
  )
}

// Quote Block Component
export const QuoteBlock: React.FC<QuoteBlockProps> = ({ 
  quote, 
  author, 
  source, 
  className = '' 
}) => {
  return (
    <div className={`bg-blue-50 border-l-4 border-blue-500 p-6 my-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <FaQuoteLeft className="text-blue-500 text-2xl flex-shrink-0 mt-1" />
        <div>
          <blockquote className="text-lg text-gray-800 italic mb-3">
            "{quote}"
          </blockquote>
          {(author || source) && (
            <div className="text-sm text-gray-600">
              {author && <span className="font-medium">— {author}</span>}
              {source && <span className="ml-2">({source})</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Info Box Component
export const InfoBox: React.FC<InfoBoxProps> = ({ 
  title, 
  content, 
  type = 'info', 
  className = '' 
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return <FaInfoCircle />
    }
  }

  return (
    <div className={`border rounded-lg p-4 my-4 ${getTypeStyles()} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-lg">
          {getIcon()}
        </div>
        <div>
          <h4 className="font-semibold mb-2">{title}</h4>
          <div className="text-sm" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  )
}

// Rich Text Renderer Component
interface RichTextRendererProps {
  content: string
  className?: string
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}