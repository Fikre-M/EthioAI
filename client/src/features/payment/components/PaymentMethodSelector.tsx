import React from 'react'
import { PAYMENT_METHODS } from '../../../services/paymentService'

interface PaymentMethodSelectorProps {
  selectedMethod?: string
  onMethodSelect: (methodId: string) => void
  currency?: string
  country?: string
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodSelect,
  currency = 'USD',
  country = 'US'
}) => {
  // Filter available methods based on currency and country
  const availableMethods = PAYMENT_METHODS.filter(method => 
    method.currencies.includes(currency) && method.countries.includes(country)
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
      
      <div className="grid gap-3">
        {availableMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            className={`
              w-full p-4 border-2 rounded-lg text-left transition-all duration-200
              ${selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                {selectedMethod === method.id && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment method badges */}
            <div className="mt-2 flex flex-wrap gap-1">
              {method.currencies.map((curr) => (
                <span
                  key={curr}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  {curr}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      
      {availableMethods.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No payment methods available for {currency} in {country}</p>
        </div>
      )}
    </div>
  )
}

export default PaymentMethodSelector