import { CheckoutFormData, TravelerDetails } from '@/types/booking'
import { Button } from '@components/common/Button/Button'
import { Input } from '@components/common/Input/Input'
import { FaUser, FaUsers, FaPhone, FaShieldAlt, FaPlus, FaMinus } from 'react-icons/fa'

interface CheckoutFormProps {
  formData: CheckoutFormData
  setFormData: (data: CheckoutFormData) => void
  currentStep: number
}

export default function CheckoutForm({ formData, setFormData, currentStep }: CheckoutFormProps) {
  
  const updateContactInfo = (field: string, value: string) => {
    setFormData({
      ...formData,
      contactInfo: {
        ...formData.contactInfo,
        [field]: value,
      },
    })
  }

  const updateTraveler = (index: number, field: string, value: string) => {
    const updatedTravelers = [...formData.travelers]
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      travelers: updatedTravelers,
    })
  }

  const updateEmergencyContact = (field: string, value: string) => {
    setFormData({
      ...formData,
      emergencyContact: {
        ...formData.emergencyContact,
        [field]: value,
      },
    })
  }

  const renderContactInfoStep = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <FaUser className="text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <Input
            type="text"
            value={formData.contactInfo.firstName}
            onChange={(e) => updateContactInfo('firstName', e.target.value)}
            placeholder="Enter first name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <Input
            type="text"
            value={formData.contactInfo.lastName}
            onChange={(e) => updateContactInfo('lastName', e.target.value)}
            placeholder="Enter last name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            value={formData.contactInfo.email}
            onChange={(e) => updateContactInfo('email', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <Input
            type="tel"
            value={formData.contactInfo.phone}
            onChange={(e) => updateContactInfo('phone', e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <Input
            type="text"
            value={formData.contactInfo.address}
            onChange={(e) => updateContactInfo('address', e.target.value)}
            placeholder="Enter street address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <Input
            type="text"
            value={formData.contactInfo.city}
            onChange={(e) => updateContactInfo('city', e.target.value)}
            placeholder="Enter city"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <select
            value={formData.contactInfo.country}
            onChange={(e) => updateContactInfo('country', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            <option value="">Select country</option>
            <option value="ET">Ethiopia</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="AU">Australia</option>
            <option value="JP">Japan</option>
            <option value="KE">Kenya</option>
            <option value="ZA">South Africa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code
          </label>
          <Input
            type="text"
            value={formData.contactInfo.postalCode}
            onChange={(e) => updateContactInfo('postalCode', e.target.value)}
            placeholder="Enter postal code"
          />
        </div>
      </div>
    </div>
  )

  const renderTravelerDetailsStep = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <FaUsers className="text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-900">Traveler Details</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Please provide details for all travelers. This information is required for tour bookings.
      </p>

      <div className="space-y-8">
        {formData.travelers.map((traveler, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Traveler {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <Input
                  type="text"
                  value={traveler.firstName}
                  onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <Input
                  type="text"
                  value={traveler.lastName}
                  onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={traveler.email}
                  onChange={(e) => updateTraveler(index, 'email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={traveler.phone}
                  onChange={(e) => updateTraveler(index, 'phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <Input
                  type="date"
                  value={traveler.dateOfBirth}
                  onChange={(e) => updateTraveler(index, 'dateOfBirth', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality *
                </label>
                <Input
                  type="text"
                  value={traveler.nationality}
                  onChange={(e) => updateTraveler(index, 'nationality', e.target.value)}
                  placeholder="Enter nationality"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Number
                </label>
                <Input
                  type="text"
                  value={traveler.passportNumber || ''}
                  onChange={(e) => updateTraveler(index, 'passportNumber', e.target.value)}
                  placeholder="Enter passport number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Requirements
                </label>
                <Input
                  type="text"
                  value={traveler.dietaryRequirements || ''}
                  onChange={(e) => updateTraveler(index, 'dietaryRequirements', e.target.value)}
                  placeholder="e.g., Vegetarian, Halal, Allergies"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions
                </label>
                <textarea
                  value={traveler.medicalConditions || ''}
                  onChange={(e) => updateTraveler(index, 'medicalConditions', e.target.value)}
                  placeholder="Any medical conditions or special needs"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderFinalDetailsStep = () => (
    <div className="space-y-6">
      {/* Emergency Contact */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <FaPhone className="text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Emergency Contact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              value={formData.emergencyContact.name}
              onChange={(e) => updateEmergencyContact('name', e.target.value)}
              placeholder="Enter emergency contact name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship *
            </label>
            <select
              value={formData.emergencyContact.relationship}
              onChange={(e) => updateEmergencyContact('relationship', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="child">Child</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <Input
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={(e) => updateEmergencyContact('phone', e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.emergencyContact.email}
              onChange={(e) => updateEmergencyContact('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>

      {/* Travel Insurance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <FaShieldAlt className="text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Travel Insurance</h2>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">Recommended Protection</h3>
          <p className="text-blue-800 text-sm mb-3">
            Protect your trip investment with comprehensive travel insurance. Coverage includes trip cancellation, 
            medical emergencies, and travel delays.
          </p>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Trip cancellation up to 100% of trip cost</li>
            <li>• Emergency medical coverage up to $100,000</li>
            <li>• 24/7 emergency assistance</li>
            <li>• Coverage for travel delays and lost baggage</li>
          </ul>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.travelInsurance}
            onChange={(e) => setFormData({ ...formData, travelInsurance: e.target.checked })}
            className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
          />
          <div>
            <span className="font-medium text-gray-900">
              Yes, I want travel insurance (+$29 per person)
            </span>
            <p className="text-sm text-gray-600 mt-1">
              Highly recommended for international travel
            </p>
          </div>
        </label>
      </div>

      {/* Special Requests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h3>
        <textarea
          value={formData.specialRequests || ''}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          placeholder="Any additional requests or special arrangements..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          rows={4}
        />
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
        
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
              className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              required
            />
            <span className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-orange-600 hover:text-orange-700 underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                Privacy Policy
              </a>
              *
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
              className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              I would like to receive promotional emails about special offers and new tours
            </span>
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {currentStep === 1 && renderContactInfoStep()}
      {currentStep === 2 && renderTravelerDetailsStep()}
      {currentStep === 3 && renderFinalDetailsStep()}
    </div>
  )
}