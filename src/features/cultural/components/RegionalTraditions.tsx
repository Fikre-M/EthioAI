import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaMapMarkerAlt, FaUsers, FaHeart, FaShare, FaExpand,
  FaSearch, FaGlobe, FaLeaf, FaRing,
  FaUtensils, FaMusic, FaTshirt, FaHandsHelping, FaStar
} from 'react-icons/fa'

interface RegionalTradition {
  id: string
  name: string
  region: string
  ethnicity: string
  category: 'ceremony' | 'craft' | 'food' | 'music' | 'clothing' | 'social' | 'spiritual'
  description: string
  significance: string
  practiceDetails: string
  materials?: string[]
  seasonality?: string
  ageGroups?: string[]
  genderRoles?: string
  modernStatus: 'thriving' | 'declining' | 'endangered' | 'reviving'
  preservationEfforts?: string[]
  relatedTraditions?: string[]
  images?: string[]
  videos?: string[]
  practitioners?: number
  lastDocumented?: string
}

interface RegionalTraditionsProps {
  traditions?: RegionalTradition[]
  className?: string
}

const RegionalTraditions: React.FC<RegionalTraditionsProps> = ({
  traditions: propTraditions,
  className = ''
}) => {
  const [selectedTradition, setSelectedTradition] = useState<RegionalTradition | null>(null)
  const [filterRegion, setFilterRegion] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Mock regional traditions data
  const mockTraditions: RegionalTradition[] = propTraditions || [
    {
      id: '1',
      name: 'Coffee Ceremony',
      region: 'Nationwide',
      ethnicity: 'Multiple ethnicities',
      category: 'ceremony',
      description: 'Traditional Ethiopian coffee ceremony involving roasting, grinding, and brewing coffee beans in a social setting.',
      significance: 'Central to Ethiopian hospitality and social bonding, representing community, respect, and spiritual connection.',
      practiceDetails: 'The ceremony involves three rounds: Abol (first), Tona (second), and Baraka (third), each with specific rituals and meanings.',
      materials: ['Green coffee beans', 'Jebena (clay pot)', 'Mukecha (roasting pan)', 'Incense'],
      seasonality: 'Year-round',
      ageGroups: ['Adults', 'Elders'],
      genderRoles: 'Traditionally performed by women, though men may participate',
      modernStatus: 'thriving',
      preservationEfforts: ['Cultural education programs', 'Tourism promotion', 'Diaspora communities'],
      practitioners: 50000000,
      lastDocumented: '2024-11-01'
    },
    {
      id: '2',
      name: 'Gada System',
      region: 'Oromia',
      ethnicity: 'Oromo',
      category: 'social',
      description: 'Traditional democratic governance system of the Oromo people based on age-grade classes.',
      significance: 'UNESCO-recognized system promoting peace, democracy, and social organization.',
      practiceDetails: 'Eight-year cycles of leadership roles, with elaborate ceremonies and traditional laws.',
      seasonality: 'Ceremonial transitions occur every 8 years',
      ageGroups: ['Adults', 'Elders'],
      genderRoles: 'Primarily male leadership with important female advisory roles',
      modernStatus: 'reviving',
      preservationEfforts: ['UNESCO recognition', 'Academic research', 'Cultural revival movements'],
      practitioners: 35000000,
      lastDocumented: '2024-10-15'
    },
    {
      id: '3',
      name: 'Weaving Traditions',
      region: 'Dorze, SNNPR',
      ethnicity: 'Dorze',
      category: 'craft',
      description: 'Traditional cotton weaving using backstrap looms to create colorful textiles.',
      significance: 'Represents Dorze cultural identity and provides economic livelihood for communities.',
      practiceDetails: 'Complex patterns passed down through generations, with specific designs for different occasions.',
      materials: ['Cotton thread', 'Natural dyes', 'Backstrap loom'],
      seasonality: 'Year-round production',
      ageGroups: ['Youth', 'Adults'],
      genderRoles: 'Both men and women participate, with some specialization by gender',
      modernStatus: 'declining',
      preservationEfforts: ['Cooperative formation', 'Tourism promotion', 'Skills training programs'],
      practitioners: 5000,
      lastDocumented: '2024-09-20'
    },
    {
      id: '4',
      name: 'Honey Wine Making',
      region: 'Tigray',
      ethnicity: 'Tigray',
      category: 'food',
      description: 'Traditional fermentation of honey to create tej, a ceremonial alcoholic beverage.',
      significance: 'Important for religious ceremonies, weddings, and social gatherings.',
      practiceDetails: 'Specific honey varieties and fermentation techniques passed down through families.',
      materials: ['Wild honey', 'Hops (gesho)', 'Clay vessels'],
      seasonality: 'Honey collection in dry season, brewing year-round',
      ageGroups: ['Adults', 'Elders'],
      genderRoles: 'Knowledge traditionally held by elder women',
      modernStatus: 'thriving',
      preservationEfforts: ['Commercial production', 'Cultural festivals', 'Recipe documentation'],
      practitioners: 15000,
      lastDocumented: '2024-11-10'
    },
    {
      id: '5',
      name: 'Mursi Lip Plates',
      region: 'South Omo, SNNPR',
      ethnicity: 'Mursi',
      category: 'clothing',
      description: 'Traditional body modification practice where women wear clay or wooden plates in their lower lips.',
      significance: 'Symbol of beauty, maturity, and cultural identity within Mursi society.',
      practiceDetails: 'Process begins in adolescence with gradual stretching and plate insertion.',
      materials: ['Clay', 'Wood', 'Natural pigments'],
      ageGroups: ['Youth', 'Adults'],
      genderRoles: 'Exclusively practiced by women',
      modernStatus: 'endangered',
      preservationEfforts: ['Cultural documentation', 'Tourism awareness', 'Community education'],
      practitioners: 500,
      lastDocumented: '2024-08-15'
    },
    {
      id: '6',
      name: 'Sidama Buurisame Ceremony',
      region: 'Sidama',
      ethnicity: 'Sidama',
      category: 'ceremony',
      description: 'Traditional ceremony marking the transition from boyhood to manhood.',
      significance: 'Crucial rite of passage establishing social roles and responsibilities.',
      practiceDetails: 'Multi-day ceremony involving elders, traditional foods, and ritual activities.',
      seasonality: 'Typically performed during harvest season',
      ageGroups: ['Youth'],
      genderRoles: 'Male initiation ceremony with female support roles',
      modernStatus: 'declining',
      preservationEfforts: ['Elder councils', 'Cultural education', 'Documentation projects'],
      practitioners: 8000,
      lastDocumented: '2024-07-30'
    }
  ]

  const regions = [...new Set(mockTraditions.map(tradition => tradition.region))]
  const categories = [...new Set(mockTraditions.map(tradition => tradition.category))]

  const filteredTraditions = mockTraditions.filter(tradition => {
    const matchesRegion = filterRegion === 'all' || tradition.region === filterRegion
    const matchesCategory = filterCategory === 'all' || tradition.category === filterCategory
    const matchesStatus = filterStatus === 'all' || tradition.modernStatus === filterStatus
    const matchesSearch = searchTerm === '' || 
      tradition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tradition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tradition.ethnicity.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRegion && matchesCategory && matchesStatus && matchesSearch
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ceremony': return <FaRing className="text-purple-600" />
      case 'craft': return <FaHandsHelping className="text-blue-600" />
      case 'food': return <FaUtensils className="text-green-600" />
      case 'music': return <FaMusic className="text-red-600" />
      case 'clothing': return <FaTshirt className="text-pink-600" />
      case 'social': return <FaUsers className="text-indigo-600" />
      case 'spiritual': return <FaLeaf className="text-teal-600" />
      default: return <FaGlobe className="text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ceremony': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'craft': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'food': return 'bg-green-100 text-green-800 border-green-200'
      case 'music': return 'bg-red-100 text-red-800 border-red-200'
      case 'clothing': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'social': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'spiritual': return 'bg-teal-100 text-teal-800 border-teal-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thriving': return 'text-green-600 bg-green-100'
      case 'declining': return 'text-yellow-600 bg-yellow-100'
      case 'endangered': return 'text-red-600 bg-red-100'
      case 'reviving': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const toggleFavorite = (traditionId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(traditionId)) {
      newFavorites.delete(traditionId)
    } else {
      newFavorites.add(traditionId)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaGlobe className="mr-3 text-indigo-600" />
            Regional Traditions of Ethiopia
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              Map
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search traditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="thriving">Thriving</option>
              <option value="declining">Declining</option>
              <option value="endangered">Endangered</option>
              <option value="reviving">Reviving</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredTraditions.length} traditions found
          </div>
        </div>
      </div>   
   {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTraditions.map(tradition => (
              <div
                key={tradition.id}
                onClick={() => setSelectedTradition(tradition)}
                className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-indigo-400 to-purple-600 relative">
                  <div className="flex items-center justify-center h-48">
                    {getCategoryIcon(tradition.category)}
                    <span className="text-4xl ml-2">
                      {tradition.category === 'ceremony' ? '🎭' :
                       tradition.category === 'craft' ? '🎨' :
                       tradition.category === 'food' ? '🍯' :
                       tradition.category === 'music' ? '🎵' :
                       tradition.category === 'clothing' ? '👗' :
                       tradition.category === 'social' ? '🤝' :
                       tradition.category === 'spiritual' ? '🕯️' : '🌍'}
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tradition.modernStatus)}`}>
                      {tradition.modernStatus}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(tradition.id)
                    }}
                    className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                  >
                    <FaHeart className={favorites.has(tradition.id) ? 'text-red-500' : 'text-gray-400'} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{tradition.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(tradition.category)}`}>
                      {tradition.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    {tradition.region} • {tradition.ethnicity}
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">{tradition.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <FaUsers className="mr-1" />
                      {tradition.practitioners ? tradition.practitioners.toLocaleString() : 'Unknown'} practitioners
                    </div>
                    <Button variant="outline" size="sm">
                      <FaExpand className="mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="p-6">
          <div className="space-y-4">
            {filteredTraditions.map(tradition => (
              <div
                key={tradition.id}
                onClick={() => setSelectedTradition(tradition)}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(tradition.category).replace('text-', 'bg-').replace('-800', '-500')}`}>
                      {getCategoryIcon(tradition.category)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{tradition.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(tradition.category)}`}>
                          {tradition.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tradition.modernStatus)}`}>
                          {tradition.modernStatus}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{tradition.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {tradition.region}
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="mr-1" />
                          {tradition.ethnicity}
                        </div>
                        {tradition.practitioners && (
                          <div className="flex items-center">
                            <FaStar className="mr-1" />
                            {tradition.practitioners.toLocaleString()} practitioners
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(tradition.id)
                      }}
                      className={`p-2 rounded-full hover:bg-gray-100 ${
                        favorites.has(tradition.id) ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <Button variant="outline" size="sm">
                      <FaExpand className="mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="p-6">
          <div className="bg-gradient-to-br from-green-400 to-blue-600 rounded-lg h-96 flex items-center justify-center mb-6">
            <div className="text-center text-white">
              <FaGlobe className="text-6xl mb-4 mx-auto" />
              <h3 className="text-2xl font-bold mb-2">Interactive Map</h3>
              <p className="text-lg">Explore traditions by region</p>
            </div>
          </div>
          
          {/* Region Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.filter(region => region !== 'Nationwide').map(region => {
              const regionTraditions = filteredTraditions.filter(t => t.region === region)
              return (
                <div key={region} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-indigo-600" />
                    {region}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {regionTraditions.length} tradition{regionTraditions.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1">
                    {regionTraditions.slice(0, 3).map(tradition => (
                      <div
                        key={tradition.id}
                        onClick={() => setSelectedTradition(tradition)}
                        className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        • {tradition.name}
                      </div>
                    ))}
                    {regionTraditions.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{regionTraditions.length - 3} more...
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}  
    {/* Tradition Detail Modal */}
      {selectedTradition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedTradition.name}</h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(selectedTradition.category)}`}>
                      {selectedTradition.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTradition.modernStatus)}`}>
                      {selectedTradition.modernStatus}
                    </span>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {selectedTradition.region}
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      {selectedTradition.ethnicity}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTradition(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedTradition.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cultural Significance</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedTradition.significance}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Practice Details</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedTradition.practiceDetails}</p>
                  </div>

                  {selectedTradition.materials && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Materials Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTradition.materials.map(material => (
                          <span key={material} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTradition.preservationEfforts && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Preservation Efforts</h3>
                      <div className="space-y-2">
                        {selectedTradition.preservationEfforts.map(effort => (
                          <div key={effort} className="flex items-center p-2 bg-green-50 rounded">
                            <FaLeaf className="mr-2 text-green-600" />
                            <span className="text-sm text-gray-700">{effort}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTradition.modernStatus)}`}>
                      {selectedTradition.modernStatus}
                    </span>
                  </div>

                  {selectedTradition.practitioners && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Practitioners</h4>
                      <p className="text-2xl font-bold text-indigo-600">
                        {selectedTradition.practitioners.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {selectedTradition.seasonality && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Seasonality</h4>
                      <p className="text-gray-700">{selectedTradition.seasonality}</p>
                    </div>
                  )}

                  {selectedTradition.ageGroups && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Age Groups</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTradition.ageGroups.map(group => (
                          <span key={group} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTradition.genderRoles && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Gender Roles</h4>
                      <p className="text-sm text-gray-700">{selectedTradition.genderRoles}</p>
                    </div>
                  )}

                  {selectedTradition.lastDocumented && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Last Documented</h4>
                      <p className="text-gray-700">
                        {new Date(selectedTradition.lastDocumented).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => toggleFavorite(selectedTradition.id)}
                    >
                      <FaHeart className={favorites.has(selectedTradition.id) ? 'text-red-500 mr-1' : 'mr-1'} />
                      {favorites.has(selectedTradition.id) ? 'Favorited' : 'Favorite'}
                    </Button>
                    <Button variant="outline">
                      <FaShare className="mr-1" />
                      Share
                    </Button>
                  </div>

                  {selectedTradition.relatedTraditions && selectedTradition.relatedTraditions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Related Traditions</h4>
                      <div className="space-y-2">
                        {selectedTradition.relatedTraditions.map(traditionId => {
                          const relatedTradition = mockTraditions.find(t => t.id === traditionId)
                          return relatedTradition ? (
                            <button
                              key={traditionId}
                              onClick={() => setSelectedTradition(relatedTradition)}
                              className="block w-full text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                            >
                              <div className="font-medium text-indigo-600">{relatedTradition.name}</div>
                              <div className="text-sm text-gray-600">{relatedTradition.region}</div>
                            </button>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegionalTraditions