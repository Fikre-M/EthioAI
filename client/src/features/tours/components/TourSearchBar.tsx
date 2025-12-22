import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@hooks/useDebounce'

export interface SearchSuggestion {
  id: string
  title: string
  type: 'tour' | 'location' | 'category'
  icon?: string
}

export interface TourSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (value: string) => void
  suggestions?: SearchSuggestion[]
  isLoading?: boolean
}

export const TourSearchBar = ({
  value,
  onChange,
  onSearch,
  suggestions = [],
  isLoading = false,
}: TourSearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const debouncedValue = useDebounce(value, 300)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Trigger search on debounced value change
  useEffect(() => {
    if (debouncedValue) {
      onSearch(debouncedValue)
    }
  }, [debouncedValue, onSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          onSearch(value)
          setIsFocused(false)
        }
        break
      case 'Escape':
        setIsFocused(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.title)
    onSearch(suggestion.title)
    setIsFocused(false)
    setSelectedIndex(-1)
  }

  const handleClear = () => {
    onChange('')
    onSearch('')
    inputRef.current?.focus()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tour':
        return '🎒'
      case 'location':
        return '📍'
      case 'category':
        return '🏷️'
      default:
        return '🔍'
    }
  }

  const showSuggestions = isFocused && value.length > 0 && suggestions.length > 0

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tours, destinations, or activities..."
          className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />

        {/* Loading or Clear Button */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : value ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  index === selectedIndex
                    ? 'bg-orange-50 dark:bg-orange-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xl flex-shrink-0">
                  {suggestion.icon || getTypeIcon(suggestion.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {suggestion.type}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
