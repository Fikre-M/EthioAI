import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaTshirt, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaHeart,
  FaShare, FaExpand, FaArrowLeft, FaArrowRight, FaFilter,
  FaSearch, FaEye, FaDownload, FaInfoCircle, FaStar
} from 'react-icons/fa'

interface ClothingItem {
  id: string
  name: string
  region: string
  ethnicity: string
  description: string
  occasion: string
  materials: string[]
  colors: string[]
  significance: string
  images: string[]
  genderWorn: 'male' | 'female' | 'both'
  seasonality?: string
  historicalPeriod?: string
  modernAdaptations?: string
  relatedItems?: string[]
}

interface TraditionalClothingShowcaseProps {
  items?: ClothingItem[]
  className?: string
}

const TraditionalClothingShowcase: React.FC<TraditionalClothingShowcaseProps> = ({
  items: propItems,
  className = ''
}) => {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [filterRegion, setFilterRegion] = useState<string>('all')
  const [filterGender, setFilterGender] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Mock traditional clothing data
  const mockItems: ClothingItem[] = propItems || [
    {
      id: '1',
      name: 'Habesha Kemis',
      region: 'Amhara',
      ethnicity: 'Amhara',
      description: 'Traditional white cotton dress with colorful embroidered borders, worn by Ethiopian women for special occasions.',
      occasion: 'Religious ceremonies, weddings, cultural celebrations',
      materials: ['Cotton', 'Silk thread', 'Gold thread'],
      colors: ['White', 'Gold', 'Red', 'Green'],
      significance: 'Symbol of Ethiopian femininity and cultural pride, represents purity and celebration.',
      images: ['/images/clothing/habesha-kemis-1.jpg', '/images/clothing/habesha-kemis-2.jpg'],
      genderWorn: 'female',
      seasonality: 'All seasons',
      historicalPeriod: 'Ancient times to present',
      modernAdaptations: 'Contemporary designers create modern versions for diaspora communities'
    },
    {
      id: '2',
      name: 'Netela',
      region: 'Amhara',
      ethnicity: 'Amhara',
      description: 'Traditional white cotton shawl with decorative borders, worn as a head covering or shoulder wrap.',
      occasion: 'Church services, formal events, daily wear',
      materials: ['Cotton', 'Silk'],
      colors: ['White', 'Cream', 'Gold trim'],
      significance: 'Represents modesty and respect, essential part of Ethiopian Orthodox Christian attire.',
      images: ['/images/clothing/netela-1.jpg', '/images/clothing/netela-2.jpg'],
      genderWorn: 'female',
      seasonality: 'All seasons',
      historicalPeriod: 'Medieval to present'
    },
    {
      id: '3',
      name: 'Kaba',
      region: 'Tigray',
      ethnicity: 'Tigray',
      description: 'Traditional white cotton robe with intricate embroidery, worn by Tigrayan women.',
      occasion: 'Festivals, weddings, religious ceremonies',
      materials: ['Cotton', 'Embroidery thread'],
      colors: ['White', 'Colorful embroidery'],
      significance: 'Represents Tigrayan cultural identity and craftsmanship.',
      images: ['/images/clothing/kaba-1.jpg'],
      genderWorn: 'female',
      relatedItems: ['1', '2']
    },
    {
      id: '4',
      name: 'Gabi',
      region: 'Amhara',
      ethnicity: 'Amhara',
      description: 'Traditional thick cotton blanket worn as outer garment, especially in highland areas.',
      occasion: 'Daily wear, cold weather, ceremonial events',
      materials: ['Thick cotton'],
      colors: ['White', 'Natural cotton color'],
      significance: 'Practical garment for highland climate, symbol of Ethiopian highland culture.',
      images: ['/images/clothing/gabi-1.jpg', '/images/clothing/gabi-2.jpg'],
      genderWorn: 'both',
      seasonality: 'Cool/cold seasons'
    },
    {
      id: '5',
      name: 'Oromo Traditional Dress',
      region: 'Oromia',
      ethnicity: 'Oromo',
      description: 'Colorful traditional dress with distinctive patterns and beadwork, representing Oromo cultural heritage.',
      occasion: 'Cultural festivals, Irreecha celebration, weddings',
      materials: ['Cotton', 'Beads', 'Leather'],
      colors: ['Red', 'Black', 'White', 'Yellow'],
      significance: 'Represents Oromo identity and connection to Waaqeffannaa traditions.',
      images: ['/images/clothing/oromo-dress-1.jpg', '/images/clothing/oromo-dress-2.jpg'],
      genderWorn: 'female',
      modernAdaptations: 'Featured in contemporary Ethiopian fashion shows'
    },
    {
      id: '6',
      name: 'Sidama Traditional Attire',
      region: 'Sidama',
      ethnicity: 'Sidama',
      description: 'Traditional clothing featuring geometric patterns and earth tones, worn during cultural ceremonies.',
      occasion: 'Fichee celebration, cultural events, traditional ceremonies',
      materials: ['Cotton', 'Natural dyes'],
      colors: ['Brown', 'Orange', 'Black', 'White'],
      significance: 'Connects wearers to Sidama ancestral traditions and seasonal celebrations.',
      images: ['/images/clothing/sidama-1.jpg'],
      genderWorn: 'both'
    },
    {
      id: '7',
      name: 'Afar Traditional Dress',
      region: 'Afar',
      ethnicity: 'Afar',
      description: 'Lightweight, flowing garments adapted to the hot, arid climate of the Afar region.',
      occasion: 'Daily wear, cultural ceremonies, pastoral activities',
      materials: ['Light cotton', 'Linen'],
      colors: ['White', 'Light blue', 'Beige'],
      significance: 'Practical adaptation to desert climate while maintaining cultural identity.',
      images: ['/images/clothing/afar-1.jpg', '/images/clothing/afar-2.jpg'],
      genderWorn: 'both',
      seasonality: 'Hot climate adaptation'
    },
    {
      id: '8',
      name: 'Gurage Traditional Costume',
      region: 'Gurage Zone',
      ethnicity: 'Gurage',
      description: 'Distinctive traditional attire with unique patterns and colors specific to Gurage culture.',
      occasion: 'Meskel celebration, weddings, cultural festivals',
      materials: ['Cotton', 'Traditional weaving'],
      colors: ['Red', 'Yellow', 'Green', 'Black'],
      significance: 'Preserves Gurage cultural heritage and community identity.',
      images: ['/images/clothing/gurage-1.jpg'],
      genderWorn: 'both'
    }
  ]

  const filteredItems = mockItems.filter(item => {
    const matchesRegion = filterRegion === 'all' || item.region === filterRegion
    const matchesGender = filterGender === 'all' || item.genderWorn === filterGender || item.genderWorn === 'both'
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ethnicity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRegion && matchesGender && matchesSearch
  })

  const regions = [...new Set(mockItems.map(item => item.region))]

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId)
    } else {
      newFavorites.add(itemId)
    }
    setFavorites(newFavorites)
  }

  const nextImage = () => {
    if (selectedItem && selectedItem.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedItem.images.length)
    }
  }

  const prevImage = () => {
    if (selectedItem && selectedItem.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length)
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaTshirt className="mr-3 text-purple-600" />
            Traditional Ethiopian Clothing
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
              variant={viewMode === 'carousel' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('carousel')}
            >
              Carousel
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
                placeholder="Search clothing..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="both">Unisex</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredItems.length} items found
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                onClick={() => {
                  setSelectedItem(item)
                  setCurrentImageIndex(0)
                }}
              >
                <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-purple-400 to-pink-600 relative">
                  <div className="flex items-center justify-center h-48">
                    <FaTshirt className="text-6xl text-white" />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaExpand className="text-white text-2xl" />
                    </div>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(item.id)
                    }}
                    className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                  >
                    <FaHeart className={favorites.has(item.id) ? 'text-red-500' : 'text-gray-400'} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    <span className="text-xs text-gray-500">{item.genderWorn}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    {item.region} • {item.ethnicity}
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.colors.slice(0, 3).map(color => (
                        <span key={color} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {color}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      <FaEye className="mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carousel View */}
      {viewMode === 'carousel' && (
        <div className="p-6">
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-80 bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item)
                    setCurrentImageIndex(0)
                  }}
                >
                  <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-purple-400 to-pink-600">
                    <div className="flex items-center justify-center h-48">
                      <FaTshirt className="text-6xl text-white" />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-1" />
                      {item.region}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedItem.name}</h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {selectedItem.region}
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      {selectedItem.ethnicity}
                    </div>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {selectedItem.genderWorn}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div>
                  <div className="relative aspect-w-3 aspect-h-4 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg mb-4">
                    <div className="flex items-center justify-center h-96">
                      <FaTshirt className="text-8xl text-white" />
                    </div>
                    
                    {selectedItem.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                        >
                          <FaArrowLeft />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                        >
                          <FaArrowRight />
                        </button>
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white text-sm">
                          {currentImageIndex + 1} / {selectedItem.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFavorite(selectedItem.id)}
                      >
                        <FaHeart className={favorites.has(selectedItem.id) ? 'text-red-500 mr-1' : 'mr-1'} />
                        {favorites.has(selectedItem.id) ? 'Favorited' : 'Favorite'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <FaShare className="mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      <FaDownload className="mr-1" />
                      Download Info
                    </Button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cultural Significance</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedItem.significance}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Occasion</h4>
                      <p className="text-sm text-gray-600">{selectedItem.occasion}</p>
                    </div>
                    {selectedItem.seasonality && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Seasonality</h4>
                        <p className="text-sm text-gray-600">{selectedItem.seasonality}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.materials.map(material => (
                        <span key={material} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.colors.map(color => (
                        <span key={color} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedItem.modernAdaptations && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Modern Adaptations</h4>
                      <p className="text-sm text-gray-600">{selectedItem.modernAdaptations}</p>
                    </div>
                  )}

                  {selectedItem.relatedItems && selectedItem.relatedItems.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Related Items</h4>
                      <div className="space-y-2">
                        {selectedItem.relatedItems.map(itemId => {
                          const relatedItem = mockItems.find(item => item.id === itemId)
                          return relatedItem ? (
                            <button
                              key={itemId}
                              onClick={() => {
                                setSelectedItem(relatedItem)
                                setCurrentImageIndex(0)
                              }}
                              className="block w-full text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                            >
                              <div className="font-medium text-purple-600">{relatedItem.name}</div>
                              <div className="text-sm text-gray-600">{relatedItem.region}</div>
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

export default TraditionalClothingShowcase