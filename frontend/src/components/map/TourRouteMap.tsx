import { Tour } from '@/types/tour'
import { MapView } from './MapView'
import { RouteTimeline } from './RouteOverlay'
import { useMap, calculateRouteDistance, formatDistance } from '@/hooks/useMap'
import { useEffect } from 'react'

export interface TourRouteMapProps {
  tour: Tour
  className?: string
}

export const TourRouteMap = ({ tour, className = '' }: TourRouteMapProps) => {
  const { mapState, fitBounds } = useMap()

  // Extract route from itinerary
  const routeCoordinates = tour.itinerary.map((_day, index) => ({
    lat: 9.0320 + index * 0.5, // Simplified - would come from actual data
    lng: 38.7469 + index * 0.3,
  }))

  const markers = tour.itinerary.map((day, index) => ({
    id: `day-${day.day}`,
    lat: routeCoordinates[index].lat,
    lng: routeCoordinates[index].lng,
    title: `Day ${day.day}: ${day.title}`,
    description: day.description,
  }))

  const routes = [
    {
      id: 'main-route',
      coordinates: routeCoordinates,
      color: '#F97316',
    },
  ]

  // Calculate total distance
  const totalDistance = calculateRouteDistance(routeCoordinates)

  // Fit map to show entire route
  useEffect(() => {
    if (markers.length > 0) {
      fitBounds(markers)
    }
  }, [markers.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Map */}
      <div className="relative">
        <MapView
          center={mapState.center}
          zoom={mapState.zoom}
          markers={markers}
          routes={routes}
          className="h-96 md:h-[500px]"
        />

        {/* Route Info Overlay */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tour Route</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span>{formatDistance(totalDistance)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{tour.durationDays} days</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              <span>{tour.itinerary.length} stops</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Timeline */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Day-by-Day Itinerary
        </h3>
        <RouteTimeline
          waypoints={tour.itinerary.map((day) => ({
            id: `day-${day.day}`,
            title: `Day ${day.day}: ${day.title}`,
            description: day.description,
            time: day.accommodation ? `Stay: ${day.accommodation}` : undefined,
          }))}
          color="#F97316"
        />
      </div>

      {/* Stops List */}
      <div className="grid md:grid-cols-2 gap-4">
        {tour.itinerary.map((day) => (
          <div
            key={day.day}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                {day.day}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {day.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {day.description}
                </p>

                {/* Activities */}
                {day.activities && day.activities.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Activities:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {day.activities.slice(0, 3).map((activity, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                      {day.activities.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          +{day.activities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Meals */}
                {day.meals && day.meals.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Meals:</span> {day.meals.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
