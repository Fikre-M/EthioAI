import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '@store/store'
import { CheckoutFormData, TravelerDetails } from '@/types/booking'
import { Button } from '@components/common/Button/Button'
import { Input } from '@components/common/Input/Input'
import CheckoutForm from '../components/CheckoutForm'
import { FaArrowLeft, FaShieldAlt, FaUsers, FaPhone, FaCheckCircle } from 'react-icons/fa'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalItems, subtotal, discount, totalPrice, appliedPromo } = useSelector((state: RootState) => state.booking)
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
    },
    travelers: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
    },
    travelInsurance: false,
    termsAccepted: false,
    marketingConsent: false,
    specialRequests: '',
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  // Initialize travelers based on cart items
  const initializeTravelers = () => {
    const totalTravelers = items.reduce((sum, item) => 
      sum + item.participants.adults + item.participants.children, 0
    )
    
    const travelers: TravelerDetails[] = []
    for (let i = 0; i < totalTravelers; i++) {
      travelers.push({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        nationality: '',
        passportNumber: '',
        dietaryRequirements: '',
        medicalConditions: '',
      })
    }
    
    setFormData(prev => ({ ...prev, travelers }))
  }

  // Initialize travelers on component mount
  useState(() => {
    if (items.length > 0 && formData.travelers.length === 0) {
      initializeTravelers()
    }
  })

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Proceed to payment
      navigate('/payment', { state: { checkoutData: formData } })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/cart')
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.contactInfo.firstName && 
               formData.contactInfo.lastName && 
               formData.contactInfo.email && 
               formData.contactInfo.phone
      case 2:
        return formData.travelers.every(traveler => 
          traveler.firstName && traveler.lastName && traveler.dateOfBirth
        )
      case 3:
        return formData.emergencyContact.name && 
               formData.emergencyContact.phone && 
               formData.termsAccepted
      default:
        return false
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No items in cart
            </h2>
            <p className="text-gray-600 mb-8">
              Add some tours to your cart before proceeding to checkout.
            </p>
            <Button variant="primary" onClick={() => navigate('/tours')}>
              Browse Tours
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            {currentStep === 1 ? 'Back to Cart' : 'Previous Step'}
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <FaCheckCircle /> : step}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step <= currentStep ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  {step === 1 && 'Contact Info'}
                  {step === 2 && 'Traveler Details'}
                  {step === 3 && 'Final Details'}
                </span>
                {step < 3 && (
                  <div className={`w-12 h-0.5 ml-4 ${
                    step < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              formData={formData}
              setFormData={setFormData}
              currentStep={currentStep}
            />
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <img
                      src={item.tourImage}
                      alt={item.tourName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.tourName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.participants.adults} adult{item.participants.adults > 1 ? 's' : ''}
                        {item.participants.children > 0 && 
                          `, ${item.participants.children} child${item.participants.children > 1 ? 'ren' : ''}`
                        }
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${item.totalPrice}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>$0</span>
                </div>
                
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center">
                  <FaShieldAlt className="w-4 h-4 mr-2 text-green-600" />
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="w-4 h-4 mr-2 text-blue-600" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="w-4 h-4 mr-2 text-orange-600" />
                  <span>Free cancellation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
          >
            {currentStep === 1 ? 'Back to Cart' : 'Previous'}
          </Button>
          
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {currentStep === totalSteps ? 'Proceed to Payment' : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  )
}