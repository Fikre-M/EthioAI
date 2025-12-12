import React, { useState } from 'react'
import { PAYMENT_METHODS } from '../../../services/paymentService'

interface PaymentFormProps {
  selectedMethodId?: string
  amount: number
  currency: string
  onSubmit: (formData: any) => void
  loading?: boolean
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedMethodId,
  amount,
  currency,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    phoneNumber: '',
    fullName: ''
  })

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === selectedMethodId)

  if (!selectedMethod) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Please select a payment method to continue</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-xl font-bold text-gray-900">
            {formatAmount(amount, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium text-gray-900">
            {selectedMethod.icon} {selectedMethod.name}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedMethod.provider === 'stripe' ? (
          // Stripe Card Payment Form
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Secure Card Payment</h4>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={formData.cardholderName}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  
                  <input
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Mobile Money Payment Form
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3">Mobile Money Payment</h4>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                
                <input
                  type="tel"
                  placeholder="+251 9XX XXX XXX"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
            ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }
          `}
        >
          {loading ? 'Processing Payment...' : `Pay ${formatAmount(amount, currency)}`}
        </button>
      </form>

      {/* Security Notice */}
      <div className="text-xs text-gray-500 text-center">
        🔒 Your payment information is encrypted and secure
      </div>
    </div>
  )
}

export default PaymentForm