import { useState } from 'react'
import { Tour } from '@/types/tour'
import { MapView, TourRouteMap } from '@/components/map'
import { useGeolocation, formatDistanceFromUser, calculateDistanceFromUser } from '@/hooks/useGeolocation'

export interface Attraction {
  id: string
  name: string
  type: 'restaurant' | 'hotel' | 'attraction' | 'shopping' | 'transport'
  coordinates: { lat: number; lng: number }
  description: string
  rating?: number
  distance?: number
  imageUrl?: string
}

export interface TourDetailMapProps {
  tour: Tour
  className?: string
}

export const TourDetailMap = ({ tour, className = '' }: TourDetailMapProps) => {
  const [activeTab, setActiveTab] = useState<'meeting' | 'route' | 'attractions'>('meeting')
  const { latitude: userLat, longitude: userLng } = useGeolocation()

  // Mock nearby attractions (would come from API)
  const nearbyAttractions: Attraction[] = [
    {
      id: '1',
      name: 'Skylight Hotel',
      type: 'hotel',
      coordinates: { lat: 9.0330, lng: 38.7480 },
      description: '5-star luxury hotel with spa and restaurant',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
    {
      id: '2',
      name: 'Lucy Restaurant',
      type: 'restaurant',
      coordinates: { lat: 9.0310, lng: 38.7460 },
      description: 'Traditional Ethiopian cuisine',
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    },
    {
      id: '3',
      name: 'National Museum',
      type: 'attraction',
      coordinates: { lat: 9.0340, lng: 38.7490 },
      description: 'Home to Lucy fossil and Ethiopian artifacts',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
    },
    {
      id: '4',
      name: 'Merkato Market',
      type: 'shopping',
      coordinates: { lat: 9.0280, lng: 38.7420 },
      description: 'Largest open-air market in Africa',
      rating: 4.2,
      imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400',
    },
    {
      id: '5',
      name: 'Bole International Airport',
      type: 'transport',
      coordinates: { lat: 8.9806, lng: 38.7578 },
      description: 'Main international airport',
      rating: 4.0,
      imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
    },
  ]

  // Calculate distances from user location
  const attractionsWithDistance = nearbyAttractions.map((attraction) => ({
    ...attraction,
    distance: calculateDistanceFromUser(
      userLat,
      userLng,
      attraction.coordinates.lat,
      attraction.coordinates.lng
    ),
  }))

  // Sort by distance
  const sortedAttractions = attractionsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))

  const getAttractionIcon = (type: Attraction['type']) => {
    switch (type) {
      case 'hotel':
        return '🏨'
      case 'restaurant':
        return '🍽️'
      case 'attraction':
        return '🎯'
      case 'shopping':
        return '🛍️'
      case 'transport':
        return '✈️'
      default:
        return '📍'
    }
  }

  const getDirectionsUrl = (destination: { lat: number; lng: number }) => {
    if (userLat && userLng) {
      return `https://www.google.com/maps/dir/${userLat},${userLng}/${destination.lat},${destination.lng}`
    }
    return `https://www.google.com/maps?q=${destination.lat},${destination.lng}`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4 md:gap-8 overflow-x-auto">
          {[
            { id: 'meeting', label: 'Meeting Point', icon: '📍' },
            { id: 'route', label: 'Tour Route', icon: '🗺️' },
            { id: 'attractions', label: 'Nearby Places', icon: '🎯' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Meeting Point Tab */}
        {activeTab === 'meeting' && tour.meetingPoint && (
          <div className="space-y-6">
            <div className="relative">
              <MapView
                center={tour.meetingPoint.coordinates}
                zoom={15}
                markers={[
                  {
                    id: 'meeting-point',
                    lat: tour.meetingPoint.coordinates.lat,
                    lng: tour.meetingPoint.coordinates.lng,
                    title: tour.meetingPoint.name,
                    description: tour.meetingPoint.address,
                  },
                  ...(userLat && userLng
                    ? [
                        {
                          id: 'user-location',
                          lat: userLat,
                          lng: userLng,
                          title: 'Your Location',
                          description: 'You are here',
                        },
                      ]
                    : []),
                ]}
                className="h-80 md:h-96"
              />

              {/* Get Directions Button */}
              <div className="absolute bottom-4 right-4">
                <a
                  href={getDirectionsUrl(tour.meetingPoint.coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold shadow-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>

            {/* Meeting Point Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Meeting Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {tour.meetingPoint.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {tour.meetingPoint.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Meeting Time</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {tour.meetingPoint.meetingTime}
                        </p>
                      </div>
                    </div>

                    {userLat && userLng && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Distance</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDistanceFromUser(
                              calculateDistanceFromUser(
                                userLat,
                                userLng,
                                tour.meetingPoint.coordinates.lat,
                                tour.meetingPoint.coordinates.lng
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Instructions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {tour.meetingPoint.instructions}
                </p>

                {tour.meetingPoint.landmarks && tour.meetingPoint.landmarks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Nearby Landmarks
                    </h4>
                    <ul className="space-y-1">
                      {tour.meetingPoint.landmarks.map((landmark, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span className="text-orange-600 mt-0.5">•</span>
                          <span>{landmark}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tour Route Tab */}
        {activeTab === 'route' && (
          <div>
            <TourRouteMap tour={tour} />
          </div>
        )}

        {/* Nearby Attractions Tab */}
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            {/* Map with attractions */}
            <div className="relative">
              <MapView
                center={tour.meetingPoint?.coordinates || { lat: 9.0320, lng: 38.7469 }}
                zoom={13}
                markers={[
                  ...(tour.meetingPoint
                    ? [
                        {
                          id: 'meeting-point',
                          lat: tour.meetingPoint.coordinates.lat,
                          lng: tour.meetingPoint.coordinates.lng,
                          title: 'Meeting Point',
                          description: tour.meetingPoint.name,
                        },
                      ]
                    : []),
                  ...sortedAttractions.map((attraction) => ({
                    id: attraction.id,
                    lat: attraction.coordinates.lat,
                    lng: attraction.coordinates.lng,
                    title: attraction.name,
                    description: attraction.description,
                  })),
                  ...(userLat && userLng
                    ? [
                        {
                          id: 'user-location',
                          lat: userLat,
                          lng: userLng,
                          title: 'Your Location',
                          description: 'You are here',
                        },
                      ]
                    : []),
                ]}
                className="h-80 md:h-96"
              />
            </div>

            {/* Attractions List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Nearby Places ({sortedAttractions.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {sortedAttractions.map((attraction) => (
                  <div
                    key={attraction.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {attraction.imageUrl && (
                      <img
                        src={attraction.imageUrl}
                        alt={attraction.name}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getAttractionIcon(attraction.type)}</span>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {attraction.name}
                          </h4>
                        </div>
                        {attraction.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <svg
                              className="w-4 h-4 text-yellow-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium">{attraction.rating}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {attraction.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {attraction.distance !== null && (
                            <span>{formatDistanceFromUser(attraction.distance)}</span>
                          )}
                        </div>
                        <a
                          href={getDirectionsUrl(attraction.coordinates)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                          </svg>
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
