import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ContentCard, { CulturalContent } from '../components/ContentCard'
import { Button } from '@components/common/Button/Button'
import { FaSearch, FaFilter, FaMap, FaCalendar, FaFire, FaGlobe } from 'react-icons/fa'

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
    category: 'Museums & Galleries',
    location: 'Addis Ababa University',
    duration: '30 minutes',
    views: 5420,
    likes: 267,
    featured: false,
    author: 'University Museum Team',
    publishedAt: '2024-11-25T13:10:00Z'
  }
]

const CultureHubPage: React.FC = () => {
  const navigate = useNavigate()
  const [content, setContent] = useState<CulturalContent[]>(mockCulturalContent)
  const [filteredContent, setFilteredContent] = useState<CulturalContent[]>(mockCulturalContent)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    filterContent()
  }, [searchTerm, selectedType, selectedCategory, content])

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

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredContent(filtered)
  }

  const featuredContent = filteredContent.filter(item => item.featured)
  const regularContent = filteredContent.filter(item => !item.featured)

  const contentTypes = [
    { key: 'all', label: 'All Content', icon: FaGlobe },
    { key: 'heritage', label: 'Heritage Sites', icon: FaMap },
    { key: 'museum', label: 'Virtual Museums', icon: FaCalendar },
    { key: 'festival', label: 'Festivals', icon: FaFire },
    { key: 'tradition', label: 'Traditions', icon: FaGlobe }
  ]

  const categories = [
    'all',
    ...Array.from(new Set(content.map(item => item.category)))
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ethiopian Cultural Heritage
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Explore the rich tapestry of Ethiopian culture, from ancient heritage sites 
              to vibrant festivals and timeless traditions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => navigate('/cultural/museum')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                🏛️ Virtual Museums
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('content-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                📚 Explore Articles
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cultural content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {contentTypes.map(type => {
                const IconComponent = type.icon
                return (
                  <button
                    key={type.key}
                    onClick={() => setSelectedType(type.key)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedType === type.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="mr-2" size={14} />
                    {type.label}
                  </button>
                )
              })}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
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

          {loading ? (
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
                  setSelectedType('all')
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
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              📝 Submit Content
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