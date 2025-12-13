import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ContentCard, { CulturalContent } from '../components/ContentCard'
import { Button } from '@components/common/Button/Button'
import { FaSearch, FaFilter, FaMap, FaCalendar, FaFire, FaPalette, FaMusic, FaUtensils, FaHeart, FaChartLine, FaPlay, FaArrowRight, FaStar, FaGraduationCap, FaUpload, FaUsers } from 'react-icons/fa'

// Mock cultural content data
const mockCulturalContent: CulturalContent[] = [
  {
    id: '1',
    title: 'The Ancient Rock Churches of Lalibela',
    description: 'Discover the magnificent 12th-century rock-hewn churches that make Lalibela a UNESCO World Heritage site and a center of Ethiopian Orthodox Christianity.',
    image: '/images/lalibela-churches.jpg',
    type: 'heritage',
    category: 'Religious Heritage',
    location: 'Lalibela, Amhara Region',
    date: '2024-12-15T00:00:00Z',
    duration: '2-3 hours read',
    views: 15420,
    likes: 892,
    featured: true,
    author: 'Dr. Alemayehu Teshome',
    publishedAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Virtual Tour: National Museum of Ethiopia',
    description: 'Explore the treasures of Ethiopian history including Lucy, ancient manuscripts, and royal artifacts in this immersive virtual museum experience.',
    image: '/images/national-museum.jpg',
    type: 'museum',
    category: 'Museums & Galleries',
    location: 'Addis Ababa',
    duration: '45 minutes',
    views: 8750,
    likes: 456,
    featured: true,
    author: 'Museum Curator Team',
    publishedAt: '2024-11-28T14:30:00Z'
  },
  {
    id: '3',
    title: 'Timkat Festival: Ethiopian Orthodox Epiphany',
    description: 'Experience the colorful celebration of Timkat, where thousands gather to commemorate the baptism of Jesus Christ in the Jordan River.',
    image: '/images/timkat-festival.jpg',
    type: 'festival',
    category: 'Religious Festivals',
    location: 'Gondar, Amhara Region',
    date: '2025-01-19T00:00:00Z',
    duration: '3 days',
    views: 12300,
    likes: 678,
    featured: false,
    author: 'Festival Documentation Team',
    publishedAt: '2024-12-05T09:15:00Z'
  },
  {
    id: '4',
    title: 'Coffee Ceremony: The Heart of Ethiopian Culture',
    description: 'Learn about the traditional Ethiopian coffee ceremony, a social ritual that brings communities together and honors the birthplace of coffee.',
    image: '/images/coffee-ceremony.jpg',
    type: 'tradition',
    category: 'Cultural Traditions',
    location: 'Throughout Ethiopia',
    duration: '15 minutes read',
    views: 9840,
    likes: 523,
    featured: false,
    author: 'Cultural Heritage Society',
    publishedAt: '2024-11-30T16:45:00Z'
  },
  {
    id: '5',
    title: 'Harar: The Walled City of Saints',
    description: 'Explore the ancient walled city of Harar, known for its 82 mosques, 102 shrines, and unique architectural heritage.',
    image: '/images/harar-city.jpg',
    type: 'heritage',
    category: 'Historical Cities',
    location: 'Harar, Harari Region',
    duration: '20 minutes read',
    views: 7650,
    likes: 389,
    featured: false,
    author: 'Heritage Documentation Project',
    publishedAt: '2024-12-03T11:20:00Z'
  },
  {
    id: '6',
    title: 'Ethnological Museum Virtual Experience',
    description: 'Discover Ethiopian cultural diversity through traditional clothing, musical instruments, and ceremonial objects in this virtual tour.',
    image: '/images/ethnological-museum.jpg',
    type: 'museum',
    category: 'Art & Culture',
    location: 'Addis Ababa University',
    duration: '30 minutes',
    views: 5420,
    likes: 267,
    featured: false,
    author: 'University Museum Team',
    publishedAt: '2024-11-25T13:10:00Z'
  },
  {
    id: '7',
    title: 'Traditional Ethiopian Music: Eskista Dance',
    description: 'Learn about the shoulder-shaking dance that embodies Ethiopian joy and celebration, performed at weddings and festivals.',
    image: '/images/eskista-dance.jpg',
    type: 'tradition',
    category: 'Music & Dance',
    location: 'Throughout Ethiopia',
    duration: '10 minutes read',
    views: 7890,
    likes: 445,
    featured: false,
    author: 'Ethiopian Cultural Institute',
    publishedAt: '2024-12-02T15:20:00Z'
  },
  {
    id: '8',
    title: 'Injera: The Foundation of Ethiopian Cuisine',
    description: 'Discover the ancient art of making injera, the spongy sourdough flatbread that serves as both plate and utensil in Ethiopian meals.',
    image: '/images/injera-making.jpg',
    type: 'tradition',
    category: 'Food & Cuisine',
    location: 'Throughout Ethiopia',
    duration: '12 minutes read',
    views: 11200,
    likes: 678,
    featured: true,
    author: 'Chef Almaz Yohannes',
    publishedAt: '2024-11-29T12:00:00Z'
  },
  {
    id: '9',
    title: 'Ancient Axum: Cradle of Ethiopian Civilization',
    description: 'Explore the ancient kingdom of Axum, home to towering obelisks and the legendary resting place of the Ark of the Covenant.',
    image: '/images/axum-obelisks.jpg',
    type: 'heritage',
    category: 'History & Archaeology',
    location: 'Axum, Tigray Region',
    duration: '18 minutes read',
    views: 9650,
    likes: 534,
    featured: false,
    author: 'Prof. Tekle Hagos',
    publishedAt: '2024-11-27T09:30:00Z'
  },
  {
    id: '10',
    title: 'Ethiopian Orthodox Art: Illuminated Manuscripts',
    description: 'Marvel at the intricate religious artwork found in ancient Ethiopian manuscripts, featuring unique artistic styles and biblical narratives.',
    image: '/images/manuscript-art.jpg',
    type: 'article',
    category: 'Art & Culture',
    location: 'Various Monasteries',
    duration: '15 minutes read',
    views: 6780,
    likes: 389,
    featured: false,
    author: 'Art Historian Dr. Meron Teshome',
    publishedAt: '2024-12-04T11:45:00Z'
  }
]

// Content categories with icons and descriptions
const contentCategories = [
  {
    id: 'history',
    name: 'History & Archaeology',
    icon: FaMap,
    color: 'from-amber-500 to-orange-600',
    description: 'Ancient civilizations and archaeological wonders',
    count: 3
  },
  {
    id: 'art',
    name: 'Art & Culture',
    icon: FaPalette,
    color: 'from-purple-500 to-pink-600',
    description: 'Traditional and contemporary Ethiopian art',
    count: 2
  },
  {
    id: 'music',
    name: 'Music & Dance',
    icon: FaMusic,
    color: 'from-green-500 to-teal-600',
    description: 'Traditional music, instruments, and dances',
    count: 1
  },
  {
    id: 'food',
    name: 'Food & Cuisine',
    icon: FaUtensils,
    color: 'from-red-500 to-pink-600',
    description: 'Culinary traditions and cooking methods',
    count: 1
  },
  {
    id: 'language',
    name: 'Language Learning',
    icon: FaPlay,
    color: 'from-blue-500 to-indigo-600',
    description: 'Learn Amharic phrases and pronunciation',
    count: 15,
    link: '/cultural/language'
  },
  {
    id: 'recipes',
    name: 'Traditional Recipes',
    icon: FaUtensils,
    color: 'from-orange-500 to-red-600',
    description: 'Authentic Ethiopian dishes and cooking guides',
    count: 25,
    link: '/cultural/recipes'
  },
  {
    id: 'learning',
    name: 'Learning Hub',
    icon: FaGraduationCap,
    color: 'from-purple-500 to-indigo-600',
    description: 'Interactive cultural education and progress tracking',
    count: 12,
    link: '/cultural/learning'
  },
  {
    id: 'community',
    name: 'Community Hub',
    icon: FaUsers,
    color: 'from-blue-500 to-cyan-600',
    description: 'Live events, marketplace, and cultural discussions',
    count: 8,
    link: '/cultural/community'
  },
  {
    id: 'quiz',
    name: 'Cultural Quiz',
    icon: FaPlay,
    color: 'from-green-500 to-emerald-600',
    description: 'Test your knowledge with interactive cultural quizzes',
    count: 50,
    link: '/cultural/quiz'
  },
  {
    id: 'contribute',
    name: 'Share Your Story',
    icon: FaUpload,
    color: 'from-pink-500 to-rose-600',
    description: 'Submit stories, photos, and travel experiences',
    count: 5,
    link: '/cultural/contribute'
  },
  {
    id: 'traditions',
    name: 'Cultural Traditions',
    icon: FaHeart,
    color: 'from-blue-500 to-indigo-600',
    description: 'Ceremonies, rituals, and social customs',
    count: 2
  },
  {
    id: 'festivals',
    name: 'Religious Festivals',
    icon: FaCalendar,
    color: 'from-yellow-500 to-orange-600',
    description: 'Religious celebrations and festivals',
    count: 1
  }
]

// Trending topics
const trendingTopics = [
  { name: 'Timkat 2025', views: '25.4K', trend: '+15%' },
  { name: 'Coffee Origins', views: '18.7K', trend: '+8%' },
  { name: 'Lalibela Churches', views: '32.1K', trend: '+12%' },
  { name: 'Ethiopian Art', views: '14.2K', trend: '+22%' },
  { name: 'Traditional Music', views: '11.8K', trend: '+5%' },
  { name: 'Ancient Axum', views: '19.3K', trend: '+18%' }
]

const CultureHubPage: React.FC = () => {
  const navigate = useNavigate()
  const [content] = useState<CulturalContent[]>(mockCulturalContent)
  const [filteredContent, setFilteredContent] = useState<CulturalContent[]>(mockCulturalContent)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    filterContent()
  }, [searchTerm, selectedCategory, content])

  const filterContent = () => {
    let filtered = content

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredContent(filtered)
  }

  const featuredContent = filteredContent.filter(item => item.featured)
  const regularContent = filteredContent.filter(item => !item.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                  🌟 Featured
                </span>
                <span className="text-yellow-300 text-sm">Discover Ethiopia's Rich Heritage</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Ethiopian Cultural
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Heritage Hub</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                Journey through 3,000 years of Ethiopian civilization. Explore ancient kingdoms, 
                sacred traditions, and vibrant cultures that shaped the Horn of Africa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="primary"
                  onClick={() => navigate('/cultural/museum/national-museum-ethiopia')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black hover:from-yellow-400 hover:to-orange-500 font-semibold"
                >
                  <FaPlay className="mr-2" />
                  Start Virtual Tour
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-white text-white hover:bg-white hover:text-blue-900"
                >
                  <FaArrowRight className="mr-2" />
                  Explore Categories
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{content.length}+</div>
                  <div className="text-sm text-gray-300">Cultural Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">2</div>
                  <div className="text-sm text-gray-300">Virtual Museums</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">50K+</div>
                  <div className="text-sm text-gray-300">Monthly Visitors</div>
                </div>
              </div>
            </div>

            {/* Featured Content Preview */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaStar className="mr-2 text-yellow-400" />
                Featured This Week
              </h3>
              {featuredContent.slice(0, 2).map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/cultural/article/${item.id}`)}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:bg-opacity-20 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center text-2xl">
                      {item.type === 'heritage' ? '🏛️' : item.type === 'tradition' ? '🎭' : '📖'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>{item.views.toLocaleString()} views</span>
                        <span>{item.likes.toLocaleString()} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Categories Section */}
      <div id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dive deep into different aspects of Ethiopian culture and heritage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {contentCategories.map(category => {
            const IconComponent = category.icon
            return (
              <div
                key={category.id}
                onClick={() => {
                  if (category.link) {
                    navigate(category.link)
                  } else {
                    setSelectedCategory(category.name)
                  }
                }}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white transform group-hover:scale-105 transition-all duration-300 shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="text-3xl" />
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                      {category.count} items
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white text-opacity-90 text-sm">{category.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium">
                    <span>Explore</span>
                    <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaChartLine className="mr-3 text-green-500" />
              Trending Topics
            </h3>
            <Button variant="outline" size="sm">
              View All Trends
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingTopics.map((topic, index) => (
              <div
                key={topic.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">{topic.name}</div>
                    <div className="text-sm text-gray-600">{topic.views} views</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{topic.trend}</div>
                  <div className="text-xs text-gray-500">this week</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Cultural Content</h3>
            <p className="text-gray-600">Search through our extensive collection of Ethiopian heritage</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Enhanced Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, museums, traditions, festivals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {contentCategories.slice(0, 4).map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => {/* TODO: Implement advanced filters */}}
              className="flex items-center"
            >
              <FaFilter className="mr-2" />
              Filters
            </Button>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="mt-4 pt-4 border-t flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Featured Content */}
        {featuredContent.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaFire className="mr-3 text-orange-500" />
              Featured Content
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredContent.map(item => (
                <ContentCard
                  key={item.id}
                  content={item}
                  variant="featured"
                />
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div id="content-grid">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Cultural Content
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaFilter />
              <span>{filteredContent.length} items found</span>
            </div>
          </div>

          {false ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularContent.map(item => (
                <ContentCard
                  key={item.id}
                  content={item}
                  variant="default"
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Contribute to Ethiopian Cultural Heritage</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Help us preserve and share Ethiopia's rich cultural heritage. Submit your own articles, 
            photos, and stories to be featured in our cultural hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate('/cultural/editor')}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              📝 Create Article
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              🤝 Become a Contributor
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CultureHubPage