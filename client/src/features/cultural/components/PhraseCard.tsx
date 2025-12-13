import React, { useState, useRef } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaVolumeUp, FaHeart, FaPlay, FaPause, FaCheck,
  FaInfoCircle, FaBookmark, FaGraduationCap,
  FaShoppingCart, FaExclamationTriangle, FaUtensils,
  FaHandPaper, FaStar, FaRedo, FaMicrophone
} from 'react-icons/fa'

interface Phrase {
  id: string
  amharic: string
  english: string
  pronunciation: string
  category: 'greetings' | 'shopping' | 'emergency' | 'food'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  audioUrl?: string
  culturalNote?: string
}

interface PhraseCardProps {
  phrase: Phrase
  isFavorite: boolean
  isCompleted: boolean
  onToggleFavorite: () => void
  onMarkCompleted: () => void
  onStartRecording?: () => void
  practiceMode?: boolean
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  isFavorite,
  isCompleted,
  onToggleFavorite,
  onMarkCompleted,
  onStartRecording,
  practiceMode = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPronunciation, setShowPronunciation] = useState(false)
  const [showCulturalNote, setShowCulturalNote] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'greetings': return FaHandPaper
      case 'shopping': return FaShoppingCart
      case 'emergency': return FaExclamationTriangle
      case 'food': return FaUtensils
      default: return FaBookmark
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'greetings': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shopping': return 'bg-green-100 text-green-800 border-green-200'
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200'
      case 'food': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const playAudio = () => {
    if (phrase.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
        setPlayCount(playCount + 1)
      }
    } else {
      // Simulate audio playback for demo
      setIsPlaying(true)
      setPlayCount(playCount + 1)
      setTimeout(() => {
        setIsPlaying(false)
      }, 2000)
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'am-ET' // Amharic language code
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const CategoryIcon = getCategoryIcon(phrase.category)

  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
      isCompleted ? 'ring-2 ring-green-200' : ''
    }`}>
      {phrase.audioUrl && (
        <audio
          ref={audioRef}
          src={phrase.audioUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(phrase.category)}`}>
              <CategoryIcon className="inline mr-1" />
              {phrase.category}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(phrase.difficulty)}`}>
              {phrase.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <div className="p-1 bg-green-100 rounded-full">
                <FaCheck className="text-green-600 text-sm" />
              </div>
            )}
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isFavorite ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              <FaHeart />
            </button>
          </div>
        </div>

        {/* Amharic Text */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-gray-900 font-amharic">
              {phrase.amharic}
            </h3>
            <button
              onClick={() => speakText(phrase.amharic)}
              className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
              title="Listen to pronunciation"
            >
              <FaVolumeUp className="text-green-600" />
            </button>
          </div>
          
          <p className="text-lg text-gray-700 mb-2">{phrase.english}</p>
          
          <button
            onClick={() => setShowPronunciation(!showPronunciation)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaInfoCircle className="mr-1" />
            {showPronunciation ? 'Hide' : 'Show'} pronunciation
          </button>
          
          {showPronunciation && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                Pronunciation: <span className="font-mono">{phrase.pronunciation}</span>
              </p>
            </div>
          )}
        </div>

        {/* Audio Controls */}
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={playAudio}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isPlaying 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              <span className="font-medium">
                {isPlaying ? 'Stop' : 'Play Audio'}
              </span>
            </button>
            
            {playCount > 0 && (
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <FaRedo />
                <span>{playCount} plays</span>
              </div>
            )}
          </div>
        </div>

        {/* Cultural Note */}
        {phrase.culturalNote && (
          <div className="mb-4">
            <button
              onClick={() => setShowCulturalNote(!showCulturalNote)}
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
            >
              <FaStar className="mr-1" />
              {showCulturalNote ? 'Hide' : 'Show'} cultural note
            </button>
            
            {showCulturalNote && (
              <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800 text-sm leading-relaxed">
                  {phrase.culturalNote}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Practice Mode Features */}
        {practiceMode && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
              <FaGraduationCap className="mr-2" />
              Practice Exercise
            </h4>
            <p className="text-yellow-700 text-sm mb-3">
              Try to pronounce this phrase and compare with the audio.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={playAudio}>
                <FaPlay className="mr-1" />
                Listen Again
              </Button>
              <Button size="sm" variant="outline" onClick={() => speakText(phrase.pronunciation)}>
                <FaVolumeUp className="mr-1" />
                Hear Pronunciation
              </Button>
              {onStartRecording && (
                <Button size="sm" variant="outline" onClick={onStartRecording}>
                  <FaMicrophone className="mr-1" />
                  Record Yourself
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {!isCompleted && (
              <Button
                size="sm"
                onClick={onMarkCompleted}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <FaCheck className="mr-1" />
                Mark as Learned
              </Button>
            )}
            
            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600">
                <FaCheck />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CategoryIcon />
            <span className="capitalize">{phrase.category}</span>
          </div>
        </div>
      </div>
    </div>
  )
}