import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaArrowLeft, FaArrowRight, FaRandom, FaRedo, FaCheck,
  FaTimes, FaVolumeUp, FaEye, FaEyeSlash, FaStar,
  FaGraduationCap, FaChartLine, FaHeart
} from 'react-icons/fa'

interface Phrase {
  id: string
  amharic: string
  english: string
  pronunciation: string
  category: 'greetings' | 'shopping' | 'emergency' | 'food'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  culturalNote?: string
}

interface FlashcardProgress {
  phraseId: string
  correctCount: number
  incorrectCount: number
  lastReviewed: Date
  nextReview: Date
  interval: number // days
  easeFactor: number
}

interface FlashcardDeckProps {
  phrases: Phrase[]
  onComplete: (results: FlashcardProgress[]) => void
  onClose: () => void
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  phrases,
  onComplete,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionProgress, setSessionProgress] = useState<FlashcardProgress[]>([])
  const [studyMode, setStudyMode] = useState<'sequential' | 'random' | 'spaced'>('sequential')
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  })

  const currentPhrase = phrases[currentIndex]

  useEffect(() => {
    // Initialize progress for all phrases
    const initialProgress = phrases.map(phrase => ({
      phraseId: phrase.id,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: new Date(),
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5
    }))
    setSessionProgress(initialProgress)
  }, [phrases])

  const speakText = (text: string, lang: string = 'am-ET') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    setShowAnswer(!showAnswer)
  }

  const handleAnswer = (isCorrect: boolean) => {
    const updatedProgress = sessionProgress.map(progress => {
      if (progress.phraseId === currentPhrase.id) {
        const newProgress = { ...progress }
        
        if (isCorrect) {
          newProgress.correctCount++
          // Spaced repetition algorithm (simplified SM-2)
          if (newProgress.correctCount === 1) {
            newProgress.interval = 1
          } else if (newProgress.correctCount === 2) {
            newProgress.interval = 6
          } else {
            newProgress.interval = Math.round(newProgress.interval * newProgress.easeFactor)
          }
          newProgress.easeFactor = Math.max(1.3, newProgress.easeFactor + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02)))
        } else {
          newProgress.incorrectCount++
          newProgress.interval = 1
          newProgress.easeFactor = Math.max(1.3, newProgress.easeFactor - 0.2)
        }
        
        newProgress.lastReviewed = new Date()
        const nextReview = new Date()
        nextReview.setDate(nextReview.getDate() + newProgress.interval)
        newProgress.nextReview = nextReview
        
        return newProgress
      }
      return progress
    })

    setSessionProgress(updatedProgress)
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1
    }))

    // Move to next card
    setTimeout(() => {
      nextCard()
    }, 1000)
  }

  const nextCard = () => {
    setShowAnswer(false)
    setIsFlipped(false)
    
    if (studyMode === 'random') {
      const nextIndex = Math.floor(Math.random() * phrases.length)
      setCurrentIndex(nextIndex)
    } else if (studyMode === 'spaced') {
      // Find next card that needs review
      const needsReview = sessionProgress
        .map((progress, index) => ({ progress, index }))
        .filter(({ progress }) => progress.nextReview <= new Date())
        .sort((a, b) => a.progress.nextReview.getTime() - b.progress.nextReview.getTime())
      
      if (needsReview.length > 0) {
        setCurrentIndex(needsReview[0].index)
      } else {
        // All cards reviewed, start over or complete
        if (currentIndex < phrases.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          completeSession()
        }
      }
    } else {
      // Sequential mode
      if (currentIndex < phrases.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        completeSession()
      }
    }
  }

  const previousCard = () => {
    setShowAnswer(false)
    setIsFlipped(false)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const shuffleDeck = () => {
    setStudyMode('random')
    const randomIndex = Math.floor(Math.random() * phrases.length)
    setCurrentIndex(randomIndex)
    setShowAnswer(false)
    setIsFlipped(false)
  }

  const completeSession = () => {
    onComplete(sessionProgress)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'greetings': return '👋'
      case 'shopping': return '🛒'
      case 'emergency': return '🚨'
      case 'food': return '🍽️'
      default: return '📚'
    }
  }

  const getAccuracyPercentage = () => {
    if (sessionStats.total === 0) return 0
    return Math.round((sessionStats.correct / sessionStats.total) * 100)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaGraduationCap className="mr-2 text-blue-600" />
                  Flashcard Study
                </h2>
                <p className="text-sm text-gray-600">
                  Card {currentIndex + 1} of {phrases.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleDeck}
                className="flex items-center"
              >
                <FaRandom className="mr-1" />
                Shuffle
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}
            ></div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-lg font-bold text-green-700">{sessionStats.correct}</div>
              <div className="text-xs text-green-600">Correct</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-lg font-bold text-red-700">{sessionStats.incorrect}</div>
              <div className="text-xs text-red-600">Incorrect</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-700">{getAccuracyPercentage()}%</div>
              <div className="text-xs text-blue-600">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="p-8">
          <div 
            className={`relative w-full h-80 cursor-pointer transition-transform duration-500 preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={flipCard}
          >
            {/* Front of card */}
            <div className={`absolute inset-0 w-full h-full backface-hidden ${isFlipped ? 'rotate-y-180' : ''}`}>
              <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 flex flex-col justify-center items-center text-white shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">{getCategoryIcon(currentPhrase.category)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentPhrase.difficulty)}`}>
                    {currentPhrase.difficulty}
                  </span>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold font-amharic mb-2">
                    {currentPhrase.amharic}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      speakText(currentPhrase.amharic)
                    }}
                    className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
                  >
                    <FaVolumeUp />
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="text-white text-opacity-80 mb-2">
                    Click to reveal translation
                  </p>
                  <FaEye className="text-white text-opacity-60" />
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'rotate-y-0' : ''}`}>
              <div className="h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-8 flex flex-col justify-center items-center text-white shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {currentPhrase.english}
                  </h3>
                  <p className="text-lg text-white text-opacity-90 mb-4">
                    Pronunciation: <span className="font-mono">{currentPhrase.pronunciation}</span>
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      speakText(currentPhrase.english, 'en-US')
                    }}
                    className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
                  >
                    <FaVolumeUp />
                  </button>
                </div>
                
                {currentPhrase.culturalNote && (
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                    <p className="text-sm text-white">
                      <FaStar className="inline mr-2" />
                      {currentPhrase.culturalNote}
                    </p>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-white text-opacity-80 mb-2">
                    How well did you know this?
                  </p>
                  <FaEyeSlash className="text-white text-opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Buttons */}
        {showAnswer && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-4 justify-center">
              <Button
                onClick={() => handleAnswer(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
              >
                <FaTimes className="mr-2" />
                Didn't Know
              </Button>
              <Button
                onClick={() => handleAnswer(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                <FaCheck className="mr-2" />
                Knew It
              </Button>
            </div>
            
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={previousCard}
                disabled={currentIndex === 0}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={nextCard}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {!showAnswer && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={previousCard}
                disabled={currentIndex === 0}
              >
                <FaArrowLeft className="mr-2" />
                Previous
              </Button>
              
              <div className="text-sm text-gray-600">
                Tap card to flip
              </div>
              
              <Button
                variant="outline"
                onClick={nextCard}
              >
                Next
                <FaArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}