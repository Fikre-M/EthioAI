import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";

type SortOption =
  | "popularity"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest"
  | "relevance";

interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  availability: ("in-stock" | "limited" | "out-of-stock")[];
  shipping: string[];
  vendors: string[];
  features: string[];
  madeInEthiopia: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  subcategory: string;
  vendor: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    location: string;
  };
  features: string[];
  tags: string[];
  availability: "in-stock" | "limited" | "out-of-stock";
  shipping: {
    free: boolean;
    estimatedDays: number;
    cost?: number;
  };
  isWishlisted: boolean;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  madeInEthiopia: boolean;
  popularity: number;
}

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    availability: [],
    shipping: [],
    vendors: [],
    features: [],
    madeInEthiopia: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock product data
  const mockProducts: Product[] = [
    {
      id: "prod-001",
      name: "Ethiopian Coffee Experience Set",
      description:
        "Premium Ethiopian coffee beans with traditional brewing equipment. Includes ceremonial cups and incense.",
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      rating: 4.8,
      reviewCount: 156,
      images: [
        "/products/coffee-set-1.jpg",
        "/products/coffee-set-2.jpg",
        "/products/coffee-set-3.jpg",
      ],
      category: "Food & Beverages",
      subcategory: "Coffee",
      vendor: {
        id: "vendor-001",
        name: "Addis Coffee Roasters",
        rating: 4.9,
        verified: true,
        location: "Addis Ababa, Ethiopia",
      },
      features: ["Organic", "Fair Trade", "Single Origin", "Traditional Roast"],
      tags: ["coffee", "ethiopian", "traditional", "gift-set"],
      availability: "in-stock",
      shipping: {
        free: true,
        estimatedDays: 3,
      },
      isWishlisted: false,
      isFeatured: true,
      isNew: false,
      createdAt: "2024-01-15",
      madeInEthiopia: true,
      popularity: 95,
    },
    {
      id: "prod-002",
      name: "Handwoven Ethiopian Scarf",
      description:
        "Beautiful traditional Ethiopian scarf made from premium cotton. Perfect for cultural events or daily wear.",
      price: 45.0,
      rating: 4.6,
      reviewCount: 89,
      images: ["/products/scarf-1.jpg", "/products/scarf-2.jpg"],
      category: "Fashion & Accessories",
      subcategory: "Scarves",
      vendor: {
        id: "vendor-002",
        name: "Heritage Textiles",
        rating: 4.7,
        verified: true,
        location: "Bahir Dar, Ethiopia",
      },
      features: [
        "Handmade",
        "100% Cotton",
        "Traditional Design",
        "Machine Washable",
      ],
      tags: ["fashion", "traditional", "handmade", "cotton"],
      availability: "in-stock",
      shipping: {
        free: false,
        estimatedDays: 5,
        cost: 8.99,
      },
      isWishlisted: true,
      isFeatured: false,
      isNew: true,
      createdAt: "2024-01-20",
      madeInEthiopia: true,
      popularity: 78,
    },
    {
      id: "prod-003",
      name: "Lalibela Rock Church Model",
      description:
        "Detailed miniature replica of the famous Lalibela rock churches. Perfect for collectors and cultural enthusiasts.",
      price: 125.0,
      rating: 4.9,
      reviewCount: 34,
      images: [
        "/products/church-model-1.jpg",
        "/products/church-model-2.jpg",
        "/products/church-model-3.jpg",
      ],
      category: "Art & Collectibles",
      subcategory: "Sculptures",
      vendor: {
        id: "vendor-003",
        name: "Cultural Artifacts Co.",
        rating: 4.8,
        verified: true,
        location: "Lalibela, Ethiopia",
      },
      features: [
        "Handcrafted",
        "Authentic Design",
        "Limited Edition",
        "Certificate of Authenticity",
      ],
      tags: ["art", "collectible", "religious", "handcrafted"],
      availability: "limited",
      shipping: {
        free: true,
        estimatedDays: 7,
      },
      isWishlisted: false,
      isFeatured: true,
      isNew: false,
      createdAt: "2024-01-10",
      madeInEthiopia: true,
      popularity: 89,
    },
    {
      id: "prod-004",
      name: "Ethiopian Spice Collection",
      description:
        "Complete collection of authentic Ethiopian spices including berbere, mitmita, and korarima. Perfect for cooking enthusiasts.",
      price: 34.99,
      originalPrice: 49.99,
      discount: 30,
      rating: 4.7,
      reviewCount: 203,
      images: ["/products/spices-1.jpg", "/products/spices-2.jpg"],
      category: "Food & Beverages",
      subcategory: "Spices",
      vendor: {
        id: "vendor-004",
        name: "Spice Route Ethiopia",
        rating: 4.6,
        verified: true,
        location: "Dire Dawa, Ethiopia",
      },
      features: [
        "Organic",
        "Freshly Ground",
        "Traditional Blend",
        "Recipe Book Included",
      ],
      tags: ["spices", "cooking", "traditional", "organic"],
      availability: "in-stock",
      shipping: {
        free: false,
        estimatedDays: 4,
        cost: 5.99,
      },
      isWishlisted: false,
      isFeatured: false,
      isNew: true,
      createdAt: "2024-01-18",
      madeInEthiopia: true,
      popularity: 82,
    },
    {
      id: "prod-005",
      name: "Traditional Ethiopian Jewelry Set",
      description:
        "Elegant silver jewelry set featuring traditional Ethiopian designs. Includes necklace, earrings, and bracelet.",
      price: 189.0,
      rating: 4.5,
      reviewCount: 67,
      images: [
        "/products/jewelry-1.jpg",
        "/products/jewelry-2.jpg",
        "/products/jewelry-3.jpg",
      ],
      category: "Fashion & Accessories",
      subcategory: "Jewelry",
      vendor: {
        id: "vendor-005",
        name: "Silver Traditions",
        rating: 4.4,
        verified: true,
        location: "Axum, Ethiopia",
      },
      features: [
        "Sterling Silver",
        "Handcrafted",
        "Traditional Design",
        "Gift Box Included",
      ],
      tags: ["jewelry", "silver", "traditional", "handmade"],
      availability: "in-stock",
      shipping: {
        free: true,
        estimatedDays: 6,
      },
      isWishlisted: true,
      isFeatured: false,
      isNew: false,
      createdAt: "2024-01-12",
      madeInEthiopia: true,
      popularity: 71,
    },
    {
      id: "prod-006",
      name: "Ethiopian Honey Collection",
      description:
        "Pure Ethiopian honey from different regions. Includes white honey, forest honey, and eucalyptus honey.",
      price: 67.5,
      rating: 4.8,
      reviewCount: 124,
      images: ["/products/honey-1.jpg", "/products/honey-2.jpg"],
      category: "Food & Beverages",
      subcategory: "Honey",
      vendor: {
        id: "vendor-006",
        name: "Golden Hive Collective",
        rating: 4.9,
        verified: true,
        location: "Tigray, Ethiopia",
      },
      features: [
        "Raw Honey",
        "No Additives",
        "Multiple Varieties",
        "Sustainable Sourcing",
      ],
      tags: ["honey", "natural", "organic", "healthy"],
      availability: "in-stock",
      shipping: {
        free: false,
        estimatedDays: 5,
        cost: 12.99,
      },
      isWishlisted: false,
      isFeatured: true,
      isNew: false,
      createdAt: "2024-01-08",
      madeInEthiopia: true,
      popularity: 93,
    },
  ];

  // Initialize products with mock data
  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setIsLoading(false);
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    setIsLoading(true);
    let result = [...products];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(
        (product) =>
          filters.categories.includes(product.category) ||
          filters.categories.includes(product.subcategory)
      );
    }

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter((product) => product.rating >= filters.rating);
    }

    // Apply availability filter
    if (filters.availability.length > 0) {
      result = result.filter((product) =>
        filters.availability.includes(product.availability)
      );
    }

    // Apply shipping filter
    if (filters.shipping.includes("free")) {
      result = result.filter((product) => product.shipping.free);
    }

    // Apply made in Ethiopia filter
    if (filters.madeInEthiopia) {
      result = result.filter((product) => product.madeInEthiopia);
    }

    // Apply vendor filter (if implemented)
    if (filters.vendors.length > 0) {
      result = result.filter((product) =>
        filters.vendors.includes(product.vendor.id)
      );
    }

    // Apply features filter (if implemented)
    if (filters.features.length > 0) {
      result = result.filter((product) =>
        filters.features.some((feature) => product.features.includes(feature))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "relevance":
          // For relevance, we could combine multiple factors
          return (b.popularity || 0) - (a.popularity || 0);
        case "popularity":
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    setFilteredProducts(result);
    setIsLoading(false);
  }, [filters, products, searchQuery, sortBy]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
      availability: [],
      shipping: [],
      vendors: [],
      features: [],
      madeInEthiopia: false,
    });
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-6 sm:mb-8 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient-ethiopian mb-2 line-clamp-2">
          Ethiopian Marketplace
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
          Discover unique products from local Ethiopian artisans and businesses
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 min-w-0 overflow-hidden">
        {/* Search */}
        <div className="w-full min-w-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter & Sort */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {Object.values(filters).some((filter) =>
              Array.isArray(filter) ? filter.length > 0 : Boolean(filter)
            ) && (
              <Badge variant="secondary" className="ml-1">
                {
                  Object.values(filters).filter((filter) =>
                    Array.isArray(filter) ? filter.length > 0 : Boolean(filter)
                  ).length
                }
              </Badge>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-9 w-9 p-0"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-9 w-9 p-0"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-9"
            >
              <option value="popularity">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-xs sm:text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 min-w-0 overflow-hidden">
        {/* Filters Sidebar */}
        <div
          className={`lg:col-span-1 order-2 lg:order-1 min-w-0 transition-all duration-300 ${
            isFilterOpen ? "block" : "hidden lg:block"
          }`}
        >
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 order-1 lg:order-2 min-w-0 overflow-hidden">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full animate-pulse"
                >
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              } gap-4 sm:gap-6`}
            >
              {filteredProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard
                    product={product}
                    viewMode={viewMode}
                    onWishlistToggle={() => {
                      setProducts(
                        products.map((p) =>
                          p.id === product.id
                            ? { ...p, isWishlisted: !p.isWishlisted }
                            : p
                        )
                      );
                    }}
                    onAddToCart={() => {
                      // Handle add to cart
                      console.log("Added to cart:", product.id);
                    }}
                    onClick={() => navigate(`/marketplace/${product.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={handleResetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
