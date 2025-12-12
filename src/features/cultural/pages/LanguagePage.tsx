import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaArrowLeft, FaHeart, FaBookmark, FaGraduationCap, FaGlobe,
  FaShoppingCart, FaExclamationTriangle, FaUtensils,
  FaHandPaper, FaSearch, FaStar, FaCheck
} from 'react-icons/fa'
import { PhraseCard } from '../components/PhraseCard'
import { VoiceRecorder } from '../components/VoiceRecorder'
import { FlashcardDeck } from '../components/FlashcardDeck'
import { ProgressTracker } from '../components/ProgressTracker'

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

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  phraseId: string
}

const LanguagePage: React.FC = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'learn' | 'quiz' | 'practice'>('learn')
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completedPhrases, setCompletedPhrases] = useState<Set<string>>(new Set())
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [recordingPhrase, setRecordingPhrase] = useState<Phrase | null>(null)

  // Mock phrases data
  const phrases: Phrase[] = [
    // Greetings
    {
      id: '1',
      amharic: 'ሰላም',
      english: 'Hello/Peace',
      pronunciation: 'selam',
      category: 'greetings',
      difficulty: 'beginner',
      culturalNote: 'The most common greeting in Ethiopia, meaning both hello and peace.'
    },
    {
      id: '2',
      amharic: 'እንደምን አለህ?',
      english: 'How are you? (to male)',
      pronunciation: 'indemin aleh?',
      category: 'greetings',
      difficulty: 'beginner',
      culturalNote: 'Used when addressing a male. For females, use "indemin alesh?"'
    },
    {
      id: '3',
      amharic: 'እንደምን አለሽ?',
      english: 'How are you? (to female)',
      pronunciation: 'indemin alesh?',
      category: 'greetings',
      difficulty: 'beginner'
    },
    {
      id: '4',
      amharic: 'ደህና ነኝ',
      english: 'I am fine',
      pronunciation: 'dehna negn',
      category: 'greetings',
      difficulty: 'beginner'
    },
    {
      id: '5',
      amharic: 'አመሰግናለሁ',
      english: 'Thank you',
      pronunciation: 'ameseginallehu',
      category: 'greetings',
      difficulty: 'beginner'
    },

    // Shopping
    {
      id: '6',
      amharic: 'ይህ ስንት ነው?',
      english: 'How much is this?',
      pronunciation: 'yih sint new?',
      category: 'shopping',
      difficulty: 'intermediate',
      culturalNote: 'Essential phrase for bargaining in Ethiopian markets.'
    },
    {
      id: '7',
      amharic: 'በጣም ውድ ነው',
      english: 'It is very expensive',
      pronunciation: 'betam wud new',
      category: 'shopping',
      difficulty: 'intermediate'
    },
    {
      id: '8',
      amharic: 'ቅናሽ አለ?',
      english: 'Is there a discount?',
      pronunciation: 'qinash ale?',
      category: 'shopping',
      difficulty: 'intermediate'
    },
    {
      id: '9',
      amharic: 'እወስዳለሁ',
      english: 'I will take it',
      pronunciation: 'iwesdallehu',
      category: 'shopping',
      difficulty: 'intermediate'
    },

    // Emergency
    {
      id: '10',
      amharic: 'እርዳታ!',
      english: 'Help!',
      pronunciation: 'irdata!',
      category: 'emergency',
      difficulty: 'beginner',
      culturalNote: 'Important emergency phrase to know.'
    },
    {
      id: '11',
      amharic: 'ሐኪም ያስፈልገኛል',
      english: 'I need a doctor',
      pronunciation: 'hakim yasifeligenal',
      category: 'emergency',
      difficulty: 'advanced'
    },
    {
      id: '12',
      amharic: 'ፖሊስ ጥራ',
      english: 'Call the police',
      pronunciation: 'polis tira',
      category: 'emergency',
      difficulty: 'intermediate'
    },

    // Food
    {
      id: '13',
      amharic: 'ምን አለ?',
      english: 'What do you have?',
      pronunciation: 'min ale?',
      category: 'food',
      difficulty: 'beginner'
    },
    {
      id: '14',
      amharic: 'ኢንጀራ እፈልጋለሁ',
      english: 'I want injera',
      pronunciation: 'injera ifeliigalehu',
      category: 'food',
      difficulty: 'intermediate',
      culturalNote: 'Injera is the traditional Ethiopian flatbread made from teff.'
    },
    {
      id: '15',
      amharic: 'ቡና ይዘጋጃል?',
      english: 'Is coffee prepared?',
      pronunciation: 'buna yizegajal?',
      category: 'food',
      difficulty: 'intermediate',
      culturalNote: 'Coffee ceremony is central to Ethiopian culture.'
    }
  ]

  // Quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'How do you say "Hello" in Amharic?',
      options: ['ሰላም', 'አመሰግናለሁ', 'ደህና ነኝ', 'እንደምን አለህ'],
      correctAnswer: 0,
      explanation: 'ሰላም (selam) means both "hello" and "peace" in Amharic.',
      phraseId: '1'
    },
    {
      id: 'q2',
      question: 'What does "ይህ ስንት ነው?" mean?',
      options: ['Thank you', 'How much is this?', 'I am fine', 'Help!'],
      correctAnswer: 1,
      explanation: 'This is an essential phrase for shopping and bargaining in Ethiopian markets.',
      phraseId: '6'
    },
    {
      id: 'q3',
      question: 'How do you ask for help in Amharic?',
      options: ['ሰላም', 'እርዳታ!', 'አመሰግናለሁ', 'ደህና ነኝ'],
      correctAnswer: 1,
      explanation: 'እርዳታ! (irdata!) is the word for "Help!" in emergency situations.',
      phraseId: '10'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Phrases', icon: FaGlobe, count: phrases.length },
    { id: 'greetings', name: 'Greetings', icon: FaHandPaper, count: phrases.filter(p => p.category === 'greetings').length },
    { id: 'shopping', name: 'Shopping', icon: FaShoppingCart, count: phrases.filter(p => p.category === 'shopping').length },
    { id: 'emergency', name: 'Emergency', icon: FaExclamationTriangle, count: phrases.filter(p => p.category === 'emergency').length },
    { id: 'food', name: 'Food', icon: FaUtensils, count: phrases.filter(p => p.category === 'food').length }
  ]

  const filteredPhrases = phrases.filter(phrase => {
    const matchesCategory = activeCategory === 'all' || phrase.category === activeCategory
    const matchesSearch = searchTerm === '' || 
      phrase.amharic.includes(searchTerm) ||
      phrase.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phrase.pronunciation.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (phraseId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(phraseId)) {
      newFavorites.delete(phraseId)
    } else {
      newFavorites.add(phraseId)
    }
    setFavorites(newFavorites)
    // Save to localStorage
    localStorage.setItem('amharic-favorites', JSON.stringify(Array.from(newFavorites)))
  }

  const markAsCompleted = (phraseId: string) => {
    const newCompleted = new Set(completedPhrases)
    newCompleted.add(phraseId)
    setCompletedPhrases(newCompleted)
    localStorage.setItem('amharic-completed', JSON.stringify(Array.from(newCompleted)))
  }

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowAnswer(true)
    
    if (answerIndex === quizQuestions[currentQuizIndex].correctAnswer) {
      setQuizScore(quizScore + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuizIndex(0)
    setQuizScore(0)
    setSelectedAnswer(null)
    setShowAnswer(false)
  }

  // Load saved data on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('amharic-favorites')
    const savedCompleted = localStorage.getItem('amharic-completed')
    
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
    
    if (savedCompleted) {
      setCompletedPhrases(new Set(JSON.parse(savedCompleted)))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/cultural')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaGraduationCap className="mr-3 text-green-600" />
                  Learn Amharic
                </h1>
                <p className="text-gray-600 mt-1">Master essential Ethiopian phrases with interactive lessons</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'learn' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('learn')}
              >
                Learn
              </Button>
              <Button
                variant={viewMode === 'quiz' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('quiz')}
              >
                Quiz
              </Button>
              <Button
                variant={viewMode === 'practice' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('practice')}
              >
                Practice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFlashcards(true)}
              >
                Flashcards
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProgress(true)}
              >
                Progress
              </Button>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Learned</p>
                  <p className="text-2xl font-bold text-green-700">{completedPhrases.size}</p>
                </div>
                <FaCheck className="text-green-500 text-xl" />
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Favorites</p>
                  <p className="text-2xl font-bold text-red-700">{favorites.size}</p>
                </div>
                <FaHeart className="text-red-500 text-xl" />
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Phrases</p>
                  <p className="text-2xl font-bold text-blue-700">{phrases.length}</p>
                </div>
                <FaBookmark className="text-blue-500 text-xl" />
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Progress</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {Math.round((completedPhrases.size / phrases.length) * 100)}%
                  </p>
                </div>
                <FaStar className="text-yellow-500 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Learning Mode */}
        {viewMode === 'learn' && (
          <>
            {/* Categories and Search */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => {
                    const IconComponent = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                          activeCategory === category.id
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="text-sm" />
                        <span className="font-medium">{category.name}</span>
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {category.count}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search phrases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Phrase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhrases.map(phrase => (
                <PhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  isFavorite={favorites.has(phrase.id)}
                  isCompleted={completedPhrases.has(phrase.id)}
                  onToggleFavorite={() => toggleFavorite(phrase.id)}
                  onMarkCompleted={() => markAsCompleted(phrase.id)}
                  onStartRecording={() => {
                    setRecordingPhrase(phrase)
                    setShowVoiceRecorder(true)
                  }}
                />
              ))}
            </div>

            {filteredPhrases.length === 0 && (
              <div className="text-center py-12">
                <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No phrases found</h3>
                <p className="text-gray-600">Try adjusting your search or category filter.</p>
              </div>
            )}
          </>
        )}

        {/* Quiz Mode */}
        {viewMode === 'quiz' && (
          <div className="max-w-2xl mx-auto">
            {currentQuizIndex < quizQuestions.length ? (
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      Question {currentQuizIndex + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-sm text-gray-600">
                      Score: {quizScore}/{quizQuestions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {quizQuestions[currentQuizIndex].question}
                  </h2>

                  <div className="space-y-3">
                    {quizQuestions[currentQuizIndex].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => !showAnswer && handleQuizAnswer(index)}
                        disabled={showAnswer}
                        className={`w-full p-4 text-left rounded-lg border transition-colors ${
                          showAnswer
                            ? index === quizQuestions[currentQuizIndex].correctAnswer
                              ? 'bg-green-100 border-green-500 text-green-800'
                              : selectedAnswer === index
                              ? 'bg-red-100 border-red-500 text-red-800'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {showAnswer && index === quizQuestions[currentQuizIndex].correctAnswer && (
                            <FaCheck className="text-green-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {showAnswer && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                    <p className="text-blue-800">{quizQuestions[currentQuizIndex].explanation}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetQuiz}>
                    Restart Quiz
                  </Button>
                  
                  {showAnswer && (
                    <Button onClick={nextQuestion}>
                      {currentQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
                <p className="text-lg text-gray-600 mb-6">
                  You scored {quizScore} out of {quizQuestions.length}
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={resetQuiz}>Take Again</Button>
                  <Button variant="outline" onClick={() => setViewMode('learn')}>
                    Back to Learning
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practice Mode */}
        {viewMode === 'practice' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Mode</h2>
              <p className="text-gray-600 mb-8">
                Practice your favorite phrases and test your pronunciation skills.
              </p>
              
              {favorites.size > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phrases
                    .filter(phrase => favorites.has(phrase.id))
                    .map(phrase => (
                      <PhraseCard
                        key={phrase.id}
                        phrase={phrase}
                        isFavorite={true}
                        isCompleted={completedPhrases.has(phrase.id)}
                        onToggleFavorite={() => toggleFavorite(phrase.id)}
                        onMarkCompleted={() => markAsCompleted(phrase.id)}
                        onStartRecording={() => {
                          setRecordingPhrase(phrase)
                          setShowVoiceRecorder(true)
                        }}
                        practiceMode={true}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaHeart className="mx-auto text-4xl text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite phrases yet</h3>
                  <p className="text-gray-600 mb-6">
                    Add some phrases to your favorites to practice them here.
                  </p>
                  <Button onClick={() => setViewMode('learn')}>
                    Start Learning
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Voice Recorder Modal */}
      {showVoiceRecorder && recordingPhrase && (
        <VoiceRecorder
          targetPhrase={recordingPhrase.amharic}
          onRecordingComplete={(_audioBlob, confidence) => {
            console.log('Recording completed with confidence:', confidence)
            setShowVoiceRecorder(false)
            setRecordingPhrase(null)
            // Here you could save the recording or update progress
          }}
          onClose={() => {
            setShowVoiceRecorder(false)
            setRecordingPhrase(null)
          }}
        />
      )}

      {/* Flashcards Modal */}
      {showFlashcards && (
        <FlashcardDeck
          phrases={filteredPhrases}
          onComplete={(results) => {
            console.log('Flashcard session completed:', results)
            setShowFlashcards(false)
            // Here you could save the session results
          }}
          onClose={() => setShowFlashcards(false)}
        />
      )}

      {/* Progress Tracker Modal */}
      {showProgress && (
        <ProgressTracker
          sessions={[]} // Mock sessions - in real app, load from storage
          totalPhrases={phrases.length}
          completedPhrases={completedPhrases.size}
          onClose={() => setShowProgress(false)}
        />
      )}
    </div>
  )
}

export default LanguagePage