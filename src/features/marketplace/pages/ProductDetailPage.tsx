import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import { Product } from './MarketplacePage'
import {
  FaHeart, FaShoppingCart, FaStar, FaMapMarkerAlt, FaShieldAlt,
  FaTruck, FaArrowLeft, FaShare, FaFlag, FaCheck, FaClock,
  FaExclamationTriangle, FaPlus, FaMinus, FaEye, FaThumbsUp,
  FaThumbsDown, FaReply, FaImage, FaPlay, FaExpand, FaChevronLeft,
  FaChevronRight, FaStore, FaPhone, FaEnvelope, FaGlobe
} from 'react-icons/fa'

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  images?: string[]
  helpful: number
  notHelpful: number
  verified: boolean
  createdAt: string
  replies?: ReviewReply[]
}

interface ReviewReply {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
  isVendor: boolean
}

interface RelatedProduct {
  id: string
  name: string
  price: number
  rating: number
  image: string
}

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState<'description' | 'reviews' | 'shipping'>('description')
  const [isLoading, setIsLoading] = useState(true)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Mock product data (in real app, this would come from API)
  const mockProduct: Product = {
    id: 'prod-001',
    name: 'Ethiopian Coffee Experience Set',
    description: `Immerse yourself in the rich tradition of Ethiopian coffee culture with this comprehensive experience set. This premium collection includes:

• **Authentic Ethiopian Coffee Beans**: Single-origin beans from the highlands of Sidamo, known for their bright acidity and floral notes
• **Traditional Jebena**: Handcrafted clay coffee pot used in Ethiopian coffee ceremonies
• **Ceremonial Cups**: Set of 6 traditional handleless cups (cini)
• **Roasting Pan**: Traditional menkeshkesh for roasting green coffee beans
• **Frankincense**: Authentic Ethiopian frankincense for the complete ceremonial experience
• **Instruction Guide**: Step-by-step guide to performing the traditional coffee ceremony

The Ethiopian coffee ceremony is a cornerstone of social and cultural life, representing hospitality, friendship, and respect. This set allows you to bring this beautiful tradition into your own home, creating meaningful moments with family and friends.

Each component is carefully selected and sourced directly from Ethiopian artisans, ensuring authenticity and supporting local communities. The coffee beans are freshly roasted and packaged to preserve their exceptional flavor profile.`,
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    rating: 4.8,
    reviewCount: 156,
    images: [
      '/products/coffee-set-1.jpg',
      '/products/coffee-set-2.jpg',
      '/products/coffee-set-3.jpg',
      '/products/coffee-set-4.jpg',
      '/products/coffee-set-5.jpg'
    ],
    category: 'Food & Beverages',
    subcategory: 'Coffee',
    vendor: {
      id: 'vendor-001',
      name: 'Addis Coffee Roasters',
      rating: 4.9,
      verified: true,
      location: 'Addis Ababa, Ethiopia'
    },
    features: ['Organic', 'Fair Trade', 'Single Origin', 'Traditional Roast', 'Ceremonial Grade'],
    tags: ['coffee', 'ethiopian', 'traditional', 'gift-set', 'ceremony'],
    availability: 'in-stock',
    shipping: {
      free: true,
      estimatedDays: 3
    },
    isWishlisted: false,
    isFeatured: true,
    isNew: false,
    createdAt: '2024-01-15'
  }

  const mockReviews: Review[] = [
    {
      id: 'review-1',
      userId: 'user-1',
      userName: 'Sarah M.',
      rating: 5,
      title: 'Absolutely Amazing Experience!',
      content: 'This coffee set exceeded all my expectations. The quality is outstanding and the coffee ceremony has become a weekly tradition in our family. The instruction guide was very helpful for beginners.',
      images: ['/reviews/review-1-1.jpg', '/reviews/review-1-2.jpg'],
      helpful: 23,
      notHelpful: 1,
      verified: true,
      createdAt: '2024-01-20',
      replies: [
        {
          id: 'reply-1',
          userId: 'vendor-001',
          userName: 'Addis Coffee Roasters',
          content: 'Thank you so much for your wonderful review! We\'re thrilled that you and your family are enjoying the coffee ceremony tradition.',
          createdAt: '2024-01-21',
          isVendor: true
        }
      ]
    },
    {
      id: 'review-2',
      userId: 'user-2',
      userName: 'Michael K.',
      rating: 4,
      title: 'Great Quality, Fast Shipping',
      content: 'The set arrived quickly and everything was well-packaged. The jebena is beautiful and the coffee tastes incredible. Only minor issue was that one of the cups had a small chip, but customer service was very responsive.',
      helpful: 18,
      notHelpful: 0,
      verified: true,
      createdAt: '2024-01-18'
    },
    {
      id: 'review-3',
      userId: 'user-3',
      userName: 'Emma L.',
      rating: 5,
      title: 'Perfect Gift for Coffee Lovers',
      content: 'Bought this as a gift for my coffee-obsessed friend and she absolutely loves it! The presentation is beautiful and the cultural significance makes it extra special.',
      helpful: 15,
      notHelpful: 2,
      verified: true,
      createdAt: '2024-01-16'
    }
  ]

  const mockRelatedProducts: RelatedProduct[] = [
    {
      id: 'prod-004',
      name: 'Ethiopian Spice Collection',
      price: 34.99,
      rating: 4.7,
      image: '/products/spices-1.jpg'
    },
    {
      id: 'prod-006',
      name: 'Ethiopian Honey Collection',
      price: 67.50,
      rating: 4.8,
      image: '/products/honey-1.jpg'
    },
    {
      id: 'prod-007',
      name: 'Traditional Coffee Cups Set',
      price: 24.99,
      rating: 4.6,
      image: '/products/cups-1.jpg'
    },
    {
      id: 'prod-008',
      name: 'Ethiopian Frankincense',
      price: 19.99,
      rating: 4.5,
      image: '/products/frankincense-1.jpg'
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProduct(mockProduct)
      setReviews(mockReviews)
      setRelatedProducts(mockRelatedProducts)
      setIsWishlisted(mockProduct.isWishlisted)
      setIsLoading(false)
    }, 1000)
  }, [productId])

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleAddToCart = () => {
    console.log('Added to cart:', { productId, quantity })
    // Add to cart logic
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    // Update wishlist logic
  }

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!product) return
    
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    } else {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getAvailabilityStatus = () => {
    if (!product) return { icon: null, text: '', color: '' }
    
    switch (product.availability) {
      case 'in-stock':
        return { icon: <FaCheck className="text-green-600" />, text: 'In Stock', color: 'text-green-600' }
      case 'limited':
        return { icon: <FaClock className="text-yellow-600" />, text: 'Limited Stock', color: 'text-yellow-600' }
      case 'out-of-stock':
        return { icon: <FaExclamationTriangle className="text-red-600" />, text: 'Out of Stock', color: 'text-red-600' }
      default:
        return { icon: <FaCheck className="text-green-600" />, text: 'Available', color: 'text-green-600' }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/marketplace')} className="bg-blue-600 hover:bg-blue-700 text-white">
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  const availabilityStatus = getAvailabilityStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/marketplace')} className="hover:text-blue-600">
            Marketplace
          </button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate('/marketplace')}
          variant="outline"
          className="mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={product.images[selectedImageIndex] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              {/* Expand Button */}
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
              >
                <FaExpand />
              </button>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image || '/placeholder-product.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                  <span className="ml-2 text-lg font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
                <div className="flex items-center text-sm">
                  {availabilityStatus.icon}
                  <span className={`ml-1 ${availabilityStatus.color}`}>
                    {availabilityStatus.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Vendor Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaStore className="text-blue-600 mr-2" />
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{product.vendor.name}</span>
                      {product.vendor.verified && (
                        <FaShieldAlt className="text-blue-500 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-1" />
                      {product.vendor.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {renderStars(product.vendor.rating)}
                    <span className="ml-1 text-sm">{product.vendor.rating}</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Visit Store
                  </Button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.availability === 'out-of-stock'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  className={`px-6 py-3 ${isWishlisted ? 'text-red-600 border-red-300' : ''}`}
                >
                  <FaHeart className={isWishlisted ? 'text-red-500' : ''} />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center">
                <FaTruck className="text-green-600 mr-2" />
                <div>
                  <div className="font-medium text-green-900">
                    {product.shipping.free ? 'Free Shipping' : `$${product.shipping.cost} Shipping`}
                  </div>
                  <div className="text-sm text-green-700">
                    Estimated delivery: {product.shipping.estimatedDays} business days
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="flex-1">
                <FaShare className="mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex-1">
                <FaFlag className="mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setSelectedTab('description')}
                className={`px-6 py-4 font-medium transition-all ${
                  selectedTab === 'description'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`px-6 py-4 font-medium transition-all ${
                  selectedTab === 'reviews'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews ({product.reviewCount})
              </button>
              <button
                onClick={() => setSelectedTab('shipping')}
                className={`px-6 py-4 font-medium transition-all ${
                  selectedTab === 'shipping'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Shipping & Returns
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {product.description}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                {/* Reviews Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                      <div className="flex items-center justify-center mb-1">
                        {renderStars(product.rating)}
                      </div>
                      <div className="text-sm text-gray-600">{product.reviewCount} reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center mb-1">
                          <span className="text-sm w-8">{stars}</span>
                          <FaStar className="text-yellow-400 mr-2" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${Math.random() * 80 + 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {Math.floor(Math.random() * 50)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <span className="font-medium text-sm">
                              {review.userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">{review.userName}</span>
                              {review.verified && (
                                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-gray-600">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-700 mb-3">{review.content}</p>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-2 mb-3">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="flex items-center text-gray-600 hover:text-green-600">
                          <FaThumbsUp className="mr-1" />
                          Helpful ({review.helpful})
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-red-600">
                          <FaThumbsDown className="mr-1" />
                          Not Helpful ({review.notHelpful})
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-blue-600">
                          <FaReply className="mr-1" />
                          Reply
                        </button>
                      </div>
                      
                      {review.replies && review.replies.length > 0 && (
                        <div className="mt-4 ml-8 space-y-3">
                          {review.replies.map((reply) => (
                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <span className={`font-medium ${reply.isVendor ? 'text-blue-600' : 'text-gray-900'}`}>
                                  {reply.userName}
                                </span>
                                {reply.isVendor && (
                                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    Vendor
                                  </span>
                                )}
                                <span className="ml-2 text-sm text-gray-600">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Delivery Options</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center">
                          <FaTruck className="text-green-600 mr-2" />
                          Standard Shipping: 3-5 business days (Free)
                        </li>
                        <li className="flex items-center">
                          <FaTruck className="text-blue-600 mr-2" />
                          Express Shipping: 1-2 business days ($15.99)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Return Policy</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• 30-day return window</li>
                        <li>• Items must be unused and in original packaging</li>
                        <li>• Free returns for defective items</li>
                        <li>• Customer pays return shipping for other returns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                onClick={() => navigate(`/marketplace/product/${relatedProduct.id}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">
                  {relatedProduct.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {formatPrice(relatedProduct.price)}
                  </span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm">{relatedProduct.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <FaTimes />
            </button>
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage