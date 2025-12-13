import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '@store/store'
import { applyPromoCode, removePromoCode, AVAILABLE_PROMO_CODES } from '@store/slices/bookingSlice'
import CartItem from '../components/CartItem'
import { Button } from '@components/common/Button/Button'
import { Input } from '@components/common/Input/Input'
import { FaShoppingCart, FaArrowLeft, FaTag, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

export default function CartPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, totalItems, subtotal, discount, totalPrice, appliedPromo } = useSelector((state: RootState) => state.booking)
  
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [showAvailablePromos, setShowAvailablePromos] = useState(false)

  const handleApplyPromo = () => {
    setPromoError('')
    const code = promoInput.toUpperCase()
    const promo = AVAILABLE_PROMO_CODES.find(p => p.code === code)
    
    if (!promo) {
      setPromoError('Invalid promo code')
      return
    }
    
    if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
      setPromoError('This promo code has expired')
      return
    }
    
    if (promo.minPurchase && subtotal < promo.minPurchase) {
      setPromoError(`Minimum purchase of $${promo.minPurchase} required`)
      return
    }
    
    dispatch(applyPromoCode(code))
    setPromoInput('')
  }
  
  const handleRemovePromo = () => {
    dispatch(removePromoCode())
    setPromoError('')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <FaShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start exploring amazing tours and add them to your cart!
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/tours')}
            >
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
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Promo Code Section */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <FaTag className="text-orange-600" />
                  <span className="font-medium text-gray-900">Promo Code</span>
                </div>
                
                {appliedPromo ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-600" />
                        <span className="font-semibold text-green-800">{appliedPromo.code}</span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <p className="text-sm text-green-700">
                      {appliedPromo.type === 'percentage' 
                        ? `${appliedPromo.discount}% discount applied`
                        : `$${appliedPromo.discount} discount applied`}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        placeholder="Enter code"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase())
                          setPromoError('')
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={!promoInput}
                      >
                        Apply
                      </Button>
                    </div>
                    
                    {promoError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                        <FaExclamationCircle />
                        <span>{promoError}</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setShowAvailablePromos(!showAvailablePromos)}
                      className="text-sm text-orange-600 hover:text-orange-700 mt-2"
                    >
                      {showAvailablePromos ? 'Hide' : 'View'} available codes
                    </button>
                    
                    {showAvailablePromos && (
                      <div className="mt-3 space-y-2">
                        {AVAILABLE_PROMO_CODES.map(promo => (
                          <div
                            key={promo.code}
                            className="p-2 bg-gray-50 rounded text-xs cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setPromoInput(promo.code)
                              setShowAvailablePromos(false)
                            }}
                          >
                            <div className="font-semibold text-orange-600">{promo.code}</div>
                            <div className="text-gray-600">
                              {promo.type === 'percentage' 
                                ? `${promo.discount}% off`
                                : `$${promo.discount} off`}
                              {promo.minPurchase && ` (min $${promo.minPurchase})`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>$0</span>
                </div>
                
                <div className="border-t pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="text-center text-sm text-green-600 font-medium">
                    You saved ${discount.toFixed(2)}!
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full mb-3"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/tours')}
              >
                Continue Shopping
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">✓</span>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">✓</span>
                  <span>Free Cancellation</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">✓</span>
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
