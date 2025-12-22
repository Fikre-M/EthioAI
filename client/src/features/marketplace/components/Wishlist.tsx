import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import ProductCard from './ProductCard'
import { Product } from '../pages/MarketplacePage'
import {
  FaHeart, FaShare, FaBell, FaTrash, FaShoppingCart, FaEye,
  FaFilter, FaSort, FaTh, FaList, FaEnvelope, FaLink,
  FaFacebook, FaTwitter, FaWhatsapp, FaCopy, FaDownload,
  FaExclamationTriangle, FaCheckCircle,
  FaSpinner, FaTimes, FaPlus, FaSearch, FaFlag, FaStar
} from 'react-icons/fa'
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'

interface WishlistProps {
  isOpen: boolean
  onClose: () => void
}

interface WishlistItem extends Product {
  addedAt: string
  priceHistory: PricePoint[]
  notifications: NotificationSettings
}

interface PricePoint {
  price: number
  date: string
}

interface NotificationSettings {
  priceDropEnabled: boolean
  priceDropThreshold: number
  backInStockEnabled: boolean
  emailNotifications: boolean
}

interface ShareOptions {
  isPublic: boolean
  allowComments: boolean
  shareUrl?: string
}

const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'added' | 'price-low' | 'price-high' | 'name' | 'discount'>('added')
  const [filterBy, setFilterBy] = useState<'all' | 'in-stock' | 'on-sale' | 'price-drop'>('all')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showShareModal, setShowShareModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [selectedItemForNotification, setSelectedItemForNotification] = useState<string | null>(null)
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    isPublic: false,
    allowComments: false
  })

  // Mock wishlist data
  const mockWishlistItems: WishlistItem[] = [
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
      isWishlisted: true,
      isFeatured: true,
      isNew: false,
      createdAt: '2024-01-15',
      madeInEthiopia: true,
      popularity: 95,
      addedAt: '2024-01-20T10:30:00Z',
      priceHistory: [
        { price: 119.99, date: '2024-01-01' },
        { price: 109.99, date: '2024-01-10' },
        { price: 89.99, date: '2024-01-15' }
      ],
      notifications: {
        priceDropEnabled: true,
        priceDropThreshold: 10,
        backInStockEnabled: true,
        emailNotifications: true
      }
    }
  ]

  useEffect(() => {
    if (isOpen) {
      loadWishlistItems()
    }
  }, [isOpen])

  const loadWishlistItems = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setWishlistItems(mockWishlistItems)
      setIsLoading(false)
    }, 1000)
  } 
 const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems(items => items.filter(item => item.id !== productId))
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(productId)
      return newSet
    })
  }

  const handleAddToCart = (productId: string) => {
    console.log('Added to cart:', productId)
    // In real app, this would add to cart and optionally remove from wishlist
  }

  const handleProductClick = (productId: string) => {
    navigate(`/marketplace/product/${productId}`)
  }

  const handleSelectItem = (productId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedItems.size === wishlistItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(wishlistItems.map(item => item.id)))
    }
  }

  const handleBulkRemove = () => {
    setWishlistItems(items => items.filter(item => !selectedItems.has(item.id)))
    setSelectedItems(new Set())
  }

  const handleBulkAddToCart = () => {
    selectedItems.forEach(productId => {
      console.log('Added to cart:', productId)
    })
    alert(`Added ${selectedItems.size} items to cart!`)
  }

  const handleShareWishlist = () => {
    setShowShareModal(true)
  }

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/marketplace/wishlist/shared/abc123`
    navigator.clipboard.writeText(shareUrl)
    setShareOptions({ ...shareOptions, shareUrl })
    alert('Wishlist link copied to clipboard!')
  }

  const handleSocialShare = (platform: string) => {
    const shareUrl = shareOptions.shareUrl || `${window.location.origin}/marketplace/wishlist/shared/abc123`
    const text = `Check out my Ethiopian marketplace wishlist with ${wishlistItems.length} amazing products!`
    
    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`
        break
      case 'email':
        url = `mailto:?subject=My Ethiopian Marketplace Wishlist&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`
        break
    }
    
    if (url) {
      window.open(url, '_blank')
    }
  }

  const handleNotificationSettings = (productId: string) => {
    setSelectedItemForNotification(productId)
    setShowNotificationModal(true)
  }

  const updateNotificationSettings = (productId: string, settings: NotificationSettings) => {
    setWishlistItems(items => 
      items.map(item => 
        item.id === productId 
          ? { ...item, notifications: settings }
          : item
      )
    )
  }

  const getFilteredAndSortedItems = () => {
    let filtered = [...wishlistItems]

    // Apply filters
    switch (filterBy) {
      case 'in-stock':
        filtered = filtered.filter(item => item.availability === 'in-stock')
        break
      case 'on-sale':
        filtered = filtered.filter(item => item.discount && item.discount > 0)
        break
      case 'price-drop':
        filtered = filtered.filter(item => {
          const history = item.priceHistory
          return history.length > 1 && history[history.length - 1].price < history[history.length - 2].price
        })
        break
    }

    // Apply sorting
    switch (sortBy) {
      case 'added':
        filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0))
        break
    }

    return filtered
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getPriceChange = (item: WishlistItem) => {
    const history = item.priceHistory
    if (history.length < 2) return null
    
    const current = history[history.length - 1].price
    const previous = history[history.length - 2].price
    const change = ((current - previous) / previous) * 100
    
    return {
      percentage: Math.abs(change),
      isDecrease: change < 0,
      amount: Math.abs(current - previous)
    }
  }

  const filteredItems = getFilteredAndSortedItems()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mr-4">
              <FaHeart className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
              <p className="text-gray-600">{wishlistItems.length} saved products</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleShareWishlist}
              variant="outline"
              className="flex items-center"
            >
              <FaShare className="mr-2" />
              Share Wishlist
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Loading your wishlist...</span>
          </div>
        ) : (
          <div className="p-6">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Start adding products you love to keep track of them</p>
                <Button
                  onClick={() => {
                    onClose()
                    navigate('/marketplace')
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <>
                {/* Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Items</option>
                      <option value="in-stock">In Stock</option>
                      <option value="on-sale">On Sale</option>
                      <option value="price-drop">Price Drops</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="added">Recently Added</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name A-Z</option>
                      <option value="discount">Biggest Discounts</option>
                    </select>

                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                      >
                        <FaTh />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                      >
                        <FaList />
                      </button>
                    </div>
                  </div>

                  {/* Bulk Actions */}
                  {selectedItems.size > 0 && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {selectedItems.size} selected
                      </span>
                      <Button
                        onClick={handleBulkAddToCart}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <FaShoppingCart className="mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={handleBulkRemove}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <FaTrash className="mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                {/* Select All */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === wishlistItems.length && wishlistItems.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="font-medium text-gray-900">
                      Select All ({filteredItems.length} items)
                    </span>
                  </label>
                  
                  <div className="text-sm text-gray-600">
                    Total value: {formatPrice(filteredItems.reduce((sum, item) => sum + item.price, 0))}
                  </div>
                </div>        
        {/* Wishlist Items */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {filteredItems.map((item) => {
                    const priceChange = getPriceChange(item)
                    
                    return (
                      <div key={item.id} className="relative">
                        {/* Selection Checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white shadow-lg"
                          />
                        </div>

                        {/* Price Change Indicator */}
                        {priceChange && (
                          <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-medium ${
                            priceChange.isDecrease 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {priceChange.isDecrease ? (
                              <FaArrowTrendDown className="inline mr-1" />
                            ) : (
                              <FaArrowTrendUp className="inline mr-1" />
                            )}
                            {priceChange.percentage.toFixed(1)}%
                          </div>
                        )}

                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                          <ProductCard
                            product={item}
                            viewMode={viewMode}
                            onWishlistToggle={handleRemoveFromWishlist}
                            onAddToCart={handleAddToCart}
                            onClick={handleProductClick}
                          />
                          
                          {/* Wishlist-specific Actions */}
                          <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm text-gray-600">
                                Added {new Date(item.addedAt).toLocaleDateString()}
                              </div>
                              <button
                                onClick={() => handleNotificationSettings(item.id)}
                                className={`text-sm flex items-center ${
                                  item.notifications.priceDropEnabled 
                                    ? 'text-blue-600' 
                                    : 'text-gray-500'
                                }`}
                              >
                                <FaBell className="mr-1" />
                                {item.notifications.priceDropEnabled ? 'Notifications On' : 'Set Alerts'}
                              </button>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleAddToCart(item.id)}
                                size="sm"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={item.availability === 'out-of-stock'}
                              >
                                <FaShoppingCart className="mr-1" />
                                Add to Cart
                              </Button>
                              <Button
                                onClick={() => handleRemoveFromWishlist(item.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Share Your Wishlist</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Share Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shareable Link
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={shareOptions.shareUrl || 'Click "Generate Link" to create a shareable URL'}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
                    />
                    <Button
                      onClick={handleCopyShareLink}
                      className="rounded-l-none bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FaCopy />
                    </Button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Make wishlist public</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareOptions.isPublic}
                        onChange={(e) => setShareOptions({ ...shareOptions, isPublic: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Allow comments</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareOptions.allowComments}
                        onChange={(e) => setShareOptions({ ...shareOptions, allowComments: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Social Sharing */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Share on Social Media</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleSocialShare('facebook')}
                      variant="outline"
                      className="flex items-center justify-center"
                    >
                      <FaFacebook className="mr-2 text-blue-600" />
                      Facebook
                    </Button>
                    <Button
                      onClick={() => handleSocialShare('twitter')}
                      variant="outline"
                      className="flex items-center justify-center"
                    >
                      <FaTwitter className="mr-2 text-blue-400" />
                      Twitter
                    </Button>
                    <Button
                      onClick={() => handleSocialShare('whatsapp')}
                      variant="outline"
                      className="flex items-center justify-center"
                    >
                      <FaWhatsapp className="mr-2 text-green-600" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={() => handleSocialShare('email')}
                      variant="outline"
                      className="flex items-center justify-center"
                    >
                      <FaEnvelope className="mr-2 text-gray-600" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings Modal */}
        {showNotificationModal && selectedItemForNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Price Alerts</h3>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <FaBell className="text-4xl text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Stay Updated</h4>
                  <p className="text-gray-600 text-sm">
                    Get notified when prices drop or items come back in stock
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Price drop alerts</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Back in stock alerts</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price drop threshold
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="5">5% or more</option>
                      <option value="10" selected>10% or more</option>
                      <option value="15">15% or more</option>
                      <option value="20">20% or more</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowNotificationModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNotificationModal(false)
                      alert('Notification settings saved!')
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist