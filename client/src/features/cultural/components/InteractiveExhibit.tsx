import React, { useState, useEffect } from 'react'
import {
  FaPlay, FaInfoCircle, FaMousePointer,
  FaVideo, FaHeadphones, FaBookOpen, FaQuestionCircle,
  FaLightbulb, FaEye, FaTrophy, FaRedo,
  FaClock, FaHeart, FaBookmark, FaStar, FaArrowRight
} from 'react-icons/fa'
import { Button } from '@components/common/Button/Button'
import Photo360Viewer from './Photo360Viewer'
import AudioGuidePlayer from './AudioGuidePlayer'

interface InteractiveHotspot {
  id: string
  x: number
  y: number
  title: string
  description: string
  type: 'info' | 'audio' | 'video' | 'link' | 'zoom' | 'quiz' | 'ar' | 'comparison' | 'timeline'
  content?: any
  points?: number
  audioUrl?: string
  videoUrl?: string
  linkUrl?: string
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

interface TimelineEvent {
  id: string
  year: string
  title: string
  description: string
  image?: string
}

interface ComparisonItem {
  id: string
  title: string
  image: string
  description: string
  facts: string[]
}

interface ExhibitContent {
  id: string
  title: string
  description: string
  type: 'artifact' | 'diorama' | 'timeline' | 'comparison' | 'quiz'
  mainImage: string
  images360?: string[]
  hotspots: InteractiveHotspot[]
  audioGuide?: any
  quiz?: QuizQuestion[]
  timeline?: TimelineEvent[]
  comparison?: ComparisonItem[]
  facts?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: number
  category?: string
}

interface InteractiveExhibitProps {
  exhibit: ExhibitContent
  onComplete?: (score: number) => void
  onProgress?: (progress: number) => void
  className?: string
}

const InteractiveExhibit: React.FC<InteractiveExhibitProps> = ({
  exhibit,
  onComplete,
  onProgress,
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState<'explore' | 'learn' | 'quiz' | 'compare'>('explore')
  const [selectedHotspot, setSelectedHotspot] = useState<InteractiveHotspot | null>(null)
  const [visitedHotspots, setVisitedHotspots] = useState<Set<string>>(new Set())
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizScore, setQuizScore] = useState(0)
  const [showQuizResults, setShowQuizResults] = useState(false)

  const [userProgress, setUserProgress] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showHints, setShowHints] = useState(true)


  // Calculate progress based on completed activities
  useEffect(() => {
    const totalActivities = exhibit.hotspots.length + (exhibit.quiz?.length || 0)
    const completed = visitedHotspots.size + (showQuizResults ? 1 : 0)
    const progress = totalActivities > 0 ? (completed / totalActivities) * 100 : 0
    setUserProgress(progress)
    onProgress?.(progress)

    // Check for achievements
    checkAchievements()
  }, [visitedHotspots, showQuizResults, exhibit])

  const checkAchievements = () => {
    const newAchievements: string[] = []

    if (visitedHotspots.size >= exhibit.hotspots.length) {
      newAchievements.push('Explorer: Visited all hotspots')
    }

    if (visitedHotspots.size >= 5) {
      newAchievements.push('Curious Mind: Explored 5+ points')
    }

    if (quizScore >= 80) {
      newAchievements.push('Scholar: Scored 80%+ on quiz')
    }

    if (userProgress >= 100) {
      newAchievements.push('Completionist: Finished entire exhibit')
      onComplete?.(quizScore)
    }

    setAchievements(prev => [...new Set([...prev, ...newAchievements])])
  }

  const handleHotspotClick = (hotspot: InteractiveHotspot) => {
    setSelectedHotspot(hotspot)
    setVisitedHotspots(prev => new Set([...prev, hotspot.id]))

    // Handle different hotspot types
    switch (hotspot.type) {
      case 'quiz':
        setActiveMode('quiz')
        break
      case 'comparison':
        setActiveMode('compare')
        break
      case 'timeline':
        // Show timeline content
        break
      default:
        // Show info modal
        break
    }
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)

    if (exhibit.quiz && questionIndex === exhibit.quiz.length - 1) {
      // Calculate final score
      let score = 0
      exhibit.quiz.forEach((question, index) => {
        if (newAnswers[index] === question.correctAnswer) {
          score += question.points
        }
      })
      const totalPoints = exhibit.quiz.reduce((sum, q) => sum + q.points, 0)
      const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0
      setQuizScore(percentage)
      setShowQuizResults(true)
    } else {
      setCurrentQuizIndex(questionIndex + 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuizIndex(0)
    setQuizAnswers([])
    setQuizScore(0)
    setShowQuizResults(false)
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const currentQuiz = exhibit.quiz?.[currentQuizIndex]

  return (
    <div className={`bg-white rounded-lg shadow-lg border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{exhibit.title}</h2>
            <p className="text-blue-100">{exhibit.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`border-white text-white hover:bg-white hover:text-blue-600 ${
                isLiked ? 'bg-white text-blue-600' : ''
              }`}
            >
              <FaHeart className="mr-1" />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`border-white text-white hover:bg-white hover:text-blue-600 ${
                isBookmarked ? 'bg-white text-blue-600' : ''
              }`}
            >
              <FaBookmark className="mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* Progress and Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(userProgress)}%</div>
            <div className="text-sm text-blue-200">Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{visitedHotspots.size}</div>
            <div className="text-sm text-blue-200">Points Explored</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{achievements.length}</div>
            <div className="text-sm text-blue-200">Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{exhibit.estimatedTime || 15}m</div>
            <div className="text-sm text-blue-200">Est. Time</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${userProgress}%` }}
          ></div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-2 mt-4">
          {[
            { id: 'explore', label: 'Explore', icon: FaMousePointer },
            { id: 'learn', label: 'Learn', icon: FaBookOpen },
            { id: 'quiz', label: 'Quiz', icon: FaQuestionCircle },
            { id: 'compare', label: 'Compare', icon: FaEye }
          ].map(mode => {
            const IconComponent = mode.icon
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  activeMode === mode.id
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-500 bg-opacity-30 text-white hover:bg-opacity-50'
                }`}
              >
                <IconComponent className="mr-2" />
                {mode.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Explore Mode */}
        {activeMode === 'explore' && (
          <div className="space-y-6">
            {/* Main Interactive Display */}
            <div className="relative">
              {exhibit.images360 ? (
                <Photo360Viewer
                  images={exhibit.images360}
                  title={exhibit.title}
                  description={exhibit.description}
                  hotspots={exhibit.hotspots.map(h => ({
                    ...h,
                    type: h.type as 'info' | 'zoom' | 'audio' | 'video' | 'link'
                  }))}
                  onHotspotClick={handleHotspotClick}
                  showHotspots={showHints}
                  className="h-96"
                />
              ) : (
                <div className="relative aspect-w-16 aspect-h-9 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center h-96">
                    <span className="text-8xl">🏛️</span>
                    
                    {/* Interactive Hotspots */}
                    {showHints && exhibit.hotspots.map(hotspot => (
                      <button
                        key={hotspot.id}
                        onClick={() => handleHotspotClick(hotspot)}
                        className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-110 ${
                          visitedHotspots.has(hotspot.id)
                            ? 'bg-green-500 animate-none'
                            : 'bg-blue-500 animate-pulse'
                        }`}
                        style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                        title={hotspot.title}
                      >
                        {hotspot.type === 'info' && <FaInfoCircle className="w-4 h-4 text-white mx-auto" />}
                        {hotspot.type === 'audio' && <FaHeadphones className="w-4 h-4 text-white mx-auto" />}
                        {hotspot.type === 'video' && <FaVideo className="w-4 h-4 text-white mx-auto" />}
                        {hotspot.type === 'quiz' && <FaQuestionCircle className="w-4 h-4 text-white mx-auto" />}
                        {hotspot.type === 'comparison' && <FaEye className="w-4 h-4 text-white mx-auto" />}
                        {hotspot.type === 'timeline' && <FaClock className="w-4 h-4 text-white mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hints Toggle */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    showHints ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  <FaLightbulb className="mr-2 inline" />
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
              </div>
            </div>

            {/* Hotspot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exhibit.hotspots.map(hotspot => (
                <div
                  key={hotspot.id}
                  onClick={() => handleHotspotClick(hotspot)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    visitedHotspots.has(hotspot.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      visitedHotspots.has(hotspot.id) ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {hotspot.type === 'info' && <FaInfoCircle className="text-white" />}
                      {hotspot.type === 'audio' && <FaHeadphones className="text-white" />}
                      {hotspot.type === 'video' && <FaVideo className="text-white" />}
                      {hotspot.type === 'quiz' && <FaQuestionCircle className="text-white" />}
                      {hotspot.type === 'comparison' && <FaEye className="text-white" />}
                      {hotspot.type === 'timeline' && <FaClock className="text-white" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{hotspot.title}</h4>
                      {hotspot.points && (
                        <span className="text-sm text-blue-600">+{hotspot.points} points</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{hotspot.description}</p>
                  {visitedHotspots.has(hotspot.id) && (
                    <div className="mt-2 flex items-center text-green-600 text-sm">
                      <FaTrophy className="mr-1" />
                      Completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learn Mode */}
        {activeMode === 'learn' && (
          <div className="space-y-6">
            {exhibit.audioGuide && (
              <AudioGuidePlayer
                audioGuide={exhibit.audioGuide}
                showPlaylist={true}
              />
            )}

            {/* Facts and Information */}
            {exhibit.facts && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <FaLightbulb className="mr-2" />
                  Did You Know?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exhibit.facts.map((fact, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-blue-800 text-sm">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {exhibit.timeline && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaClock className="mr-2" />
                  Timeline
                </h3>
                <div className="space-y-4">
                  {exhibit.timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        {index < exhibit.timeline!.length - 1 && (
                          <div className="w-0.5 h-16 bg-blue-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-blue-600">{event.year}</span>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quiz Mode */}
        {activeMode === 'quiz' && exhibit.quiz && (
          <div className="space-y-6">
            {!showQuizResults ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question {currentQuizIndex + 1} of {exhibit.quiz.length}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exhibit.difficulty)}`}>
                      {exhibit.difficulty || 'Beginner'}
                    </span>
                    <span className="text-sm text-gray-600">
                      +{currentQuiz?.points} points
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuizIndex + 1) / exhibit.quiz.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {currentQuiz && (
                  <div>
                    <h4 className="text-xl font-medium text-gray-900 mb-6">{currentQuiz.question}</h4>
                    <div className="space-y-3">
                      {currentQuiz.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuizAnswer(currentQuizIndex, index)}
                          className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl ${
                    quizScore >= 80 ? 'bg-green-100 text-green-600' : 
                    quizScore >= 60 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {quizScore >= 80 ? '🏆' : quizScore >= 60 ? '👍' : '📚'}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                <p className="text-xl text-gray-600 mb-6">
                  You scored {Math.round(quizScore)}%
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {exhibit.quiz.filter((_, index) => quizAnswers[index] === exhibit.quiz![index].correctAnswer).length}
                    </div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {exhibit.quiz.length - exhibit.quiz.filter((_, index) => quizAnswers[index] === exhibit.quiz![index].correctAnswer).length}
                    </div>
                    <div className="text-sm text-gray-600">Incorrect</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(quizScore)}</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button variant="primary" onClick={resetQuiz}>
                    <FaRedo className="mr-2" />
                    Retake Quiz
                  </Button>
                  <Button variant="outline" onClick={() => setActiveMode('explore')}>
                    Continue Exploring
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compare Mode */}
        {activeMode === 'compare' && exhibit.comparison && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare and Contrast</h3>
              <p className="text-gray-600">Explore similarities and differences between related artifacts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exhibit.comparison.slice(0, 2).map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-400 to-gray-600">
                    <div className="flex items-center justify-center h-48">
                      <span className="text-4xl">🏺</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                    <div className="space-y-2">
                      {item.facts.map((fact, factIndex) => (
                        <div key={factIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-sm text-gray-700">{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {exhibit.comparison.length > 2 && (
              <div className="text-center">
                <Button variant="outline">
                  <FaArrowRight className="mr-2" />
                  View More Comparisons
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Achievements Panel */}
      {achievements.length > 0 && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-4">
          <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
            <FaTrophy className="mr-2" />
            Achievements Unlocked!
          </h4>
          <div className="space-y-1">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-sm text-yellow-800 flex items-center">
                <FaStar className="mr-2 text-yellow-600" />
                {achievement}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hotspot Detail Modal */}
      {selectedHotspot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{selectedHotspot.title}</h4>
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
                <div className="prose prose-sm max-w-none">
                  {typeof selectedHotspot.content === 'string' ? (
                    <p>{selectedHotspot.content}</p>
                  ) : (
                    <div>{selectedHotspot.content}</div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {selectedHotspot.type === 'audio' && (
                  <Button variant="primary" size="sm">
                    <FaPlay className="mr-2" />
                    Play Audio
                  </Button>
                )}
                {selectedHotspot.type === 'video' && (
                  <Button variant="primary" size="sm">
                    <FaPlay className="mr-2" />
                    Play Video
                  </Button>
                )}
                {selectedHotspot.points && (
                  <span className="text-sm text-green-600 font-medium">
                    +{selectedHotspot.points} points earned
                  </span>
                )}
              </div>
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

export default InteractiveExhibit