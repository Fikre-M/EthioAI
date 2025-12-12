import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tour } from '@/types/tour'
import { TourQuickViewModal } from './TourQuickViewModal'

export interface EnhancedTourCardProps {
  tour: Tour
  onWishlistToggle?: (tourId: string) => void
  isInWishlist?: boolean
}

export const EnhancedTourCard = ({ 
  tour, 
  onWishlistToggle,
  isInWishlist = false 
}: EnhancedTourCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist)

  const images = tour.images.length > 0 ? tour.images : [tour.imageUrl]

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    onWishlistToggle?.(tour.id)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'moderate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'challenging': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
      case 'extreme': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <>
      <div className="group relative">
        <Link to={`/tours/${tour.id}`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Image Carousel */}
            <div className="relative h-48 overflow-hidden">
              {/* Current Image */}
              <img
                src={images[currentImageIndex]}
                alt={tour.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-4'
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Featured Badge */}
              {tour.featured && (
                <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Featured
                </div>
              )}

              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{tour.rating}</span>
                <span className="text-xs text-gray-500">({tour.reviewCount})</span>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className="absolute bottom-3 right-3 w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg
                  className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'}`}
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Category & Duration */}
              <div className="flex items-center gap-3 mb-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded text-xs font-medium capitalize">
                  {tour.category}
                </span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{tour.duration}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {tour.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {tour.shortDescription}
              </p>

              {/* Quick Info */}
              <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{tour.location}</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getDifficultyColor(tour.difficulty)}`}>
                  {tour.difficulty}
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1 mb-3">
                {tour.highlights.slice(0, 2).map((highlight, index) => (
                  <span key={index} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {highlight}
                  </span>
                ))}
                {tour.highlights.length > 2 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{tour.highlights.length - 2} more
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {tour.currency} {tour.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleQuickView}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Quick View
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      <TourQuickViewModal
        tour={tour}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  )
}
