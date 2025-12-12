import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import { Product } from '../pages/MarketplacePage'
import {
  FaHeart, FaShoppingCart, FaStar, FaMapMarkerAlt, FaTag,
  FaShieldAlt, FaTruck, FaFire, FaGift, FaEye, FaRegHeart,
  FaCheck, FaClock, FaExclamationTriangle
} from 'react-icons/fa'

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  onWishlistToggle: (productId: string) => void
  onAddToCart: (productId: string) => void
  onClick: (productId: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onWishlistToggle,
  onAddToCart,
  onClick
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const handleImageError = () => {
    setIsImageLoading(false)
  }

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onWishlistToggle(product.id)
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product.id)
  }

  const getAvailabilityStatus = () => {
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
        className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const availabilityStatus = getAvailabilityStatus()

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onClick(product.id)}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <div className="flex">
          {/* Image Section */}
          <div className="relative w-64 h-48 flex-shrink-0">
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
              </div>
            )}
            <img
              src={product.images[currentImageIndex] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Image Navigation */}
            {product.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={handlePrevImage}
                  className="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                >
                  ←
                </button>
                <button
                  onClick={handleNextImage}
                  className="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                >
                  →
                </button>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.isFeatured && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <FaFire className="mr-1" />
                  Featured
                </span>
              )}
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <FaGift className="mr-1" />
                  New
                </span>
              )}
              {product.discount && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              {product.isWishlisted ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-600" />
              )}
            </button>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              </div>
              
              <div className="text-right ml-4">
                <div className="flex items-center mb-1">
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through text-sm mr-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>
                
                <div className="flex items-center justify-end mb-2">
                  <div className="flex items-center mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor Info */}
            <div className="flex items-center mb-3">
              <FaMapMarkerAlt className="text-gray-400 mr-1" />
              <span className="text-sm text-gray-600 mr-3">{product.vendor.location}</span>
              <span className="text-sm font-medium text-gray-900">{product.vendor.name}</span>
              {product.vendor.verified && (
                <FaShieldAlt className="text-blue-500 ml-1" />
              )}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {feature}
                </span>
              ))}
              {product.features.length > 3 && (
                <span className="text-xs text-gray-500">+{product.features.length - 3} more</span>
              )}
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  {availabilityStatus.icon}
                  <span className={`ml-1 ${availabilityStatus.color}`}>
                    {availabilityStatus.text}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FaTruck className="mr-1" />
                  {product.shipping.free ? 'Free shipping' : `$${product.shipping.cost} shipping`}
                  <span className="ml-1">({product.shipping.estimatedDays} days)</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleAddToCartClick}
                  disabled={product.availability === 'out-of-stock'}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div
      onClick={() => onClick(product.id)}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        <img
          src={product.images[currentImageIndex] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Image Navigation */}
        {product.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImage}
              className="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
            >
              ←
            </button>
            <button
              onClick={handleNextImage}
              className="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
            >
              →
            </button>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isFeatured && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <FaFire className="mr-1" />
              Featured
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <FaGift className="mr-1" />
              New
            </span>
          )}
          {product.discount && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
        >
          {product.isWishlisted ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-600" />
          )}
        </button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={handleAddToCartClick}
            disabled={product.availability === 'out-of-stock'}
            className="w-full bg-white text-gray-900 hover:bg-gray-100"
          >
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Vendor */}
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <span className="truncate">{product.vendor.name}</span>
          {product.vendor.verified && (
            <FaShieldAlt className="text-blue-500 ml-1 flex-shrink-0" />
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-sm mr-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Availability and Shipping */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            {availabilityStatus.icon}
            <span className={`ml-1 ${availabilityStatus.color}`}>
              {availabilityStatus.text}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaTruck className="mr-1" />
            {product.shipping.free ? 'Free shipping' : `$${product.shipping.cost}`}
            <span className="ml-1">({product.shipping.estimatedDays} days)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard