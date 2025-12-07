import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Tour } from '@/types/tour'
import { TourImageGallery } from '../components/TourImageGallery'
import { TourReviews } from '../components/TourReviews'
import { TourMeetingPoint } from '../components/TourMeetingPoint'

// Mock data - replace with API call
const mockTour: Tour = {
  id: '1',
  title: 'Historic Route: Lalibela, Gondar & Axum',
  description: 'Embark on an unforgettable journey through Northern Ethiopia\'s historic route. Visit the magnificent rock-hewn churches of Lalibela, explore the medieval castles of Gondar, and discover the ancient obelisks of Axum. This comprehensive tour offers a deep dive into Ethiopia\'s rich history and cultural heritage.',
  shortDescription: 'Visit rock-hewn churches, medieval castles, and ancient obelisks',
  imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200',
  images: [
    'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
  ],
  price: 5000,
  currency: 'ETB',
  duration: '7 days / 6 nights',
  durationDays: 7,
  location: 'Northern Ethiopia',
  region: 'Amhara',
  category: 'historical',
  difficulty: 'moderate',
  rating: 4.8,
  reviewCount: 124,
  maxGroupSize: 12,
  minAge: 12,
  highlights: [
    'Visit 11 rock-hewn churches of Lalibela',
    'Explore Gondar\'s medieval castles',
    'See the ancient obelisks of Axum',
    'Experience traditional Ethiopian coffee ceremony',
    'Meet local communities',
  ],
  included: [
    'Accommodation (hotels)',
    'All meals (breakfast, lunch, dinner)',
    'Professional English-speaking guide',
    'Ground transportation',
    'Entrance fees to all sites',
    'Bottled water',
  ],
  excluded: [
    'International flights',
    'Travel insurance',
    'Personal expenses',
    'Tips and gratuities',
    'Alcoholic beverages',
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Addis Ababa',
      description: 'Arrive at Bole International Airport. Transfer to hotel. City tour if time permits.',
      activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner'],
      meals: ['Dinner'],
      accommodation: 'Addis Ababa Hotel',
    },
    {
      day: 2,
      title: 'Fly to Lalibela',
      description: 'Morning flight to Lalibela. Visit the first group of rock-hewn churches.',
      activities: ['Flight to Lalibela', 'Visit churches', 'Local market'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Lalibela Hotel',
    },
    {
      day: 3,
      title: 'Lalibela Churches',
      description: 'Full day exploring the second group of churches and Bet Giyorgis.',
      activities: ['Church visits', 'Photography', 'Cultural experience'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Lalibela Hotel',
    },
  ],
  guide: {
    id: '1',
    name: 'Abebe Kebede',
    avatar: 'https://i.pravatar.cc/150?img=12',
    languages: ['English', 'Amharic', 'French'],
    rating: 4.9,
    toursGuided: 150,
  },
  availability: [
    {
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-07'),
      availableSpots: 8,
      price: 5000,
    },
    {
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-21'),
      availableSpots: 12,
      price: 5000,
    },
  ],
  tags: ['UNESCO', 'History', 'Culture', 'Photography'],
  featured: true,
  meetingPoint: {
    name: 'Bole International Airport',
    address: 'Bole Road, Addis Ababa, Ethiopia',
    coordinates: {
      lat: 8.9806,
      lng: 38.7578,
    },
    instructions: 'Meet at the main arrival hall, near the information desk. Look for our guide holding a sign with "EthioAI Tours" and your name.',
    contactPhone: '+251 11 123 4567',
    contactEmail: 'tours@ethioai.com',
    meetingTime: '8:00 AM (Please arrive 15 minutes early)',
    landmarks: [
      'Ethiopian Airlines Office',
      'Bole International Airport Terminal 2',
      'Skylight Hotel (5 minutes walk)',
    ],
  },
  reviews: [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      title: 'Absolutely Amazing Experience!',
      comment: 'This tour exceeded all my expectations. The rock-hewn churches of Lalibela are breathtaking, and our guide Abebe was incredibly knowledgeable. The accommodations were comfortable, and the food was delicious. Highly recommend!',
      date: new Date('2024-11-15'),
      helpful: 24,
      verified: true,
      images: [
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400',
        'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400',
      ],
    },
    {
      id: '2',
      userId: '2',
      userName: 'Michael Chen',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      title: 'A Journey Through Time',
      comment: 'The historic route tour was phenomenal. Visiting Axum, Gondar, and Lalibela in one trip was perfect. The itinerary was well-paced, and we had enough time at each site. Our guide was patient and answered all our questions.',
      date: new Date('2024-10-28'),
      helpful: 18,
      verified: true,
    },
    {
      id: '3',
      userId: '3',
      userName: 'Emma Williams',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      rating: 4,
      title: 'Great Tour with Minor Issues',
      comment: 'Overall a fantastic experience. The historical sites are incredible and well worth visiting. The only downside was some delays with domestic flights, but that\'s not really the tour operator\'s fault. Would still recommend!',
      date: new Date('2024-10-10'),
      helpful: 12,
      verified: true,
    },
    {
      id: '4',
      userId: '4',
      userName: 'David Martinez',
      userAvatar: 'https://i.pravatar.cc/150?img=7',
      rating: 5,
      title: 'Best Tour in Ethiopia',
      comment: 'I\'ve been on many tours around the world, and this ranks among the best. The combination of history, culture, and natural beauty is unmatched. Abebe was an excellent guide who made the experience even better.',
      date: new Date('2024-09-22'),
      helpful: 31,
      verified: true,
      images: [
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400',
      ],
    },
    {
      id: '5',
      userId: '5',
      userName: 'Lisa Anderson',
      userAvatar: 'https://i.pravatar.cc/150?img=9',
      rating: 5,
      title: 'Unforgettable Ethiopian Adventure',
      comment: 'This tour was the highlight of my trip to Africa. The rock-hewn churches are architectural marvels, and the castles of Gondar are stunning. Everything was well-organized, and the group size was perfect for getting to know fellow travelers.',
      date: new Date('2024-09-05'),
      helpful: 15,
      verified: true,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [tour] = useState<Tour>(mockTour)
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'included' | 'meeting' | 'reviews'>('overview')

  // Suppress unused variable warning
  console.log('Tour ID:', id)

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <li><Link to="/" className="hover:text-orange-600">Home</Link></li>
          <li>/</li>
          <li><Link to="/tours" className="hover:text-orange-600">Tours</Link></li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white">{tour.title}</li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tour Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <TourImageGallery images={tour.images} title={tour.title} featured={tour.featured} />

          {/* Title & Rating */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {tour.title}
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-gray-500">({tour.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{tour.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tour.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex gap-4 md:gap-8 overflow-x-auto">
              {(['overview', 'itinerary', 'included', 'meeting', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-orange-600 text-orange-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'meeting' ? 'Meeting Point' : tab}
                  {tab === 'reviews' && tour.reviews && ` (${tour.reviews.length})`}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="prose dark:prose-invert max-w-none">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">About This Tour</h3>
                  <p className="text-gray-600 dark:text-gray-400">{tour.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {tour.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-2">
                      Day {day.day}: {day.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{day.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Activities:</span>
                        <ul className="mt-1 space-y-1">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="text-gray-600 dark:text-gray-400">• {activity}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">Meals:</span>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{day.meals.join(', ')}</p>
                        {day.accommodation && (
                          <>
                            <span className="font-medium mt-2 block">Accommodation:</span>
                            <p className="text-gray-600 dark:text-gray-400">{day.accommodation}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'included' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-600">What's Included</h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-red-600">What's Not Included</h3>
                  <ul className="space-y-2">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'meeting' && tour.meetingPoint && (
              <TourMeetingPoint meetingPoint={tour.meetingPoint} />
            )}

            {activeTab === 'reviews' && tour.reviews && (
              <TourReviews
                reviews={tour.reviews}
                averageRating={tour.rating}
                totalReviews={tour.reviewCount}
              />
            )}
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
            {/* Price */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">From</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {tour.currency} {tour.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">per person</p>
            </div>

            {/* Quick Info */}
            <div className="space-y-3 py-4 border-y border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Duration</span>
                <span className="font-medium">{tour.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Group Size</span>
                <span className="font-medium">Max {tour.maxGroupSize} people</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Difficulty</span>
                <span className="font-medium capitalize">{tour.difficulty}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Min Age</span>
                <span className="font-medium">{tour.minAge}+ years</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors">
                Book Now
              </button>
              <button className="w-full px-6 py-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg font-semibold transition-colors">
                Contact Us
              </button>
            </div>

            {/* Guide Info */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3">Your Guide</h4>
              <div className="flex items-center gap-3">
                <img
                  src={tour.guide.avatar}
                  alt={tour.guide.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium">{tour.guide.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>⭐ {tour.guide.rating}</span>
                    <span>•</span>
                    <span>{tour.guide.toursGuided} tours</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Languages: {tour.guide.languages.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetailPage
