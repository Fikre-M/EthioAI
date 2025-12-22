import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import { ItineraryItem } from '../pages/ItineraryPage'
import {
  FaMap, FaMapMarkerAlt, FaRoute, FaExpand, FaCompress,
  FaLayerGroup, FaSatellite, FaRoad
} from 'react-icons/fa'

interface MapViewProps {
  items: ItineraryItem[]
  isOpen: boolean
  onClose: () => void
}

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: string
  color: string
}

const MapView: React.FC<MapViewProps> = ({
  items,
  isOpen,
  onClose
}) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap')
  const [showRoute, setShowRoute] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Mock coordinates for Ethiopian locations
  const locationCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'Bole International Airport': { lat: 8.9806, lng: 38.7992 },
    'Lalibela Hotel': { lat: 12.0337, lng: 39.0473 },
    'Lalibela Rock Churches': { lat: 12.0337, lng: 39.0473 },
    'Seven Olives Hotel Restaurant': { lat: 12.0320, lng: 39.0460 },
    'Lalibela Market': { lat: 12.0350, lng: 39.0480 },
    'Addis Ababa': { lat: 9.0320, lng: 38.7469 },
    'Bahir Dar': { lat: 11.5942, lng: 37.3615 },
    'Gondar': { lat: 12.6116, lng: 37.4669 },
    'Axum': { lat: 14.1313, lng: 38.7238 }
  }

  const getItemColor = (type: string) => {
    switch (type) {
      case 'flight': return '#3B82F6'
      case 'hotel': return '#10B981'
      case 'restaurant': return '#F59E0B'
      case 'transport': return '#8B5CF6'
      case 'activity': return '#EC4899'
      case 'tour': return '#6366F1'
      default: return '#6B7280'
    }
  }

  const mapLocations: MapLocation[] = items.map(item => {
    const coords = locationCoordinates[item.location] || { lat: 12.0337, lng: 39.0473 }
    return {
      id: item.id,
      name: item.location,
      lat: coords.lat,
      lng: coords.lng,
      type: item.type,
      color: getItemColor(item.type)
    }
  })





  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
      isFullscreen ? 'p-0' : 'p-4'
    }`}>
      <div className={`bg-white rounded-2xl w-full max-h-[90vh] overflow-hidden ${
        isFullscreen ? 'h-full max-w-none' : 'max-w-6xl'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FaMap className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Route Map</h2>
              <p className="text-gray-600">Visualize your daily itinerary</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="p-2"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Map Controls Sidebar */}
          <div className="w-80 p-6 border-r border-gray-200 bg-gray-50">
            {/* Map Type Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Map Type</h3>
              <div className="space-y-2">
                {[
                  { type: 'roadmap', label: 'Road Map', icon: FaRoad },
                  { type: 'satellite', label: 'Satellite', icon: FaSatellite },
                  { type: 'terrain', label: 'Terrain', icon: FaLayerGroup }
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setMapType(type as any)}
                    className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                      mapType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="mr-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Route Options */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Route Options</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showRoute}
                  onChange={(e) => setShowRoute(e.target.checked)}
                  className="mr-2"
                />
                <FaRoute className="mr-2 text-blue-600" />
                Show route lines
              </label>
            </div>

            {/* Locations List */}
            <div>
              <h3 className="font-semibold mb-3">Locations ({mapLocations.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={item.id} className="flex items-center p-2 bg-white rounded-lg border">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: getItemColor(item.type) }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.title}</div>
                      <div className="text-xs text-gray-500 truncate">{item.location}</div>
                    </div>
                    <div className="text-xs text-gray-400">{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Legend</h3>
              <div className="space-y-2">
                {[
                  { type: 'flight', label: 'Flights', color: '#3B82F6' },
                  { type: 'hotel', label: 'Hotels', color: '#10B981' },
                  { type: 'restaurant', label: 'Restaurants', color: '#F59E0B' },
                  { type: 'tour', label: 'Tours', color: '#6366F1' },
                  { type: 'activity', label: 'Activities', color: '#EC4899' },
                  { type: 'transport', label: 'Transport', color: '#8B5CF6' }
                ].map(({ type, label, color }) => (
                  <div key={type} className="flex items-center text-sm">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: color }}
                    ></div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            {/* Mock Map Display */}
            <div className={`bg-gradient-to-br from-green-100 to-blue-100 relative ${
              isFullscreen ? 'h-screen' : 'h-96'
            }`}>
              {/* Map Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-12 h-full">
                  {Array.from({ length: 144 }, (_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                  ))}
                </div>
              </div>

              {/* Location Markers */}
              {mapLocations.map((location, index) => (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${20 + (index * 15) % 60}%`,
                    top: `${30 + (index * 10) % 40}%`
                  }}
                >
                  {/* Marker */}
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: location.color }}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {location.name}
                    </div>
                  </div>
                </div>
              ))}

              {/* Route Lines */}
              {showRoute && mapLocations.length > 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {mapLocations.slice(0, -1).map((_, index) => {
                    const x1 = 20 + (index * 15) % 60
                    const y1 = 30 + (index * 10) % 40
                    const x2 = 20 + ((index + 1) * 15) % 60
                    const y2 = 30 + ((index + 1) * 10) % 40
                    
                    return (
                      <line
                        key={index}
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                    )
                  })}
                </svg>
              )}

              {/* Map Info Overlay */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
                <div className="text-sm font-medium">Route Overview</div>
                <div className="text-xs text-gray-600">
                  {mapLocations.length} locations • {mapType} view
                </div>
              </div>

              {/* Mock Map Notice */}
              <div className="absolute bottom-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 max-w-xs">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-yellow-600 mr-2 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-yellow-800">Demo Map</div>
                    <div className="text-xs text-yellow-700">
                      This is a mock map view. In production, this would integrate with Google Maps or similar mapping service.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <Button
                variant="outline"
                className="bg-white shadow-lg p-2"
                onClick={() => alert('Zoom in functionality')}
              >
                +
              </Button>
              <Button
                variant="outline"
                className="bg-white shadow-lg p-2"
                onClick={() => alert('Zoom out functionality')}
              >
                -
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapView