import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaArrowLeft, FaClock, FaUsers, FaStar, FaHeart, FaShare,
  FaPlay, FaUtensils, FaFire, FaLeaf, FaGlobe, FaMapMarkerAlt,
  FaUserTie, FaBookmark, FaPrint, FaCheck, FaPlus,
  FaMinus, FaShoppingCart, FaExternalLinkAlt
} from 'react-icons/fa'

interface Recipe {
  id: string
  name: string
  description: string
  image: string
  difficulty: 'easy' | 'medium' | 'hard'
  cookingTime: number
  prepTime: number
  servings: number
  category: string
  region: string
  spiceLevel: 'mild' | 'medium' | 'hot' | 'very-hot'
  ingredients: {
    name: string
    amount: string
    notes?: string
  }[]
  instructions: {
    step: number
    title: string
    description: string
    time?: number
    image?: string
    tips?: string[]
  }[]
  tags: string[]
  rating: number
  reviews: number
  videoUrl?: string
  author: string
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  nutritionInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sodium: number
  }
  culturalBackground: string
  servingTips: string[]
  variations: string[]
  storageInstructions: string
}

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [servings, setServings] = useState(4)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'recipe' | 'nutrition' | 'reviews'>('recipe')
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [shoppingList, setShoppingList] = useState<Set<string>>(new Set())

  // Mock recipe data - in real app, fetch by ID
  const mockRecipe: Recipe = {
    id: '1',
    name: 'Doro Wat',
    description: 'Traditional Ethiopian chicken stew with berbere spice and hard-boiled eggs. This is Ethiopia\'s national dish, typically served during special occasions and holidays. The rich, complex flavors develop through slow cooking and the perfect blend of spices.',
    image: '/images/recipes/doro-wat-detail.jpg',
    difficulty: 'hard',
    cookingTime: 90,
    prepTime: 30,
    servings: 6,
    category: 'Main Dish',
    region: 'Nationwide Ethiopia',
    spiceLevel: 'hot',
    ingredients: [
      { name: 'Whole chicken', amount: '1 (3-4 lbs)', notes: 'cut into 8-10 pieces' },
      { name: 'Hard-boiled eggs', amount: '6 large', notes: 'peeled' },
      { name: 'Red onions', amount: '3 large', notes: 'finely chopped' },
      { name: 'Berbere spice blend', amount: '4 tablespoons', notes: 'authentic Ethiopian blend' },
      { name: 'Niter kibbeh', amount: '3 tablespoons', notes: 'Ethiopian spiced butter' },
      { name: 'Garlic cloves', amount: '6 cloves', notes: 'minced' },
      { name: 'Fresh ginger', amount: '2 inches', notes: 'peeled and minced' },
      { name: 'Chicken broth', amount: '2 cups', notes: 'low sodium' },
      { name: 'Tomato paste', amount: '2 tablespoons' },
      { name: 'White wine', amount: '1/4 cup', notes: 'optional' },
      { name: 'Salt', amount: 'to taste' },
      { name: 'Black pepper', amount: '1/2 teaspoon' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Prepare the Onions',
        description: 'In a large, heavy-bottomed pot, cook the chopped onions over medium heat without oil for 10-15 minutes, stirring frequently until they become soft and golden. This dry-cooking method is traditional and develops deep flavor.',
        time: 15,
        tips: ['Stir constantly to prevent burning', 'The onions should be caramelized but not dark brown']
      },
      {
        step: 2,
        title: 'Add Aromatics',
        description: 'Add the minced garlic and ginger to the onions. Cook for 2-3 minutes until fragrant. Add the tomato paste and cook for another 2 minutes, stirring constantly.',
        time: 5,
        tips: ['Keep the heat at medium to prevent burning the garlic']
      },
      {
        step: 3,
        title: 'Create the Berbere Base',
        description: 'Add the berbere spice blend and niter kibbeh to the pot. Stir well and cook for 2-3 minutes to bloom the spices. The mixture should be fragrant and deep red.',
        time: 3,
        tips: ['Berbere can burn quickly, so watch carefully', 'The spices should sizzle but not smoke']
      },
      {
        step: 4,
        title: 'Add Liquid',
        description: 'Gradually add the chicken broth and wine (if using), stirring constantly to prevent lumps. Bring the mixture to a gentle simmer.',
        time: 5,
        tips: ['Add liquid slowly while stirring to create a smooth sauce']
      },
      {
        step: 5,
        title: 'Cook the Chicken',
        description: 'Add the chicken pieces to the pot, turning to coat with the sauce. Cover and simmer for 45-60 minutes, turning the chicken occasionally, until tender and cooked through.',
        time: 60,
        tips: ['Don\'t rush this step - slow cooking develops the best flavor', 'The sauce should be thick enough to coat the chicken']
      },
      {
        step: 6,
        title: 'Add the Eggs',
        description: 'Gently add the hard-boiled eggs to the pot. Simmer for an additional 10-15 minutes to allow the eggs to absorb the flavors. Season with salt and pepper to taste.',
        time: 15,
        tips: ['Score the eggs lightly with a knife to help them absorb flavor', 'Be gentle to avoid breaking the eggs']
      },
      {
        step: 7,
        title: 'Final Seasoning and Rest',
        description: 'Taste and adjust seasoning. Remove from heat and let rest for 10 minutes before serving. This allows the flavors to meld together.',
        time: 10,
        tips: ['The dish tastes even better the next day', 'Serve with injera bread for authentic experience']
      }
    ],
    tags: ['traditional', 'spicy', 'festive', 'protein-rich', 'special-occasion'],
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
      fat: 28,
      fiber: 3,
      sodium: 890
    },
    culturalBackground: 'Doro Wat is Ethiopia\'s national dish and holds deep cultural significance. Traditionally prepared for special occasions like Ethiopian New Year (Enkutatash), Christmas (Genna), and Epiphany (Timkat), this dish represents hospitality and celebration. The preparation is often a communal activity, with family members gathering to help with the lengthy cooking process. The berbere spice blend, which gives the dish its distinctive flavor and color, is often made from scratch and passed down through generations.',
    servingTips: [
      'Serve with injera bread for an authentic experience',
      'Traditionally eaten with hands using injera to scoop the stew',
      'Accompany with ayib (Ethiopian cottage cheese) to balance the heat',
      'Serve with honey wine (tej) or Ethiopian beer',
      'Present on a communal platter for sharing'
    ],
    variations: [
      'Doro Alicha: A milder version using turmeric instead of berbere',
      'Vegetarian version: Replace chicken with mushrooms or cauliflower',
      'Fish Wat: Use fish fillets instead of chicken',
      'Beef Wat: Substitute beef chuck roast for chicken'
    ],
    storageInstructions: 'Store in refrigerator for up to 3 days. Reheat gently on stovetop, adding a little broth if needed. Freezes well for up to 3 months.'
  }

  useEffect(() => {
    // In real app, fetch recipe by ID
    setRecipe(mockRecipe)
    setServings(mockRecipe.servings)
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('recipe-favorites')
    if (savedFavorites) {
      const favorites = new Set(JSON.parse(savedFavorites))
      setIsFavorite(favorites.has(id || ''))
    }
  }, [id])

  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem('recipe-favorites')
    const favorites = savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set()
    
    if (isFavorite) {
      favorites.delete(id)
    } else {
      favorites.add(id)
    }
    
    setIsFavorite(!isFavorite)
    localStorage.setItem('recipe-favorites', JSON.stringify(Array.from(favorites)))
  }

  const toggleStep = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber)
    } else {
      newCompleted.add(stepNumber)
    }
    setCompletedSteps(newCompleted)
  }

  const adjustServings = (newServings: number) => {
    if (newServings > 0 && newServings <= 20) {
      setServings(newServings)
    }
  }

  const getAdjustedAmount = (originalAmount: string, originalServings: number) => {
    const ratio = servings / originalServings
    const match = originalAmount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/)
    
    if (match) {
      const [, amount, unit] = match
      const adjustedAmount = (parseFloat(amount) * ratio).toFixed(1)
      return `${adjustedAmount} ${unit}`
    }
    
    return originalAmount
  }

  const toggleShoppingList = (ingredient: string) => {
    const newList = new Set(shoppingList)
    if (newList.has(ingredient)) {
      newList.delete(ingredient)
    } else {
      newList.add(ingredient)
    }
    setShoppingList(newList)
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

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/cultural/recipes')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Recipes</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <FaPrint className="mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFavorite}>
                <FaHeart className={`mr-2 ${isFavorite ? 'text-red-500' : ''}`} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </Button>
              <Button variant="outline" size="sm">
                <FaShare className="mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Recipe Header */}
            <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg mb-4">
                    <div className="flex items-center justify-center h-64">
                      <FaUtensils className="text-white text-6xl" />
                    </div>
                  </div>
                  
                  {recipe.videoUrl && (
                    <div className="mt-4">
                      <Button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        <FaPlay className="mr-2" />
                        Watch Cooking Video
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="md:w-1/2">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getSpiceLevelIcons(recipe.spiceLevel)}
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{recipe.name}</h1>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">{recipe.rating}</span>
                      <span className="text-gray-600 ml-1">({recipe.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">{recipe.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <FaClock className="mx-auto text-orange-600 mb-2" />
                      <div className="text-sm text-gray-600">Total Time</div>
                      <div className="font-semibold">{recipe.prepTime + recipe.cookingTime}m</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <FaUsers className="mx-auto text-blue-600 mb-2" />
                      <div className="text-sm text-gray-600">Servings</div>
                      <div className="font-semibold">{recipe.servings}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <FaUserTie className="mx-auto text-green-600 mb-2" />
                      <div className="text-sm text-gray-600">Difficulty</div>
                      <div className="font-semibold capitalize">{recipe.difficulty}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {recipe.isVegetarian && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <FaLeaf className="inline mr-1" />
                        Vegetarian
                      </span>
                    )}
                    {recipe.isVegan && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <FaLeaf className="inline mr-1" />
                        Vegan
                      </span>
                    )}
                    {recipe.isGlutenFree && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Gluten-Free
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center mb-2">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{recipe.region}</span>
                    </div>
                    <div>Recipe by <span className="font-medium">{recipe.author}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'recipe', label: 'Recipe', icon: FaUtensils },
                    { id: 'nutrition', label: 'Nutrition', icon: FaLeaf },
                    { id: 'reviews', label: 'Reviews', icon: FaStar }
                  ].map(tab => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <IconComponent className="text-sm" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Recipe Tab */}
                {activeTab === 'recipe' && (
                  <div className="space-y-8">
                    {/* Ingredients */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Ingredients</h2>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Servings:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => adjustServings(servings - 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <FaMinus className="text-gray-600" />
                            </button>
                            <span className="font-medium w-8 text-center">{servings}</span>
                            <button
                              onClick={() => adjustServings(servings + 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <FaPlus className="text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {recipe.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleShoppingList(ingredient.name)}
                                className={`p-1 rounded ${
                                  shoppingList.has(ingredient.name)
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white text-gray-400 hover:text-gray-600'
                                }`}
                              >
                                <FaShoppingCart className="text-sm" />
                              </button>
                              <div>
                                <span className="font-medium">
                                  {getAdjustedAmount(ingredient.amount, recipe.servings)} {ingredient.name}
                                </span>
                                {ingredient.notes && (
                                  <div className="text-sm text-gray-600">{ingredient.notes}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {shoppingList.size > 0 && (
                        <div className="mt-4">
                          <Button variant="outline" className="w-full">
                            <FaShoppingCart className="mr-2" />
                            Export Shopping List ({shoppingList.size} items)
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
                      <div className="space-y-6">
                        {recipe.instructions.map((instruction) => (
                          <div
                            key={instruction.step}
                            className={`p-6 rounded-lg border-2 transition-colors ${
                              completedSteps.has(instruction.step)
                                ? 'bg-green-50 border-green-200'
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <button
                                onClick={() => toggleStep(instruction.step)}
                                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  completedSteps.has(instruction.step)
                                    ? 'bg-green-600 border-green-600 text-white'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {completedSteps.has(instruction.step) ? (
                                  <FaCheck className="text-sm" />
                                ) : (
                                  <span className="text-sm font-medium">{instruction.step}</span>
                                )}
                              </button>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {instruction.title}
                                  </h3>
                                  {instruction.time && (
                                    <span className="text-sm text-gray-600 flex items-center">
                                      <FaClock className="mr-1" />
                                      {instruction.time}m
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                  {instruction.description}
                                </p>
                                
                                {instruction.tips && instruction.tips.length > 0 && (
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">Tips:</h4>
                                    <ul className="text-blue-800 text-sm space-y-1">
                                      {instruction.tips.map((tip, index) => (
                                        <li key={index} className="flex items-start">
                                          <span className="text-blue-600 mr-2">•</span>
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Nutrition Tab */}
                {activeTab === 'nutrition' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Nutrition Information</h2>
                    <p className="text-gray-600">Per serving ({recipe.servings} servings total)</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(recipe.nutritionInfo).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-gray-900">{value}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {key === 'carbs' ? 'Carbohydrates' : key}
                            {key !== 'calories' && <span className="ml-1">g</span>}
                            {key === 'calories' && <span className="ml-1">cal</span>}
                            {key === 'sodium' && <span className="ml-1">mg</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                      <Button>Write a Review</Button>
                    </div>
                    
                    <div className="text-center py-12">
                      <FaStar className="mx-auto text-4xl text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600">Be the first to review this recipe!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cultural Background */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaGlobe className="mr-2 text-blue-600" />
                Cultural Background
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{recipe.culturalBackground}</p>
            </div>

            {/* Serving Tips */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUtensils className="mr-2 text-green-600" />
                Serving Tips
              </h3>
              <ul className="space-y-2">
                {recipe.servingTips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Find Restaurants */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-red-600" />
                Find Restaurants
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Want to try {recipe.name} at a restaurant? Find Ethiopian restaurants near you.
              </p>
              <Button className="w-full" variant="outline">
                <FaExternalLinkAlt className="mr-2" />
                Find Restaurants Serving This
              </Button>
            </div>

            {/* Variations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUserTie className="mr-2 text-purple-600" />
                Recipe Variations
              </h3>
              <ul className="space-y-2">
                {recipe.variations.map((variation, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">•</span>
                    {variation}
                  </li>
                ))}
              </ul>
            </div>

            {/* Storage */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaBookmark className="mr-2 text-orange-600" />
                Storage Instructions
              </h3>
              <p className="text-sm text-gray-700">{recipe.storageInstructions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage