import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaArrowLeft, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt,
  FaBook, FaUsers, FaChartLine, FaStar, FaHeart,
  FaUtensils, FaMusic, FaTshirt, FaGlobe
} from 'react-icons/fa'
import { InteractiveCulturalMap } from '../components/InteractiveCulturalMap'
import { CulturalTimeline } from '../components/CulturalTimeline'
import { ProgressTracker } from '../components/ProgressTracker'

interface LearningModule {
  id: string
  title: string
  description: string
  category: 'language' | 'history' | 'geography' | 'cuisine' | 'arts' | 'traditions'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // minutes
  completionRate: number
  rating: number
  enrollments: number
  prerequisites: string[]
  learningObjectives: string[]
  activities: string[]
  rewards: string[]
  isCompleted: boolean
  isFavorite: boolean
  progress: number
}



const CulturalLearningHub: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'map' | 'timeline' | 'progress'>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [userProgress, setUserProgress] = useState({
    totalModules: 0,
    completedModules: 0,
    totalHours: 0,
    currentStreak: 0,
    achievements: 0,
    level: 1,
    experience: 0
  })

  // Mock learning modules
  const mockModules: LearningModule[] = [
    {
      id: 'amharic-basics',
      title: 'Amharic Language Fundamentals',
      description: 'Master the basics of Amharic script, pronunciation, and essential phrases for daily communication.',
      category: 'language',
      difficulty: 'beginner',
      duration: 120,
      completionRate: 85,
      rating: 4.8,
      enrollments: 1250,
      prerequisites: [],
      learningObjectives: [
        'Read and write Amharic script (Fidel)',
        'Pronounce common words correctly',
        'Use basic greetings and phrases',
        'Understand cultural context of language use'
      ],
      activities: ['Interactive lessons', 'Pronunciation practice', 'Cultural scenarios', 'Voice recording'],
      rewards: ['Amharic Script Master badge', '50 XP', 'Cultural Context certificate'],
      isCompleted: false,
      isFavorite: true,
      progress: 65
    },
    {
      id: 'ethiopian-history',
      title: 'Journey Through Ethiopian History',
      description: 'Explore 3000 years of Ethiopian civilization from ancient Aksum to modern times.',
      category: 'history',
      difficulty: 'intermediate',
      duration: 180,
      completionRate: 78,
      rating: 4.9,
      enrollments: 890,
      prerequisites: [],
      learningObjectives: [
        'Understand major historical periods',
        'Identify key historical figures',
        'Analyze cultural developments',
        'Connect past to present'
      ],
      activities: ['Interactive timeline', 'Virtual museum tours', 'Historical simulations', 'Research projects'],
      rewards: ['History Scholar badge', '75 XP', 'Timeline Master certificate'],
      isCompleted: true,
      isFavorite: false,
      progress: 100
    },
    {
      id: 'regional-geography',
      title: 'Ethiopian Regional Diversity',
      description: 'Discover the geographical and cultural diversity across Ethiopia\'s regions and peoples.',
      category: 'geography',
      difficulty: 'beginner',
      duration: 90,
      completionRate: 92,
      rating: 4.7,
      enrollments: 1100,
      prerequisites: [],
      learningObjectives: [
        'Identify major regions and their characteristics',
        'Understand ethnic and linguistic diversity',
        'Explore geographical features',
        'Learn about regional traditions'
      ],
      activities: ['Interactive maps', 'Regional profiles', 'Cultural comparisons', 'Virtual field trips'],
      rewards: ['Geography Explorer badge', '40 XP', 'Regional Expert certificate'],
      isCompleted: false,
      isFavorite: true,
      progress: 30
    },
    {
      id: 'traditional-cuisine',
      title: 'Masters of Ethiopian Cuisine',
      description: 'Learn to cook authentic Ethiopian dishes and understand their cultural significance.',
      category: 'cuisine',
      difficulty: 'intermediate',
      duration: 150,
      completionRate: 88,
      rating: 4.9,
      enrollments: 750,
      prerequisites: ['regional-geography'],
      learningObjectives: [
        'Master traditional cooking techniques',
        'Understand spice combinations',
        'Learn cultural dining etiquette',
        'Prepare complete Ethiopian meals'
      ],
      activities: ['Video tutorials', 'Recipe practice', 'Spice identification', 'Cultural dining sessions'],
      rewards: ['Master Chef badge', '60 XP', 'Culinary Artist certificate'],
      isCompleted: false,
      isFavorite: false,
      progress: 0
    },
    {
      id: 'traditional-arts',
      title: 'Ethiopian Arts and Crafts',
      description: 'Explore traditional Ethiopian arts, from ancient manuscripts to contemporary expressions.',
      category: 'arts',
      difficulty: 'advanced',
      duration: 200,
      completionRate: 72,
      rating: 4.6,
      enrollments: 420,
      prerequisites: ['ethiopian-history'],
      learningObjectives: [
        'Analyze traditional art forms',
        'Understand artistic symbolism',
        'Create inspired artworks',
        'Appreciate cultural aesthetics'
      ],
      activities: ['Art analysis', 'Virtual gallery tours', 'Creative projects', 'Artist interviews'],
      rewards: ['Art Connoisseur badge', '80 XP', 'Cultural Artist certificate'],
      isCompleted: false,
      isFavorite: true,
      progress: 15
    },
    {
      id: 'cultural-traditions',
      title: 'Living Traditions and Festivals',
      description: 'Immerse yourself in Ethiopian festivals, ceremonies, and cultural practices.',
      category: 'traditions',
      difficulty: 'intermediate',
      duration: 135,
      completionRate: 90,
      rating: 4.8,
      enrollments: 980,
      prerequisites: ['regional-geography'],
      learningObjectives: [
        'Understand festival significance',
        'Learn ceremonial practices',
        'Participate in virtual celebrations',
        'Appreciate cultural diversity'
      ],
      activities: ['Festival simulations', 'Ceremony walkthroughs', 'Cultural interviews', 'Tradition mapping'],
      rewards: ['Tradition Keeper badge', '55 XP', 'Cultural Ambassador certificate'],
      isCompleted: false,
      isFavorite: false,
      progress: 45
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories', icon: FaGlobe, color: 'text-gray-600' },
    { id: 'language', name: 'Language', icon: FaBook, color: 'text-blue-600' },
    { id: 'history', name: 'History', icon: FaCalendarAlt, color: 'text-purple-600' },
    { id: 'geography', name: 'Geography', icon: FaMapMarkerAlt, color: 'text-green-600' },
    { id: 'cuisine', name: 'Cuisine', icon: FaUtensils, color: 'text-orange-600' },
    { id: 'arts', name: 'Arts', icon: FaTshirt, color: 'text-pink-600' },
    { id: 'traditions', name: 'Traditions', icon: FaMusic, color: 'text-red-600' }
  ]

  const filteredModules = mockModules.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty
    const matchesSearch = searchTerm === '' || 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category)
    return categoryData ? categoryData.icon : FaBook
  }

  const toggleFavorite = (moduleId: string) => {
    // Toggle favorite in localStorage or API
    console.log('Toggle favorite for module:', moduleId)
  }

  const startModule = (moduleId: string) => {
    // Navigate to specific learning module
    navigate(`/cultural/learning/${moduleId}`)
  }

  useEffect(() => {
    // Calculate user progress
    const completed = mockModules.filter(m => m.isCompleted).length
    const totalProgress = mockModules.reduce((sum, m) => sum + m.progress, 0)
    const avgProgress = totalProgress / mockModules.length
    
    setUserProgress({
      totalModules: mockModules.length,
      completedModules: completed,
      totalHours: Math.round(mockModules.reduce((sum, m) => sum + (m.duration * m.progress / 100), 0) / 60),
      currentStreak: 7, // Mock data
      achievements: 3, // Mock data
      level: Math.floor(avgProgress / 20) + 1,
      experience: Math.round(avgProgress * 10)
    })
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
                  <FaGraduationCap className="mr-3 text-blue-600" />
                  Cultural Learning Hub
                </h1>
                <p className="text-gray-600 mt-1">Immersive Ethiopian cultural education platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Level {userProgress.level}</div>
                <div className="text-lg font-bold text-blue-600">{userProgress.experience} XP</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {userProgress.level}
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{userProgress.completedModules}</div>
              <div className="text-sm text-blue-600">Completed</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{userProgress.totalHours}h</div>
              <div className="text-sm text-green-600">Study Time</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">{userProgress.currentStreak}</div>
              <div className="text-sm text-orange-600">Day Streak</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{userProgress.achievements}</div>
              <div className="text-sm text-purple-600">Achievements</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{Math.round((userProgress.completedModules / userProgress.totalModules) * 100)}%</div>
              <div className="text-sm text-red-600">Progress</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: FaGraduationCap },
              { id: 'modules', label: 'Learning Modules', icon: FaBook },
              { id: 'map', label: 'Cultural Map', icon: FaMapMarkerAlt },
              { id: 'timeline', label: 'Timeline', icon: FaCalendarAlt },
              { id: 'progress', label: 'Progress', icon: FaChartLine }
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
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Featured Modules */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Learning Paths</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockModules.slice(0, 3).map(module => {
                  const IconComponent = getCategoryIcon(module.category)
                  return (
                    <div key={module.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(module.id)}
                          className={`p-2 rounded-full ${module.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                        >
                          <FaHeart />
                        </button>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{module.duration}m</span>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            {module.rating}
                          </div>
                          <span>{module.enrollments} enrolled</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => startModule(module.id)}
                        className="w-full"
                      >
                        {module.progress > 0 ? 'Continue Learning' : 'Start Module'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Access */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Language Practice', icon: FaBook, color: 'bg-blue-500', link: '/cultural/language' },
                  { title: 'Recipe Collection', icon: FaUtensils, color: 'bg-orange-500', link: '/cultural/recipes' },
                  { title: 'Virtual Museum', icon: FaGlobe, color: 'bg-green-500', link: '/cultural/museum' },
                  { title: 'Cultural Categories', icon: FaUsers, color: 'bg-purple-500', link: '/cultural/categories' }
                ].map(item => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.title}
                      onClick={() => navigate(item.link)}
                      className={`${item.color} text-white p-6 rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      <IconComponent className="text-2xl mb-2 mx-auto" />
                      <div className="font-medium text-sm">{item.title}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Learning Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  {filteredModules.length} modules found
                </div>
              </div>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(module => {
                const IconComponent = getCategoryIcon(module.category)
                return (
                  <div key={module.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <IconComponent className="text-gray-600" />
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(module.id)}
                          className={`p-2 rounded-full ${module.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                        >
                          <FaHeart />
                        </button>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>
                      
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                        <span>{module.duration}m</span>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          {module.rating}
                        </div>
                        <span>{module.enrollments}</span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => startModule(module.id)}
                        className="w-full"
                        variant={module.isCompleted ? 'outline' : 'primary'}
                      >
                        {module.isCompleted ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Cultural Map Tab */}
        {activeTab === 'map' && (
          <InteractiveCulturalMap />
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <CulturalTimeline />
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <ProgressTracker
            sessions={[]} // Mock data
            totalPhrases={50}
            completedPhrases={userProgress.completedModules}
            onClose={() => {}}
          />
        )}
      </div>
    </div>
  )
}

export default CulturalLearningHub