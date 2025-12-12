import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import {
  FaSearch, FaFilter, FaSort, FaGrid3X3, FaList, FaHeart,
  FaShoppingCart, FaStar, FaMapMarkerAlt, FaTag, FaFire,
  FaGift, FaShieldAlt, FaTruck, FaArrowUp, FaArrowDown
} from 'react-icons/fa'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviewCount: number
  images: string[]
  category: string
  subcategory: string
  vendor: {
    id: string
    name: string
    rating: number
    verified: boolean
    location: string
  }
  features: string[]
  tags: string[]
  availability: 'in-stock' | 'limited' | 'out-of-stock'
  shipping: {
    free: boolean
    estimatedDays: number
    cost?: number
  }
  isWishlisted: boolean
  isFeatured: boolean
  isNew: boolean
  createdAt: string
}

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  rating: number
  availability: string[]
  shipping: string[]
  vendors: string[]
  features: string[]
}

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    availability: [],
    shipping: [],
    vendors: [],
    features: []
  })
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest'>('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  // Mock product data
  const mockProducts: Product[] = [
    {
      id: 'prod-001',
      name: 'Ethiopian Coffee Experience Set',
      description: 'Premium Ethiopian coffee beans with traditional brewing equipment. Includes ceremonial cups and incense.',
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      rating: 4.8,
      reviewCount: 156,
      images: [
        '/products/coffee-set-1.jpg',
        '/products/coffee-set-2.jpg',
        '/products/coffee-set-3.jpg'
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
      features: ['Organic', 'Fair Trade', 'Single Origin', 'Traditional Roast'],
      tags: ['coffee', 'ethiopian', 'traditional', 'gift-set'],
      availability: 'in-stock',
      shipping: {
        free: true,
        estimatedDays: 3
      },
      isWishlisted: false,
      isFeatured: true,
      isNew: false,
      createdAt: '2024-01-15'
    },
    {
      id: 'prod-002',
      name: 'Handwoven Ethiopian Scarf',
      description: 'Beautiful traditional Ethiopian scarf made from premium cotton. Perfect for cultural events or daily wear.',
      price: 45.00,
      rating: 4.6,
      reviewCount: 89,
      images: [
        '/products/scarf-1.jpg',
        '/products/scarf-2.jpg'
      ],
      category: 'Fashion & Accessories',
      subcategory: 'Scarves',
      vendor: {
        id: 'vendor-002',
        name: 'Heritage Textiles',
        rating: 4.7,
        verified: true,
        location: 'Bahir Dar, Ethiopia'
      },
      features: ['Handmade', '100% Cotton', 'Traditional Design', 'Machine Washable'],
      tags: ['fashion', 'traditional', 'handmade', 'cotton'],
      availability: 'in-stock',
      shipping: {
        free: false,
        estimatedDays: 5,
        cost: 8.99
      },
      isWishlisted: true,
      isFeatured: false,
      isNew: true,
      createdAt: '2024-01-20'
    },
    {
      id: 'prod-003',
      name: 'Lalibela Rock Church Model',
      description: 'Detailed miniature replica of the famous Lalibela rock churches. Perfect for collectors and cultural enthusiasts.',
      price: 125.00,
      rating: 4.9,
      reviewCount: 34,
      images: [
        '/products/church-model-1.jpg',
        '/products/church-model-2.jpg',
        '/products/church-model-3.jpg'
      ],
      category: 'Art & Collectibles',
      subcategory: 'Sculptures',
      vendor: {
        id: 'vendor-003',
        name: 'Cultural Artifacts Co.',
        rating: 4.8,
        verified: true,
        location: 'Lalibela, Ethiopia'
      },
      features: ['Handcrafted', 'Authentic Design', 'Limited Edition', 'Certificate of Authenticity'],
      tags: ['art', 'collectible', 'religious', 'handcrafted'],
      availability: 'limited',
      shipping: {
        free: true,
        estimatedDays: 7
      },
      isWishlisted: false,
      isFeatured: true,
      isNew: false,
      createdAt: '2024-01-10'
    },
    {
      id: 'prod-004',
      name: 'Ethiopian Spice Collection',
      description: 'Complete collection of authentic Ethiopian spices including berbere, mitmita, and korarima. Perfect for cooking enthusiasts.',
      price: 34.99,
      originalPrice: 49.99,
      discount: 30,
      rating: 4.7,
      reviewCount: 203,
      images: [
        '/products/spices-1.jpg',
        '/products/spices-2.jpg'
      ],
      category: 'Food & Beverages',
      subcategory: 'Spices',
      vendor: {
        id: 'vendor-004',
        name: 'Spice Route Ethiopia',
        rating: 4.6,
        verified: true,
        location: 'Dire Dawa, Ethiopia'
      },
      features: ['Organic', 'Freshly Ground', 'Traditional Blend', 'Recipe Book Included'],
      tags: ['spices', 'cooking', 'traditional', 'organic'],
      availability: 'in-stock',
      shipping: {
        free: false,
        estimatedDays: 4,
        cost: 5.99
      },
      isWishlisted: false,
      isFeatured: false,
      isNew: true,
      createdAt: '2024-01-18'
    },
    {
      id: 'prod-005',
      name: 'Traditional Ethiopian Jewelry Set',
      description: 'Elegant silver jewelry set featuring traditional Ethiopian designs. Includes necklace, earrings, and bracelet.',
      price: 189.00,
      rating: 4.5,
      reviewCount: 67,
      images: [
        '/products/jewelry-1.jpg',
        '/products/jewelry-2.jpg',
        '/products/jewelry-3.jpg'
      ],
      category: 'Fashion & Accessories',
      subcategory: 'Jewelry',
      vendor: {
        id: 'vendor-005',
        name: 'Silver Traditions',
        rating: 4.4,
        verified: true,
        location: 'Axum, Ethiopia'
      },
      features: ['Sterling Silver', 'Handcrafted', 'Traditional Design', 'Gift Box Included'],
      tags: ['jewelry', 'silver', 'traditional', 'handmade'],
      availability: 'in-stock',
      shipping: {
        free: true,
        estimatedDays: 6
      },
      isWishlisted: true,
      isFeatured: false,
      isNew: false,
      createdAt: '2024-01-12'
    },
    {
      id: 'prod-006',
      name: 'Ethiopian Honey Collection',
      description: 'Pure Ethiopian honey from different regions. Includes white honey, forest honey, and eucalyptus honey.',
      price: 67.50,
      rating: 4.8,
      reviewCount: 124,
      images: [
        '/products/honey-1.jpg',
        '/products/honey-2.jpg'
      ],
      category: 'Food & Beverages',
      subcategory: 'Honey',
      vendor: {
        id: 'vendor-006',
        name: 'Golden Hive Collective',
        rating: 4.9,
        verified: true,
        location: 'Tigray, Ethiopia'
      },
      features: ['Raw Honey', 'No Additives', 'Multiple Varieties', 'Sustainable Sourcing'],
      tags: ['honey', 'natural', 'organic', 'healthy'],
      availability: 'in-stock',
      shipping: {
        free: false,
        estimatedDays: 5,
        cost: 12.99
      },
      isWishlisted: false,
      isFeatured: true,
      isNew: false,
      createdAt: '2024-01-08'
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [products, filters, sortBy, searchQuery])

  const applyFiltersAndSort = () => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      )
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating)
    }

    // Apply availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(product =>
        filters.availability.includes(product.availability)
      )
    }

    // Apply shipping filter
    if (filters.shipping.includes('free')) {
      filtered = filtered.filter(product => product.shipping.free)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        // Relevance - featured first, then by rating
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return b.rating - a.rating
        })
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleWishlistToggle = (productId: string) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, isWishlisted: !product.isWishlisted }
        : product
    ))
  }

  const handleAddToCart = (productId: string) => {
    // Add to cart logic
    console.log('Added to cart:', productId)
    // You could show a toast notification here
  }

  const handleProductClick = (productId: string) => {
    navigate(`/marketplace/product/${productId}`)
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const categories = Array.from(new Set(products.map(p => p.category)))
  const vendors = Array.from(new Set(products.map(p => p.vendor.name)))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ethiopian Marketplace</h1>
          <p className="text-xl text-gray-600">Discover authentic Ethiopian products and cultural treasures</p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, categories, or vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Controls */}
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
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
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
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
                categories={categories}
                vendors={vendors}
                priceRange={[0, Math.max(...products.map(p => p.price))]}
              />
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              
              {/* Featured Tags */}
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  <FaFire className="mr-1" />
                  Featured
                </span>
                <span className="flex items-center text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <FaGift className="mr-1" />
                  New Arrivals
                </span>
              </div>
            </div>

            {/* Products */}
            {currentProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {currentProducts.map((product) => (
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
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setFilters({
                    categories: [],
                    priceRange: [0, 1000],
                    rating: 0,
                    availability: [],
                    shipping: [],
                    vendors: [],
                    features: []
                  })
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? 'default' : 'outline'}
                    className={currentPage === page ? 'bg-blue-600 text-white' : ''}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplacePage