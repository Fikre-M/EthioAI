import React, { useState, useRef, useEffect } from 'react'
import {
  FaExpand, FaCompress, FaUndo, FaRedo, FaSearchPlus,
  FaSearchMinus, FaPlay, FaVolumeUp,
  FaArrowLeft, FaArrowRight, FaCompass, FaInfoCircle,
  FaCog, FaEye
} from 'react-icons/fa'
import { Button } from '@components/common/Button/Button'

interface InteractiveHotspot {
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

interface Photo360ViewerProps {
  images: string[]
  title: string
  description?: string
  hotspots?: InteractiveHotspot[]
  autoRotate?: boolean
  showControls?: boolean
  showHotspots?: boolean
  onHotspotClick?: (hotspot: InteractiveHotspot) => void
  onImageChange?: (index: number) => void
  className?: string
}

const Photo360Viewer: React.FC<Photo360ViewerProps> = ({
  images,
  title,
  description,
  hotspots = [],
  autoRotate = false,
  showControls = true,
  showHotspots = true,
  onHotspotClick,
  onImageChange,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 })
  const [showSettings, setShowSettings] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState<InteractiveHotspot | null>(null)
  
  // Auto-rotation effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoRotating) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isAutoRotating])

  // Handle image navigation
  const navigateImage = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % images.length
      : currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    
    setCurrentImageIndex(newIndex)
    onImageChange?.(newIndex)
  }

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 8))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5))
  }

  // Handle rotation controls
  const handleRotateLeft = () => {
    setRotation(prev => prev - 90)
  }

  const handleRotateRight = () => {
    setRotation(prev => prev + 90)
  }

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle mouse/touch interactions for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    setViewPosition(prev => ({
      x: prev.x + deltaX * 0.5,
      y: prev.y + deltaY * 0.5
    }))
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle hotspot interactions
  const handleHotspotClick = (hotspot: InteractiveHotspot) => {
    setSelectedHotspot(hotspot)
    onHotspotClick?.(hotspot)
  }

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          navigateImage('prev')
          break
        case 'ArrowRight':
          navigateImage('next')
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case ' ':
          e.preventDefault()
          setIsAutoRotating(prev => !prev)
          break
        case 'r':
        case 'R':
          setRotation(0)
          setZoom(1)
          setViewPosition({ x: 0, y: 0 })
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Main 360° Image Display */}
      <div className="relative aspect-w-16 aspect-h-9 min-h-96">
        <div 
          className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center relative overflow-hidden cursor-move"
          style={{
            transform: `scale(${zoom}) rotate(${rotation + viewPosition.x * 0.1}deg) translate(${viewPosition.x}px, ${viewPosition.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease'
          }}
        >
          {/* Placeholder for actual 360° image */}
          <div className="text-8xl text-white animate-pulse">🌐</div>
          
          {/* Interactive Hotspots */}
          {showHotspots && hotspots.map(hotspot => (
            <button
              key={hotspot.id}
              onClick={() => handleHotspotClick(hotspot)}
              className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg hover:bg-blue-600 transition-all duration-300 animate-pulse hover:animate-none hover:scale-110"
              style={{ 
                left: `${hotspot.x}%`, 
                top: `${hotspot.y}%`,
                transform: `scale(${1/zoom})` // Keep hotspots same size when zoomed
              }}
              title={hotspot.title}
            >
              <span className="sr-only">{hotspot.title}</span>
              {hotspot.type === 'info' && <FaInfoCircle className="w-4 h-4 text-white mx-auto" />}
              {hotspot.type === 'audio' && <FaVolumeUp className="w-4 h-4 text-white mx-auto" />}
              {hotspot.type === 'zoom' && <FaSearchPlus className="w-4 h-4 text-white mx-auto" />}
              {hotspot.type === 'video' && <FaPlay className="w-4 h-4 text-white mx-auto" />}
            </button>
          ))}
        </div>

        {/* Navigation Controls */}
        {showControls && images.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
            <button
              onClick={() => navigateImage('prev')}
              className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors pointer-events-auto"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors pointer-events-auto"
            >
              <FaArrowRight />
            </button>
          </div>
        )}

        {/* Top Controls */}
        {showControls && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            {/* Left side - Info */}
            <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <FaCompass className={isAutoRotating ? 'animate-spin' : ''} />
                <span className="text-sm font-medium">360° View</span>
                {images.length > 1 && (
                  <span className="text-xs">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                )}
              </div>
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
              >
                <FaCog />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        {showControls && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black bg-opacity-50 text-white px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{title}</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    disabled={zoom <= 0.5}
                  >
                    <FaSearchMinus />
                  </button>
                  <span className="text-xs px-2">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    disabled={zoom >= 8}
                  >
                    <FaSearchPlus />
                  </button>
                  <div className="w-px h-4 bg-white bg-opacity-30 mx-2"></div>
                  <button
                    onClick={handleRotateLeft}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <FaUndo />
                  </button>
                  <button
                    onClick={handleRotateRight}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <FaRedo />
                  </button>
                  <div className="w-px h-4 bg-white bg-opacity-30 mx-2"></div>
                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${
                      isAutoRotating ? 'bg-blue-600' : ''
                    }`}
                  >
                    <FaPlay />
                  </button>
                </div>
              </div>

              {/* Image Navigation Dots */}
              {images.length > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index)
                        onImageChange?.(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-40'
                      }`}
                    />
                  ))}
                </div>
              )}

              {description && (
                <p className="text-sm text-gray-300 mt-2">{description}</p>
              )}
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg min-w-64">
            <h4 className="font-medium mb-3">Viewer Settings</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Rotate</span>
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    isAutoRotating ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    isAutoRotating ? 'translate-x-5' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Hotspots</span>
                <button
                  onClick={() => setShowSettings(false)} // This would toggle hotspots in real implementation
                  className="w-10 h-6 rounded-full bg-blue-600"
                >
                  <div className="w-4 h-4 bg-white rounded-full translate-x-5"></div>
                </button>
              </div>

              <div>
                <span className="text-sm block mb-2">Zoom Level</span>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="pt-2 border-t border-gray-600">
                <button
                  onClick={() => {
                    setRotation(0)
                    setZoom(1)
                    setViewPosition({ x: 0, y: 0 })
                    setIsAutoRotating(false)
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Reset View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Zoom Level Indicator */}
        {zoom !== 1 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
            <span className="text-sm font-medium">{Math.round(zoom * 100)}% Zoom</span>
          </div>
        )}

        {/* Instructions Overlay */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
          <div className="flex items-center space-x-4">
            <span>🖱️ Drag to rotate</span>
            <span>🔍 Scroll to zoom</span>
            <span>⌨️ Space to auto-rotate</span>
            <span>F for fullscreen</span>
          </div>
        </div>
      </div>

      {/* Hotspot Details Modal */}
      {selectedHotspot && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedHotspot.title}</h4>
                <p className="text-gray-600 mt-1">{selectedHotspot.description}</p>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {selectedHotspot.content && (
              <div className="mb-4">
                <p className="text-gray-700 text-sm">{selectedHotspot.content}</p>
              </div>
            )}

            <div className="flex items-center space-x-3">
              {selectedHotspot.type === 'audio' && selectedHotspot.audioUrl && (
                <Button variant="primary" size="sm">
                  <FaPlay className="mr-2" />
                  Play Audio
                </Button>
              )}
              {selectedHotspot.type === 'video' && selectedHotspot.videoUrl && (
                <Button variant="primary" size="sm">
                  <FaPlay className="mr-2" />
                  Play Video
                </Button>
              )}
              {selectedHotspot.type === 'link' && selectedHotspot.linkUrl && (
                <Button variant="outline" size="sm">
                  <FaEye className="mr-2" />
                  Learn More
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelectedHotspot(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Photo360Viewer