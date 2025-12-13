import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCalendar, FaMapMarkerAlt, FaClock, FaEye, FaHeart, FaShare } from 'react-icons/fa'

export interface CulturalContent {
  id: string
  title: string
  description: string
  image: string
  type: 'article' | 'museum' | 'tradition' | 'festival' | 'heritage'
  category: string
  location?: string
  date?: string
  duration?: string
  views: number
  likes: number
  featured: boolean
  author?: string
  publishedAt: string
}

interface ContentCardProps {
  content: CulturalContent
  variant?: 'default' | 'featured' | 'compact'
  showActions?: boolean
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  variant = 'default',
  showActions = true
}) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    if (content.type === 'museum') {
      navigate(`/cultural/museum/${content.id}`)
    } else {
      navigate(`/cultural/article/${content.id}`)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement like functionality
    console.log('Liked:', content.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: window.location.origin + `/cultural/article/${content.id}`
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'museum': return '🏛️'
      case 'tradition': return '🎭'
      case 'festival': return '🎉'
      case 'heritage': return '🏺'
      default: return '📖'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'museum': return 'bg-purple-100 text-purple-800'
      case 'tradition': return 'bg-green-100 text-green-800'
      case 'festival': return 'bg-orange-100 text-orange-800'
      case 'heritage': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={handleCardClick}
        className="flex items-center space-x-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{getTypeIcon(content.type)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{content.title}</h3>
          <p className="text-sm text-gray-600 truncate">{content.description}</p>
          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
            <span className="flex items-center">
              <FaEye className="mr-1" />
              {content.views.toLocaleString()}
            </span>
            <span className="flex items-center">
              <FaHeart className="mr-1" />
              {content.likes.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div
        onClick={handleCardClick}
        className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
      >
        {/* Featured Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </span>
        </div>

        {/* Image */}
        <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
          <span className="text-6xl">{getTypeIcon(content.type)}</span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(content.type)}`}>
              {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
            </span>
            <span className="text-sm text-gray-500">{content.category}</span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
            {content.title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {content.description}
          </p>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            {content.location && (
              <div className="flex items-center text-sm text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                <span>{content.location}</span>
              </div>
            )}
            {content.date && (
              <div className="flex items-center text-sm text-gray-600">
                <FaCalendar className="mr-2 text-blue-500" />
                <span>{new Date(content.date).toLocaleDateString()}</span>
              </div>
            )}
            {content.duration && (
              <div className="flex items-center text-sm text-gray-600">
                <FaClock className="mr-2 text-green-500" />
                <span>{content.duration}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <FaEye className="mr-1" />
                  {content.views.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <FaHeart className="mr-1" />
                  {content.likes.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaHeart />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <FaShare />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
        <span className="text-4xl">{getTypeIcon(content.type)}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(content.type)}`}>
            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
          </span>
          <span className="text-xs text-gray-500">{content.category}</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {content.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {content.description}
        </p>

        {/* Metadata */}
        {(content.location || content.date) && (
          <div className="space-y-1 mb-3">
            {content.location && (
              <div className="flex items-center text-xs text-gray-600">
                <FaMapMarkerAlt className="mr-1 text-red-500" />
                <span>{content.location}</span>
              </div>
            )}
            {content.date && (
              <div className="flex items-center text-xs text-gray-600">
                <FaCalendar className="mr-1 text-blue-500" />
                <span>{new Date(content.date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-3 text-xs text-gray-600">
              <span className="flex items-center">
                <FaEye className="mr-1" />
                {content.views.toLocaleString()}
              </span>
              <span className="flex items-center">
                <FaHeart className="mr-1" />
                {content.likes.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleLike}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaHeart size={12} />
              </button>
              <button
                onClick={handleShare}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaShare size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentCard