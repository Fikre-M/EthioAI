import { useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BookingForm from '../components/BookingForm'
import { Loader } from '@components/common/Loader/Loader'

// Mock tour data - replace with actual API call
const mockTour = {
  id: '1',
  title: 'Historic Lalibela Rock Churches',
  image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800',
  price: 150,
  location: 'Lalibela, Ethiopia',
  duration: '8 hours',
  rating: 4.9,
  reviews: 234,
  description: 'Explore the magnificent rock-hewn churches of Lalibela',
  category: 'Cultural',
  difficulty: 'Moderate',
}

export default function BookingPage() {
  const { tourId } = useParams<{ tourId: string }>()
  const { t } = useTranslation()

  // TODO: Replace with actual API call
  const tour = mockTour
  const loading = false
  const error = null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error || !tour) {
    return <Navigate to="/tours" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tour Preview */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {tour.title}
                </h1>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Location:</span>
                    {tour.location}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Duration:</span>
                    {tour.duration}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Difficulty:</span>
                    {tour.difficulty}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Rating:</span>
                    ⭐ {tour.rating} ({tour.reviews} reviews)
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{tour.description}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <BookingForm tour={tour} />
          </div>
        </div>
      </div>
    </div>
  )
}
