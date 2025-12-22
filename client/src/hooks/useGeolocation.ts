import { useState, useEffect, useCallback } from 'react'

export interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

export interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watch?: boolean
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  })

  const [watchId, setWatchId] = useState<number | null>(null)

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      error: null,
      loading: false,
    })
  }, [])

  const onError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Unable to retrieve location'

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied'
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable'
        break
      case error.TIMEOUT:
        errorMessage = 'Location request timed out'
        break
    }

    setState({
      latitude: null,
      longitude: null,
      accuracy: null,
      error: errorMessage,
      loading: false,
    })
  }, [])

  const getLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const positionOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    }

    if (watch) {
      const id = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        positionOptions
      )
      setWatchId(id)
    } else {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        positionOptions
      )
    }
  }, [enableHighAccuracy, timeout, maximumAge, watch, onSuccess, onError])

  const clearWatch = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }, [watchId])

  useEffect(() => {
    getLocation()

    return () => {
      clearWatch()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    getLocation,
    clearWatch,
    isAvailable: 'geolocation' in navigator,
  }
}

// Helper function to calculate distance from user to a point
export const calculateDistanceFromUser = (
  userLat: number | null,
  userLng: number | null,
  targetLat: number,
  targetLng: number
): number | null => {
  if (userLat === null || userLng === null) return null

  const R = 6371 // Earth's radius in kilometers
  const dLat = ((targetLat - userLat) * Math.PI) / 180
  const dLng = ((targetLng - userLng) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((targetLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Helper function to format distance from user
export const formatDistanceFromUser = (distanceInKm: number | null): string => {
  if (distanceInKm === null) return 'Distance unknown'
  
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m away`
  }
  if (distanceInKm < 10) {
    return `${distanceInKm.toFixed(1)} km away`
  }
  return `${Math.round(distanceInKm)} km away`
}
