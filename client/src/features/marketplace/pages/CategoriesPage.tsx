import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaTshirt, FaCoffee, FaHammer, FaGem, FaPalette, FaHome,
  FaArrowRight, FaFlag, FaUsers, FaShoppingBag, FaStar,
  FaFire, FaGift, FaChevronRight, FaEye, FaHeart
} from 'react-icons/fa'

interface Category {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  image: string
  productCount: number
  featuredProducts: FeaturedProduct[]
  color: string
  gradient: string
  tags: string[]
}

interface FeaturedProduct {
  id: string
  name: string
  price: number
  image: string
  rating: number
  madeInEthiopia: boolean
}

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const categories: Category[] = [
    {
      id: 'traditional-clothing',
      name: 'Traditional Clothing',
      description: 'Authentic Ethiopian garments including habesha kemis, netela, and traditional accessories crafted by skilled artisans.',
      icon: <FaTshirt className="text-3xl" />,
      image: '/categories/traditional-clothing.jpg',
      productCount: 156,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      tags: ['Habesha Kemis', 'Netela', 'Traditional Scarves', 'Cultural Wear'],
      featuredProducts: [
        {
          id: 'cloth-001',
          name: 'Elegant Habesha Kemis - White with Gold Embroidery',
          price: 189.99,
          image: '/products/habesha-kemis-1.jpg',
          rating: 4.9,
          madeInEthiopia: true
        },
        {
          id: 'cloth-002',
          name: 'Traditional Netela Shawl - Handwoven Cotton',
          price: 67.50,
          image: '/products/netela-1.jpg',
          rating: 4.7,
          madeInEthiopia: true
        },
        {
          id: 'cloth-003',
          name: 'Ethiopian Cultural Scarf - Colorful Patterns',
          price: 45.00,
          image: '/products/cultural-scarf-1.jpg',
          rating: 4.6,
          madeInEthiopia: true
        }
      ]
    },
    {
      id: 'coffee-spices',
      name: 'Coffee & Spices',
      description: 'Premium Ethiopian coffee beans, traditional spices like berbere and mitmita, and authentic honey from the highlands.',
      icon: <FaCoffee className="text-3xl" />,
      image: '/categories/coffee-spices.jpg',
      productCount: 89,
      color: 'text-amber-600',
      gradient: 'from-amber-500 to-orange-500',
      tags: ['Single Origin Coffee', 'Berbere Spice', 'Ethiopian Honey', 'Traditional Blends'],
      featuredProducts: [
        {
          id: 'coffee-001',
          name: 'Yirgacheffe Single Origin Coffee Beans',
          price: 28.99,
          image: '/products/yirgacheffe-coffee.jpg',
          rating: 4.9,
          madeInEthiopia: true
        },
        {
          id: 'spice-001',
          name: 'Authentic Berbere Spice Blend - 250g',
          price: 24.50,
          image: '/products/berbere-spice.jpg',
          rating: 4.8,
          madeInEthiopia: true
        },
        {
          id: 'honey-001',
          name: 'Pure Ethiopian White Honey - 500g',
          price: 45.00,
          image: '/products/white-honey.jpg',
          rating: 4.7,
          madeInEthiopia: true
        }
      ]
    },
    {
      id: 'handicrafts',
      name: 'Handicrafts',
      description: 'Handcrafted items including baskets, pottery, wood carvings, and traditional tools made by Ethiopian artisans.',
      icon: <FaHammer className="text-3xl" />,
      image: '/categories/handicrafts.jpg',
      productCount: 234,
      color: 'text-green-600',
      gradient: 'from-green-500 to-teal-500',
      tags: ['Woven Baskets', 'Clay Pottery', 'Wood Carvings', 'Traditional Tools'],
      featuredProducts: [
        {
          id: 'craft-001',
          name: 'Traditional Ethiopian Basket - Colorful Patterns',
          price: 78.00,
          image: '/products/ethiopian-basket.jpg',
          rating: 4.8,
          madeInEthiopia: true
        },
        {
          id: 'craft-002',
          name: 'Handcrafted Clay Jebena - Coffee Pot',
          price: 56.99,
          image: '/products/clay-jebena.jpg',
          rating: 4.9,
          madeInEthiopia: true
        },
        {
          id: 'craft-003',
          name: 'Carved Wooden Ethiopian Cross',
          price: 89.50,
          image: '/products/wooden-cross.jpg',
          rating: 4.6,
          madeInEthiopia: true
        }
      ]
    },
    {
      id: 'jewelry',
      name: 'Jewelry',
      description: 'Traditional Ethiopian jewelry including silver crosses, amber beads, and handcrafted accessories with cultural significance.',
      icon: <FaGem className="text-3xl" />,
      image: '/categories/jewelry.jpg',
      productCount: 127,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      tags: ['Silver Crosses', 'Amber Jewelry', 'Traditional Beads', 'Cultural Accessories'],
      featuredProducts: [
        {
          id: 'jewelry-001',
          name: 'Sterling Silver Ethiopian Cross Necklace',
          price: 156.00,
          image: '/products/silver-cross-necklace.jpg',
          rating: 4.9,
          madeInEthiopia: true
        },
        {
          id: 'jewelry-002',
          name: 'Traditional Amber Bead Bracelet',
          price: 89.99,
          image: '/products/amber-bracelet.jpg',
          rating: 4.7,
          madeInEthiopia: true
        },
        {
          id: 'jewelry-003',
          name: 'Handcrafted Ethiopian Earrings Set',
          price: 67.50,
          image: '/products/traditional-earrings.jpg',
          rating: 4.8,
          madeInEthiopia: true
        }
      ]
    },
    {
      id: 'art-paintings',
      name: 'Art & Paintings',
      description: 'Ethiopian art including traditional paintings, religious icons, contemporary works, and cultural artifacts.',
      icon: <FaPalette className="text-3xl" />,
      image: '/categories/art-paintings.jpg',
      productCount: 78,
      color: 'text-red-600',
      gradient: 'from-red-500 to-pink-500',
      tags: ['Religious Icons', 'Traditional Paintings', 'Contemporary Art', 'Cultural Artifacts'],
      featuredProducts: [
        {
          id: 'art-001',
          name: 'Traditional Ethiopian Religious Icon - Hand Painted',
          price: 234.00,
          image: '/products/religious-icon.jpg',
          rating: 4.9,
          madeInEthiopia: true
        },
        {
          id: 'art-002',
          name: 'Ethiopian Landscape Painting - Simien Mountains',
          price: 189.50,
          image: '/products/landscape-painting.jpg',
          rating: 4.8,
          madeInEthiopia: true
        },
        {
          id: 'art-003',
          name: 'Contemporary Ethiopian Art - Cultural Fusion',
          price: 167.99,
          image: '/products/contemporary-art.jpg',
          rating: 4.6,
          madeInEthiopia: true
        }
      ]
    },
    {
      id: 'home-decor',
      name: 'Home Decor',
      description: 'Ethiopian home decoration items including textiles, wall hangings, traditional furniture, and decorative objects.',
      icon: <FaHome className="text-3xl" />,
      image: '/categories/home-decor.jpg',
      productCount: 198,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      tags: ['Wall Hangings', 'Traditional Textiles', 'Decorative Objects', 'Cultural Furniture'],
      featuredProducts: [
        {
          id: 'decor-001',
          name: 'Ethiopian Traditional Wall Hanging - Woven Art',
          price: 123.00,
          image: '/products/wall-hanging.jpg',
          rating: 4.7,
          madeInEthiopia: true
        },
        {
          id: 'decor-002',
          name: 'Handwoven Ethiopian Table Runner',
          price: 56.50,
          image: '/products/table-runner.jpg',
          rating: 4.8,
          madeInEthiopia: true
        },
        {
          id: 'decor-003',
          name: 'Traditional Ethiopian Stool - Carved Wood',
          price: 189.99,
          image: '/products/traditional-stool.jpg',
          rating: 4.6,
          madeInEthiopia: true
        }
      ]
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/marketplace?category=${categoryId}`)
  }

  const handleProductClick = (productId: string) => {
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
        className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ethiopian Product Categories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover authentic Ethiopian products organized by traditional categories. 
            Each item is handcrafted by skilled artisans and represents the rich cultural heritage of Ethiopia.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <FaFlag className="text-blue-600 mr-2" />
              <span>Made in Ethiopia</span>
            </div>
            <div className="flex items-center">
              <FaUsers className="text-green-600 mr-2" />
              <span>Supporting Local Artisans</span>
            </div>
            <div className="flex items-center">
              <FaShoppingBag className="text-purple-600 mr-2" />
              <span>1000+ Authentic Products</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedCategory === category.id ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60`}></div>
                
                {/* Category Icon */}
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full p-3">
                  <div className={category.color}>
                    {category.icon}
                  </div>
                </div>

                {/* Product Count */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {category.productCount} products
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
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  <FaChevronRight className={`text-gray-400 transition-transform ${
                    selectedCategory === category.id ? 'rotate-90' : ''
                  }`} />
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {category.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {category.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{category.tags.length - 2} more</span>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCategoryClick(category.id)
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <FaEye className="mr-2" />
                  Browse {category.productCount} Products
                </Button>
              </div>

              {/* Expanded Content */}
              {selectedCategory === category.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FaFire className="text-orange-500 mr-2" />
                    Featured Products
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {category.featuredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProductClick(product.id)
                        }}
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
                      handleCategoryClick(category.id)
                    }}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    View All {category.productCount} Products
                    <FaArrowRight className="ml-2" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Discover Authentic Ethiopian Culture</h2>
          <p className="text-xl mb-6 opacity-90">
            Each product tells a story of Ethiopian heritage, crafted with love by skilled artisans
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => navigate('/marketplace')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              <FaShoppingBag className="mr-2" />
              Browse All Products
            </Button>
            <Button
              onClick={() => navigate('/marketplace?filter=madeInEthiopia')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              <FaFlag className="mr-2" />
              Made in Ethiopia Only
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">1000+</div>
            <div className="text-gray-600">Authentic Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">500+</div>
            <div className="text-gray-600">Local Artisans</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">6</div>
            <div className="text-gray-600">Product Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage