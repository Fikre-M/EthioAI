import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import QRCodeGenerator from '../components/QRCodeGenerator'
import { PaymentResponse } from '../../../services/paymentService'

interface LocationState {
  paymentResponse?: PaymentResponse
  packageDetails?: {
    id: string
    name: string
    price: number
    currency: string
    duration: string
    description: string
  }
  bookingData?: {
    bookingId: string
    items: any[]
    metadata: Record<string, any>
  }
}

const ConfirmationPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState

  const bookingReference = state?.bookingData?.bookingId || `ETH-${Date.now().toString().slice(-8)}`
  
  const paymentResponse = state?.paymentResponse || {
    success: true,
    paymentId: `pay_${Date.now()}`,
    status: 'completed' as const,
    message: 'Payment completed successfully',
    transactionRef: `TXN_${Date.now()}`
  }

  const packageDetails = state?.packageDetails || {
    id: 'tour-001',
    name: 'Lalibela Rock Churches Tour',
    price: 299,
    currency: 'USD',
    duration: '3 Days / 2 Nights',
    description: 'Explore the magnificent rock-hewn churches of Lalibela'
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const handleDownloadPDF = () => {
    alert('PDF download functionality will be implemented with a PDF library like jsPDF or react-pdf')
  }

  const qrCodeValue = `https://ethioai-tours.com/booking/${bookingReference}`

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your payment has been processed successfully</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-mono font-medium text-gray-900">{bookingReference}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm text-gray-700">{paymentResponse.transactionRef}</span>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium text-gray-900 mb-2">{packageDetails.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{packageDetails.description}</p>
                  <p className="text-sm text-blue-600">Duration: {packageDetails.duration}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Paid:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatAmount(packageDetails.price, packageDetails.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Download PDF Ticket
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>

          {/* Right Column - QR Code & Next Steps */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Your E-Ticket</h2>
              
              <QRCodeGenerator
                value={qrCodeValue}
                size={200}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Check Your Email</h3>
                    <p className="text-sm text-gray-600">Review your booking confirmation and tour details</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Prepare for Your Trip</h3>
                    <p className="text-sm text-gray-600">Pack according to the weather and activity requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Enjoy Your Tour!</h3>
                    <p className="text-sm text-gray-600">Have an amazing experience exploring Ethiopia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage