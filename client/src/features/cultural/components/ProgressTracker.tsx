import React, { useState } from 'react'
import {
  FaChartLine, FaCalendarAlt, FaTrophy, FaFire, FaBullseye,
  FaClock, FaGraduationCap, FaCheck
} from 'react-icons/fa'

interface LearningSession {
  id: string
  date: Date
  phrasesStudied: number
  correctAnswers: number
  totalAnswers: number
  timeSpent: number // minutes
  categories: string[]
  studyMode: 'learn' | 'quiz' | 'practice' | 'flashcards'
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  progress: number
  target: number
}

interface ProgressTrackerProps {
  sessions: LearningSession[]
  totalPhrases: number
  completedPhrases: number
  onClose: () => void
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  sessions,
  totalPhrases,
  completedPhrases,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'achievements'>('overview')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week')

  // Calculate statistics
  const totalStudyTime = sessions.reduce((sum, session) => sum + session.timeSpent, 0)
  const totalSessions = sessions.length
  const averageAccuracy = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + (session.correctAnswers / session.totalAnswers), 0) / sessions.length * 100
    : 0

  const currentStreak = calculateStreak(sessions)
  const longestStreak = calculateLongestStreak(sessions)

  // Filter sessions by time range
  const filteredSessions = filterSessionsByTimeRange(sessions, timeRange)

  // Calculate weekly progress
  const weeklyData = calculateWeeklyProgress(filteredSessions)

  // Define achievements
  const achievements: Achievement[] = [
    {
      id: 'first_phrase',
      title: 'First Steps',
      description: 'Complete your first phrase',
      icon: '🎯',
      progress: Math.min(completedPhrases, 1),
      target: 1,
      unlockedAt: completedPhrases >= 1 ? new Date() : undefined
    },
    {
      id: 'five_phrases',
      title: 'Getting Started',
      description: 'Complete 5 phrases',
      icon: '🌟',
      progress: Math.min(completedPhrases, 5),
      target: 5,
      unlockedAt: completedPhrases >= 5 ? new Date() : undefined
    },
    {
      id: 'ten_phrases',
      title: 'Making Progress',
      description: 'Complete 10 phrases',
      icon: '🚀',
      progress: Math.min(completedPhrases, 10),
      target: 10,
      unlockedAt: completedPhrases >= 10 ? new Date() : undefined
    },
    {
      id: 'all_phrases',
      title: 'Master Student',
      description: 'Complete all phrases',
      icon: '🏆',
      progress: completedPhrases,
      target: totalPhrases,
      unlockedAt: completedPhrases >= totalPhrases ? new Date() : undefined
    },
    {
      id: 'seven_day_streak',
      title: 'Consistent Learner',
      description: 'Study for 7 days in a row',
      icon: '🔥',
      progress: Math.min(currentStreak, 7),
      target: 7,
      unlockedAt: currentStreak >= 7 ? new Date() : undefined
    },
    {
      id: 'perfect_quiz',
      title: 'Perfect Score',
      description: 'Get 100% on a quiz',
      icon: '💯',
      progress: sessions.some(s => s.totalAnswers > 0 && s.correctAnswers === s.totalAnswers) ? 1 : 0,
      target: 1,
      unlockedAt: sessions.some(s => s.totalAnswers > 0 && s.correctAnswers === s.totalAnswers) ? new Date() : undefined
    }
  ]

  function calculateStreak(sessions: LearningSession[]): number {
    if (sessions.length === 0) return 0
    
    const sortedSessions = [...sessions].sort((a, b) => b.date.getTime() - a.date.getTime())
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let streak = 0
    let currentDate = new Date(today)
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date)
      sessionDate.setHours(0, 0, 0, 0)
      
      if (sessionDate.getTime() === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (sessionDate.getTime() < currentDate.getTime()) {
        break
      }
    }
    
    return streak
  }

  function calculateLongestStreak(sessions: LearningSession[]): number {
    if (sessions.length === 0) return 0
    
    const sortedSessions = [...sessions].sort((a, b) => a.date.getTime() - b.date.getTime())
    let longestStreak = 0
    let currentStreak = 0
    let lastDate: Date | null = null
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date)
      sessionDate.setHours(0, 0, 0, 0)
      
      if (lastDate) {
        const daysDiff = Math.floor((sessionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff === 1) {
          currentStreak++
        } else if (daysDiff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak)
          currentStreak = 1
        }
      } else {
        currentStreak = 1
      }
      
      lastDate = sessionDate
    }
    
    return Math.max(longestStreak, currentStreak)
  }

  function filterSessionsByTimeRange(sessions: LearningSession[], range: string): LearningSession[] {
    const now = new Date()
    const cutoffDate = new Date()
    
    switch (range) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      default:
        return sessions
    }
    
    return sessions.filter(session => session.date >= cutoffDate)
  }

  function calculateWeeklyProgress(sessions: LearningSession[]) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weekData = days.map(day => ({ day, sessions: 0, accuracy: 0, timeSpent: 0 }))
    
    sessions.forEach(session => {
      const dayIndex = session.date.getDay()
      weekData[dayIndex].sessions++
      weekData[dayIndex].accuracy += session.totalAnswers > 0 ? (session.correctAnswers / session.totalAnswers) * 100 : 0
      weekData[dayIndex].timeSpent += session.timeSpent
    })
    
    return weekData.map(data => ({
      ...data,
      accuracy: data.sessions > 0 ? data.accuracy / data.sessions : 0
    }))
  }

  const getStreakIcon = () => {
    if (currentStreak >= 7) return <FaFire className="text-orange-500" />
    if (currentStreak >= 3) return <FaFire className="text-yellow-500" />
    return <FaFire className="text-gray-400" />
  }



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaChartLine className="mr-3 text-blue-600" />
              Learning Progress
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartLine },
              { id: 'progress', label: 'Progress', icon: FaCalendarAlt },
              { id: 'achievements', label: 'Achievements', icon: FaTrophy }
            ].map(tab => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="text-sm" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Completed</p>
                      <p className="text-2xl font-bold text-blue-700">{completedPhrases}</p>
                      <p className="text-xs text-blue-600">of {totalPhrases} phrases</p>
                    </div>
                    <FaCheck className="text-blue-500 text-xl" />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Accuracy</p>
                      <p className="text-2xl font-bold text-green-700">{Math.round(averageAccuracy)}%</p>
                      <p className="text-xs text-green-600">average score</p>
                    </div>
                    <FaBullseye className="text-green-500 text-xl" />
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Streak</p>
                      <p className="text-2xl font-bold text-orange-700">{currentStreak}</p>
                      <p className="text-xs text-orange-600">days in a row</p>
                    </div>
                    {getStreakIcon()}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Study Time</p>
                      <p className="text-2xl font-bold text-purple-700">{totalStudyTime}</p>
                      <p className="text-xs text-purple-600">minutes total</p>
                    </div>
                    <FaClock className="text-purple-500 text-xl" />
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-600 mb-2">{day.day}</div>
                      <div 
                        className="bg-blue-200 rounded h-16 flex items-end justify-center relative"
                        style={{ 
                          backgroundColor: day.sessions > 0 
                            ? `rgba(59, 130, 246, ${Math.min(day.sessions / 3, 1)})` 
                            : '#e5e7eb' 
                        }}
                      >
                        <span className="text-xs text-white font-medium mb-1">
                          {day.sessions}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {day.timeSpent}m
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  {sessions.slice(-5).reverse().map((session, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaGraduationCap className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.studyMode.charAt(0).toUpperCase() + session.studyMode.slice(1)} Session
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.date.toLocaleDateString()} • {session.timeSpent} minutes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {session.totalAnswers > 0 ? Math.round((session.correctAnswers / session.totalAnswers) * 100) : 0}%
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.correctAnswers}/{session.totalAnswers}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Completion Progress */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Phrase Completion</h4>
                <div className="space-y-4">
                  {['greetings', 'shopping', 'emergency', 'food'].map(category => {
                    const categoryPhrases = 5 // Assuming 5 phrases per category
                    const completed = Math.floor(Math.random() * categoryPhrases) // Mock data
                    const percentage = (completed / categoryPhrases) * 100
                    
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {category}
                          </span>
                          <span className="text-sm text-gray-600">
                            {completed}/{categoryPhrases}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Study Patterns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Study Patterns</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Most Active Day</span>
                      <span className="font-medium">Monday</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Preferred Time</span>
                      <span className="font-medium">Evening</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Session</span>
                      <span className="font-medium">{Math.round(totalStudyTime / Math.max(totalSessions, 1))} min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Best Category</span>
                      <span className="font-medium">Greetings</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Longest Streak</span>
                      <span className="font-medium">{longestStreak} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Sessions</span>
                      <span className="font-medium">{totalSessions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Achievements</h3>
                <p className="text-gray-600">
                  {achievements.filter(a => a.unlockedAt).length} of {achievements.length} unlocked
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      achievement.unlockedAt
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`text-3xl ${achievement.unlockedAt ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-1 ${
                          achievement.unlockedAt ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm mb-3 ${
                          achievement.unlockedAt ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                achievement.unlockedAt ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}
                              style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {achievement.unlockedAt && (
                          <div className="mt-3 flex items-center text-sm text-yellow-700">
                            <FaTrophy className="mr-1" />
                            Unlocked {achievement.unlockedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}