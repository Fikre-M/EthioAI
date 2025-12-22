import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { Product } from './MarketplacePage'
import {
  FaTshirt, FaCoffee, FaHammer, FaGem, FaPalette, FaHome,
  FaArrowLeft, FaFilter, FaSort, FaTh, FaList, FaFlag,
  FaUsers, FaShoppingBag, FaStar, FaSpinner, FaHeart
} from 'react-icons/fa'

interface CategoryInfo {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  image: string
  color: string
  gradient: string
  tags: string[]
  totalProducts: number
}

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [category, setCategory] = useState<CategoryInfo | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popularity'>('relevance')
  const [showFilters, setShowFilters] = useState(false)

  const categoryInfo: { [key: string]: CategoryInfo } = {
    'traditional-clothing': {
      id: 'traditional-clothing',
      name: 'Traditional Clothing',
      description: 'Authentic Ethiopian garments including habesha kemis, netela, and traditional accessories crafted by skilled artisans.',
      icon: <FaTshirt className="text-4xl" />,
      image: '/categories/traditional-clothing-banner.jpg',
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      tags: ['Habesha Kemis', 'Netela', 'Traditional Scarves', 'Cultural Wear'],
      totalProducts: 156
    },
    'coffee-spices': {
      id: 'coffee-spices',
      name: 'Coffee & Spices',
      description: 'Premium Ethiopian coffee beans, traditional spices like berbere and mitmita, and authentic honey from the highlands.',
      icon: <FaCoffee className="text-4xl" />,
      image: '/categories/coffee-spices-banner.jpg',
      color: 'text-amber-600',
      gradient: 'from-amber-500 to-orange-500',
      tags: ['Single Origin Coffee', 'Berbere Spice', 'Ethiopian Honey', 'Traditional Blends'],
      totalProducts: 89
    },
    'handicrafts': {
      id: 'handicrafts',
      name: 'Handicrafts',
      description: 'Handcrafted items including baskets, pottery, wood carvings, and traditional tools made by Ethiopian artisans.',
      icon: <FaHammer className="text-4xl" />,
      image: '/categories/handicrafts-banner.jpg',
      color: 'text-green-600',
      gradient: 'from-green-500 to-teal-500',
      tags: ['Woven Baskets', 'Clay Pottery', 'Wood Carvings', 'Traditional Tools'],
      totalProducts: 234
    },
    'jewelry': {
      id: 'jewelry',
      name: 'Jewelry',
      description: 'Traditional Ethiopian jewelry including silver crosses, amber beads, and handcrafted accessories with cultural significance.',
      icon: <FaGem className="text-4xl" />,
      image: '/categories/jewelry-banner.jpg',
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      tags: ['Silver Crosses', 'Amber Jewelry', 'Traditional Beads', 'Cultural Accessories'],
      totalProducts: 127
    },
    'art-paintings': {
      id: 'art-paintings',
      name: 'Art & Paintings',
      description: 'Ethiopian art including traditional paintings, religious icons, contemporary works, and cultural artifacts.',
      icon: <FaPalette className="text-4xl" />,
      image: '/categories/art-paintings-banner.jpg',
      color: 'text-red-600',
      gradient: 'from-red-500 to-pink-500',
      tags: ['Religious Icons', 'Traditional Paintings', 'Contemporary Art', 'Cultural Artifacts'],
      totalProducts: 78
    },
    'home-decor': {
      id: 'home-decor',
      name: 'Home Decor',
      description: 'Ethiopian home decoration items including textiles, wall hangings, traditional furniture, and decorative objects.',
      icon: <FaHome className="text-4xl" />,
      image: '/categories/home-decor-banner.jpg',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      tags: ['Wall Hangings', 'Traditional Textiles', 'Decorative Objects', 'Cultural Furniture'],
      totalProducts: 198
    }
  }

  // Generate category-specific products
  const generateCategoryProducts = (categoryId: string): Product[] => {
    const baseProducts: Partial<Product>[] = []
    const categoryData = categoryInfo[categoryId]
    
    if (!categoryData) return []

    // Generate products based on category
    for (let i = 1; i <= categoryData.totalProducts; i++) {
      const productId = `${categoryId}-${String(i).padStart(3, '0')}`
      
      baseProducts.push({
        id: productId,
        name: `${categoryData.name} Product ${i}`,
        description: `Authentic Ethiopian ${categoryData.name.toLowerCase()} item crafted by skilled artisans. This product represents the rich cultural heritage of Ethiopia.`,
        price: Math.floor(Math.random() * 300) + 20,
        originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 400) + 50 : undefined,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : undefined,
        rating: Math.floor(Math.random() * 20) / 10 + 3.5,
        reviewCount: Math.floor(Math.random() * 200) + 10,
        images: [
          `/products/${categoryId}-${i}-1.jpg`,
          `/products/${categoryId}-${i}-2.jpg`,
          `/products/${categoryId}-${i}-3.jpg`
        ],
        category: categoryData.name,
        subcategory: categoryData.tags[Math.floor(Math.random() * categoryData.tags.length)],
        vendor: {
          id: `vendor-${Math.floor(Math.random() * 10) + 1}`,
          name: `Ethiopian ${categoryData.name} Artisan ${Math.floor(Math.random() * 20) + 1}`,
          rating: Math.floor(Math.random() * 10) / 10 + 4.0,
          verified: Math.random() > 0.2,
          location: ['Addis Ababa', 'Bahir Dar', 'Gondar', 'Lalibela', 'Axum', 'Dire Dawa'][Math.floor(Math.random() * 6)] + ', Ethiopia'
        },
        features: ['Handmade', 'Traditional', 'Authentic', 'Cultural'].slice(0, Math.floor(Math.random() * 4) + 1),
        tags: [categoryId, 'ethiopian', 'traditional', 'handmade'],
        availability: Math.random() > 0.1 ? 'in-stock' : Math.random() > 0.5 ? 'limited' : 'out-of-stock',
        shipping: {
          free: Math.random() > 0.3,
          estimatedDays: Math.floor(Math.random() * 7) + 3,
          cost: Math.random() > 0.3 ? undefined : Math.floor(Math.random() * 15) + 5
        },
        isWishlisted: Math.random() > 0.8,
        isFeatured: Math.random() > 0.8,
        isNew: Math.random() > 0.7,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        madeInEthiopia: Math.random() > 0.05, // 95% are made in Ethiopia
        popularity: Math.floor(Math.random() * 100) + 1
      })
    }

    return baseProducts as Product[]
  }

  useEffect(() => {
    if (categoryId && categoryInfo[categoryId]) {
      setIsLoading(true)
      
      // Simulate loading
      setTimeout(() => {
        const categoryData = categoryInfo[categoryId]
        const categoryProducts = generateCategoryProducts(categoryId)
        
        setCategory(categoryData)
        setProducts(categoryProducts)
        setFilteredProducts(categoryProducts.slice(0, 20)) // Show first 20 products
        setIsLoading(false)
      }, 1000)
    } else {
      navigate('/marketplace/categories')
    }
  }, [categoryId, navigate])

  const handleWishlistToggle = (productId: string) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, isWishlisted: !product.isWishlisted }
        : product
    ))
    setFilteredProducts(filteredProducts.map(product =>
      product.id === productId
        ? { ...product, isWishlisted: !product.isWishlisted }
        : product
    ))
  }

  const handleAddToCart = (productId: string) => {
    console.log('Added to cart:', productId)
  }

  const handleProductClick = (productId: string) => {
    navigate(`/marketplace/product/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading category products...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/marketplace/categories')} className="bg-blue-600 hover:bg-blue-700 text-white">
            Browse All Categories
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/marketplace')} className="hover:text-blue-600">
            Marketplace
          </button>
          <span>/</span>
          <button onClick={() => navigate('/marketplace/categories')} className="hover:text-blue-600">
            Categories
          </button>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate('/marketplace/categories')}
          variant="outline"
          className="mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Categories
        </Button>

        {/* Category Header */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-70`}></div>
            
            <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
              <div>
                <div className="mb-4">
                  {category.icon}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
                <p className="text-xl md:text-2xl mb-6 max-w-3xl opacity-90">
                  {category.description}
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <FaShoppingBag className="mr-2" />
                    <span>{category.totalProducts} Products</span>
                  </div>
                  <div className="flex items-center">
                    <FaFlag className="mr-2" />
                    <span>Made in Ethiopia</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-2" />
                    <span>Local Artisans</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tags */}
          <div className="p-6 bg-gray-50">
            <div className="flex flex-wrap gap-3">
              {category.tags.map((tag, index) => (
                <span key={index} className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center"
              >
                <FaFilter className="mr-2" />
                Filters
              </Button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
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

              <div className="text-gray-600">
                Showing {filteredProducts.length} of {category.totalProducts} products
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <ProductFilters
                filters={{
                  categories: [category.name],
                  priceRange: [0, 500],
                  rating: 0,
                  availability: [],
                  shipping: [],
                  vendors: [],
                  features: [],
                  madeInEthiopia: false
                }}
                onFiltersChange={() => {}}
                categories={[category.name]}
                vendors={Array.from(new Set(products.map(p => p.vendor.name)))}
                priceRange={[0, Math.max(...products.map(p => p.price))]}
              />
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
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
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or browse other categories</p>
                <Button onClick={() => navigate('/marketplace/categories')}>
                  Browse Other Categories
                </Button>
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length < category.totalProducts && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => {
                    const nextProducts = products.slice(filteredProducts.length, filteredProducts.length + 20)
                    setFilteredProducts([...filteredProducts, ...nextProducts])
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage