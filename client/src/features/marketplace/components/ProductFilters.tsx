import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaFilter, FaTimes, FaStar, FaCheck, FaTruck, FaShieldAlt,
  FaTag, FaMapMarkerAlt, FaDollarSign, FaChevronDown, FaChevronUp,
  FaFlag
} from 'react-icons/fa'

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  rating: number
  availability: string[]
  shipping: string[]
  vendors: string[]
  features: string[]
  madeInEthiopia: boolean
}

interface ProductFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  categories: string[]
  vendors: string[]
  priceRange: [number, number]
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  vendors,
  priceRange
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'price', 'rating', 'availability'])
  )

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: [min, max] })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, rating: filters.rating === rating ? 0 : rating })
  }

  const handleAvailabilityChange = (availability: string) => {
    const newAvailability = filters.availability.includes(availability)
      ? filters.availability.filter(a => a !== availability)
      : [...filters.availability, availability]
    
    onFiltersChange({ ...filters, availability: newAvailability })
  }

  const handleShippingChange = (shipping: string) => {
    const newShipping = filters.shipping.includes(shipping)
      ? filters.shipping.filter(s => s !== shipping)
      : [...filters.shipping, shipping]
    
    onFiltersChange({ ...filters, shipping: newShipping })
  }

  const handleVendorChange = (vendor: string) => {
    const newVendors = filters.vendors.includes(vendor)
      ? filters.vendors.filter(v => v !== vendor)
      : [...filters.vendors, vendor]
    
    onFiltersChange({ ...filters, vendors: newVendors })
  }

  const handleFeatureChange = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature]
    
    onFiltersChange({ ...filters, features: newFeatures })
  }

  const handleMadeInEthiopiaChange = () => {
    onFiltersChange({ ...filters, madeInEthiopia: !filters.madeInEthiopia })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: priceRange,
      rating: 0,
      availability: [],
      shipping: [],
      vendors: [],
      features: [],
      madeInEthiopia: false
    })
  }

  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      (filters.rating > 0 ? 1 : 0) +
      filters.availability.length +
      filters.shipping.length +
      filters.vendors.length +
      filters.features.length +
      (filters.madeInEthiopia ? 1 : 0) +
      (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1] ? 1 : 0)
    )
  }

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`${interactive ? 'cursor-pointer' : ''} ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        onClick={interactive ? () => handleRatingChange(i + 1) : undefined}
      />
    ))
  }

  const FilterSection: React.FC<{
    title: string
    icon: React.ReactNode
    sectionKey: string
    children: React.ReactNode
  }> = ({ title, icon, sectionKey, children }) => {
    const isExpanded = expandedSections.has(sectionKey)
    
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            {icon}
            <span className="text-sm sm:text-base font-medium text-gray-900 ml-2">{title}</span>
          </div>
          {isExpanded ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
        </button>
        
        {isExpanded && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  const availabilityOptions = [
    { value: 'in-stock', label: 'In Stock', icon: <FaCheck className="text-green-600" /> },
    { value: 'limited', label: 'Limited Stock', icon: <FaCheck className="text-yellow-600" /> },
    { value: 'out-of-stock', label: 'Out of Stock', icon: <FaTimes className="text-red-600" /> }
  ]

  const shippingOptions = [
    { value: 'free', label: 'Free Shipping', icon: <FaTruck className="text-green-600" /> },
    { value: 'fast', label: 'Fast Delivery', icon: <FaTruck className="text-blue-600" /> }
  ]

  const commonFeatures = [
    'Handmade', 'Organic', 'Fair Trade', 'Traditional', 'Authentic',
    'Limited Edition', 'Eco-Friendly', 'Artisan Made'
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaFilter className="text-blue-600 mr-2" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          
          {getActiveFiltersCount() > 0 && (
            <Button
              onClick={clearAllFilters}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Categories */}
      <FilterSection
        title="Categories"
        icon={<FaTag className="text-purple-600" />}
        sectionKey="categories"
      >
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        icon={<FaDollarSign className="text-green-600" />}
        sectionKey="price"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange[1])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={priceRange[0]}
                max={priceRange[1]}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={priceRange[0]}
                max={priceRange[1]}
              />
            </div>
          </div>
          
          <div className="px-2">
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection
        title="Minimum Rating"
        icon={<FaStar className="text-yellow-600" />}
        sectionKey="rating"
      >
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-2 flex items-center">
                {renderStars(rating)}
                <span className="ml-2 text-sm text-gray-700">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection
        title="Availability"
        icon={<FaCheck className="text-green-600" />}
        sectionKey="availability"
      >
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.availability.includes(option.value)}
                onChange={() => handleAvailabilityChange(option.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-2 flex items-center">
                {option.icon}
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Shipping */}
      <FilterSection
        title="Shipping"
        icon={<FaTruck className="text-blue-600" />}
        sectionKey="shipping"
      >
        <div className="space-y-2">
          {shippingOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.shipping.includes(option.value)}
                onChange={() => handleShippingChange(option.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-2 flex items-center">
                {option.icon}
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Vendors */}
      <FilterSection
        title="Vendors"
        icon={<FaMapMarkerAlt className="text-orange-600" />}
        sectionKey="vendors"
      >
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {vendors.map((vendor) => (
            <label key={vendor} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.vendors.includes(vendor)}
                onChange={() => handleVendorChange(vendor)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-2 flex items-center">
                <FaShieldAlt className="text-blue-500 mr-1" />
                <span className="text-sm text-gray-700">{vendor}</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Made in Ethiopia */}
      <FilterSection
        title="Origin"
        icon={<FaFlag className="text-blue-600" />}
        sectionKey="origin"
      >
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="checkbox"
              checked={filters.madeInEthiopia}
              onChange={handleMadeInEthiopiaChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-2 flex items-center">
              <FaFlag className="text-blue-500 mr-1" />
              <span className="text-sm text-gray-700 font-medium">Made in Ethiopia</span>
            </div>
          </label>
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection
        title="Features"
        icon={<FaTag className="text-indigo-600" />}
        sectionKey="features"
      >
        <div className="space-y-2">
          {commonFeatures.map((feature) => (
            <label key={feature} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.features.includes(feature)}
                onChange={() => handleFeatureChange(feature)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{feature}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

export default ProductFilters