import React from 'react'
import { TripPreferencesData } from '../pages/GenerateItineraryPage'
import {
  FaCalendarAlt, FaDollarSign, FaUsers, FaHeart, FaClock,
  FaHotel, FaCar, FaUtensils, FaWheelchair, FaStickyNote
} from 'react-icons/fa'

interface TripPreferencesProps {
  preferences: TripPreferencesData
  onPreferencesChange: (preferences: TripPreferencesData) => void
  currentStep: number
}

const TripPreferences: React.FC<TripPreferencesProps> = ({
  preferences,
  onPreferencesChange,
  currentStep
}) => {
  const updatePreference = (key: keyof TripPreferencesData, value: any) => {
    onPreferencesChange({ ...preferences, [key]: value })
  }

  const toggleInterest = (interest: string) => {
    const newInterests = preferences.interests.includes(interest)
      ? preferences.interests.filter(i => i !== interest)
      : [...preferences.interests, interest]
    updatePreference('interests', newInterests)
  }

  const toggleArrayItem = (key: 'dietaryRestrictions' | 'accessibility', item: string) => {
    const currentArray = preferences[key]
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item]
    updatePreference(key, newArray)
  }

  // Step 1: Trip Basics
  if (currentStep === 1) {
    return (
      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <FaCalendarAlt className="inline mr-2" />
              Travel Dates
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={preferences.startDate}
                  onChange={(e) => updatePreference('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={preferences.endDate}
                  onChange={(e) => updatePreference('endDate', e.target.value)}
                  min={preferences.startDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Budget & Travelers */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaDollarSign className="inline mr-2" />
                Budget (USD)
              </label>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={preferences.budget}
                onChange={(e) => updatePreference('budget', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>$500</span>
                <span className="font-semibold text-purple-600">${preferences.budget}</span>
                <span>$5000+</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FaUsers className="inline mr-2" />
                Number of Travelers
              </label>
              <select
                value={preferences.travelers}
                onChange={(e) => updatePreference('travelers', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Destination Info */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Destination: Ethiopia 🇪🇹</h3>
          <p className="text-blue-800 mb-4">
            Discover the cradle of humanity with ancient rock churches, stunning landscapes, 
            unique wildlife, and rich cultural heritage spanning over 3,000 years.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Best Time:</strong> October - March (dry season)
            </div>
            <div>
              <strong>Currency:</strong> Ethiopian Birr (ETB)
            </div>
            <div>
              <strong>Language:</strong> Amharic, English widely spoken
            </div>
          </div>
        </div>
      </div>
    )
  } 
 // Step 2: Interests & Pace
  if (currentStep === 2) {
    const interests = [
      { id: 'history', label: 'Historical Sites', icon: '🏛️', desc: 'Ancient churches, castles, monuments' },
      { id: 'culture', label: 'Cultural Experiences', icon: '🎭', desc: 'Local traditions, festivals, ceremonies' },
      { id: 'nature', label: 'Nature & Wildlife', icon: '🦁', desc: 'National parks, endemic species' },
      { id: 'adventure', label: 'Adventure Activities', icon: '🏔️', desc: 'Hiking, trekking, climbing' },
      { id: 'food', label: 'Food & Cuisine', icon: '🍽️', desc: 'Traditional dishes, coffee ceremony' },
      { id: 'photography', label: 'Photography', icon: '📸', desc: 'Scenic landscapes, cultural shots' },
      { id: 'religion', label: 'Religious Sites', icon: '⛪', desc: 'Churches, monasteries, pilgrimages' },
      { id: 'markets', label: 'Markets & Shopping', icon: '🛍️', desc: 'Local crafts, spices, textiles' },
      { id: 'music', label: 'Music & Dance', icon: '🎵', desc: 'Traditional performances, live music' },
      { id: 'wellness', label: 'Wellness & Relaxation', icon: '🧘', desc: 'Spas, hot springs, meditation' }
    ]

    const paceOptions = [
      { id: 'relaxed', label: 'Relaxed', desc: '2-3 activities per day, plenty of rest time', icon: '🐌' },
      { id: 'moderate', label: 'Moderate', desc: '3-4 activities per day, balanced schedule', icon: '🚶' },
      { id: 'packed', label: 'Packed', desc: '5+ activities per day, maximize experiences', icon: '🏃' }
    ]

    return (
      <div className="p-8">
        {/* Interests */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <FaHeart className="inline mr-2" />
            What interests you most? (Select all that apply)
          </label>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  preferences.interests.includes(interest.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-2">{interest.icon}</div>
                <div className="font-semibold text-gray-900 mb-1">{interest.label}</div>
                <div className="text-sm text-gray-600">{interest.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Travel Pace */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <FaClock className="inline mr-2" />
            What's your preferred travel pace?
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {paceOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => updatePreference('pace', option.id)}
                className={`p-6 border-2 rounded-xl text-center transition-all ${
                  preferences.pace === option.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-3">{option.icon}</div>
                <div className="font-semibold text-gray-900 mb-2">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Preferences
  if (currentStep === 3) {
    const accommodationOptions = [
      { id: 'budget', label: 'Budget', desc: 'Hostels, guesthouses ($20-40/night)', icon: '🏠' },
      { id: 'mid-range', label: 'Mid-Range', desc: 'Hotels, lodges ($40-100/night)', icon: '🏨' },
      { id: 'luxury', label: 'Luxury', desc: 'Resorts, premium hotels ($100+/night)', icon: '🏰' }
    ]

    const transportationOptions = [
      { id: 'walking', label: 'Walking', desc: 'Explore on foot when possible', icon: '🚶' },
      { id: 'public', label: 'Public Transport', desc: 'Buses, shared taxis', icon: '🚌' },
      { id: 'private', label: 'Private Transport', desc: 'Rental car, private driver', icon: '🚗' },
      { id: 'mixed', label: 'Mixed', desc: 'Combination based on situation', icon: '🔄' }
    ]

    const dietaryOptions = [
      'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free', 'No spicy food', 'No alcohol'
    ]

    const accessibilityOptions = [
      'Wheelchair accessible', 'Mobility assistance', 'Visual impairment support', 
      'Hearing impairment support', 'Elderly-friendly'
    ]

    return (
      <div className="p-8 space-y-8">
        {/* Accommodation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <FaHotel className="inline mr-2" />
            Accommodation Preference
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {accommodationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => updatePreference('accommodation', option.id)}
                className={`p-4 border-2 rounded-xl text-center transition-all ${
                  preferences.accommodation === option.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Transportation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <FaCar className="inline mr-2" />
            Transportation Preference
          </label>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {transportationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => updatePreference('transportation', option.id)}
                className={`p-4 border-2 rounded-xl text-center transition-all ${
                  preferences.transportation === option.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                <div className="text-xs text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <FaUtensils className="inline mr-2" />
            Dietary Restrictions (Optional)
          </label>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
            {dietaryOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.dietaryRestrictions.includes(option)}
                  onChange={() => toggleArrayItem('dietaryRestrictions', option)}
                  className="mr-2"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Accessibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <FaWheelchair className="inline mr-2" />
            Accessibility Needs (Optional)
          </label>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {accessibilityOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.accessibility.includes(option)}
                  onChange={() => toggleArrayItem('accessibility', option)}
                  className="mr-2"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <FaStickyNote className="inline mr-2" />
            Special Requests or Notes (Optional)
          </label>
          <textarea
            value={preferences.specialRequests}
            onChange={(e) => updatePreference('specialRequests', e.target.value)}
            placeholder="Any special requests, celebrations, or specific places you'd like to visit..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>
      </div>
    )
  }

  return null
}

export default TripPreferences