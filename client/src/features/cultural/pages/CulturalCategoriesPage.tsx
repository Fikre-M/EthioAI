import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaArrowLeft, FaCalendarAlt, FaTshirt, FaMusic, FaGlobe,
  FaClock, FaUsers, FaHeart, FaEye, FaStar, FaFilter
} from 'react-icons/fa'
import {
  HistoricalTimeline,
  TraditionalClothingShowcase,
  MusicDanceVideos,
  FestivalCalendar,
  RegionalTraditions
} from '../components'

const CulturalCategoriesPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<string>('timeline')

  const categories = [
    {
      id: 'timeline',
      name: 'Historical Timeline',
      icon: FaClock,
      color: 'from-blue-500 to-indigo-600',
      description: 'Explore 3,000 years of Ethiopian history',
      component: HistoricalTimeline
    },
    {
      id: 'clothing',
      name: 'Traditional Clothing',
      icon: FaTshirt,
      color: 'from-purple-500 to-pink-600',
      description: 'Discover regional clothing and textiles',
      component: TraditionalClothingShowcase
    },
    {
      id: 'music',
      name: 'Music & Dance',
      icon: FaMusic,
      color: 'from-red-500 to-orange-600',
      description: 'Experience traditional performances',
      component: MusicDanceVideos
    },
    {
      id: 'festivals',
      name: 'Festival Calendar',
      icon: FaCalendarAlt,
      color: 'from-green-500 to-teal-600',
      description: 'Celebrate Ethiopian festivals year-round',
      component: FestivalCalendar
    },
    {
      id: 'traditions',
      name: 'Regional Traditions',
      icon: FaGlobe,
      color: 'from-indigo-500 to-purple-600',
      description: 'Learn about diverse cultural practices',
      component: RegionalTraditions
    }
  ]

  const activeComponent = categories.find(cat => cat.id === activeCategory)?.component

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/cultural')}
              className="border-white text-white hover:bg-white hover:text-blue-900"
            >
              <FaArrowLeft className="mr-2" />
              Back to Culture Hub
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900"
              >
                <FaHeart className="mr-2" />
                Favorites
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900"
              >
                <FaFilter className="mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ethiopian Cultural Categories
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Dive deep into the rich tapestry of Ethiopian culture through our comprehensive 
              collection of historical timelines, traditional clothing, music, festivals, and regional practices.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-400">3000+</div>
                <div className="text-sm text-gray-300">Years of History</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">80+</div>
                <div className="text-sm text-gray-300">Ethnic Groups</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">200+</div>
                <div className="text-sm text-gray-300">Traditions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">50+</div>
                <div className="text-sm text-gray-300">Festivals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">100+</div>
                <div className="text-sm text-gray-300">Music Styles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map(category => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <IconComponent className="text-white text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Category Content */}
        <div className="mb-8">
          {activeComponent && React.createElement(activeComponent, { className: 'w-full' })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cultural Heritage Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FaClock className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Historical Events</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FaTshirt className="text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">30+</div>
              <div className="text-sm text-gray-600">Clothing Styles</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FaMusic className="text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">100+</div>
              <div className="text-sm text-gray-600">Music & Dance Videos</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FaCalendarAlt className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">25+</div>
              <div className="text-sm text-gray-600">Annual Festivals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CulturalCategoriesPage