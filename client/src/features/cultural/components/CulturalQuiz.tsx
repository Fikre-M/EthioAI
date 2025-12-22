import React, { useState, useEffect } from 'react'
import { 
  FaPlay, FaCheck, FaTimes, FaTrophy, FaShare, FaRedo, 
  FaClock, FaStar, FaUsers, FaMedal, FaChartLine,
  FaQuestionCircle, FaLightbulb, FaHeart
} from 'react-icons/fa'
import { Button } from '@components/common/Button/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/common/Card/Card'
// Simple inline components for Badge and Progress
const Badge: React.FC<{ children: React.ReactNode; variant?: string; className?: string }> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const variantClasses = variant === 'outline' 
    ? 'border border-gray-300 text-gray-700 bg-white' 
    : 'bg-purple-100 text-purple-800'
  return <span className={`${baseClasses} ${variantClasses} ${className}`}>{children}</span>
}

const Progress: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  points: number
}

interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  percentage: number
  rank: string
}

interface LeaderboardEntry {
  id: string
  name: string
  score: number
  percentage: number
  completedAt: string
  avatar?: string
}

const CulturalQuiz: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results' | 'leaderboard'>('menu')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  // Sample quiz questions about Ethiopian culture
  const allQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the traditional Ethiopian New Year called?',
      options: ['Enkutatash', 'Timkat', 'Meskel', 'Genna'],
      correctAnswer: 0,
      explanation: 'Enkutatash is the Ethiopian New Year, celebrated on September 11th (or 12th in leap years).',
      difficulty: 'easy',
      category: 'festivals',
      points: 10
    },
    {
      id: '2',
      question: 'Which spice blend is essential in Ethiopian cuisine?',
      options: ['Curry powder', 'Berbere', 'Garam masala', 'Za\'atar'],
      correctAnswer: 1,
      explanation: 'Berbere is a complex spice blend that forms the foundation of many Ethiopian dishes.',
      difficulty: 'easy',
      category: 'food',
      points: 10
    },
    {
      id: '3',
      question: 'What is the traditional Ethiopian bread called?',
      options: ['Naan', 'Pita', 'Injera', 'Chapati'],
      correctAnswer: 2,
      explanation: 'Injera is a spongy sourdough flatbread made from teff flour, served with most Ethiopian meals.',
      difficulty: 'easy',
      category: 'food',
      points: 10
    },
    {
      id: '4',
      question: 'Which ancient city is known as the "New Jerusalem" of Ethiopia?',
      options: ['Axum', 'Gondar', 'Lalibela', 'Harar'],
      correctAnswer: 2,
      explanation: 'Lalibela is famous for its rock-hewn churches and is considered the "New Jerusalem" of Ethiopia.',
      difficulty: 'medium',
      category: 'history',
      points: 15
    },
    {
      id: '5',
      question: 'What does "Selam" mean in Amharic?',
      options: ['Hello', 'Peace/Hello', 'Goodbye', 'Thank you'],
      correctAnswer: 1,
      explanation: 'Selam means both "peace" and is used as a greeting similar to "hello" in Amharic.',
      difficulty: 'easy',
      category: 'language',
      points: 10
    },
    {
      id: '6',
      question: 'Which Ethiopian festival celebrates the finding of the True Cross?',
      options: ['Timkat', 'Meskel', 'Enkutatash', 'Fasika'],
      correctAnswer: 1,
      explanation: 'Meskel celebrates the finding of the True Cross by Empress Helena in the 4th century.',
      difficulty: 'medium',
      category: 'festivals',
      points: 15
    },
    {
      id: '7',
      question: 'What is the traditional Ethiopian coffee ceremony called?',
      options: ['Buna', 'Kawa', 'Qahwa', 'Café'],
      correctAnswer: 0,
      explanation: 'Buna is the traditional Ethiopian coffee ceremony, an important social and cultural ritual.',
      difficulty: 'medium',
      category: 'traditions',
      points: 15
    },
    {
      id: '8',
      question: 'Which empire was centered in northern Ethiopia and was known for its obelisks?',
      options: ['Zagwe Dynasty', 'Aksumite Empire', 'Solomonic Dynasty', 'Gondarine Period'],
      correctAnswer: 1,
      explanation: 'The Aksumite Empire was famous for its towering obelisks and was a major trading power.',
      difficulty: 'hard',
      category: 'history',
      points: 20
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories', icon: FaQuestionCircle },
    { id: 'festivals', name: 'Festivals', icon: FaStar },
    { id: 'food', name: 'Food & Cuisine', icon: FaHeart },
    { id: 'history', name: 'History', icon: FaTrophy },
    { id: 'language', name: 'Language', icon: FaLightbulb },
    { id: 'traditions', name: 'Traditions', icon: FaUsers }
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels', color: 'bg-gray-500' },
    { id: 'easy', name: 'Easy', color: 'bg-green-500' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-500' },
    { id: 'hard', name: 'Hard', color: 'bg-red-500' }
  ]

  // Sample leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Almaz T.', score: 180, percentage: 90, completedAt: '2024-01-15' },
    { id: '2', name: 'Dawit M.', score: 165, percentage: 85, completedAt: '2024-01-14' },
    { id: '3', name: 'Hanan A.', score: 150, percentage: 80, completedAt: '2024-01-13' },
    { id: '4', name: 'Yonas K.', score: 140, percentage: 75, completedAt: '2024-01-12' },
    { id: '5', name: 'Sara B.', score: 130, percentage: 70, completedAt: '2024-01-11' }
  ]

  // Filter questions based on selected category and difficulty
  const getFilteredQuestions = () => {
    let filtered = allQuestions
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty)
    }
    
    return filtered.slice(0, 10) // Limit to 10 questions per quiz
  }

  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  useEffect(() => {
    setQuestions(getFilteredQuestions())
  }, [selectedCategory, selectedDifficulty])

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'playing' && timeLeft > 0 && !showExplanation) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameState, showExplanation])

  const startQuiz = () => {
    const filteredQuestions = getFilteredQuestions()
    if (filteredQuestions.length === 0) {
      alert('No questions available for the selected filters. Please choose different options.')
      return
    }
    
    setQuestions(filteredQuestions)
    setGameState('playing')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setUserAnswers([])
    setScore(0)
    setTimeLeft(30)
    setStartTime(new Date())
    setShowExplanation(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    setUserAnswers([...userAnswers, selectedAnswer])
    
    if (isCorrect) {
      setScore(score + currentQuestion.points)
    }
    
    setShowExplanation(true)
    setTimeLeft(0) // Stop the timer
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(30)
    } else {
      finishQuiz()
    }
  }

  const handleTimeUp = () => {
    if (selectedAnswer !== null) {
      handleSubmitAnswer()
    } else {
      // Auto-submit with no answer
      setUserAnswers([...userAnswers, -1])
      setShowExplanation(true)
    }
  }

  const finishQuiz = () => {
    const endTime = new Date()
    const timeSpent = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length
    const percentage = Math.round((correctAnswers / questions.length) * 100)
    
    let rank = 'Beginner'
    if (percentage >= 90) rank = 'Cultural Expert'
    else if (percentage >= 80) rank = 'Cultural Enthusiast'
    else if (percentage >= 70) rank = 'Cultural Explorer'
    else if (percentage >= 60) rank = 'Cultural Student'

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent,
      percentage,
      rank
    }

    setQuizResult(result)
    setGameState('results')
  }

  const resetQuiz = () => {
    setGameState('menu')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setUserAnswers([])
    setScore(0)
    setTimeLeft(30)
    setStartTime(null)
    setShowExplanation(false)
    setQuizResult(null)
  }

  const shareResults = () => {
    if (!quizResult) return
    
    const shareText = `I just scored ${quizResult.percentage}% on the Ethiopian Cultural Quiz! 🇪🇹 I'm a ${quizResult.rank}! Can you beat my score?`
    
    if (navigator.share) {
      navigator.share({
        title: 'Ethiopian Cultural Quiz Results',
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Results copied to clipboard!')
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  if (gameState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🇪🇹 Ethiopian Cultural Quiz
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Test your knowledge of Ethiopian culture, history, and traditions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaQuestionCircle className="mr-2 text-purple-600" />
                Choose Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedCategory === category.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <category.icon className="mx-auto mb-2 text-purple-600" />
                    <div className="text-sm font-medium">{category.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaChartLine className="mr-2 text-purple-600" />
                Choose Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex items-center ${
                      selectedDifficulty === difficulty.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${difficulty.color} mr-3`}></div>
                    <span className="font-medium">{difficulty.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Button 
            onClick={startQuiz}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
          >
            <FaPlay className="mr-2" />
            Start Quiz
          </Button>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline"
              onClick={() => setGameState('leaderboard')}
            >
              <FaTrophy className="mr-2" />
              Leaderboard
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>• {getFilteredQuestions().length} questions available</p>
          <p>• 30 seconds per question</p>
          <p>• Points based on difficulty level</p>
        </div>
      </div>
    )
  }

  if (gameState === 'playing' && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <Badge className={`${
              currentQuestion.difficulty === 'easy' ? 'bg-green-500' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {currentQuestion.difficulty.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-purple-600">
              <FaStar className="mr-1" />
              <span className="font-bold">{score} pts</span>
            </div>
            <div className={`flex items-center ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`}>
              <FaClock className="mr-1" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-6" />

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`p-4 text-left rounded-lg border-2 transition-all ${
                    showExplanation
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : selectedAnswer === index
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                      : selectedAnswer === index
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      showExplanation
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : selectedAnswer === index
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        : selectedAnswer === index
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {showExplanation && index === currentQuestion.correctAnswer && (
                        <FaCheck className="text-white text-xs" />
                      )}
                      {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                        <FaTimes className="text-white text-xs" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <FaLightbulb className="text-blue-600 mr-2 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
                    <p className="text-blue-800">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {!showExplanation ? (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (gameState === 'results' && quizResult) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {quizResult.percentage >= 90 ? '🏆' : 
             quizResult.percentage >= 80 ? '🥇' :
             quizResult.percentage >= 70 ? '🥈' :
             quizResult.percentage >= 60 ? '🥉' : '📚'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Quiz Complete!
          </h1>
          <p className="text-xl text-gray-600">
            You're a <span className="font-bold text-purple-600">{quizResult.rank}</span>!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaChartLine className="mr-2 text-purple-600" />
                Your Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {quizResult.percentage}%
                </div>
                <div className="text-gray-600">
                  {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
                </div>
                <div className="text-gray-600">
                  {quizResult.score} points earned
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaClock className="mr-2 text-purple-600" />
                Time & Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Time Spent:</span>
                  <span className="font-medium">{Math.floor(quizResult.timeSpent / 60)}m {quizResult.timeSpent % 60}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span className="font-medium">{quizResult.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-medium">{quizResult.percentage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center space-x-4">
          <Button 
            onClick={shareResults}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FaShare className="mr-2" />
            Share Results
          </Button>
          
          <Button 
            onClick={resetQuiz}
            variant="outline"
          >
            <FaRedo className="mr-2" />
            Play Again
          </Button>
          
          <Button 
            onClick={() => setGameState('leaderboard')}
            variant="outline"
          >
            <FaTrophy className="mr-2" />
            Leaderboard
          </Button>
        </div>
      </div>
    )
  }

  if (gameState === 'leaderboard') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Leaderboard
          </h1>
          <p className="text-xl text-gray-600">
            Top Ethiopian Culture Quiz Champions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaMedal className="mr-2 text-yellow-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                    index === 1 ? 'bg-gray-50 border border-gray-200' :
                    index === 2 ? 'bg-orange-50 border border-orange-200' :
                    'bg-white border border-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-500 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-purple-500 text-white'
                    }`}>
                      {index < 3 ? (
                        <FaMedal className="text-sm" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{entry.name}</div>
                      <div className="text-sm text-gray-600">
                        Completed on {new Date(entry.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-purple-600">{entry.score} pts</div>
                    <div className="text-sm text-gray-600">{entry.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button 
            onClick={() => setGameState('menu')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <FaPlay className="mr-2" />
            Take Quiz
          </Button>
        </div>
      </div>
    )
  }

  return null
}

export default CulturalQuiz