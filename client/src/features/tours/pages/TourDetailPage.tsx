import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '@api/axios.config'
import { Loader } from '@components/common/Loader/Loader'
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaCalendar, FaCheck, FaTimes } from 'react-icons/fa'

interface Tour {
  id: string
  title: string
  description: string
  images: string[]
  price: number
  duration: number
  maxGroupSize: number
  difficulty: string
  category: string
  startLocation: any
  locations: any[]
  included: string[]
  excluded: string[]
  itinerary: any[]
  tags: string[]
  featured: boolean
  rating?: number
  reviews?: number
}

export const TourDetailPage = () => {
  const { tourId } = useParams<{ tourId: string }>()
  const navigate = useNavigate()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) {
        navigate('/tours')
        return
      }

      try {
        setLoading(true)
        const response = await api.get(`/api/tours/${tourId}`)
        
        if (response.data?.success && response.data?.data?.tour) {
          const tourData = response.data.data.tour
          
          const parsedTour = {
            ...tourData,
            images: tourData.images ? JSON.parse(tourData.images) : [],
            startLocation: tourData.startLocation ? JSON.parse(tourData.startLocation) : {},
            locations: tourData.locations ? JSON.parse(tourData.locations) : [],
            included: tourData.included ? JSON.parse(tourData.included) : [],
            excluded: tourData.excluded ? JSON.parse(tourData.excluded) : [],
            itinerary: tourData.itinerary ? JSON.parse(tourData.itinerary) : [],
            tags: tourData.tags ? JSON.parse(tourData.tags) : [],
            rating: 4.5,
            reviews: 0
          }
          
          setTour(parsedTour)
        } else {
          navigate('/tours')
        }
      } catch (err) {
        console.error('Error fetching tour:', err)
        navigate('/tours')
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [tourId, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!tour) {
    return null
  }

  const mainImage = tour.images[selectedImage] || tour.images[0] || 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800'
  const location = tour.startLocation?.description || tour.category

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={mainImage}
          alt={tour.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{tour.title}</h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span>{tour.rating}</span>
                <span className="text-gray-300">({tour.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt />
                <span>{location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {tour.images.length > 1 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {tour.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-orange-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${tour.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <FaClock className="text-orange-600 text-2xl mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold">{tour.duration} days</div>
                </div>
                <div className="text-center">
                  <FaUsers className="text-orange-600 text-2xl mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Max Group</div>
                  <div className="font-semibold">{tour.maxGroupSize} people</div>
                </div>
                <div className="text-center">
                  <FaMapMarkerAlt className="text-orange-600 text-2xl mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Difficulty</div>
                  <div className="font-semibold capitalize">{tour.difficulty}</div>
                </div>
                <div className="text-center">
                  <FaCalendar className="text-orange-600 text-2xl mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Category</div>
                  <div className="font-semibold capitalize">{tour.category}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </div>

            {/* Included/Excluded */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {tour.included.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <FaCheck className="text-green-600" />
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {tour.included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excluded.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <FaTimes className="text-red-600" />
                      What's Not Included
                    </h3>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <FaTimes className="text-red-600 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Itinerary */}
            {tour.itinerary.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((day: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-orange-600 pl-4">
                      <h3 className="font-semibold text-lg">Day {day.day}: {day.title}</h3>
                      <p className="text-gray-700 mt-1">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-600">From</div>
                <div className="text-4xl font-bold text-orange-600">${tour.price}</div>
                <div className="text-sm text-gray-600">per person</div>
              </div>

              <Link
                to={`/booking/${tour.id}`}
                className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-3 rounded-lg font-semibold transition-colors mb-4"
              >
                Book Now
              </Link>

              <div className="text-center text-sm text-gray-600 mb-4">
                Free cancellation up to 24 hours before
              </div>

              {tour.tags.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tour.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetailPage
