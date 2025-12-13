import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import { Product } from '../pages/MarketplacePage'
import {
  FaShoppingCart, FaTrash, FaPlus, FaMinus, FaTimes,
  FaShippingFast, FaTag, FaCalculator, FaCreditCard,
  FaLock, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa'

interface CartItem extends Product {
  quantity: number
  selectedVariant?: string
  addedAt: string
}

interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: string
  description: string
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

const ProductCart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState<string>('standard')
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)

  // Mock cart data
  const mockCartItems: CartItem[] = [
    {
      id: 'prod-001',
      name: 'Ethiopian Coffee Experience Set',
      description: 'Premium Ethiopian coffee beans with traditional brewing equipment',
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      rating: 4.8,
      reviewCount: 156,
      images: ['/products/coffee-set-1.jpg'],
      category: 'Food & Beverages',
      subcategory: 'Coffee',
      vendor: {
        id: 'vendor-001',
        name: 'Addis Coffee Roasters',
        rating: 4.9,
        verified: true,
        location: 'Addis Ababa, Ethiopia'
      },
      features: ['Organic', 'Fair Trade'],
      tags: ['coffee', 'ethiopian'],
      availability: 'in-stock',
      shipping: { free: true, estimatedDays: 3 },
      isWishlisted: false,
      isFeatured: true,
      isNew: false,
      createdAt: '2024-01-15',
      madeInEthiopia: true,
      popularity: 95,
      quantity: 2,
      addedAt: '2024-01-20T10:30:00Z'
    }
  ]

  const shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 0,
      estimatedDays: '5-7 business days',
      description: 'Free standard shipping on orders over $50'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 15.99,
      estimatedDays: '2-3 business days',
      description: 'Faster delivery for urgent orders'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 29.99,
      estimatedDays: '1 business day',
      description: 'Next day delivery available'
    }
  ]

  useEffect(() => {
    if (isOpen) {
      loadCartItems()
    }
  }, [isOpen])

  const loadCartItems = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCartItems(mockCartItems)
      setIsLoading(false)
    }, 500)
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeFromCart = (productId: string) => {
    setCartItems(items => items.filter(item => item.id !== productId))
  }

  const applyPromoCode = () => {
    // Mock promo code validation
    if (promoCode.toLowerCase() === 'ethiopia10') {
      setPromoDiscount(10)
      alert('Promo code applied! 10% discount')
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setPromoDiscount(20)
      alert('Welcome discount applied! 20% off')
    } else {
      alert('Invalid promo code')
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    const selectedOption = shippingOptions.find(opt => opt.id === selectedShipping)
    
    // Free shipping on orders over $50
    if (subtotal >= 50 && selectedShipping === 'standard') {
      return 0
    }
    
    return selectedOption?.price || 0
  }

  const calculateDiscount = () => {
    return (calculateSubtotal() * promoDiscount) / 100
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = calculateShipping()
    const discount = calculateDiscount()
    return subtotal + shipping - discount
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
              <FaShoppingCart className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              <p className="text-gray-600">{cartItems.length} items</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading cart...</span>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some amazing Ethiopian products to get started</p>
            <Button
              onClick={() => {
                onClose()
                navigate('/marketplace')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            {/* Cart Items */}
            <div className="flex-1 p-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.vendor.name}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96 p-6 bg-gray-50 border-l border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Shipping Options */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FaShippingFast className="mr-2" />
                  Shipping Options
                </h4>
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label key={option.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{option.name}</span>
                          <span className="font-bold">
                            {option.price === 0 ? 'Free' : formatPrice(option.price)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{option.estimatedDays}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FaTag className="mr-2" />
                  Promo Code
                </h4>
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={applyPromoCode}
                    className="rounded-l-none bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(calculateShipping())}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({promoDiscount}%)</span>
                    <span>-{formatPrice(calculateDiscount())}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              >
                <FaCreditCard className="mr-2" />
                Proceed to Checkout
              </Button>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <FaLock className="mr-1" />
                  Secure checkout powered by SSL
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6">
                <div className="text-center py-8">
                  <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Checkout Complete!</h3>
                  <p className="text-gray-600 mb-6">
                    Your order has been placed successfully. You'll receive a confirmation email shortly.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setShowCheckout(false)
                        onClose()
                        navigate('/marketplace/orders')
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View My Orders
                    </Button>
                    <Button
                      onClick={() => {
                        setShowCheckout(false)
                        onClose()
                        navigate('/marketplace')
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCart