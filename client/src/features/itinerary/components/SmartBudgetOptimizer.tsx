import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import { Itinerary, DayPlanData } from '../pages/ItineraryPage'
import {
  FaChartLine, FaDollarSign, FaLightbulb, FaExclamationTriangle,
  FaCheckCircle, FaPiggyBank, FaCalculator,
  FaMapMarkerAlt, FaClock, FaUsers, FaArrowRight, FaArrowDown,
  FaArrowUp, FaStar, FaPercent, FaBalanceScale
} from 'react-icons/fa'

import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface SmartBudgetOptimizerProps {
  itinerary: Itinerary
  isOpen: boolean
  onClose: () => void
  onUpdateItinerary: (itinerary: Itinerary) => void
}

interface BudgetAnalysis {
  totalBudget: number
  actualCost: number
  projectedCost: number
  savings: number
  overspend: number
  efficiency: number
  categoryBreakdown: CategorySpending[]
  recommendations: BudgetRecommendation[]
  alternatives: Alternative[]
}

interface CategorySpending {
  category: string
  budgeted: number
  actual: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  icon: string
}

interface BudgetRecommendation {
  id: string
  type: 'save' | 'optimize' | 'warning' | 'opportunity'
  title: string
  description: string
  impact: number
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  action: string
}

interface Alternative {
  id: string
  originalItem: string
  alternative: string
  savings: number
  rating: number
  description: string
  tradeoffs: string[]
}

const SmartBudgetOptimizer: React.FC<SmartBudgetOptimizerProps> = ({
  itinerary,
  isOpen,
  onClose,
  onUpdateItinerary
}) => {
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [optimizationMode, setOptimizationMode] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced')
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isOpen) {
      generateBudgetAnalysis()
    }
  }, [isOpen, itinerary])

  const generateBudgetAnalysis = () => {
    // Calculate current spending by category
    const categoryTotals: { [key: string]: number } = {}
    
    itinerary.days.forEach(day => {
      day.items.forEach(item => {
        const category = item.category || 'Other'
        categoryTotals[category] = (categoryTotals[category] || 0) + item.price
      })
    })

    const categoryBreakdown: CategorySpending[] = [
      {
        category: 'Accommodation',
        budgeted: itinerary.totalBudget * 0.4,
        actual: categoryTotals['Accommodation'] || 0,
        percentage: ((categoryTotals['Accommodation'] || 0) / itinerary.actualCost) * 100,
        trend: 'stable',
        icon: '🏨'
      },
      {
        category: 'Transportation',
        budgeted: itinerary.totalBudget * 0.25,
        actual: categoryTotals['Transportation'] || 0,
        percentage: ((categoryTotals['Transportation'] || 0) / itinerary.actualCost) * 100,
        trend: 'up',
        icon: '🚗'
      },
      {
        category: 'Dining',
        budgeted: itinerary.totalBudget * 0.2,
        actual: categoryTotals['Dining'] || 0,
        percentage: ((categoryTotals['Dining'] || 0) / itinerary.actualCost) * 100,
        trend: 'down',
        icon: '🍽️'
      },
      {
        category: 'Activities',
        budgeted: itinerary.totalBudget * 0.15,
        actual: categoryTotals['Sightseeing'] || categoryTotals['Activity'] || categoryTotals['Cultural'] || 0,
        percentage: ((categoryTotals['Sightseeing'] || categoryTotals['Activity'] || categoryTotals['Cultural'] || 0) / itinerary.actualCost) * 100,
        trend: 'stable',
        icon: '🎯'
      }
    ]

    const recommendations: BudgetRecommendation[] = [
      {
        id: 'rec-1',
        type: 'save',
        title: 'Switch to Local Restaurants',
        description: 'Replace 2-3 expensive restaurants with highly-rated local eateries',
        impact: 120,
        difficulty: 'easy',
        category: 'Dining',
        action: 'Replace expensive dining options'
      },
      {
        id: 'rec-2',
        type: 'optimize',
        title: 'Use Public Transportation',
        description: 'Combine taxi rides with public transport for 40% savings',
        impact: 85,
        difficulty: 'medium',
        category: 'Transportation',
        action: 'Mix transport options'
      },
      {
        id: 'rec-3',
        type: 'opportunity',
        title: 'Free Walking Tours',
        description: 'Replace paid tours with free walking tours and self-guided exploration',
        impact: 150,
        difficulty: 'easy',
        category: 'Activities',
        action: 'Switch to free alternatives'
      },
      {
        id: 'rec-4',
        type: 'warning',
        title: 'Accommodation Overspend',
        description: 'Current hotel selection is 30% over typical budget allocation',
        impact: -200,
        difficulty: 'hard',
        category: 'Accommodation',
        action: 'Consider alternative lodging'
      }
    ]

    const alternatives: Alternative[] = [
      {
        id: 'alt-1',
        originalItem: 'Luxury Hotel Downtown',
        alternative: 'Boutique Hotel Historic District',
        savings: 180,
        rating: 4.6,
        description: 'Charming boutique hotel with authentic local character',
        tradeoffs: ['Smaller rooms', 'No pool', 'Great location']
      },
      {
        id: 'alt-2',
        originalItem: 'Private City Tour',
        alternative: 'Small Group Walking Tour',
        savings: 75,
        rating: 4.8,
        description: 'Intimate group experience with local guide',
        tradeoffs: ['Shared experience', 'Fixed schedule', 'More social']
      }
    ]

    const projectedCost = itinerary.actualCost - recommendations
      .filter(r => r.type !== 'warning')
      .reduce((sum, r) => sum + r.impact, 0)

    const budgetAnalysis: BudgetAnalysis = {
      totalBudget: itinerary.totalBudget,
      actualCost: itinerary.actualCost,
      projectedCost,
      savings: Math.max(0, itinerary.actualCost - projectedCost),
      overspend: Math.max(0, itinerary.actualCost - itinerary.totalBudget),
      efficiency: (itinerary.totalBudget / itinerary.actualCost) * 100,
      categoryBreakdown,
      recommendations,
      alternatives
    }

    setAnalysis(budgetAnalysis)
  }

  const handleApplyRecommendation = (recommendationId: string) => {
    setAppliedRecommendations(prev => new Set([...prev, recommendationId]))
    
    // In a real implementation, this would update the itinerary
    const recommendation = analysis?.recommendations.find(r => r.id === recommendationId)
    if (recommendation) {
      alert(`Applied: ${recommendation.title}\nEstimated savings: $${recommendation.impact}`)
    }
  }

  const handleApplyAllRecommendations = () => {
    if (!analysis) return
    
    const totalSavings = analysis.recommendations
      .filter(r => r.type !== 'warning')
      .reduce((sum, r) => sum + r.impact, 0)
    
    alert(`Applied all recommendations!\nTotal estimated savings: $${totalSavings}`)
    
    analysis.recommendations.forEach(rec => {
      if (rec.type !== 'warning') {
        setAppliedRecommendations(prev => new Set([...prev, rec.id]))
      }
    })
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'save': return <FaPiggyBank className="text-green-600" />
      case 'optimize': return <FaBalanceScale className="text-blue-600" />
      case 'opportunity': return <FaLightbulb className="text-yellow-600" />
      case 'warning': return <FaExclamationTriangle className="text-red-600" />
      default: return <FaCheckCircle className="text-gray-600" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <FaArrowUp className="text-red-500" />
      case 'down': return <FaArrowDown className="text-green-500" />
      case 'stable': return <FaArrowRight className="text-gray-500" />
      default: return null
    }
  }

  if (!isOpen || !analysis) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
              <FaChartLine className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Smart Budget Optimizer</h2>
              <p className="text-gray-600">AI-powered cost optimization for your trip</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">${analysis.savings}</div>
              <div className="text-sm text-gray-500">Potential Savings</div>
            </div>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Budget Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <FaDollarSign className="text-3xl text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">${analysis.totalBudget}</div>
              <div className="text-sm text-blue-700">Total Budget</div>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <FaCalculator className="text-3xl text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">${analysis.actualCost}</div>
              <div className="text-sm text-orange-700">Current Cost</div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <FaPiggyBank className="text-3xl text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">${analysis.projectedCost}</div>
              <div className="text-sm text-green-700">Optimized Cost</div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <FaPercent className="text-3xl text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{analysis.efficiency.toFixed(1)}%</div>
              <div className="text-sm text-purple-700">Efficiency Score</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">Spending by Category</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysis.categoryBreakdown.map((category) => (
                <div
                  key={category.category}
                  onClick={() => setSelectedCategory(category.category)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCategory === category.category
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{category.icon}</span>
                      <span className="font-medium">{category.category}</span>
                    </div>
                    {getTrendIcon(category.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budgeted:</span>
                      <span className="font-medium">${category.budgeted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Actual:</span>
                      <span className={`font-medium ${
                        category.actual > category.budgeted ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${category.actual}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          category.actual > category.budgeted ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (category.actual / category.budgeted) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {category.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Optimization Recommendations</h3>
              <Button
                onClick={handleApplyAllRecommendations}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Apply All Recommendations
              </Button>
            </div>
            
            <div className="space-y-4">
              {analysis.recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className={`border rounded-lg p-4 transition-all ${
                    appliedRecommendations.has(recommendation.id)
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getRecommendationIcon(recommendation.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(recommendation.difficulty)}`}>
                            {recommendation.difficulty}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {recommendation.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{recommendation.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className={`flex items-center ${
                            recommendation.impact > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {recommendation.impact > 0 ? <FaArrowTrendUp className="mr-1" /> : <FaArrowTrendDown className="mr-1" />}
                            ${Math.abs(recommendation.impact)} {recommendation.impact > 0 ? 'savings' : 'additional cost'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {appliedRecommendations.has(recommendation.id) ? (
                        <div className="flex items-center text-green-600">
                          <FaCheckCircle className="mr-2" />
                          Applied
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleApplyRecommendation(recommendation.id)}
                          size="sm"
                          variant="outline"
                          disabled={recommendation.type === 'warning'}
                        >
                          {recommendation.type === 'warning' ? 'Review' : 'Apply'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternatives */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Smart Alternatives</h3>
            <div className="space-y-4">
              {analysis.alternatives.map((alternative) => (
                <div key={alternative.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{alternative.alternative}</h4>
                      <p className="text-sm text-gray-600">Instead of: {alternative.originalItem}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${alternative.savings} saved</div>
                      <div className="flex items-center text-sm text-yellow-600">
                        <FaStar className="mr-1" />
                        {alternative.rating}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{alternative.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {alternative.tradeoffs.map((tradeoff, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tradeoff}
                        </span>
                      ))}
                    </div>
                    
                    <Button size="sm" variant="outline">
                      Switch to This Option
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartBudgetOptimizer