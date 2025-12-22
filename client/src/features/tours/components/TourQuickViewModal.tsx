import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Tour } from '@/types/tour'

export interface TourQuickViewModalProps {
  tour: Tour
  isOpen: boolean
  onClose: () => void
}

export const TourQuickViewModal = ({ tour, isOpen, onClose }: TourQuickViewModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const images = tour.images.length > 0 ? tour.images : [tour.imageUrl]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div className="p-6">
            {/* Main Image */}
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-4">
              <img
                src={images[selectedImage]}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              {tour.featured && (
                <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-16 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-orange-600' : ''
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="p-6 space-y-4">
            {/* Title & Rating */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {tour.title}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{tour.rating}</span>
                  <span className="text-gray-500">({tour.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">From</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {tour.currency} {tour.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">per person</p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                <p className="font-semibold text-gray-900 dark:text-white">{tour.duration}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Difficulty</p>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">{tour.difficulty}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Group Size</p>
                <p className="font-semibold text-gray-900 dark:text-white">Max {tour.maxGroupSize}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Min Age</p>
                <p className="font-semibold text-gray-900 dark:text-white">{tour.minAge}+ years</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {tour.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Highlights</h3>
              <ul className="space-y-1">
                {tour.highlights.slice(0, 4).map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{tour.location}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-4">
              <Link
                to={`/tours/${tour.id}`}
                className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-center transition-colors"
                onClick={onClose}
              >
                View Full Details
              </Link>
              <button className="px-6 py-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg font-semibold transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
