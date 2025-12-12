import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '@store/slices/bookingSlice'
import { BookingFormData, BookingItem, AddOn } from '@/types/booking'
import { Tour } from '@/types/tour'
import { Button } from '@components/common/Button/Button'
import { Input } from '@components/common/Input/Input'
import { useAvailability } from '@/hooks/useAvailability'
import WaitlistModal from './WaitlistModal'
import { FaCalendar, FaUsers, FaChild, FaUtensils, FaCar, FaUserTie, FaPlus, FaMinus, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa'

interface BookingFormProps {
  tour: Tour
}

// Available add-ons for tours
const AVAILABLE_ADDONS: AddOn[] = [
  { id: 'meal-1', name: 'Traditional Ethiopian Lunch', price: 15, description: 'Authentic injera with various wots', type: 'meal' },
  { id: 'meal-2', name: 'Vegetarian Meal Package', price: 12, description: 'Plant-based Ethiopian cuisine', type: 'meal' },
  { id: 'transport-1', name: 'Hotel Pickup & Drop-off', price: 25, description: 'Convenient door-to-door service', type: 'transport' },
  { id: 'transport-2', name: 'Airport Transfer', price: 35, description: 'Direct airport transportation', type: 'transport' },
  { id: 'guide-1', name: 'Private Tour Guide', price: 50, description: 'Dedicated personal guide', type: 'guide' },
  { id: 'guide-2', name: 'Photography Guide', price: 40, description: 'Professional photo assistance', type: 'guide' },
]

// Mock unavailable dates (in production, fetch from API)
const UNAVAILABLE_DATES = [
  '2024-12-25',
  '2024-12-26',
  '2025-01-01',
]

export default function BookingForm({ tour }: BookingFormProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [formData, setFormData] = useState<BookingFormData>({
    tourId: tour.id,
    date: '',
    adults: 1,
    children: 0,
    selectedAddOns: [],
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  })

  const [showAvailability, setShowAvailability] = useState(false)
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  
  // Check availability when date changes
  const { availability, loading: availabilityLoading } = useAvailability(tour.id, formData.date)

  const isDateUnavailable = (date: string) => {
    return UNAVAILABLE_DATES.includes(date)
  }

  const getSelectedAddOns = (): AddOn[] => {
    return AVAILABLE_ADDONS.filter(addon => formData.selectedAddOns.includes(addon.id))
  }

  const calculateTotal = () => {
    const participantsTotal = (formData.adults * tour.price) + (formData.children * tour.price * 0.5)
    const addOnsTotal = getSelectedAddOns().reduce((sum, addon) => sum + addon.price, 0)
    return participantsTotal + addOnsTotal
  }

  const toggleAddOn = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(addonId)
        ? prev.selectedAddOns.filter(id => id !== addonId)
        : [...prev.selectedAddOns, addonId]
    }))
  }

  const updateParticipants = (type: 'adults' | 'children', increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      [type]: increment 
        ? Math.min(prev[type] + 1, 20)
        : Math.max(prev[type] - (type === 'adults' ? 1 : 0), type === 'adults' ? 1 : 0)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isDateUnavailable(formData.date)) {
      alert('Selected date is not available. Please choose another date.')
      return
    }
    
    const bookingItem: BookingItem = {
      id: `${tour.id}-${Date.now()}`,
      tourId: tour.id,
      tourName: tour.title,
      tourImage: tour.images?.[0] || '',
      date: formData.date,
      participants: {
        adults: formData.adults,
        children: formData.children,
      },
      pricePerAdult: tour.price,
      pricePerChild: tour.price * 0.5,
      addOns: getSelectedAddOns(),
      totalPrice: calculateTotal(),
      meetingPoint: tour.location,
      duration: tour.duration,
      specialRequests: formData.specialRequests,
    }

    dispatch(addToCart(bookingItem))
    navigate('/cart')
  }

  const getAddOnIcon = (type: string) => {
    switch (type) {
      case 'meal': return <FaUtensils className="text-orange-600" />
      case 'transport': return <FaCar className="text-blue-600" />
      case 'guide': return <FaUserTie className="text-green-600" />
      default: return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <FaCalendar className="text-orange-600" />
        Book This Tour
      </h2>

      {/* Date Selection with Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date *
        </label>
        <div className="relative">
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value })
              setShowAvailability(false)
            }}
            min={new Date().toISOString().split('T')[0]}
            className={isDateUnavailable(formData.date) && formData.date ? 'border-red-500' : ''}
            required
          />
          
          {/* Availability Indicator */}
          {formData.date && (
            <div className="mt-2">
              {availabilityLoading ? (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaSpinner className="animate-spin" />
                  <span>Checking availability...</span>
                </div>
              ) : availability ? (
                <>
                  {availability.isFullyBooked ? (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      <FaExclamationTriangle />
                      <span className="font-medium">Fully booked for this date</span>
                    </div>
                  ) : availability.spotsLeft <= 5 ? (
                    <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 p-3 rounded-lg">
                      <FaExclamationTriangle />
                      <span className="font-medium">Only {availability.spotsLeft} spot{availability.spotsLeft > 1 ? 's' : ''} left!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                      <FaCheckCircle />
                      <span className="font-medium">Available - {availability.spotsLeft} spots remaining</span>
                    </div>
                  )}
                </>
              ) : isDateUnavailable(formData.date) ? (
                <p className="text-red-600 text-sm">This date is not available</p>
              ) : null}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowAvailability(!showAvailability)}
          className="text-sm text-orange-600 hover:text-orange-700 mt-2"
        >
          {showAvailability ? 'Hide' : 'View'} availability calendar
        </button>
        {showAvailability && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium mb-2">Unavailable dates:</p>
            <div className="flex flex-wrap gap-2">
              {UNAVAILABLE_DATES.map(date => (
                <span key={date} className="px-2 py-1 bg-red-100 text-red-700 rounded">
                  {new Date(date).toLocaleDateString()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Guest Selector */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FaUsers className="text-orange-600" />
          Guests
        </h3>
        
        {/* Adults */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FaUsers className="text-gray-600" />
              <span className="font-medium">Adults</span>
            </div>
            <p className="text-sm text-gray-500">${tour.price} per person</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateParticipants('adults', false)}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-orange-600 hover:text-orange-600 transition-colors"
              disabled={formData.adults <= 1}
            >
              <FaMinus size={12} />
            </button>
            <span className="w-8 text-center font-semibold">{formData.adults}</span>
            <button
              type="button"
              onClick={() => updateParticipants('adults', true)}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-orange-600 hover:text-orange-600 transition-colors"
              disabled={formData.adults >= 20}
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FaChild className="text-gray-600" />
              <span className="font-medium">Children</span>
            </div>
            <p className="text-sm text-gray-500">${tour.price * 0.5} per child (50% off)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateParticipants('children', false)}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-orange-600 hover:text-orange-600 transition-colors"
              disabled={formData.children <= 0}
            >
              <FaMinus size={12} />
            </button>
            <span className="w-8 text-center font-semibold">{formData.children}</span>
            <button
              type="button"
              onClick={() => updateParticipants('children', true)}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-orange-600 hover:text-orange-600 transition-colors"
              disabled={formData.children >= 20}
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Add-ons Selection */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Enhance Your Experience</h3>
        <div className="space-y-3">
          {AVAILABLE_ADDONS.map(addon => (
            <label
              key={addon.id}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.selectedAddOns.includes(addon.id)
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.selectedAddOns.includes(addon.id)}
                onChange={() => toggleAddOn(addon.id)}
                className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getAddOnIcon(addon.type)}
                  <span className="font-medium">{addon.name}</span>
                  <span className="ml-auto font-semibold text-orange-600">+${addon.price}</span>
                </div>
                <p className="text-sm text-gray-600">{addon.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-gray-900">Contact Information</h3>
        
        <Input
          type="text"
          placeholder="Full Name *"
          value={formData.contactName}
          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
          required
        />

        <Input
          type="email"
          placeholder="Email Address *"
          value={formData.contactEmail}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          required
        />

        <Input
          type="tel"
          placeholder="Phone Number *"
          value={formData.contactPhone}
          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          required
        />
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Dietary restrictions, accessibility needs, special occasions, or any other requests..."
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.specialRequests?.length || 0}/500 characters
        </p>
      </div>

      {/* Enhanced Price Summary */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-5 rounded-lg space-y-3 border border-orange-200">
        <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Adults × {formData.adults}</span>
            <span className="font-medium">${formData.adults * tour.price}</span>
          </div>
          
          {formData.children > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Children × {formData.children}</span>
              <span className="font-medium">${formData.children * tour.price * 0.5}</span>
            </div>
          )}
          
          {getSelectedAddOns().length > 0 && (
            <>
              <div className="border-t border-orange-200 pt-2 mt-2">
                <p className="text-xs font-medium text-gray-600 mb-2">Add-ons:</p>
                {getSelectedAddOns().map(addon => (
                  <div key={addon.id} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{addon.name}</span>
                    <span className="font-medium">${addon.price}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-between items-center font-bold text-xl border-t-2 border-orange-300 pt-3 mt-3">
          <span className="text-gray-900">Total</span>
          <span className="text-orange-600">${calculateTotal()}</span>
        </div>
        
        <p className="text-xs text-gray-600 text-center mt-2">
          Free cancellation up to 24 hours before the tour
        </p>
      </div>

      {/* Submit Button or Waitlist */}
      {availability?.isFullyBooked ? (
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full py-4 text-lg font-semibold border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={() => setShowWaitlistModal(true)}
          >
            Join Waitlist
          </Button>
          <p className="text-xs text-gray-500 text-center">
            We'll notify you if spots become available
          </p>
        </div>
      ) : (
        <>
          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-lg font-semibold"
            disabled={!formData.date || !formData.contactName || !formData.contactEmail || isDateUnavailable(formData.date) || availabilityLoading}
          >
            {availabilityLoading ? 'Checking availability...' : `Add to Cart - $${calculateTotal()}`}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            You won't be charged yet. Review your booking in the cart.
          </p>
        </>
      )}

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        tourId={tour.id}
        tourName={tour.title}
        date={formData.date}
        participants={{
          adults: formData.adults,
          children: formData.children,
        }}
      />
    </form>
  )
}
