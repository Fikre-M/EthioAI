import { useState, useCallback } from 'react'

export interface MapState {
  center: { lat: number; lng: number }
  zoom: number
  markers: Array<{
    id: string
    lat: number
    lng: number
    title?: string
    description?: string
  }>
  routes: Array<{
    id: string
    coordinates: Array<{ lat: number; lng: number }>
    color?: string
  }>
}

export const useMap = (initialState?: Partial<MapState>) => {
  const [mapState, setMapState] = useState<MapState>({
    center: initialState?.center || { lat: 9.0320, lng: 38.7469 }, // Addis Ababa
    zoom: initialState?.zoom || 12,
    markers: initialState?.markers || [],
    routes: initialState?.routes || [],
  })

  const setCenter = useCallback((center: { lat: number; lng: number }) => {
    setMapState((prev) => ({ ...prev, center }))
  }, [])

  const setZoom = useCallback((zoom: number) => {
    setMapState((prev) => ({ ...prev, zoom }))
  }, [])

  const addMarker = useCallback(
    (marker: MapState['markers'][0]) => {
      setMapState((prev) => ({
        ...prev,
        markers: [...prev.markers, marker],
      }))
    },
    []
  )

  const removeMarker = useCallback((markerId: string) => {
    setMapState((prev) => ({
      ...prev,
      markers: prev.markers.filter((m) => m.id !== markerId),
    }))
  }, [])

  const clearMarkers = useCallback(() => {
    setMapState((prev) => ({ ...prev, markers: [] }))
  }, [])

  const addRoute = useCallback(
    (route: MapState['routes'][0]) => {
      setMapState((prev) => ({
        ...prev,
        routes: [...prev.routes, route],
      }))
    },
    []
  )

  const removeRoute = useCallback((routeId: string) => {
    setMapState((prev) => ({
      ...prev,
      routes: prev.routes.filter((r) => r.id !== routeId),
    }))
  }, [])

  const clearRoutes = useCallback(() => {
    setMapState((prev) => ({ ...prev, routes: [] }))
  }, [])

  const fitBounds = useCallback((markers: MapState['markers']) => {
    if (markers.length === 0) return

    // Calculate bounds
    const lats = markers.map((m) => m.lat)
    const lngs = markers.map((m) => m.lng)

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    // Calculate center
    const centerLat = (minLat + maxLat) / 2
    const centerLng = (minLng + maxLng) / 2

    // Calculate zoom (simplified)
    const latDiff = maxLat - minLat
    const lngDiff = maxLng - minLng
    const maxDiff = Math.max(latDiff, lngDiff)

    let zoom = 12
    if (maxDiff > 10) zoom = 6
    else if (maxDiff > 5) zoom = 8
    else if (maxDiff > 2) zoom = 10
    else if (maxDiff > 1) zoom = 11
    else if (maxDiff > 0.5) zoom = 12
    else zoom = 14

    setMapState((prev) => ({
      ...prev,
      center: { lat: centerLat, lng: centerLng },
      zoom,
    }))
  }, [])

  const reset = useCallback(() => {
    setMapState({
      center: initialState?.center || { lat: 9.0320, lng: 38.7469 },
      zoom: initialState?.zoom || 12,
      markers: initialState?.markers || [],
      routes: initialState?.routes || [],
    })
  }, [initialState])

  return {
    mapState,
    setCenter,
    setZoom,
    addMarker,
    removeMarker,
    clearMarkers,
    addRoute,
    removeRoute,
    clearRoutes,
    fitBounds,
    reset,
  }
}

// Helper function to calculate distance between two points (Haversine formula)
export const calculateDistance = (
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Helper function to format distance
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`
  }
  return `${distanceInKm.toFixed(1)} km`
}

// Helper function to calculate route distance
export const calculateRouteDistance = (
  coordinates: Array<{ lat: number; lng: number }>
): number => {
  let totalDistance = 0
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += calculateDistance(coordinates[i], coordinates[i + 1])
  }
  return totalDistance
}
