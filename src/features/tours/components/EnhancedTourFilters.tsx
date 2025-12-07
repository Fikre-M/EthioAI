import { useState } from 'react'
import { TourFilters as TourFiltersType, TourCategory, TourDifficulty } from '@/types/tour'
import { PriceRangeSlider } from './PriceRangeSlider'
import { DateRangePicker, DateRange } from './DateRangePicker'

export interface EnhancedTourFiltersProps {
  filters: TourFiltersType
  onFiltersChange: (filters: TourFiltersType) => void
  onReset: () => void
}

const categories: { value: TourCategory; label: string; icon: string }[] = [
  { value: 'historical', label: 'Historical', icon: '🏛️' },
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'religious', label: 'Religious', icon: '⛪' },
  { value: 'wildlife', label: 'Wildlife', icon: '🦁' },
  { value: 'trekking', label: 'Trekking', icon: '🥾' },
  { value: 'city', label: 'City Tours', icon: '🏙️' },
]

const difficulties: { value: TourDifficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: 'text-green-600' },
  { value: 'moderate', label: 'Moderate', color: 'text-yellow-600' },
  { value: 'challenging', label: 'Challenging', color: 'text-orange-600' },
  { value: 'extreme', label: 'Extreme', color: 'text-red-600' },
]

const regions = [
  'Addis Ababa',
  'Amhara',
  'Oromia',
  'Tigray',
  'Southern Nations',
  'Afar',
  'Somali',
]

export const EnhancedTourFilters = ({ filters, onFiltersChange, onReset }: EnhancedTourFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null })

  const handleCategoryToggle = (category: TourCategory) => {
    const current = filters.category || []
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
    onFiltersChange({ ...filters, category: updated })
  }

  const handleDifficultyToggle = (difficulty: TourDifficulty) => {
    const current = filters.difficulty || []
    const updated = current.includes(difficulty)
      ? current.filter(d => d !== difficulty)
      : [...current, difficulty]
    onFiltersChange({ ...filters, difficulty: updated })
  }

  const handleRegionToggle = (region: string) => {
    const current = filters.region || []
    const updated = current.includes(region)
      ? current.filter(r => r !== region)
      : [...current, region]
    onFiltersChange({ ...filters, region: updated })
  }

  const handlePriceChange = (value: [number, number]) => {
    onFiltersChange({ ...filters, priceRange: value })
  }

  const handleDurationChange = (value: [number, number]) => {
    onFiltersChange({ ...filters, duration: value })
  }

  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value)
    // You can add date filtering logic here
  }

  const activeFiltersCount = 
    (filters.category?.length || 0) +
    (filters.difficulty?.length || 0) +
    (filters.region?.length || 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.duration ? 1 : 0) +
    (filters.rating ? 1 : 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-semibold text-gray-900 dark:text-white">
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filters Content */}
      <div className={`p-4 space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All
            </button>
          )}
        </div>

        {/* Date Range */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Travel Dates</h4>
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            minDate={new Date()}
          />
        </div>

        {/* Price Range Slider */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price Range</h4>
          <PriceRangeSlider
            min={0}
            max={50000}
            value={filters.priceRange || [0, 50000]}
            onChange={handlePriceChange}
            currency="ETB"
            step={500}
          />
        </div>

        {/* Duration Slider */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Duration (Days)</h4>
          <PriceRangeSlider
            min={1}
            max={30}
            value={filters.duration || [1, 30]}
            onChange={handleDurationChange}
            currency=""
            step={1}
          />
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryToggle(cat.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  filters.category?.includes(cat.value)
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Difficulty</h4>
          <div className="space-y-2">
            {difficulties.map((diff) => (
              <label key={diff.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.difficulty?.includes(diff.value) || false}
                  onChange={() => handleDifficultyToggle(diff.value)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className={`text-sm font-medium ${diff.color} group-hover:opacity-80`}>
                  {diff.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Region</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {regions.map((region) => (
              <label key={region} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.region?.includes(region) || false}
                  onChange={() => handleRegionToggle(region)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-600">
                  {region}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Minimum Rating</h4>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onFiltersChange({ ...filters, rating })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.rating === rating
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {rating}★
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
