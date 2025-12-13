import React from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaFilter, FaTimes, FaCar, FaDollarSign, FaUsers,
  FaCog, FaGasPump, FaShieldAlt, FaStar, FaSnowflake, FaRoad
} from 'react-icons/fa'

export interface CarFilters {
  priceRange: [number, number]
  categories: string[]
  companies: string[]
  transmission: string[]
  fuelType: string[]
  passengers: number
  features: string[]
  rating: number
}

interface CarFiltersProps {
  filters: CarFilters
  onFiltersChange: (filters: CarFilters) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
  availableCompanies: string[]
}

const CarFiltersComponent: React.FC<CarFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
  availableCompanies
}) => {
  const updateFilter = (key: keyof CarFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: 'categories' | 'companies' | 'transmission' | 'fuelType' | 'features', value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const categoryOptions = [
    { value: 'economy', label: 'Economy', color: 'text-green-600' },
    { value: 'compact', label: 'Compact', color: 'text-blue-600' },
    { value: 'suv', label: 'SUV', color: 'text-orange-600' },
    { value: 'luxury', label: 'Luxury', color: 'text-purple-600' },
    { value: 'van', label: 'Van/Minibus', color: 'text-gray-600' }
  ]

  const transmissionOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' }
  ]

  const fuelTypeOptions = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' }
  ]

  const featureOptions = [
    { value: 'airConditioning', label: 'Air Conditioning', icon: FaSnowflake },
    { value: 'gps', label: 'GPS Navigation', icon: FaRoad },
    { value: 'bluetooth', label: 'Bluetooth', icon: FaCar },
    { value: 'usb', label: 'USB Charging', icon: FaCar },
    { value: 'backup_camera', label: 'Backup Camera', icon: FaCar },
    { value: 'cruise_control', label: 'Cruise Control', icon: FaCar }
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
        {(filters.categories.length > 0 || filters.companies.length > 0 || filters.features.length > 0 || filters.rating > 0) && (
          <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-10 p-6 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filter Cars</h3>
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
                Price Range (per day)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="20"
                  max="200"
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

            {/* Car Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaCar className="inline mr-2" />
                Car Categories
              </label>
              <div className="space-y-2">
                {categoryOptions.map(category => (
                  <label key={category.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.value)}
                      onChange={() => toggleArrayFilter('categories', category.value)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${category.color}`}>{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rental Companies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rental Companies
              </label>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {availableCompanies.map(company => (
                  <label key={company} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.companies.includes(company)}
                      onChange={() => toggleArrayFilter('companies', company)}
                      className="mr-2"
                    />
                    <span className="text-sm">{company}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaCog className="inline mr-2" />
                Transmission
              </label>
              <div className="grid grid-cols-2 gap-2">
                {transmissionOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleArrayFilter('transmission', option.value)}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      filters.transmission.includes(option.value)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaGasPump className="inline mr-2" />
                Fuel Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {fuelTypeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleArrayFilter('fuelType', option.value)}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      filters.fuelType.includes(option.value)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaUsers className="inline mr-2" />
                Minimum Passengers
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 5, 7].map(count => (
                  <button
                    key={count}
                    onClick={() => updateFilter('passengers', count)}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      filters.passengers === count
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {count}+
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Features
              </label>
              <div className="space-y-2">
                {featureOptions.map(option => {
                  const IconComponent = option.icon
                  return (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(option.value)}
                        onChange={() => toggleArrayFilter('features', option.value)}
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

export default CarFiltersComponent