import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import FlightCard, { Flight } from '../components/FlightCard'
import FlightDetailsModal from '../components/FlightDetailsModal'
import FlightFiltersComponent, { FlightFilters } from '../components/FlightFilters'
import {
  FaPlane, FaArrowLeft, FaSearch, FaCalendarAlt,
  FaUsers, FaMapMarkerAlt, FaClock, FaDollarSign,
  FaStar, FaWifi, FaSort, FaCheckCircle
} from 'react-icons/fa'

interface FlightSearchForm {
  from: string
  to: string
  departDate: string
  returnDate?: string
  passengers: number
  tripType: 'oneWay' | 'roundTrip'
  class: 'economy' | 'business' | 'first'
}

const FlightsPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchForm, setSearchForm] = useState<FlightSearchForm>({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'roundTrip',
    class: 'economy'
  })
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [flights, setFlights] = useState<Flight[]>([])
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure' | 'rating'>('price')
  const [filters, setFilters] = useState<FlightFilters>({
    priceRange: [50, 2000],
    maxStops: 2,
    airlines: [],
    departureTime: [],
    amenities: [],
    rating: 0
  })

  const popularDestinations = [
    { code: 'ADD', city: 'Addis Ababa', country: 'Ethiopia' },
    { code: 'LLI', city: 'Lalibela', country: 'Ethiopia' },
    { code: 'BJR', city: 'Bahir Dar', country: 'Ethiopia' },
    { code: 'AXU', city: 'Axum', country: 'Ethiopia' },
    { code: 'DIR', city: 'Dire Dawa', country: 'Ethiopia' },
    { code: 'JIJ', city: 'Jijiga', country: 'Ethiopia' }
  ]

  // Mock flight data
  const mockFlights: Flight[] = [
    {
      id: 'ET101',
      airline: 'Ethiopian Airlines',
      airlineCode: 'ET',
      flightNumber: 'ET 101',
      aircraft: 'Boeing 737-800',
      departure: {
        airport: 'Bole International Airport',
        airportCode: 'ADD',
        city: 'Addis Ababa',
        time: '08:30',
        date: '2024-01-15',
        terminal: '2'
      },
      arrival: {
        airport: 'Lalibela Airport',
        airportCode: 'LLI',
        city: 'Lalibela',
        time: '09:45',
        date: '2024-01-15'
      },
      duration: '1h 15m',
      stops: 0,
      price: {
        economy: 189,
        business: 389
      },
      amenities: ['wifi', 'meals', 'entertainment'],
      baggage: {
        carry: '7kg',
        checked: '23kg'
      },
      rating: 4.5,
      reviews: 1250,
      availability: {
        economy: 12,
        business: 4,
        first: 0
      }
    },
    {
      id: 'ET205',
      airline: 'Ethiopian Airlines',
      airlineCode: 'ET',
      flightNumber: 'ET 205',
      aircraft: 'Bombardier Q400',
      departure: {
        airport: 'Bole International Airport',
        airportCode: 'ADD',
        city: 'Addis Ababa',
        time: '14:20',
        date: '2024-01-15',
        terminal: '2'
      },
      arrival: {
        airport: 'Bahir Dar Airport',
        airportCode: 'BJR',
        city: 'Bahir Dar',
        time: '15:30',
        date: '2024-01-15'
      },
      duration: '1h 10m',
      stops: 0,
      price: {
        economy: 165,
        business: 325
      },
      amenities: ['meals'],
      baggage: {
        carry: '7kg',
        checked: '23kg'
      },
      rating: 4.3,
      reviews: 890,
      availability: {
        economy: 8,
        business: 2,
        first: 0
      }
    },
    {
      id: 'ET301',
      airline: 'Ethiopian Airlines',
      airlineCode: 'ET',
      flightNumber: 'ET 301',
      aircraft: 'Boeing 737-800',
      departure: {
        airport: 'Bole International Airport',
        airportCode: 'ADD',
        city: 'Addis Ababa',
        time: '06:15',
        date: '2024-01-15',
        terminal: '2'
      },
      arrival: {
        airport: 'Axum Airport',
        airportCode: 'AXU',
        city: 'Axum',
        time: '08:45',
        date: '2024-01-15'
      },
      duration: '2h 30m',
      stops: 1,
      stopDetails: [
        { airport: 'Mekelle Airport', duration: '45m' }
      ],
      price: {
        economy: 245,
        business: 485
      },
      amenities: ['wifi', 'meals', 'entertainment'],
      baggage: {
        carry: '7kg',
        checked: '23kg'
      },
      rating: 4.4,
      reviews: 675,
      availability: {
        economy: 15,
        business: 6,
        first: 0
      }
    },
    {
      id: 'AB150',
      airline: 'ASKY Airlines',
      airlineCode: 'KP',
      flightNumber: 'KP 150',
      aircraft: 'Boeing 737-700',
      departure: {
        airport: 'Bole International Airport',
        airportCode: 'ADD',
        city: 'Addis Ababa',
        time: '11:45',
        date: '2024-01-15',
        terminal: '2'
      },
      arrival: {
        airport: 'Dire Dawa Airport',
        airportCode: 'DIR',
        city: 'Dire Dawa',
        time: '12:55',
        date: '2024-01-15'
      },
      duration: '1h 10m',
      stops: 0,
      price: {
        economy: 195,
        business: 395
      },
      amenities: ['meals'],
      baggage: {
        carry: '7kg',
        checked: '20kg'
      },
      rating: 4.1,
      reviews: 420,
      availability: {
        economy: 20,
        business: 8,
        first: 0
      }
    }
  ]

  const availableAirlines = Array.from(new Set(mockFlights.map(f => f.airline)))

  // Filter and sort flights
  useEffect(() => {
    let filtered = [...flights]

    // Apply filters
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(f => filters.airlines.includes(f.airline))
    }

    if (filters.maxStops < 2) {
      filtered = filtered.filter(f => f.stops <= filters.maxStops)
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(f => f.rating >= filters.rating)
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(f => 
        filters.amenities.every(amenity => f.amenities.includes(amenity))
      )
    }

    // Price filter
    const classKey = searchForm.class as keyof typeof filtered[0]['price']
    filtered = filtered.filter(f => {
      const price = f.price[classKey] || f.price.economy
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Sort flights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = a.price[classKey] || a.price.economy
          const priceB = b.price[classKey] || b.price.economy
          return priceA - priceB
        case 'duration':
          const durationA = parseInt(a.duration.replace(/[^\d]/g, ''))
          const durationB = parseInt(b.duration.replace(/[^\d]/g, ''))
          return durationA - durationB
        case 'departure':
          return a.departure.time.localeCompare(b.departure.time)
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

    setFilteredFlights(filtered)
  }, [flights, filters, sortBy, searchForm.class])

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setFlights(mockFlights)
      setIsSearching(false)
      setShowResults(true)
    }, 2000)
  }

  const handleInputChange = (field: keyof FlightSearchForm, value: any) => {
    setSearchForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSelectFlight = (flight: Flight) => {
    // Add to itinerary logic will be implemented in Phase 4
    alert(`Flight ${flight.flightNumber} selected! This will be integrated with the itinerary planner.`)
  }

  const handleViewDetails = (flight: Flight) => {
    setSelectedFlight(flight)
    setShowDetailsModal(true)
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [50, 2000],
      maxStops: 2,
      airlines: [],
      departureTime: [],
      amenities: [],
      rating: 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
            <h1 className="text-3xl font-bold text-gray-900">Flight Search</h1>
            <p className="text-gray-600">Find the best flights for your Ethiopian journey</p>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Trip Type Selection */}
          <div className="flex gap-4 mb-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="tripType"
                value="roundTrip"
                checked={searchForm.tripType === 'roundTrip'}
                onChange={(e) => handleInputChange('tripType', e.target.value)}
                className="mr-2"
              />
              Round Trip
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tripType"
                value="oneWay"
                checked={searchForm.tripType === 'oneWay'}
                onChange={(e) => handleInputChange('tripType', e.target.value)}
                className="mr-2"
              />
              One Way
            </label>
          </div>

          {/* Search Fields */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* From */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Departure city"
                  value={searchForm.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Destination city"
                  value={searchForm.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  value={searchForm.departDate}
                  onChange={(e) => handleInputChange('departDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Return Date */}
            {searchForm.tripType === 'roundTrip' && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={searchForm.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
              <div className="relative">
                <FaUsers className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={searchForm.passengers}
                  onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={searchForm.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchForm.from || !searchForm.to || !searchForm.departDate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch className="mr-2" />
                    Search Flights
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Destinations in Ethiopia</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((dest) => (
              <button
                key={dest.code}
                onClick={() => {
                  if (!searchForm.from) {
                    handleInputChange('from', `${dest.city} (${dest.code})`)
                  } else {
                    handleInputChange('to', `${dest.city} (${dest.code})`)
                  }
                }}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
              >
                <FaPlane className="text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-sm">{dest.city}</div>
                <div className="text-xs text-gray-500">{dest.code}</div>
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
                  {filteredFlights.length} Flights Found
                </h2>
                <p className="text-gray-600">
                  {searchForm.from} → {searchForm.to} • {searchForm.departDate}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <FaSort className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="price">Price (Low to High)</option>
                    <option value="duration">Duration (Shortest)</option>
                    <option value="departure">Departure Time</option>
                    <option value="rating">Rating (Highest)</option>
                  </select>
                </div>

                {/* Filters */}
                <FlightFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  isOpen={showFilters}
                  onToggle={() => setShowFilters(!showFilters)}
                  availableAirlines={availableAirlines}
                />
              </div>
            </div>

            {/* Flight Results */}
            {filteredFlights.length > 0 ? (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    selectedClass={searchForm.class}
                    onSelect={handleSelectFlight}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No flights found</h3>
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
            {filteredFlights.length > 0 && (
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-600 mr-2" />
                  <span className="text-green-800">
                    Found {filteredFlights.length} available flights for your search criteria
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Flight Details Modal */}
        <FlightDetailsModal
          flight={selectedFlight}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onSelect={handleSelectFlight}
          selectedClass={searchForm.class}
        />

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaDollarSign className="text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Best Prices</h3>
            <p className="text-sm text-gray-600">Compare prices from multiple airlines</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaClock className="text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Flexible Dates</h3>
            <p className="text-sm text-gray-600">Find cheaper flights on nearby dates</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaStar className="text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Top Airlines</h3>
            <p className="text-sm text-gray-600">Ethiopian Airlines and partners</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaWifi className="text-orange-600" />
            </div>
            <h3 className="font-semibold mb-1">Modern Fleet</h3>
            <p className="text-sm text-gray-600">WiFi, entertainment, and comfort</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightsPage