import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/common/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
// Removed Select component import as it's not available
// Slider component is not available, using a simple input range instead
import { Badge } from '@/components/ui/Badge'
import { Search, MapPin, Star, Filter, X } from 'lucide-react'
import { Destination, DestinationFilters } from '@/types/destination'

// Mock data - replace with API call
const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Lalibela',
    description: 'Famous for its rock-hewn churches, Lalibela is a UNESCO World Heritage Site and one of Ethiopia\'s most iconic destinations.',
    shortDescription: 'Home to 11 medieval rock-hewn churches',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
    images: [],
    location: 'Amhara Region',
    region: 'North',
    category: ['Historical', 'Religious'],
    rating: 4.9,
    reviewCount: 845,
    featured: true,
    tags: ['UNESCO', 'History', 'Architecture'],
    tours: ['1', '2', '3'],
    highlights: ['Rock-hewn churches', 'Religious festivals', 'Mountain views'],
    bestTimeToVisit: 'October to March',
    weather: {
      temperature: '15-25°C',
      season: 'Dry season (best for visiting)'
    },
    coordinates: {
      lat: 12.0317,
      lng: 39.0419
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Simien Mountains',
    description: 'A UNESCO World Heritage Site with stunning mountain landscapes, endemic wildlife, and breathtaking views.',
    shortDescription: 'Dramatic mountain landscapes and unique wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1566438480908-0e2e1a1f8a3f?w=800',
    images: [],
    location: 'Amhara Region',
    region: 'North',
    category: ['Adventure', 'Nature'],
    rating: 4.8,
    reviewCount: 723,
    featured: true,
    tags: ['UNESCO', 'Hiking', 'Wildlife'],
    tours: ['4', '5', '6'],
    highlights: ['Gelada baboons', 'Ras Dashen peak', 'Dramatic cliffs'],
    bestTimeToVisit: 'October to March',
    weather: {
      temperature: '5-20°C',
      season: 'Cool and dry'
    },
    coordinates: {
      lat: 13.23,
      lng: 38.25
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Danakil Depression',
    description: 'One of the hottest places on Earth, known for its otherworldly landscapes, active volcanoes, and colorful sulfur springs.',
    shortDescription: 'Hottest place on Earth with alien landscapes',
    imageUrl: 'https://images.unsplash.com/photo-1581441363689-606ed7810ef4?w=800',
    images: [],
    location: 'Afar Region',
    region: 'East',
    category: ['Adventure', 'Nature'],
    rating: 4.7,
    reviewCount: 589,
    featured: true,
    tags: ['Extreme', 'Geology', 'Volcanoes'],
    tours: ['7', '8', '9'],
    highlights: ['Erta Ale volcano', 'Dallol sulfur springs', 'Salt flats'],
    bestTimeToVisit: 'November to February',
    weather: {
      temperature: '30-50°C',
      season: 'Hot and dry'
    },
    coordinates: {
      lat: 14.2417,
      lng: 40.3
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Omo Valley',
    description: 'Home to diverse ethnic groups with unique cultures and traditions, offering an authentic cultural experience.',
    shortDescription: 'Cultural heartland with diverse ethnic groups',
    imageUrl: 'https://images.unsplash.com/photo-1571832017109-5b0e8a1b3b1d?w=800',
    images: [],
    location: 'Southern Nations Region',
    region: 'South',
    category: ['Cultural', 'Adventure'],
    rating: 4.6,
    reviewCount: 478,
    featured: true,
    tags: ['Culture', 'Tribes', 'Photography'],
    tours: ['10', '11', '12'],
    highlights: ['Tribal villages', 'Traditional ceremonies', 'Local markets'],
    bestTimeToVisit: 'June to September',
    weather: {
      temperature: '25-35°C',
      season: 'Dry season'
    },
    coordinates: {
      lat: 5.5,
      lng: 36.5
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Axum',
    description: 'Ancient city with towering stelae, royal tombs, and the legendary home of the Ark of the Covenant.',
    shortDescription: 'Ancient city with towering stelae and history',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
    images: [],
    location: 'Tigray Region',
    region: 'North',
    category: ['Historical', 'Religious'],
    rating: 4.5,
    reviewCount: 412,
    featured: true,
    tags: ['UNESCO', 'History', 'Archeology'],
    tours: ['13', '14', '15'],
    highlights: ['Ancient stelae', 'Archeological sites', 'Religious artifacts'],
    bestTimeToVisit: 'October to March',
    weather: {
      temperature: '15-25°C',
      season: 'Dry season (best for visiting)'
    },
    coordinates: {
      lat: 14.1211,
      lng: 38.7234
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Bale Mountains',
    description: 'A biodiversity hotspot with stunning landscapes, endemic wildlife, and excellent trekking opportunities.',
    shortDescription: 'Biodiversity hotspot with unique wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1566438480908-0e2e1a1f8a3f?w=800',
    images: [],
    location: 'Oromia Region',
    region: 'Southeast',
    category: ['Nature', 'Adventure'],
    rating: 4.7,
    reviewCount: 356,
    featured: true,
    tags: ['Wildlife', 'Hiking', 'Nature'],
    tours: ['16', '17', '18'],
    highlights: ['Ethiopian wolf', 'Sanetti Plateau', 'Harenna Forest'],
    bestTimeToVisit: 'October to March',
    weather: {
      temperature: '5-20°C',
      season: 'Cool and dry'
    },
    coordinates: {
      lat: 6.8,
      lng: 39.8
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'Harar',
    description: 'A historic walled city with 82 mosques, colorful markets, and a unique hyena feeding tradition.',
    shortDescription: 'Walled city with rich Islamic heritage',
    imageUrl: 'https://images.unsplash.com/photo-1581441363689-606ed7810ef4?w=800',
    images: [],
    location: 'Harari Region',
    region: 'East',
    category: ['Cultural', 'Historical'],
    rating: 4.4,
    reviewCount: 321,
    featured: true,
    tags: ['UNESCO', 'Culture', 'History'],
    tours: ['19', '20', '21'],
    highlights: ['Hyena feeding', 'Old city walls', 'Traditional houses'],
    bestTimeToVisit: 'October to March',
    weather: {
      temperature: '15-25°C',
      season: 'Dry season (best for visiting)'
    },
    coordinates: {
      lat: 9.3137,
      lng: 42.1182
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    name: 'Lake Tana & Blue Nile Falls',
    description: 'Source of the Blue Nile with ancient island monasteries and the majestic Blue Nile Falls.',
    shortDescription: 'Source of the Blue Nile with island monasteries',
    imageUrl: 'https://images.unsplash.com/photo-1571832017109-5b0e8a1b3b1d?w=800',
    images: [],
    location: 'Amhara Region',
    region: 'North',
    category: ['Nature', 'Historical'],
    rating: 4.3,
    reviewCount: 298,
    featured: true,
    tags: ['Waterfalls', 'Lakes', 'Monasteries'],
    tours: ['22', '23', '24'],
    highlights: ['Blue Nile Falls', 'Island monasteries', 'Boat trips'],
    bestTimeToVisit: 'October to February',
    weather: {
      temperature: '15-28°C',
      season: 'Dry season (best for visiting)'
    },
    coordinates: {
      lat: 11.6,
      lng: 37.4
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const categories = ['Historical', 'Cultural', 'Nature', 'Adventure', 'Religious']

export const DestinationsPage = () => {
  const { t } = useTranslation()
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(mockDestinations)
  const [filters, setFilters] = useState<DestinationFilters>({
    searchQuery: '',
    regions: [],
    categories: [],
    minRating: 0,
    tags: [],
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [regionFilter, setRegionFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  // Apply filters
  useEffect(() => {
    let result = [...mockDestinations]

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (destination) =>
          destination.name.toLowerCase().includes(query) ||
          destination.description.toLowerCase().includes(query) ||
          destination.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Filter by region
    if (regionFilter && !regionFilter.toLowerCase().includes('all')) {
      result = result.filter((destination) =>
        destination.region.toLowerCase().includes(regionFilter.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter && !categoryFilter.toLowerCase().includes('all')) {
      result = result.filter((destination) =>
        destination.category.some((cat) => cat.toLowerCase().includes(categoryFilter.toLowerCase()))
      )
    }

    // Apply rating filter
    if (filters.minRating && filters.minRating > 0) {
      result = result.filter((destination) => destination.rating >= (filters.minRating || 0))
    }

    // Apply sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else if (filters.sortBy === 'rating') {
        return filters.sortOrder === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating
      } else {
        // popularity (default)
        return filters.sortOrder === 'asc'
          ? a.reviewCount - b.reviewCount
          : b.reviewCount - a.reviewCount
      }
    })

    setFilteredDestinations(result)
  }, [filters, regionFilter, categoryFilter])

  const toggleRegion = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      regions: prev.regions?.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...(prev.regions || []), region]
    }))
  }

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...(prev.categories || []), category]
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      regions: [],
      categories: [],
      minRating: 0,
      tags: [],
      sortBy: 'name',
      sortOrder: 'asc'
    })
    setRegionFilter('')
    setCategoryFilter('')
  }

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Explore Ethiopian Destinations</h1>
        <p className="text-muted-foreground">
          Discover the most amazing places to visit in Ethiopia
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations..."
              className="pl-10"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <label className="block text-sm font-medium mb-1">Region</label>
            <Input
              placeholder="Filter by region"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            />
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              placeholder="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="md:hidden bg-muted/50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium mb-1">Region</label>
                <Input
                  placeholder="Filter by region"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  placeholder="Filter by category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min. Rating</label>
                <Slider
                  value={[filters.minRating || 0]}
                  onValueChange={(value) => setFilters({ ...filters, minRating: value[0] })}
                  min={0}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{filters.minRating || 0} stars</span>
                  <span>5</span>
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setRegionFilter('')
                    setCategoryFilter('')
                    setFilters({
                      searchQuery: '',
                      regions: [],
                      categories: [],
                      minRating: 0,
                      tags: []
                    })
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Filters */}
        {/* Simplified filter controls */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Region</label>
            <Input
              placeholder="Filter by region"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categories</label>
            <Input
              placeholder="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Rating: {filters.minRating}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating || 0}
              onChange={(e) =>
                setFilters({ ...filters, minRating: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
        {(filters.regions?.length ||
          filters.categories?.length ||
          filters.minRating) > 0 ? (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : null}
      </div>

      {/* Results */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded-md text-sm flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  {destination.rating.toFixed(1)}
                  <span className="text-muted-foreground text-xs ml-1">
                    ({destination.reviewCount})
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{destination.name}</h3>
                  <Badge variant="secondary" className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {destination.region}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-3">
                  {destination.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.category.map((cat) => (
                    <Badge key={cat} variant="outline">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <div>Best time: {destination.bestTimeToVisit}</div>
                    <div>{destination.weather.temperature} • {destination.weather.season}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No destinations found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default DestinationsPage
