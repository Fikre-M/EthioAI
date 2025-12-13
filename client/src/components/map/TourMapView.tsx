import { useState, useEffect } from 'react'
import { Tour } from '@/types/tour'
import { MapView } from './MapView'
import { useMap, calculateDistance } from '@/hooks/useMap'

export interface TourMapViewProps {
  tours: Tour[]
  selectedTourId?: string
  onTourSelect?: (tourId: string) => void
  showUserLocation?: boolean
  className?: string
}

export const TourMapView = ({
  tours,
  selectedTourId,
  onTourSelect,
  showUserLocation = true,
  className = '',
}: TourMapViewProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const { mapState, fitBounds, addMarker } = useMap()

  // Get user's current location
  useEffect(() => {
    if (showUserLocation && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          addMarker({
            id: 'user-location',
            ...location,
            title: 'Your Location',
            description: 'You are here',
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [showUserLocation, addMarker])

  // Create markers from tours with clustering
  const tourMarkers = tours.map((tour) => {
    // Extract coordinates from tour location or meeting point
    const coordinates = tour.meetingPoint?.coordinates || {
      // Default coordinates based on region (simplified)
      lat: 9.0320 + Math.random() * 0.1,
      lng: 38.7469 + Math.random() * 0.1,
    }

    return {
      id: tour.id,
      lat: coordinates.lat,
      lng: coordinates.lng,
      title: tour.title,
      description: `${tour.duration} • ${tour.currency} ${tour.price.toLocaleString()}`,
    }
  })

  type ClusterMarker = {
    id: string
    lat: number
    lng: number
    title: string
    description: string
    count: number
    tourIds: string[]
  }

  // Simple clustering algorithm
  const clusterMarkers = (markers: typeof tourMarkers, zoomLevel: number): ClusterMarker[] => {
    if (zoomLevel >= 12) {
      return markers.map(m => ({
        ...m,
        count: 1,
        tourIds: [m.id]
      }))
    }

    const clusters: ClusterMarker[] = []

    const clusterRadius = 0.1 / Math.pow(2, zoomLevel - 8) // Adjust radius based on zoom

    markers.forEach((marker) => {
      let addedToCluster = false

      for (const cluster of clusters) {
        const distance = calculateDistance(
          { lat: cluster.lat, lng: cluster.lng },
          { lat: marker.lat, lng: marker.lng }
        )

        if (distance < clusterRadius) {
          cluster.count++
          cluster.tourIds.push(marker.id)
          cluster.lat = (cluster.lat * (cluster.count - 1) + marker.lat) / cluster.count
          cluster.lng = (cluster.lng * (cluster.count - 1) + marker.lng) / cluster.count
          addedToCluster = true
          break
        }
      }

      if (!addedToCluster) {
        clusters.push({
          id: `cluster-${marker.id}`,
          lat: marker.lat,
          lng: marker.lng,
          title: marker.title,
          description: marker.description,
          count: 1,
          tourIds: [marker.id],
        })
      }
    })

    return clusters
  }

  const clusteredMarkers = clusterMarkers(tourMarkers, mapState.zoom)

  // Fit map to show all tours
  useEffect(() => {
    if (tours.length > 0) {
      fitBounds(tourMarkers)
    }
  }, [tours.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle marker click
  const handleMarkerClick = (markerId: string) => {
    const cluster = clusteredMarkers.find((c) => c.id === markerId)
    
    if (cluster && cluster.count > 1) {
      // Show cluster popup
      setSelectedCluster(markerId)
    } else {
      // Show single tour
      const tourId = cluster ? cluster.tourIds[0] : markerId
      onTourSelect?.(tourId)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <MapView
        center={mapState.center}
        zoom={mapState.zoom}
        markers={[
          ...clusteredMarkers.map((cluster) => ({
            id: cluster.id,
            lat: cluster.lat,
            lng: cluster.lng,
            title: cluster.count > 1 ? `${cluster.count} tours` : cluster.title,
            description: cluster.count > 1 ? 'Click to see tours' : cluster.description,
          })),
          ...(userLocation
            ? [
                {
                  id: 'user-location',
                  ...userLocation,
                  title: 'Your Location',
                  description: 'You are here',
                },
              ]
            : []),
        ]}
        onMarkerClick={handleMarkerClick}
        className="h-full"
      />

      {/* Cluster Popup */}
      {selectedCluster && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 z-20 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tours in this area
            </h3>
            <button
              onClick={() => setSelectedCluster(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {(() => {
              const cluster = clusteredMarkers.find((c) => c.id === selectedCluster)
              if (!cluster) return null
              return cluster.tourIds.map((tourId) => {
                const tour = tours.find((t) => t.id === tourId)
                if (!tour) return null

                return (
                  <button
                    key={tourId}
                    onClick={() => {
                      onTourSelect?.(tourId)
                      setSelectedCluster(null)
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <img
                      src={tour.imageUrl}
                      alt={tour.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                        {tour.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {tour.rating}
                        </span>
                        <span>•</span>
                        <span>{tour.duration}</span>
                      </div>
                      <p className="text-sm font-semibold text-orange-600">
                        {tour.currency} {tour.price.toLocaleString()}
                      </p>
                    </div>
                  </button>
                )
              })
            })()}
          </div>
        </div>
      )}

      {/* Selected Tour Popup */}
      {selectedTourId && !selectedCluster && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-20">
          {(() => {
            const tour = tours.find((t) => t.id === selectedTourId)
            if (!tour) return null

            return (
              <>
                <div className="relative h-48">
                  <img
                    src={tour.imageUrl}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onTourSelect?.('')}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {tour.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">{tour.rating}</span>
                      <span>({tour.reviewCount})</span>
                    </span>
                    <span>•</span>
                    <span>{tour.duration}</span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {tour.shortDescription}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {tour.currency} {tour.price.toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={`/tours/${tour.id}`}
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Tour Location</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Your Location</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              3
            </div>
            <span className="text-gray-700 dark:text-gray-300">Multiple Tours</span>
          </div>
        </div>
      </div>
    </div>
  )
}
