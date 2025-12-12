import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import ProductCard from '../components/ProductCard'
import { Product } from './MarketplacePage'
import {
  FaStar, FaMapMarkerAlt, FaCalendar, FaShoppingBag, FaHeart,
  FaShare, FaPhone, FaEnvelope, FaGlobe, FaInstagram, FaFacebook,
  FaTwitter, FaCheckCircle, FaAward, FaUsers, FaTruck, FaUndo,
  FaFilter, FaSort, FaGrid3X3, FaList, FaSearch, FaFlag,
  FaChartLine, FaThumbsUp, FaComment, FaEye, FaPlus
} from 'react-icons/fa'

interface Vendor {
  id: string
  name: string
  description: string
  logo: string
  coverImage: string
  rating: number
  reviewCount: number
  verified: boolean
  location: string
  joinedDate: string
  totalProducts: number
  totalSales: number
  followers: number
  responseTime: string
  shippingPolicy: string
  returnPolicy: string
  contact: {
    phone?: string
    email?: string
    website?: string
    social: {
      instagram?: string
      facebook?: string
      twitter?: string
    }
  }
  badges: string[]
  specialties: string[]
  story: string
}

interface VendorReview {
  id: string
  customerName: string
  customerAvatar: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful: number
}

const VendorPage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<VendorReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about'>('products')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock vendor data
  const mockVendor: Vendor = {
    id: 'vendor-001',
    name: 'Addis Coffee Roasters',
    description: 'Premium Ethiopian coffee roasters bringing you the finest beans from the birthplace of coffee',
    logo: '/vendors/addis-coffee-logo.jpg',
    coverImage: '/vendors/addis-coffee-cover.jpg',
    rating: 4.9,
    reviewCount: 1247,
    verified: true,
    location: 'Addis Ababa, Ethiopia',
    joinedDate: '2020-03-15',
    totalProducts: 45,
    totalSales: 12500,
    followers: 3420,
    responseTime: '< 2 hours',
    shippingPolicy: 'Free shipping on orders over $50. International shipping available.',
    returnPolicy: '30-day return policy. Items must be unopened and in original packaging.',
    contact: {
      phone: '+251-11-123-4567',
      email: 'hello@addiscoffee.com',
      website: 'https://addiscoffee.com',
      social: {
        instagram: '@addiscoffee',
        facebook: 'AddisCoffee',
        twitter: '@addiscoffee'
      }
    },
    badges: ['Verified Seller', 'Top Rated', 'Fast Shipping', 'Made in Ethiopia'],
    specialties: ['Coffee Beans', 'Traditional Brewing Equipment', 'Coffee Accessories'],
    story: 'Founded in 2020 by coffee enthusiasts from Addis Ababa, we are passionate about sharing the rich coffee culture of Ethiopia with the world. Our beans are sourced directly from local farmers in the highlands of Ethiopia, ensuring fair trade and the highest quality. We roast our coffee in small batches to preserve the unique flavors that make Ethiopian coffee legendary.'
  }

  const mockProducts: Product[] = [
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
      popularity: 95
    }
  ]

  const mockReviews: VendorReview[] = [
    {
      id: 'review-001',
      customerName: 'Sarah Johnson',
      customerAvatar: '/avatars/sarah.jpg',
      rating: 5,
      comment: 'Amazing coffee quality and fast shipping! The traditional brewing equipment is authentic and well-made. Highly recommend this vendor.',
      date: '2024-01-18',
      verified: true,
      helpful: 12
    }
  ]

  useEffect(() => {
    if (vendorId) {
      loadVendorData()
    }
  }, [vendorId])

  const loadVendorData = async () => {
    setIsLoading(true)
    // Simulate API calls
    setTimeout(() => {
      setVendor(mockVendor)
      setProducts(mockProducts)
      setReviews(mockReviews)
      setIsLoading(false)
    }, 1000)
  }

  const handleFollowVendor = () => {
    setIsFollowing(!isFollowing)
    setVendor(prev => prev ? {
      ...prev,
      followers: prev.followers + (isFollowing ? -1 : 1)
    } : null)
  }

  const handleShareVendor = () => {
    const shareUrl = window.location.href
    const shareText = `Check out ${vendor?.name} on Ethiopian Marketplace!`
    
    if (navigator.share) {
      navigator.share({
        title: vendor?.name,
        text: shareText,
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Vendor link copied to clipboard!')
    }
  }

  const handleProductClick = (productId: string) => {
    navigate(`/marketplace/product/${productId}`)
  }

  const handleWishlistToggle = (productId: string) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, isWishlisted: !product.isWishlisted }
        : product
    ))
  }

  const handleAddToCart = (productId: string) => {
    console.log('Added to cart:', productId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const filteredProducts = products.filter(product =>
    searchQuery === '' || 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading vendor...</span>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor not found</h2>
          <p className="text-gray-600 mb-6">The vendor you're looking for doesn't exist.</p>
          <Button
            onClick={() => navigate('/marketplace')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
        <img
          src={vendor.coverImage}
          alt={`${vendor.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Vendor Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg -mt-16 relative z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
                  {vendor.verified && (
                    <FaCheckCircle className="text-blue-500 text-xl" title="Verified Vendor" />
                  )}
                </div>
                <p className="text-gray-600 mb-2">{vendor.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {vendor.location}
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-1" />
                    Joined {formatDate(vendor.joinedDate)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={handleFollowVendor}
                className={`${
                  isFollowing 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <FaHeart className="mr-2" />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button
                onClick={handleShareVendor}
                variant="outline"
              >
                <FaShare className="mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-2xl font-bold text-gray-900">{vendor.rating}</span>
              </div>
              <p className="text-sm text-gray-600">{formatNumber(vendor.reviewCount)} reviews</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatNumber(vendor.totalProducts)}
              </div>
              <p className="text-sm text-gray-600">Products</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatNumber(vendor.totalSales)}
              </div>
              <p className="text-sm text-gray-600">Sales</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatNumber(vendor.followers)}
              </div>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {vendor.responseTime}
              </div>
              <p className="text-sm text-gray-600">Response time</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-6">
            {vendor.badges.map((badge, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'products', label: 'Products', icon: FaShoppingBag },
              { id: 'reviews', label: 'Reviews', icon: FaStar },
              { id: 'about', label: 'About', icon: FaEye }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {/* Product Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    <FaGrid3X3 />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {filteredProducts.length} of {vendor.totalProducts} products
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                <div className="flex items-center space-x-2">
                  <FaStar className="text-yellow-400" />
                  <span className="text-lg font-bold">{vendor.rating}</span>
                  <span className="text-gray-600">({formatNumber(vendor.reviewCount)} reviews)</span>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.customerAvatar}
                        alt={review.customerName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                            {review.verified && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{new Date(review.date).toLocaleDateString()}</span>
                          <button className="flex items-center hover:text-blue-600">
                            <FaThumbsUp className="mr-1" />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Vendor Story */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Story</h3>
                <p className="text-gray-700 leading-relaxed">{vendor.story}</p>
              </div>

              {/* Specialties */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {vendor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {vendor.contact.phone && (
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-3" />
                      <span className="text-gray-700">{vendor.contact.phone}</span>
                    </div>
                  )}
                  {vendor.contact.email && (
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <span className="text-gray-700">{vendor.contact.email}</span>
                    </div>
                  )}
                  {vendor.contact.website && (
                    <div className="flex items-center">
                      <FaGlobe className="text-gray-400 mr-3" />
                      <a
                        href={vendor.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {vendor.contact.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Follow Us</h4>
                  <div className="flex space-x-3">
                    {vendor.contact.social.instagram && (
                      <a
                        href={`https://instagram.com/${vendor.contact.social.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700"
                      >
                        <FaInstagram className="text-xl" />
                      </a>
                    )}
                    {vendor.contact.social.facebook && (
                      <a
                        href={`https://facebook.com/${vendor.contact.social.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FaFacebook className="text-xl" />
                      </a>
                    )}
                    {vendor.contact.social.twitter && (
                      <a
                        href={`https://twitter.com/${vendor.contact.social.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500"
                      >
                        <FaTwitter className="text-xl" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Policies</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <FaTruck className="text-gray-400 mr-2" />
                      <h4 className="font-medium text-gray-900">Shipping</h4>
                    </div>
                    <p className="text-sm text-gray-600">{vendor.shippingPolicy}</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <FaUndo className="text-gray-400 mr-2" />
                      <h4 className="font-medium text-gray-900">Returns</h4>
                    </div>
                    <p className="text-sm text-gray-600">{vendor.returnPolicy}</p>
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

export default VendorPage