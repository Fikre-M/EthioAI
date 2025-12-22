import { useState } from 'react'
import { TourFilters as TourFiltersType, TourCategory, TourDifficulty } from '@/types/tour'

export interface TourFiltersProps {
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

const difficulties: { value: TourDifficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' },
  { value: 'extreme', label: 'Extreme' },
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

export const TourFilters = ({ filters, onFiltersChange, onReset }: TourFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)

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

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: [min, max] })
  }

  const handleDurationChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, duration: [min, max] })
  }

  const activeFiltersCount = 
    (filters.category?.length || 0) +
    (filters.difficulty?.length || 0) +
    (filters.region?.length || 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.duration ? 1 : 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
      >
        <span className="font-semibold">Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filters Content */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.category?.includes(cat.value) || false}
                  onChange={() => handleCategoryToggle(cat.value)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-600">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price Range (ETB)</h4>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange?.[0] || ''}
                onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange?.[1] || 50000)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange?.[1] || ''}
                onChange={(e) => handlePriceChange(filters.priceRange?.[0] || 0, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Duration (Days)</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.duration?.[0] || ''}
              onChange={(e) => handleDurationChange(Number(e.target.value), filters.duration?.[1] || 30)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.duration?.[1] || ''}
              onChange={(e) => handleDurationChange(filters.duration?.[0] || 1, Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            />
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
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-orange-600">
                  {diff.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Region</h4>
          <div className="space-y-2">
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
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onFiltersChange({ ...filters, rating })}
                className={`p-2 rounded-lg transition-colors ${
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
