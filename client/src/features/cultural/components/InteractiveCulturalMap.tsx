import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaMapMarkerAlt, FaSearch, FaCamera,
  FaMusic, FaUtensils, FaTshirt, FaHome, FaGlobe, FaExpand,
  FaCompress, FaList, FaRoute, FaStar, FaHeart, FaShare
} from 'react-icons/fa'

interface CulturalSite {
  id: string
  name: string
  type: 'heritage' | 'festival' | 'craft' | 'food' | 'music' | 'architecture'
  region: string
  coordinates: { lat: number; lng: number }
  description: string
  significance: string
  images: string[]
  visitingInfo: {
    bestTime: string
    duration: string
    accessibility: 'easy' | 'moderate' | 'difficult'
    cost: string
  }
  culturalElements: string[]
  relatedSites: string[]
  isUNESCO: boolean
  rating: number
  reviews: number
}

interface Region {
  id: string
  name: string
  capital: string
  population: number
  area: number
  languages: string[]
  ethnicGroups: string[]
  majorFestivals: string[]
  traditionalCrafts: string[]
  signature_dishes: string[]
  coordinates: { lat: number; lng: number }
  boundaries: { lat: number; lng: number }[]
  color: string
}

interface InteractiveCulturalMapProps {
  onSiteSelect?: (site: CulturalSite) => void
  className?: string
}

export const InteractiveCulturalMap: React.FC<InteractiveCulturalMapProps> = ({
  onSiteSelect,
  className = ''
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedSite, setSelectedSite] = useState<CulturalSite | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [mapView, setMapView] = useState<'regions' | 'sites' | 'routes'>('regions')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Mock Ethiopian regions data
  const regions: Region[] = [
    {
      id: 'addis-ababa',
      name: 'Addis Ababa',
      capital: 'Addis Ababa',
      population: 3500000,
      area: 527,
      languages: ['Amharic', 'Oromo', 'Tigrinya'],
      ethnicGroups: ['Amhara', 'Oromo', 'Tigray', 'Gurage'],
      majorFestivals: ['Timkat', 'Meskel', 'Enkutatash'],
      traditionalCrafts: ['Metalwork', 'Pottery', 'Weaving'],
      signature_dishes: ['Doro Wat', 'Kitfo', 'Tibs'],
      coordinates: { lat: 9.0320, lng: 38.7469 },
      boundaries: [
        { lat: 9.1, lng: 38.6 },
        { lat: 9.1, lng: 38.9 },
        { lat: 8.9, lng: 38.9 },
        { lat: 8.9, lng: 38.6 }
      ],
      color: '#FF6B6B'
    },
    {
      id: 'oromia',
      name: 'Oromia',
      capital: 'Adama',
      population: 37000000,
      area: 353006,
      languages: ['Oromo', 'Amharic'],
      ethnicGroups: ['Oromo', 'Amhara', 'Gurage'],
      majorFestivals: ['Irreecha', 'Fichee', 'Meskel'],
      traditionalCrafts: ['Basketry', 'Leather work', 'Wood carving'],
      signature_dishes: ['Kitfo', 'Bozena Shiro', 'Qanta Firfir'],
      coordinates: { lat: 8.5, lng: 39.5 },
      boundaries: [
        { lat: 10.5, lng: 34.5 },
        { lat: 10.5, lng: 43.0 },
        { lat: 4.0, lng: 43.0 },
        { lat: 4.0, lng: 34.5 }
      ],
      color: '#4ECDC4'
    },
    {
      id: 'amhara',
      name: 'Amhara',
      capital: 'Bahir Dar',
      population: 21000000,
      area: 154708,
      languages: ['Amharic', 'Oromo'],
      ethnicGroups: ['Amhara', 'Oromo', 'Agaw'],
      majorFestivals: ['Timkat', 'Meskel', 'Genna'],
      traditionalCrafts: ['Church art', 'Manuscript illumination', 'Stone carving'],
      signature_dishes: ['Doro Wat', 'Injera', 'Teff dishes'],
      coordinates: { lat: 11.5, lng: 37.5 },
      boundaries: [
        { lat: 14.0, lng: 35.0 },
        { lat: 14.0, lng: 40.0 },
        { lat: 9.0, lng: 40.0 },
        { lat: 9.0, lng: 35.0 }
      ],
      color: '#45B7D1'
    },
    {
      id: 'tigray',
      name: 'Tigray',
      capital: 'Mekelle',
      population: 5400000,
      area: 50078,
      languages: ['Tigrinya', 'Amharic'],
      ethnicGroups: ['Tigray', 'Amhara'],
      majorFestivals: ['Timkat', 'Meskel', 'Ashenda'],
      traditionalCrafts: ['Rock-hewn churches', 'Honey wine making', 'Salt mining'],
      signature_dishes: ['Injera', 'Zigni', 'Tej'],
      coordinates: { lat: 14.0, lng: 38.5 },
      boundaries: [
        { lat: 14.9, lng: 36.5 },
        { lat: 14.9, lng: 39.9 },
        { lat: 12.5, lng: 39.9 },
        { lat: 12.5, lng: 36.5 }
      ],
      color: '#F7DC6F'
    }
  ]

  // Mock cultural sites data
  const culturalSites: CulturalSite[] = [
    {
      id: 'lalibela-churches',
      name: 'Rock-Hewn Churches of Lalibela',
      type: 'heritage',
      region: 'amhara',
      coordinates: { lat: 12.0317, lng: 39.0473 },
      description: 'Eleven medieval monolithic cave churches carved directly into the volcanic rock, representing a New Jerusalem.',
      significance: 'UNESCO World Heritage Site and one of Ethiopia\'s holiest cities, attracting thousands of pilgrims annually.',
      images: ['/images/sites/lalibela-1.jpg', '/images/sites/lalibela-2.jpg'],
      visitingInfo: {
        bestTime: 'October to March (dry season)',
        duration: '2-3 days',
        accessibility: 'moderate',
        cost: '$50-100 per day'
      },
      culturalElements: ['Orthodox Christianity', 'Medieval architecture', 'Pilgrimage traditions'],
      relatedSites: ['axum-obelisks', 'gondar-castles'],
      isUNESCO: true,
      rating: 4.9,
      reviews: 1250
    },
    {
      id: 'axum-obelisks',
      name: 'Axum Obelisks',
      type: 'heritage',
      region: 'tigray',
      coordinates: { lat: 14.1319, lng: 38.7267 },
      description: 'Ancient granite stelae marking the tombs of Axumite royalty, some reaching heights of over 20 meters.',
      significance: 'Remnants of the ancient Kingdom of Axum, showcasing advanced engineering and artistic skills.',
      images: ['/images/sites/axum-1.jpg', '/images/sites/axum-2.jpg'],
      visitingInfo: {
        bestTime: 'November to February',
        duration: '1-2 days',
        accessibility: 'easy',
        cost: '$30-60 per day'
      },
      culturalElements: ['Ancient Axumite civilization', 'Royal burial traditions', 'Stone carving'],
      relatedSites: ['lalibela-churches'],
      isUNESCO: true,
      rating: 4.7,
      reviews: 890
    },
    {
      id: 'irreecha-celebration',
      name: 'Irreecha Festival Grounds',
      type: 'festival',
      region: 'oromia',
      coordinates: { lat: 8.7500, lng: 38.9833 },
      description: 'Sacred lake where the Oromo people celebrate their thanksgiving festival, Irreecha, marking the end of the rainy season.',
      significance: 'Most important Oromo cultural celebration, bringing together millions in gratitude and unity.',
      images: ['/images/sites/irreecha-1.jpg', '/images/sites/irreecha-2.jpg'],
      visitingInfo: {
        bestTime: 'October (festival time)',
        duration: '1 day',
        accessibility: 'easy',
        cost: 'Free'
      },
      culturalElements: ['Oromo traditions', 'Thanksgiving ceremonies', 'Cultural performances'],
      relatedSites: [],
      isUNESCO: false,
      rating: 4.8,
      reviews: 650
    },
    {
      id: 'dorze-village',
      name: 'Dorze Cultural Village',
      type: 'craft',
      region: 'snnpr',
      coordinates: { lat: 6.1167, lng: 37.5833 },
      description: 'Traditional village known for distinctive beehive-shaped houses and expert cotton weaving techniques.',
      significance: 'Living museum of Dorze culture, showcasing traditional architecture and textile crafts.',
      images: ['/images/sites/dorze-1.jpg', '/images/sites/dorze-2.jpg'],
      visitingInfo: {
        bestTime: 'Year-round',
        duration: 'Half day',
        accessibility: 'moderate',
        cost: '$20-40'
      },
      culturalElements: ['Traditional architecture', 'Cotton weaving', 'Dorze culture'],
      relatedSites: [],
      isUNESCO: false,
      rating: 4.5,
      reviews: 320
    }
  ]

  const siteTypes = [
    { id: 'all', name: 'All Sites', icon: FaGlobe, color: 'text-gray-600' },
    { id: 'heritage', name: 'Heritage Sites', icon: FaHome, color: 'text-blue-600' },
    { id: 'festival', name: 'Festival Grounds', icon: FaMusic, color: 'text-green-600' },
    { id: 'craft', name: 'Craft Centers', icon: FaTshirt, color: 'text-purple-600' },
    { id: 'food', name: 'Culinary Sites', icon: FaUtensils, color: 'text-orange-600' },
    { id: 'architecture', name: 'Architecture', icon: FaHome, color: 'text-red-600' }
  ]

  const filteredSites = culturalSites.filter(site => {
    const matchesFilter = activeFilter === 'all' || site.type === activeFilter
    const matchesSearch = searchTerm === '' || 
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = !selectedRegion || site.region === selectedRegion
    
    return matchesFilter && matchesSearch && matchesRegion
  })

  const toggleFavorite = (siteId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(siteId)) {
      newFavorites.delete(siteId)
    } else {
      newFavorites.add(siteId)
    }
    setFavorites(newFavorites)
    localStorage.setItem('cultural-map-favorites', JSON.stringify(Array.from(newFavorites)))
  }

  const handleSiteClick = (site: CulturalSite) => {
    setSelectedSite(site)
    if (onSiteSelect) {
      onSiteSelect(site)
    }
  }



  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('cultural-map-favorites')
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaMapMarkerAlt className="mr-3 text-blue-600" />
            Interactive Cultural Map
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLegend(!showLegend)}
            >
              <FaList className="mr-2" />
              Legend
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <FaCompress className="mr-2" /> : <FaExpand className="mr-2" />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cultural sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            <select
              value={selectedRegion || ''}
              onChange={(e) => setSelectedRegion(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {['regions', 'sites', 'routes'].map(view => (
              <Button
                key={view}
                variant={mapView === view ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setMapView(view as any)}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Site Type Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {siteTypes.map(type => {
            const IconComponent = type.icon
            return (
              <button
                key={type.id}
                onClick={() => setActiveFilter(type.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  activeFilter === type.id
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`text-sm ${type.color}`} />
                <span className="text-sm font-medium">{type.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex">
        {/* Map Area */}
        <div className="flex-1 relative">
          <div className="h-96 lg:h-[600px] bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
            {/* SVG Map */}
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full"
              style={{ background: 'linear-gradient(135deg, #e8f5e8 0%, #e1f0ff 100%)' }}
            >
              {/* Regions */}
              {mapView === 'regions' && regions.map(region => (
                <g key={region.id}>
                  <polygon
                    points={region.boundaries.map(b => `${(b.lng - 33) * 20},${(15 - b.lat) * 30}`).join(' ')}
                    fill={selectedRegion === region.id ? region.color : `${region.color}80`}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                  />
                  <text
                    x={(region.coordinates.lng - 33) * 20}
                    y={(15 - region.coordinates.lat) * 30}
                    textAnchor="middle"
                    className="text-sm font-medium fill-gray-800 pointer-events-none"
                  >
                    {region.name}
                  </text>
                </g>
              ))}

              {/* Cultural Sites */}
              {(mapView === 'sites' || mapView === 'routes') && filteredSites.map(site => (
                <g key={site.id}>
                  <circle
                    cx={(site.coordinates.lng - 33) * 20}
                    cy={(15 - site.coordinates.lat) * 30}
                    r="8"
                    fill={selectedSite?.id === site.id ? '#FF6B6B' : '#4ECDC4'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-10 transition-all"
                    onClick={() => handleSiteClick(site)}
                  />
                  {site.isUNESCO && (
                    <circle
                      cx={(site.coordinates.lng - 33) * 20}
                      cy={(15 - site.coordinates.lat) * 30}
                      r="12"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                    />
                  )}
                  <text
                    x={(site.coordinates.lng - 33) * 20}
                    y={(15 - site.coordinates.lat) * 30 - 15}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-800 pointer-events-none"
                  >
                    {site.name.length > 20 ? site.name.substring(0, 20) + '...' : site.name}
                  </text>
                </g>
              ))}

              {/* Routes */}
              {mapView === 'routes' && (
                <g>
                  {filteredSites.slice(0, -1).map((site, index) => {
                    const nextSite = filteredSites[index + 1]
                    return (
                      <line
                        key={`route-${index}`}
                        x1={(site.coordinates.lng - 33) * 20}
                        y1={(15 - site.coordinates.lat) * 30}
                        x2={(nextSite.coordinates.lng - 33) * 20}
                        y2={(15 - nextSite.coordinates.lat) * 30}
                        stroke="#FF6B6B"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                    )
                  })}
                </g>
              )}
            </svg>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <Button size="sm" variant="outline" className="bg-white">
                <FaExpand />
              </Button>
              <Button size="sm" variant="outline" className="bg-white">
                <FaRoute />
              </Button>
            </div>
          </div>
        </div>

        {/* Legend Sidebar */}
        {showLegend && (
          <div className="w-80 border-l border-gray-200 p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Map Legend</h3>
            
            {/* Site Types */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Site Types</h4>
              <div className="space-y-2">
                {siteTypes.slice(1).map(type => {
                  const IconComponent = type.icon
                  return (
                    <div key={type.id} className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <IconComponent className={`text-sm ${type.color}`} />
                      <span className="text-sm text-gray-700">{type.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* UNESCO Sites */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Special Designations</h4>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-yellow-500 border-dashed rounded-full"></div>
                <FaStar className="text-yellow-500" />
                <span className="text-sm text-gray-700">UNESCO World Heritage</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Statistics</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Sites:</span>
                  <span className="font-medium">{culturalSites.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>UNESCO Sites:</span>
                  <span className="font-medium">{culturalSites.filter(s => s.isUNESCO).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Regions:</span>
                  <span className="font-medium">{regions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Favorites:</span>
                  <span className="font-medium">{favorites.size}</span>
                </div>
              </div>
            </div>

            {/* Selected Region Info */}
            {selectedRegion && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Region Information</h4>
                {(() => {
                  const region = regions.find(r => r.id === selectedRegion)
                  return region ? (
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <h5 className="font-semibold text-gray-900">{region.name}</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Capital: {region.capital}</div>
                        <div>Population: {region.population.toLocaleString()}</div>
                        <div>Languages: {region.languages.join(', ')}</div>
                        <div>Major Festivals: {region.majorFestivals.join(', ')}</div>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Site Details */}
      {selectedSite && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                {selectedSite.name}
                {selectedSite.isUNESCO && (
                  <FaStar className="ml-2 text-yellow-500" title="UNESCO World Heritage Site" />
                )}
              </h3>
              <p className="text-gray-600 capitalize">{selectedSite.type} • {selectedSite.region}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFavorite(selectedSite.id)}
                className={`p-2 rounded-full transition-colors ${
                  favorites.has(selectedSite.id)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaHeart />
              </button>
              <Button variant="outline" size="sm">
                <FaShare className="mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <FaCamera className="mr-2" />
                Gallery
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <p className="text-gray-700 mb-4 leading-relaxed">{selectedSite.description}</p>
              <p className="text-gray-600 text-sm mb-4">{selectedSite.significance}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-medium">{selectedSite.rating}</span>
                  <span className="text-gray-600 ml-1">({selectedSite.reviews} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Visiting Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Best Time: {selectedSite.visitingInfo.bestTime}</div>
                  <div>Duration: {selectedSite.visitingInfo.duration}</div>
                  <div>Accessibility: {selectedSite.visitingInfo.accessibility}</div>
                  <div>Cost: {selectedSite.visitingInfo.cost}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cultural Elements</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedSite.culturalElements.map(element => (
                    <span key={element} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {element}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}