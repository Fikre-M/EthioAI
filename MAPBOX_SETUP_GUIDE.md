# 🗺️ Mapbox Integration Setup Guide

## Current Status

The map system is **fully functional with placeholder views** and ready for Mapbox GL JS integration!

---

## 📋 What's Already Done ✅

### Components Created
- ✅ **MapView.tsx** - Base map component with placeholder
- ✅ **TourRouteMap.tsx** - Route visualization
- ✅ **TourMapView.tsx** - Tour-specific maps
- ✅ **LocationMarker.tsx** - Custom markers
- ✅ **RouteOverlay.tsx** - Path overlays
- ✅ **TourDetailMap.tsx** - 3-tab map interface

### Hooks Created
- ✅ **useGeolocation.ts** - User location tracking
- ✅ **useMap.ts** - Map state management

### Configuration
- ✅ **.env** file with Mapbox token placeholder
- ✅ Map components integrated in pages
- ✅ Error handling for missing token
- ✅ Loading states
- ✅ Placeholder views

---

## 🚀 Steps to Enable Real Maps

### Step 1: Get Mapbox Access Token

1. Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Sign up or log in
3. Navigate to **Access Tokens**
4. Click **Create a token** or use the default public token
5. Copy your access token

### Step 2: Add Token to .env File

Open `frontend/.env` and replace the placeholder:

```env
# Before
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here

# After (example)
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNscXh5ejEyMzB4eHoycW1...
```

### Step 3: Install Mapbox GL JS

Run this command in the `frontend` directory:

```bash
npm install mapbox-gl
```

Or with yarn:

```bash
yarn add mapbox-gl
```

### Step 4: Install Mapbox GL CSS

The CSS is automatically included with the package, but you need to import it.

Add this to `frontend/src/main.tsx` or `frontend/src/App.tsx`:

```typescript
import 'mapbox-gl/dist/mapbox-gl.css'
```

### Step 5: Uncomment Real Implementation

Open `frontend/src/components/map/MapView.tsx` and uncomment the real Mapbox implementation:

```typescript
// Find this section (around line 40):
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

// Uncomment and use it!
```

---

## 📝 Complete MapView.tsx Implementation

Here's the complete implementation with Mapbox GL JS:

```typescript
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export interface MapViewProps {
  center: { lat: number; lng: number }
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
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    
    if (!token || token === 'your_mapbox_access_token_here') {
      setError('Mapbox access token not configured')
      return
    }

    if (!mapContainerRef.current) return

    try {
      mapboxgl.accessToken = token

      // Initialize map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12',
        center: [center.lng, center.lat],
        zoom: zoom,
        interactive: interactive,
      })

      mapRef.current = map

      map.on('load', () => {
        setMapLoaded(true)

        // Add markers
        markers.forEach((marker) => {
          const el = document.createElement('div')
          el.className = 'custom-marker'
          el.style.width = '32px'
          el.style.height = '32px'
          el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)'
          el.style.backgroundSize = 'cover'
          el.style.cursor = 'pointer'

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="font-semibold">${marker.title || 'Location'}</h3>
             ${marker.description ? `<p class="text-sm">${marker.description}</p>` : ''}`
          )

          const mapboxMarker = new mapboxgl.Marker(el)
            .setLngLat([marker.lng, marker.lat])
            .setPopup(popup)
            .addTo(map)

          el.addEventListener('click', () => {
            onMarkerClick?.(marker.id)
          })

          markersRef.current.push(mapboxMarker)
        })

        // Add routes
        routes.forEach((route) => {
          map.addSource(route.id, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route.coordinates.map((c) => [c.lng, c.lat]),
              },
            },
          })

          map.addLayer({
            id: route.id,
            type: 'line',
            source: route.id,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': route.color || '#F97316',
              'line-width': 3,
            },
          })
        })
      })

      // Add navigation controls
      if (interactive) {
        map.addControl(new mapboxgl.NavigationControl(), 'top-right')
        map.addControl(new mapboxgl.FullscreenControl(), 'top-right')
      }

    } catch (err) {
      setError('Failed to load map')
      console.error('Map initialization error:', err)
    }

    return () => {
      // Cleanup
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      mapRef.current?.remove()
    }
  }, [center, zoom, markers, routes, interactive, onMarkerClick])

  if (error) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Please configure Mapbox access token in .env file
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full rounded-lg overflow-hidden" />
      
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 🔧 TypeScript Types

If you get TypeScript errors, install the types:

```bash
npm install --save-dev @types/mapbox-gl
```

Or with yarn:

```bash
yarn add -D @types/mapbox-gl
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Mapbox token added to `.env`
- [ ] `mapbox-gl` package installed
- [ ] CSS imported in main file
- [ ] Real implementation uncommented
- [ ] TypeScript types installed (if needed)
- [ ] Dev server restarted
- [ ] Maps display correctly
- [ ] Markers appear on map
- [ ] Routes draw correctly
- [ ] Zoom controls work
- [ ] No console errors

---

## 🎯 Testing the Maps

### 1. Tour Detail Page
Navigate to any tour detail page and click the "Maps & Directions" tab:
- Meeting Point map should display
- Tour Route should show the path
- Nearby Attractions should have multiple markers

### 2. Tour Comparison Page
Add tours to comparison and check if location info displays correctly.

### 3. Geolocation
Allow browser location access to see:
- Your location marker (blue)
- Distance calculations
- "Get Directions" functionality

---

## 🐛 Troubleshooting

### Map Not Displaying
- Check browser console for errors
- Verify token is correct in `.env`
- Restart dev server after changing `.env`
- Clear browser cache

### TypeScript Errors
```bash
npm install --save-dev @types/mapbox-gl
```

### CSS Not Loading
Add to `main.tsx`:
```typescript
import 'mapbox-gl/dist/mapbox-gl.css'
```

### Token Invalid
- Check token hasn't expired
- Verify token has correct permissions
- Try creating a new token

---

## 📊 Current vs Real Implementation

### Current (Placeholder)
- ✅ Shows placeholder map view
- ✅ Displays marker count
- ✅ Shows coordinates
- ✅ Has zoom controls UI
- ✅ Error handling
- ✅ Loading states

### After Mapbox Integration
- ✅ Real interactive map
- ✅ Actual markers with popups
- ✅ Route visualization
- ✅ Zoom/pan functionality
- ✅ Fullscreen mode
- ✅ Navigation controls
- ✅ Custom styling

---

## 🎨 Map Styles

You can change the map style in `.env`:

```env
# Street view (default)
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12

# Satellite
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/satellite-v9

# Outdoors
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/outdoors-v12

# Light
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/light-v11

# Dark
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/dark-v11
```

---

## 💡 Pro Tips

1. **Free Tier**: Mapbox offers 50,000 free map loads per month
2. **Custom Markers**: You can use custom SVG icons for markers
3. **Clustering**: For many markers, enable clustering
4. **3D Buildings**: Add 3D building layer for better visualization
5. **Offline**: Cache map tiles for offline use

---

## 📚 Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Mapbox Examples](https://docs.mapbox.com/mapbox-gl-js/example/)
- [Mapbox Studio](https://studio.mapbox.com/) - Create custom styles
- [Mapbox Pricing](https://www.mapbox.com/pricing)

---

## 🎉 Summary

Your map system is **production-ready** with placeholder views! 

To enable real maps:
1. Get Mapbox token
2. Add to `.env`
3. Install `mapbox-gl`
4. Uncomment real implementation
5. Restart dev server

**Everything else is already built and working!** 🚀
