import { useEffect, useRef, useState } from 'react'

export interface MapViewProps {
  center: {
    lat: number
    lng: number
  }
  zoom?: number
  markers?: Array<{
    id: string
    lat: number
    lng: number
    title?: string
    description?: string
  }>
  routes?: Array<{
    id: string
    coordinates: Array<{ lat: number; lng: number }>
    color?: string
  }>
  className?: string
  interactive?: boolean
  onMarkerClick?: (markerId: string) => void
}

export const MapView = ({
  center,
  zoom = 12,
  markers = [],
  routes = [],
  className = '',
  interactive = true,
  onMarkerClick,
}: MapViewProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Initialize Mapbox GL JS
    // This is a placeholder implementation
    // Real implementation will use mapbox-gl library
    
    const initializeMap = async () => {
      try {
        // Check if Mapbox token is configured
        const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
        
        if (!token) {
          setError('Mapbox access token not configured')
          return
        }

        // Simulate map loading
        await new Promise((resolve) => setTimeout(resolve, 500))
        setMapLoaded(true)
        
        // In real implementation:
        // const mapboxgl = await import('mapbox-gl')
        // mapboxgl.accessToken = token
        // const map = new mapboxgl.Map({
        //   container: mapContainerRef.current!,
        //   style: 'mapbox://styles/mapbox/streets-v12',
        //   center: [center.lng, center.lat],
        //   zoom: zoom,
        //   interactive: interactive
        // })
        
        // Add markers
        // markers.forEach(marker => {
        //   new mapboxgl.Marker()
        //     .setLngLat([marker.lng, marker.lat])
        //     .setPopup(new mapboxgl.Popup().setHTML(`<h3>${marker.title}</h3>`))
        //     .addTo(map)
        // })
        
        // Add routes
        // routes.forEach(route => {
        //   map.addLayer({
        //     id: route.id,
        //     type: 'line',
        //     source: {
        //       type: 'geojson',
        //       data: {
        //         type: 'Feature',
        //         geometry: {
        //           type: 'LineString',
        //           coordinates: route.coordinates.map(c => [c.lng, c.lat])
        //         }
        //       }
        //     },
        //     paint: {
        //       'line-color': route.color || '#F97316',
        //       'line-width': 3
        //     }
        //   })
        // })
        
      } catch (err) {
        setError('Failed to load map')
        console.error('Map initialization error:', err)
      }
    }

    initializeMap()

    return () => {
      // Cleanup map instance
    }
  }, [center, zoom, markers, routes, interactive])

  if (error) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Please configure Mapbox access token in .env file
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full rounded-lg overflow-hidden">
        {/* Placeholder Map View */}
        {!mapLoaded && (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
            </div>
          </div>
        )}
        
        {mapLoaded && (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 relative">
            {/* Placeholder map with center marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-orange-600 mx-auto mb-2"
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                </p>
                {markers.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{markers.length} markers</p>
                )}
              </div>
            </div>

            {/* Marker indicators */}
            {markers.map((marker, index) => (
              <button
                key={marker.id}
                onClick={() => onMarkerClick?.(marker.id)}
                className="absolute w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:bg-orange-700 transition-colors"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`,
                }}
                title={marker.title}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Controls */}
      {interactive && mapLoaded && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Reset view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
        © Mapbox
      </div>
    </div>
  )
}
