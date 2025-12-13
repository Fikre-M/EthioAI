import React from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaFilter, FaTimes, FaClock, FaDollarSign, FaPlane,
  FaStar, FaWifi, FaUtensils
} from 'react-icons/fa'

export interface FlightFilters {
  priceRange: [number, number]
  maxStops: number
  airlines: string[]
  departureTime: string[]
  amenities: string[]
  rating: number
}

interface FlightFiltersProps {
  filters: FlightFilters
  onFiltersChange: (filters: FlightFilters) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
  availableAirlines: string[]
}

const FlightFiltersComponent: React.FC<FlightFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
  availableAirlines
}) => {
  const updateFilter = (key: keyof FlightFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: 'airlines' | 'departureTime' | 'amenities', value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const departureTimeOptions = [
    { value: 'early', label: 'Early Morning (6AM - 12PM)', icon: '🌅' },
    { value: 'afternoon', label: 'Afternoon (12PM - 6PM)', icon: '☀️' },
    { value: 'evening', label: 'Evening (6PM - 12AM)', icon: '🌆' },
    { value: 'night', label: 'Night (12AM - 6AM)', icon: '🌙' }
  ]

  const amenityOptions = [
    { value: 'wifi', label: 'WiFi', icon: FaWifi },
    { value: 'meals', label: 'Meals', icon: FaUtensils },
    { value: 'entertainment', label: 'Entertainment', icon: FaPlane }
  ]

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        onClick={onToggle}
        variant="outline"
        className="mb-4 md:mb-0"
      >
        <FaFilter className="mr-2" />
        Filters
        {(filters.airlines.length > 0 || filters.amenities.length > 0 || filters.rating > 0) && (
          <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filter Flights</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggle}
                className="p-1"
              >
                <FaTimes />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaDollarSign className="inline mr-2" />
                Price Range
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="50"
                  max="2000"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Stops */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaPlane className="inline mr-2" />
                Maximum Stops
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(stops => (
                  <button
                    key={stops}
                    onClick={() => updateFilter('maxStops', stops)}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      filters.maxStops === stops
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {stops === 0 ? 'Direct' : `${stops} Stop${stops > 1 ? 's' : ''}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Airlines */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Airlines
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableAirlines.map(airline => (
                  <label key={airline} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.airlines.includes(airline)}
                      onChange={() => toggleArrayFilter('airlines', airline)}
                      className="mr-2"
                    />
                    <span className="text-sm">{airline}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaClock className="inline mr-2" />
                Departure Time
              </label>
              <div className="space-y-2">
                {departureTimeOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.departureTime.includes(option.value)}
                      onChange={() => toggleArrayFilter('departureTime', option.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {option.icon} {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities
              </label>
              <div className="space-y-2">
                {amenityOptions.map(option => {
                  const IconComponent = option.icon
                  return (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(option.value)}
                        onChange={() => toggleArrayFilter('amenities', option.value)}
                        className="mr-2"
                      />
                      <IconComponent className="mr-2 text-gray-500" />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaStar className="inline mr-2" />
                Minimum Rating
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => updateFilter('rating', rating)}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      filters.rating === rating
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={onToggle}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlightFiltersComponent