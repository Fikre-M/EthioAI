import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@store/store'
import { clearCart } from '@store/slices/bookingSlice'
import { CheckoutFormData } from '@/types/booking'
import { Button } from '@components/common/Button/Button'
import { Input } from '@components/common/Input/Input'
import { FaArrowLeft, FaCreditCard, FaLock, FaShieldAlt, FaPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa'

interface PaymentFormData {
  paymentMethod: 'card' | 'paypal' | 'apple' | 'google'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  billingAddress: {
    address: string
    city: string
    country: string
    postalCode: string
  }
}

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { items, totalItems, subtotal, discount, totalPrice, appliedPromo } = useSelector((state: RootState) => state.booking)
  const checkoutData = location.state?.checkoutData as CheckoutFormData

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      address: checkoutData?.contactInfo.address || '',
      city: checkoutData?.contactInfo.city || '',
      country: checkoutData?.contactInfo.country || '',
      postalCode: checkoutData?.contactInfo.postalCode || '',
    },
  })

  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate insurance cost
  const insuranceCost = checkoutData?.travelInsurance 
    ? (checkoutData.travelers.length * 29) 
    : 0
  
  const finalTotal = totalPrice + insuranceCost

  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {}

    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber) newErrors.cardNumber = 'Card number is required'
      if (!paymentData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
      if (!paymentData.cvv) newErrors.cvv = 'CVV is required'
      if (!paymentData.cardholderName) newErrors.cardholderName = 'Cardholder name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validatePaymentForm()) return

    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Create booking confirmation data
      const bookingConfirmation = {
        bookingId: `ETH-${Date.now()}`,
        checkoutData,
        paymentData,
        items,
        totalPrice: finalTotal,
        appliedPromo,
        insuranceCost,
        paymentStatus: 'completed',
        bookingDate: new Date().toISOString(),
      }

      // Clear cart after successful payment
      dispatch(clearCart())

      // Navigate to confirmation page
      navigate('/confirmation', { 
        state: { bookingConfirmation },
        replace: true 
      })
    } catch (error) {
      console.error('Payment failed:', error)
      setErrors({ payment: 'Payment failed. Please try again.' })
    } finally {
      setProcessing(false)
    }
  }

  const updatePaymentData = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const updateBillingAddress = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value,
      },
    }))
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Invalid Access
            </h2>
            <p className="text-gray-600 mb-8">
              Please complete the checkout process first.
            </p>
            <Button variant="primary" onClick={() => navigate('/cart')}>
              Go to Cart
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
            onClick={() => navigate('/checkout')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Checkout
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-2">Secure payment processing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'card' }))}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentData.paymentMethod === 'card'
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaCreditCard className="text-2xl text-gray-600" />
                  <span className="text-sm font-medium">Credit Card</span>
                </button>

                <button
                  onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentData.paymentMethod === 'paypal'
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaPaypal className="text-2xl text-blue-600" />
                  <span className="text-sm font-medium">PayPal</span>
                </button>

                <button
                  onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'apple' }))}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentData.paymentMethod === 'apple'
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaApplePay className="text-2xl text-gray-800" />
                  <span className="text-sm font-medium">Apple Pay</span>
                </button>

                <button
                  onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'google' }))}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentData.paymentMethod === 'google'
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaGooglePay className="text-2xl text-blue-500" />
                  <span className="text-sm font-medium">Google Pay</span>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentData.paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <Input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => updatePaymentData('cardholderName', e.target.value)}
                      placeholder="Enter cardholder name"
                      error={errors.cardholderName}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <Input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => updatePaymentData('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      error={errors.cardNumber}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <Input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => updatePaymentData('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        error={errors.expiryDate}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <Input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => updatePaymentData('cvv', e.target.value)}
                        placeholder="123"
                        error={errors.cvv}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Alternative Payment Methods */}
              {paymentData.paymentMethod !== 'card' && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    You will be redirected to {paymentData.paymentMethod} to complete your payment.
                  </p>
                </div>
              )}
            </div>

            {/* Billing Address */}
            {paymentData.paymentMethod === 'card' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Billing Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <Input
                      type="text"
                      value={paymentData.billingAddress.address}
                      onChange={(e) => updateBillingAddress('address', e.target.value)}
                      placeholder="Enter billing address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      type="text"
                      value={paymentData.billingAddress.city}
                      onChange={(e) => updateBillingAddress('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={paymentData.billingAddress.country}
                      onChange={(e) => updateBillingAddress('country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select country</option>
                      <option value="ET">Ethiopia</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      value={paymentData.billingAddress.postalCode}
                      onChange={(e) => updateBillingAddress('postalCode', e.target.value)}
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaLock className="text-green-600" />
                <span className="font-semibold text-green-800">Secure Payment</span>
              </div>
              <p className="text-green-700 text-sm">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption 
                to protect your data.
              </p>
            </div>

            {errors.payment && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{errors.payment}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.tourName}</span>
                    <span className="font-medium">${item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                {insuranceCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Travel Insurance</span>
                    <span>${insuranceCost}</span>
                  </div>
                )}
                
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                variant="primary"
                className="w-full py-4 text-lg font-semibold"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay $${finalTotal.toFixed(2)}`
                )}
              </Button>

              {/* Security Features */}
              <div className="mt-6 pt-4 border-t space-y-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <FaShieldAlt className="w-3 h-3 mr-2 text-green-600" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center">
                  <FaLock className="w-3 h-3 mr-2 text-blue-600" />
                  <span>PCI DSS compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}