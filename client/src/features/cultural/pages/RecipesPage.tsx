import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaArrowLeft, FaSearch, FaFilter, FaClock, FaUsers,
  FaHeart, FaStar, FaPlay, FaUtensils,
  FaFire, FaLeaf, FaGlobe, FaUserTie
} from 'react-icons/fa'

interface Recipe {
  id: string
  name: string
  description: string
  image: string
  difficulty: 'easy' | 'medium' | 'hard'
  cookingTime: number // minutes
  servings: number
  category: 'main' | 'side' | 'dessert' | 'beverage' | 'snack'
  region: string
  spiceLevel: 'mild' | 'medium' | 'hot' | 'very-hot'
  ingredients: string[]
  tags: string[]
  rating: number
  reviews: number
  videoUrl?: string
  author: string
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  nutritionInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

const RecipesPage: React.FC = () => {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'time' | 'popularity'>('popularity')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  // Mock recipe data
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Doro Wat',
      description: 'Traditional Ethiopian chicken stew with berbere spice and hard-boiled eggs. The national dish of Ethiopia.',
      image: '/images/recipes/doro-wat.jpg',
      difficulty: 'hard',
      cookingTime: 120,
      servings: 6,
      category: 'main',
      region: 'Nationwide',
      spiceLevel: 'hot',
      ingredients: [
        '1 whole chicken, cut into pieces',
        '6 hard-boiled eggs',
        '2 large onions, finely chopped',
        '4 tbsp berbere spice blend',
        '2 tbsp niter kibbeh (Ethiopian spiced butter)',
        '3 cloves garlic, minced',
        '1 inch ginger, minced',
        '1 cup chicken broth',
        'Salt to taste'
      ],
      tags: ['traditional', 'spicy', 'festive', 'protein-rich'],
      rating: 4.8,
      reviews: 245,
      videoUrl: '/videos/doro-wat-tutorial.mp4',
      author: 'Chef Almaz Tadesse',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      nutritionInfo: {
        calories: 485,
        protein: 42,
        carbs: 12,
        fat: 28
      }
    },
    {
      id: '2',
      name: 'Injera',
      description: 'Spongy sourdough flatbread made from teff flour. The foundation of Ethiopian cuisine.',
      image: '/images/recipes/injera.jpg',
      difficulty: 'medium',
      cookingTime: 72, // 3 days fermentation + cooking
      servings: 8,
      category: 'side',
      region: 'Nationwide',
      spiceLevel: 'mild',
      ingredients: [
        '2 cups teff flour',
        '3 cups water',
        '1/2 cup starter (optional)',
        'Pinch of salt'
      ],
      tags: ['traditional', 'fermented', 'gluten-free', 'staple'],
      rating: 4.6,
      reviews: 189,
      videoUrl: '/videos/injera-making.mp4',
      author: 'Grandmother Worknesh',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      nutritionInfo: {
        calories: 180,
        protein: 6,
        carbs: 35,
        fat: 2
      }
    },
    {
      id: '3',
      name: 'Kitfo',
      description: 'Ethiopian steak tartare seasoned with mitmita spice and served with ayib cheese.',
      image: '/images/recipes/kitfo.jpg',
      difficulty: 'easy',
      cookingTime: 15,
      servings: 4,
      category: 'main',
      region: 'Gurage',
      spiceLevel: 'medium',
      ingredients: [
        '1 lb lean beef, finely minced',
        '2 tbsp niter kibbeh',
        '1 tbsp mitmita spice',
        '1/2 cup ayib cheese',
        'Gomen (collard greens) for serving',
        'Salt to taste'
      ],
      tags: ['raw', 'spicy', 'protein-rich', 'traditional'],
      rating: 4.4,
      reviews: 156,
      author: 'Chef Yohannes Gebre',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      nutritionInfo: {
        calories: 320,
        protein: 28,
        carbs: 3,
        fat: 22
      }
    },
    {
      id: '4',
      name: 'Shiro Wat',
      description: 'Creamy chickpea flour stew, a beloved vegetarian dish perfect for fasting periods.',
      image: '/images/recipes/shiro-wat.jpg',
      difficulty: 'easy',
      cookingTime: 30,
      servings: 4,
      category: 'main',
      region: 'Nationwide',
      spiceLevel: 'medium',
      ingredients: [
        '1 cup shiro powder (ground chickpeas)',
        '2 cups water or vegetable broth',
        '1 large onion, chopped',
        '3 cloves garlic, minced',
        '2 tbsp berbere spice',
        '3 tbsp olive oil',
        '1 tsp ginger, minced',
        'Salt to taste'
      ],
      tags: ['vegetarian', 'vegan', 'protein-rich', 'fasting-friendly'],
      rating: 4.7,
      reviews: 203,
      videoUrl: '/videos/shiro-wat-recipe.mp4',
      author: 'Chef Meron Addis',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      nutritionInfo: {
        calories: 285,
        protein: 15,
        carbs: 32,
        fat: 12
      }
    },
    {
      id: '5',
      name: 'Tibs',
      description: 'Sautéed meat with vegetables, onions, and aromatic spices. A popular dish for special occasions.',
      image: '/images/recipes/tibs.jpg',
      difficulty: 'medium',
      cookingTime: 25,
      servings: 4,
      category: 'main',
      region: 'Nationwide',
      spiceLevel: 'medium',
      ingredients: [
        '1.5 lbs beef or lamb, cubed',
        '2 large onions, sliced',
        '2 bell peppers, sliced',
        '4 cloves garlic, minced',
        '2 tbsp berbere spice',
        '3 tbsp niter kibbeh',
        '1 tsp rosemary',
        'Salt and pepper to taste'
      ],
      tags: ['sautéed', 'vegetables', 'aromatic', 'celebration'],
      rating: 4.5,
      reviews: 178,
      videoUrl: '/videos/tibs-cooking.mp4',
      author: 'Chef Daniel Berhane',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      nutritionInfo: {
        calories: 395,
        protein: 35,
        carbs: 8,
        fat: 25
      }
    },
    {
      id: '6',
      name: 'Ethiopian Coffee',
      description: 'Traditional coffee ceremony preparation with roasted beans, creating an aromatic and social experience.',
      image: '/images/recipes/ethiopian-coffee.jpg',
      difficulty: 'medium',
      cookingTime: 45,
      servings: 6,
      category: 'beverage',
      region: 'Nationwide',
      spiceLevel: 'mild',
      ingredients: [
        '1/2 cup green coffee beans',
        '3 cups water',
        'Incense for ceremony',
        'Sugar or honey (optional)',
        'Popcorn for serving (traditional)'
      ],
      tags: ['ceremony', 'traditional', 'social', 'aromatic'],
      rating: 4.9,
      reviews: 312,
      videoUrl: '/videos/coffee-ceremony.mp4',
      author: 'Grandmother Almaz',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      nutritionInfo: {
        calories: 5,
        protein: 0,
        carbs: 1,
        fat: 0
      }
    }
  ]

  const categories = [
    { id: 'all', name: 'All Recipes', icon: FaUtensils },
    { id: 'main', name: 'Main Dishes', icon: FaUserTie },
    { id: 'side', name: 'Side Dishes', icon: FaLeaf },
    { id: 'dessert', name: 'Desserts', icon: FaStar },
    { id: 'beverage', name: 'Beverages', icon: FaGlobe },
    { id: 'snack', name: 'Snacks', icon: FaFire }
  ]

  useEffect(() => {
    setRecipes(mockRecipes)
    setFilteredRecipes(mockRecipes)
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('recipe-favorites')
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  useEffect(() => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = searchTerm === '' || 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty
      const matchesSpiceLevel = selectedSpiceLevel === 'all' || recipe.spiceLevel === selectedSpiceLevel
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesSpiceLevel
    })

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'time':
          return a.cookingTime - b.cookingTime
        case 'popularity':
          return b.reviews - a.reviews
        default:
          return 0
      }
    })

    setFilteredRecipes(filtered)
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, selectedSpiceLevel, sortBy])

  const toggleFavorite = (recipeId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId)
    } else {
      newFavorites.add(recipeId)
    }
    setFavorites(newFavorites)
    localStorage.setItem('recipe-favorites', JSON.stringify(Array.from(newFavorites)))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSpiceLevelColor = (spiceLevel: string) => {
    switch (spiceLevel) {
      case 'mild': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'hot': return 'text-orange-600'
      case 'very-hot': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSpiceLevelIcons = (spiceLevel: string) => {
    const count = spiceLevel === 'mild' ? 1 : spiceLevel === 'medium' ? 2 : spiceLevel === 'hot' ? 3 : 4
    return Array.from({ length: count }, (_, i) => (
      <FaFire key={i} className={getSpiceLevelColor(spiceLevel)} />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/cultural')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaUtensils className="mr-3 text-orange-600" />
                  Ethiopian Recipes
                </h1>
                <p className="text-gray-600 mt-1">Discover authentic Ethiopian cuisine and cooking traditions</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" />
              Filters
            </Button>
          </div>

          {/* Search and Quick Stats */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes, ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>{filteredRecipes.length} recipes found</span>
              <span>{favorites.size} favorites</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2 mb-6">
                {categories.map(category => {
                  const IconComponent = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-orange-100 text-orange-800'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="text-sm" />
                      <span>{category.name}</span>
                    </button>
                  )
                })}
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Difficulty</h3>
              <div className="space-y-2 mb-6">
                {['all', 'easy', 'medium', 'hard'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`w-full px-3 py-2 rounded-lg text-left transition-colors capitalize ${
                      selectedDifficulty === difficulty
                        ? 'bg-orange-100 text-orange-800'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Spice Level</h3>
              <div className="space-y-2 mb-6">
                {['all', 'mild', 'medium', 'hot', 'very-hot'].map(spiceLevel => (
                  <button
                    key={spiceLevel}
                    onClick={() => setSelectedSpiceLevel(spiceLevel)}
                    className={`w-full px-3 py-2 rounded-lg text-left transition-colors capitalize ${
                      selectedSpiceLevel === spiceLevel
                        ? 'bg-orange-100 text-orange-800'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {spiceLevel.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="time">Cooking Time</option>
              </select>
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/cultural/recipe/${recipe.id}`)}
                >
                  {/* Recipe Image */}
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-orange-400 to-red-600 rounded-t-lg">
                      <div className="flex items-center justify-center h-48">
                        <FaUtensils className="text-white text-4xl" />
                      </div>
                    </div>
                    
                    {/* Overlay badges */}
                    <div className="absolute top-3 left-3 flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                      {recipe.videoUrl && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          <FaPlay className="mr-1" />
                          Video
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(recipe.id)
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                        favorites.has(recipe.id)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                      }`}
                    >
                      <FaHeart />
                    </button>
                  </div>

                  {/* Recipe Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center space-x-1 ml-2">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="text-sm text-gray-600">{recipe.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          {recipe.cookingTime}m
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="mr-1" />
                          {recipe.servings}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {getSpiceLevelIcons(recipe.spiceLevel)}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {recipe.isVegetarian && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Vegetarian
                        </span>
                      )}
                      {recipe.isVegan && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Vegan
                        </span>
                      )}
                      {recipe.isGlutenFree && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          Gluten-Free
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        by {recipe.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {recipe.reviews} reviews
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <FaUtensils className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipesPage