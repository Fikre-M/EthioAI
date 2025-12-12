import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import CarCard, { CarRental } from '../components/CarCard'
import CarDetailsModal from '../components/CarDetailsModal'
import CarFiltersComponent, { CarFilters } from '../components/CarFilters'
import {
  FaCar, FaArrowLeft, FaSearch, FaCalendarAlt,
  FaMapMarkerAlt, FaShieldAlt,
  FaRoad, FaStar, FaDollarSign, FaSort, FaCheckCircle
} from 'react-icons/fa'

interface CarSearchForm {
  location: string
  pickupDate: string
  returnDate: string
  pickupTime: string
  returnTime: string
  driverAge: number
}



const CarRentalPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchForm, setSearchForm] = useState<CarSearchForm>({
    location: '',
    pickupDate: '',
    returnDate: '',
    pickupTime: '10:00',
    returnTime: '10:00',
    driverAge: 25
  })
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [cars, setCars] = useState<CarRental[]>([])
  const [filteredCars, setFilteredCars] = useState<CarRental[]>([])
  const [selectedCar, setSelectedCar] = useState<CarRental | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'category' | 'company'>('price')
  const [searchDays, setSearchDays] = useState(1)
  const [filters, setFilters] = useState<CarFilters>({
    priceRange: [20, 200],
    categories: [],
    companies: [],
    transmission: [],
    fuelType: [],
    passengers: 2,
    features: [],
    rating: 0
  })

  const popularLocations = [
    'Addis Ababa - Bole Airport',
    'Addis Ababa - City Center',
    'Bahir Dar',
    'Gondar',
    'Lalibela',
    'Hawassa',
    'Arba Minch',
    'Axum'
  ]

  // Mock car rental data
  const mockCars: CarRental[] = [
    {
      id: 'eco-001',
      name: 'Toyota Corolla',
      category: 'economy',
      company: 'Budget Car Rental',
      image: '/images/cars/corolla.jpg',
      features: ['Bluetooth', 'USB Charging', 'Power Steering'],
      pricePerDay: 35,
      totalPrice: 35 * searchDays,
      passengers: 5,
      luggage: 2,
      doors: 4,
      transmission: 'manual',
      fuelType: 'petrol',
      airConditioning: true,
      gps: false,
      insurance: ['Third Party', 'Collision Damage Waiver'],
      rating: 4.2,
      reviews: 156,
      availability: true,
      fuelPolicy: 'Full to Full',
      mileage: 'Unlimited',
      deposit: 200,
      location: 'Addis Ababa Airport'
    },
    {
      id: 'suv-001',
      name: 'Toyota Land Cruiser',
      category: 'suv',
      company: 'Ethiopian Car Rental',
      image: '/images/cars/landcruiser.jpg',
      features: ['4WD', 'Roof Rack', 'Spare Tire', 'Tool Kit', 'First Aid Kit'],
      pricePerDay: 85,
      totalPrice: 85 * searchDays,
      passengers: 7,
      luggage: 5,
      doors: 5,
      transmission: 'automatic',
      fuelType: 'diesel',
      airConditioning: true,
      gps: true,
      insurance: ['Full Coverage', 'Third Party', 'Theft Protection'],
      rating: 4.7,
      reviews: 89,
      availability: true,
      fuelPolicy: 'Full to Full',
      mileage: 'Unlimited',
      deposit: 500,
      location: 'Addis Ababa City Center'
    },
    {
      id: 'comp-001',
      name: 'Hyundai Elantra',
      category: 'compact',
      company: 'Hertz Ethiopia',
      image: '/images/cars/elantra.jpg',
      features: ['Automatic', 'Bluetooth', 'Backup Camera', 'Cruise Control'],
      pricePerDay: 45,
      totalPrice: 45 * searchDays,
      passengers: 5,
      luggage: 3,
      doors: 4,
      transmission: 'automatic',
      fuelType: 'petrol',
      airConditioning: true,
      gps: true,
      insurance: ['Third Party', 'Collision Damage Waiver'],
      rating: 4.4,
      reviews: 203,
      availability: true,
      fuelPolicy: 'Full to Full',
      mileage: 'Unlimited',
      deposit: 300,
      location: 'Bahir Dar'
    },
    {
      id: 'van-001',
      name: 'Toyota Hiace',
      category: 'van',
      company: 'Galaxy Express',
      image: '/images/cars/hiace.jpg',
      features: ['12 Seats', 'Large Storage', 'Power Steering', 'Radio/CD'],
      pricePerDay: 95,
      totalPrice: 95 * searchDays,
      passengers: 12,
      luggage: 8,
      doors: 4,
      transmission: 'manual',
      fuelType: 'diesel',
      airConditioning: true,
      gps: false,
      insurance: ['Third Party', 'Passenger Insurance'],
      rating: 4.1,
      reviews: 67,
      availability: true,
      fuelPolicy: 'Full to Full',
      mileage: 'Unlimited',
      deposit: 400,
      location: 'Gondar'
    },
    {
      id: 'lux-001',
      name: 'BMW X5',
      category: 'luxury',
      company: 'Premium Car Rental',
      image: '/images/cars/bmwx5.jpg',
      features: ['Leather Seats', 'Sunroof', 'Premium Sound', 'Navigation', 'Heated Seats'],
      pricePerDay: 150,
      totalPrice: 150 * searchDays,
      passengers: 5,
      luggage: 4,
      doors: 5,
      transmission: 'automatic',
      fuelType: 'petrol',
      airConditioning: true,
      gps: true,
      insurance: ['Full Coverage', 'Luxury Vehicle Protection'],
      rating: 4.8,
      reviews: 45,
      availability: false,
      fuelPolicy: 'Full to Full',
      mileage: 'Unlimited',
      deposit: 800,
      location: 'Addis Ababa Sheraton'
    },
    {
      id: 'eco-002',
      name: 'Suzuki Alto',
      category: 'economy',
      company: 'Budget Car Rental',
      image: '/images/cars/alto.jpg',
      features: ['Fuel Efficient', 'Easy Parking', 'Radio'],
      pricePerDay: 25,
      totalPrice: 25 * searchDays,
      passengers: 4,
      luggage: 1,
      doors: 4,
      transmission: 'manual',
      fuelType: 'petrol',
      airConditioning: false,
      gps: false,
      insurance: ['Third Party'],
      rating: 3.9,
      reviews: 124,
      availability: true,
      fuelPolicy: 'Full to Full',
      mileage: 'Unlimited',
      deposit: 150,
      location: 'Hawassa'
    }
  ]

  const availableCompanies = Array.from(new Set(mockCars.map(c => c.company)))

  // Calculate search days
  useEffect(() => {
    if (searchForm.pickupDate && searchForm.returnDate) {
      const pickup = new Date(searchForm.pickupDate)
      const returnDate = new Date(searchForm.returnDate)
      const diffTime = Math.abs(returnDate.getTime() - pickup.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setSearchDays(diffDays || 1)
    }
  }, [searchForm.pickupDate, searchForm.returnDate])

  // Filter and sort cars
  useEffect(() => {
    let filtered = [...cars]

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(c => filters.categories.includes(c.category))
    }

    if (filters.companies.length > 0) {
      filtered = filtered.filter(c => filters.companies.includes(c.company))
    }

    if (filters.transmission.length > 0) {
      filtered = filtered.filter(c => filters.transmission.includes(c.transmission))
    }

    if (filters.fuelType.length > 0) {
      filtered = filtered.filter(c => filters.fuelType.includes(c.fuelType))
    }

    if (filters.passengers > 2) {
      filtered = filtered.filter(c => c.passengers >= filters.passengers)
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(c => c.rating >= filters.rating)
    }

    // Price filter
    filtered = filtered.filter(c => 
      c.pricePerDay >= filters.priceRange[0] && c.pricePerDay <= filters.priceRange[1]
    )

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(c => {
        if (filters.features.includes('airConditioning') && !c.airConditioning) return false
        if (filters.features.includes('gps') && !c.gps) return false
        return true
      })
    }

    // Update total prices based on search days
    filtered = filtered.map(car => ({
      ...car,
      totalPrice: car.pricePerDay * searchDays
    }))

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerDay - b.pricePerDay
        case 'rating':
          return b.rating - a.rating
        case 'category':
          return a.category.localeCompare(b.category)
        case 'company':
          return a.company.localeCompare(b.company)
        default:
          return 0
      }
    })

    setFilteredCars(filtered)
  }, [cars, filters, sortBy, searchDays])

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setCars(mockCars)
      setIsSearching(false)
      setShowResults(true)
    }, 2000)
  }

  const handleInputChange = (field: keyof CarSearchForm, value: any) => {
    setSearchForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSelectCar = (car: CarRental) => {
    // Add to booking logic will be implemented in Phase 4
    alert(`Car ${car.name} selected! This will be integrated with the booking system.`)
  }

  const handleViewDetails = (car: CarRental) => {
    setSelectedCar(car)
    setShowDetailsModal(true)
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [20, 200],
      categories: [],
      companies: [],
      transmission: [],
      fuelType: [],
      passengers: 2,
      features: [],
      rating: 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={() => navigate('/transport')}
            variant="outline"
            className="mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Transport
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Car Rental</h1>
            <p className="text-gray-600">Rent a car for your Ethiopian adventure</p>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Location */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter city or airport"
                  value={searchForm.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Pickup Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date & Time</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={searchForm.pickupDate}
                    onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    className="w-full pl-10 pr-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="time"
                  value={searchForm.pickupTime}
                  onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Return Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Date & Time</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={searchForm.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    className="w-full pl-10 pr-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="time"
                  value={searchForm.returnTime}
                  onChange={(e) => handleInputChange('returnTime', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Driver Age and Search */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Driver Age</label>
              <select
                value={searchForm.driverAge}
                onChange={(e) => handleInputChange('driverAge', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {Array.from({ length: 56 }, (_, i) => i + 18).map(age => (
                  <option key={age} value={age}>{age} years old</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2 flex items-end">
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchForm.location || !searchForm.pickupDate || !searchForm.returnDate}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch className="mr-2" />
                    Search Cars
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Popular Locations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Pickup Locations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularLocations.map((location) => (
              <button
                key={location}
                onClick={() => handleInputChange('location', location)}
                className="p-3 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <FaMapMarkerAlt className="text-green-600 mb-1" />
                <div className="text-sm font-medium">{location}</div>
              </button>
            ))}
          </div>
        </div>



        {/* Search Results */}
        {showResults && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredCars.length} Cars Available
                </h2>
                <p className="text-gray-600">
                  {searchForm.location} • {searchForm.pickupDate} to {searchForm.returnDate} ({searchDays} days)
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <FaSort className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="price">Price (Low to High)</option>
                    <option value="rating">Rating (Highest)</option>
                    <option value="category">Category</option>
                    <option value="company">Company</option>
                  </select>
                </div>

                {/* Filters */}
                <CarFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  isOpen={showFilters}
                  onToggle={() => setShowFilters(!showFilters)}
                  availableCompanies={availableCompanies}
                />
              </div>
            </div>

            {/* Car Results */}
            {filteredCars.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
                {filteredCars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onSelect={handleSelectCar}
                    onViewDetails={handleViewDetails}
                    searchDays={searchDays}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No cars found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria or filters to find more options.
                </p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Success Message */}
            {filteredCars.length > 0 && (
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-600 mr-2" />
                  <span className="text-green-800">
                    Found {filteredCars.length} available cars for your dates
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Car Details Modal */}
        <CarDetailsModal
          car={selectedCar}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onSelect={handleSelectCar}
          searchDays={searchDays}
          pickupDate={searchForm.pickupDate}
          returnDate={searchForm.returnDate}
        />

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaShieldAlt className="text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Full Insurance</h3>
            <p className="text-sm text-gray-600">Comprehensive coverage included</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaRoad className="text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">GPS Navigation</h3>
            <p className="text-sm text-gray-600">Free GPS with all rentals</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaStar className="text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">24/7 Support</h3>
            <p className="text-sm text-gray-600">Round-the-clock assistance</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaDollarSign className="text-orange-600" />
            </div>
            <h3 className="font-semibold mb-1">Best Rates</h3>
            <p className="text-sm text-gray-600">Competitive pricing guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarRentalPage