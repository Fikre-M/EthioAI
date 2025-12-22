import React, { useState, useRef, useEffect } from 'react'
import {
  FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute, FaVolumeDown,
  FaForward, FaBackward, FaStepForward, FaStepBackward,
  FaHeadphones, FaDownload, FaShare, FaBookmark, FaList,
  FaExpand, FaCompress, FaCog, FaClosedCaptioning
} from 'react-icons/fa'
import { Button } from '@components/common/Button/Button'

interface AudioSegment {
  id: string
  title: string
  startTime: number
  duration: number
  description: string
  transcript?: string
  keywords?: string[]
}

interface AudioGuide {
  id: string
  title: string
  description?: string
  duration: number
  segments: AudioSegment[]
  audioUrl: string
  language?: string
  narrator?: string
  category?: string
}

interface AudioGuidePlayerProps {
  audioGuide: AudioGuide
  autoPlay?: boolean
  showPlaylist?: boolean
  onSegmentChange?: (segmentIndex: number) => void
  onComplete?: () => void
  className?: string
}

const AudioGuidePlayer: React.FC<AudioGuidePlayerProps> = ({
  audioGuide,
  autoPlay = false,
  showPlaylist = true,
  onSegmentChange,
  onComplete,
  className = ''
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [showFullTranscript, setShowFullTranscript] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCaptions, setShowCaptions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      updateCurrentSegment(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
    }

    const handleLoadStart = () => {
      setIsLoading(true)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)

    if (autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error)
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
    }
  }, [audioGuide.audioUrl, autoPlay, onComplete])

  // Update current segment based on time
  const updateCurrentSegment = (time: number) => {
    const segmentIndex = audioGuide.segments.findIndex((segment, index) => {
      const nextSegment = audioGuide.segments[index + 1]
      return time >= segment.startTime && (!nextSegment || time < nextSegment.startTime)
    })
    
    if (segmentIndex !== -1 && segmentIndex !== currentSegmentIndex) {
      setCurrentSegmentIndex(segmentIndex)
      onSegmentChange?.(segmentIndex)
    }
  }

  // Playback controls
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error)
    }
  }

  const stop = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const seekTo = (time: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(0, Math.min(time, duration))
  }

  const skipForward = (seconds: number = 15) => {
    seekTo(currentTime + seconds)
  }

  const skipBackward = (seconds: number = 15) => {
    seekTo(currentTime - seconds)
  }

  const goToSegment = (segmentIndex: number) => {
    const segment = audioGuide.segments[segmentIndex]
    if (segment) {
      seekTo(segment.startTime)
      setCurrentSegmentIndex(segmentIndex)
    }
  }

  const nextSegment = () => {
    if (currentSegmentIndex < audioGuide.segments.length - 1) {
      goToSegment(currentSegmentIndex + 1)
    }
  }

  const previousSegment = () => {
    if (currentSegmentIndex > 0) {
      goToSegment(currentSegmentIndex - 1)
    }
  }

  // Volume controls
  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const changeVolume = (newVolume: number) => {
    const audio = audioRef.current
    if (!audio) return

    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
    audio.volume = clampedVolume
    setIsMuted(clampedVolume === 0)
  }

  // Playback rate controls
  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current
    if (!audio) return

    setPlaybackRate(rate)
    audio.playbackRate = rate
  }

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get current segment
  const currentSegment = audioGuide.segments[currentSegmentIndex]

  // Calculate segment progress
  const segmentProgress = currentSegment && currentSegment.duration > 0 
    ? ((currentTime - currentSegment.startTime) / currentSegment.duration) * 100 
    : 0

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${isExpanded ? 'fixed inset-4 z-50' : ''} ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaHeadphones className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{audioGuide.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{formatTime(audioGuide.duration)}</span>
                {audioGuide.narrator && (
                  <>
                    <span>•</span>
                    <span>{audioGuide.narrator}</span>
                  </>
                )}
                {audioGuide.language && (
                  <>
                    <span>•</span>
                    <span>{audioGuide.language}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <FaCog />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <FaCompress /> : <FaExpand />}
            </Button>
          </div>
        </div>

        {audioGuide.description && (
          <p className="text-sm text-gray-600 mt-2">{audioGuide.description}</p>
        )}
      </div>

      {/* Main Player */}
      <div className="p-4">
        {/* Current Segment Info */}
        {currentSegment && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-900">{currentSegment.title}</h4>
              <span className="text-sm text-blue-700">
                {currentSegmentIndex + 1} of {audioGuide.segments.length}
              </span>
            </div>
            <p className="text-sm text-blue-800">{currentSegment.description}</p>
            
            {/* Segment Progress */}
            <div className="mt-2">
              <div className="w-full bg-blue-200 rounded-full h-1">
                <div 
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, segmentProgress))}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            {/* Segment markers */}
            <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none">
              {audioGuide.segments.map((segment) => (
                <div
                  key={segment.id}
                  className="absolute w-1 h-2 bg-gray-400 rounded-full"
                  style={{ left: `${(segment.startTime / duration) * 100}%` }}
                  title={segment.title}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={previousSegment}
            disabled={currentSegmentIndex === 0}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <FaStepBackward />
          </button>
          
          <button
            onClick={() => skipBackward(15)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <FaBackward />
          </button>

          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <FaPause className="text-xl" />
            ) : (
              <FaPlay className="text-xl ml-1" />
            )}
          </button>

          <button
            onClick={stop}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <FaStop />
          </button>

          <button
            onClick={() => skipForward(15)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <FaForward />
          </button>

          <button
            onClick={nextSegment}
            disabled={currentSegmentIndex === audioGuide.segments.length - 1}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <FaStepForward />
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-1 text-gray-600 hover:text-gray-900"
            >
              {isMuted || volume === 0 ? (
                <FaVolumeMute />
              ) : volume < 0.5 ? (
                <FaVolumeDown />
              ) : (
                <FaVolumeUp />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Playback Speed */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <select
              value={playbackRate}
              onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-1 rounded transition-colors ${
                showCaptions ? 'text-blue-600 bg-blue-100' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaClosedCaptioning />
            </button>
            <Button variant="outline" size="sm">
              <FaBookmark className="mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <FaShare className="mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Playlist/Segments */}
      {showPlaylist && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <FaList className="mr-2" />
                Segments ({audioGuide.segments.length})
              </h4>
              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showFullTranscript ? 'Hide' : 'Show'} Transcript
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {audioGuide.segments.map((segment, segmentIndex) => (
                <div
                  key={segment.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    segmentIndex === currentSegmentIndex
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => goToSegment(segmentIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {segmentIndex + 1}. {segment.title}
                        </span>
                        {segmentIndex === currentSegmentIndex && isPlaying && (
                          <div className="flex items-center space-x-1">
                            <div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                            <div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                      
                      {showFullTranscript && segment.transcript && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
                          {segment.transcript}
                        </div>
                      )}
                      
                      {segment.keywords && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {segment.keywords.map(keyword => (
                            <span key={keyword} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 ml-4">
                      {formatTime(segment.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 z-10">
          <h4 className="font-medium text-gray-900 mb-3">Audio Settings</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Playback Speed</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.25"
                value={playbackRate}
                onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">{playbackRate}x</div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-play next segment</span>
              <button className="w-10 h-6 bg-blue-600 rounded-full">
                <div className="w-4 h-4 bg-white rounded-full translate-x-5"></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Show captions</span>
              <button 
                onClick={() => setShowCaptions(!showCaptions)}
                className={`w-10 h-6 rounded-full ${showCaptions ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  showCaptions ? 'translate-x-5' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <Button variant="outline" size="sm" className="w-full">
                <FaDownload className="mr-2" />
                Download Audio
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Live Captions */}
      {showCaptions && currentSegment?.transcript && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-black bg-opacity-80 text-white p-3 rounded-lg">
          <p className="text-sm text-center">{currentSegment.transcript}</p>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioGuide.audioUrl}
        preload="metadata"
        className="hidden"
      />
    </div>
  )
}

export default AudioGuidePlayer