import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PaymentMethodSelector from '../components/PaymentMethodSelector'
import PaymentForm from '../components/PaymentForm'
import { paymentService, PaymentRequest } from '../../../services/paymentService'

interface LocationState {
  packageDetails?: {
    id: string
    name: string
    price: number
    currency: string
    duration: string
    description: string
  }
  bookingData?: any
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState

  const [selectedMethodId, setSelectedMethodId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Mock package details if not provided
  const packageDetails = state?.packageDetails || {
    id: 'tour-001',
    name: 'Lalibela Rock Churches Tour',
    price: 299,
    currency: 'USD',
    duration: '3 Days / 2 Nights',
    description: 'Explore the magnificent rock-hewn churches of Lalibela with expert guides'
  }

  const handlePaymentSubmit = async (formData: any) => {
    if (!selectedMethodId) {
      setError('Please select a payment method')
      return
    }

    setLoading(true)
    setError('')

    try {
      const paymentRequest: PaymentRequest = {
        amount: packageDetails.price,
        currency: packageDetails.currency,
        paymentMethodId: selectedMethodId,
        customerInfo: {
          name: formData.cardholderName || formData.fullName || 'Guest User',
          email: 'user@example.com',
          phone: formData.phoneNumber
        },
        bookingDetails: {
          bookingId: `booking_${Date.now()}`,
          items: [packageDetails],
          metadata: {
            packageId: packageDetails.id,
            bookingDate: new Date().toISOString(),
            ...state?.bookingData
          }
        }
      }

      const response = await paymentService.processPayment(paymentRequest)

      if (response.success) {
        navigate('/confirmation', {
          state: {
            paymentResponse: response,
            packageDetails,
            bookingData: paymentRequest.bookingDetails
          }
        })
      } else {
        setError(response.message || 'Payment failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Secure checkout for your tour booking</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Package Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{packageDetails.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{packageDetails.description}</p>
                    <p className="text-sm text-blue-600 mt-1">Duration: {packageDetails.duration}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: packageDetails.currency,
                      }).format(packageDetails.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <PaymentMethodSelector
                selectedMethod={selectedMethodId}
                onMethodSelect={setSelectedMethodId}
                currency={packageDetails.currency}
                country="ET"
              />
            </div>

            {selectedMethodId && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <PaymentForm
                  selectedMethodId={selectedMethodId}
                  amount={packageDetails.price}
                  currency={packageDetails.currency}
                  onSubmit={handlePaymentSubmit}
                  loading={loading}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage