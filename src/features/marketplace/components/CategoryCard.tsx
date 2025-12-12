import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaFlag, FaEye, FaChevronRight, FaStar, FaShoppingBag
} from 'react-icons/fa'

interface CategoryCardProps {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  image: string
  productCount: number
  color: string
  gradient: string
  tags: string[]
  featuredProducts?: FeaturedProduct[]
  isExpanded?: boolean
  onToggleExpand?: () => void
}

interface FeaturedProduct {
  id: string
  name: string
  price: number
  image: string
  rating: number
  madeInEthiopia: boolean
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  description,
  icon,
  image,
  productCount,
  color,
  gradient,
  tags,
  featuredProducts = [],
  isExpanded = false,
  onToggleExpand
}) => {
  const navigate = useNavigate()

  const handleCategoryClick = () => {
    navigate(`/marketplace/category/${id}`)
  }

  const handleProductClick = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/marketplace/product/${productId}`)
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
        className={`text-xs ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        isExpanded ? 'ring-4 ring-blue-500' : ''
      }`}
      onClick={onToggleExpand}
    >
      {/* Category Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-60`}></div>
        
        {/* Category Icon */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full p-3">
          <div className={color}>
            {icon}
          </div>
        </div>

        {/* Product Count */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          {productCount} products
        </div>

        {/* Made in Ethiopia Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
            <FaFlag className="mr-1" />
            Made in Ethiopia
          </span>
        </div>
      </div>

      {/* Category Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <FaChevronRight className={`text-gray-400 transition-transform ${
            isExpanded ? 'rotate-90' : ''
          }`} />
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-xs text-gray-500">+{tags.length - 2} more</span>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation()
            handleCategoryClick()
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <FaEye className="mr-2" />
          Browse {productCount} Products
        </Button>
      </div>

      {/* Expanded Content */}
      {isExpanded && featuredProducts.length > 0 && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <FaShoppingBag className="text-blue-500 mr-2" />
            Featured Products
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={(e) => handleProductClick(product.id, e)}
                className="flex items-center space-x-4 p-3 bg-white rounded-lg hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h5>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs text-gray-600">({product.rating})</span>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-gray-900">{formatPrice(product.price)}</div>
                  {product.madeInEthiopia && (
                    <div className="text-xs text-blue-600 flex items-center">
                      <FaFlag className="mr-1" />
                      Ethiopia
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleCategoryClick()
            }}
            variant="outline"
            className="w-full mt-4"
          >
            View All {productCount} Products
            <FaChevronRight className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default CategoryCard