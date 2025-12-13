import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import { DayPlanData } from '../pages/ItineraryPage'
import {
  FaCalculator, FaDollarSign, FaChartPie, FaExclamationTriangle,
  FaCheckCircle, FaPlane, FaHotel, FaUtensils, FaCar, FaCamera,
  FaTicketAlt, FaArrowUp, FaArrowDown
} from 'react-icons/fa'

interface BudgetCalculatorProps {
  days: DayPlanData[]
  totalBudget: number
  travelers: number
  isOpen: boolean
  onClose: () => void
  onBudgetUpdate: (newBudget: number) => void
}

interface BudgetBreakdown {
  category: string
  amount: number
  percentage: number
  icon: React.ComponentType
  color: string
}

interface BudgetRecommendation {
  type: 'warning' | 'success' | 'info'
  message: string
  action?: string
}

const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  days,
  totalBudget,
  travelers,
  isOpen,
  onClose,
  onBudgetUpdate
}) => {
  const [newBudget, setNewBudget] = useState(totalBudget)
  const [breakdown, setBreakdown] = useState<BudgetBreakdown[]>([])
  const [recommendations, setRecommendations] = useState<BudgetRecommendation[]>([])
  const [showPerPerson, setShowPerPerson] = useState(false)

  const actualCost = days.reduce((sum, day) => sum + day.totalCost, 0)
  const budgetUsed = (actualCost / totalBudget) * 100
  const remaining = totalBudget - actualCost

  useEffect(() => {
    calculateBreakdown()
    generateRecommendations()
  }, [days, totalBudget, travelers])

  const calculateBreakdown = () => {
    const categories: { [key: string]: { amount: number; icon: React.ComponentType; color: string } } = {
      'Transportation': { amount: 0, icon: FaPlane, color: 'bg-blue-500' },
      'Accommodation': { amount: 0, icon: FaHotel, color: 'bg-green-500' },
      'Dining': { amount: 0, icon: FaUtensils, color: 'bg-orange-500' },
      'Activities': { amount: 0, icon: FaCamera, color: 'bg-purple-500' },
      'Tours': { amount: 0, icon: FaTicketAlt, color: 'bg-indigo-500' },
      'Other': { amount: 0, icon: FaCar, color: 'bg-gray-500' }
    }

    days.forEach(day => {
      day.items.forEach(item => {
        const category = item.category || 'Other'
        if (categories[category]) {
          categories[category].amount += item.price
        } else {
          categories['Other'].amount += item.price
        }
      })
    })

    const breakdownData: BudgetBreakdown[] = Object.entries(categories)
      .filter(([_, data]) => data.amount > 0)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: (data.amount / actualCost) * 100,
        icon: data.icon,
        color: data.color
      }))
      .sort((a, b) => b.amount - a.amount)

    setBreakdown(breakdownData)
  }

  const generateRecommendations = () => {
    const recs: BudgetRecommendation[] = []

    // Budget status recommendations
    if (budgetUsed > 100) {
      recs.push({
        type: 'warning',
        message: `You're over budget by $${(actualCost - totalBudget).toFixed(2)}`,
        action: 'Consider removing some activities or finding cheaper alternatives'
      })
    } else if (budgetUsed > 90) {
      recs.push({
        type: 'warning',
        message: `You're using ${budgetUsed.toFixed(1)}% of your budget`,
        action: 'Be careful with additional expenses'
      })
    } else if (budgetUsed < 50) {
      recs.push({
        type: 'success',
        message: `You have $${remaining.toFixed(2)} remaining in your budget`,
        action: 'Consider adding more activities or upgrading experiences'
      })
    }

    // Category-specific recommendations
    const transportationCost = breakdown.find(b => b.category === 'Transportation')?.amount || 0
    const accommodationCost = breakdown.find(b => b.category === 'Accommodation')?.amount || 0
    const diningCost = breakdown.find(b => b.category === 'Dining')?.amount || 0

    if (transportationCost > actualCost * 0.4) {
      recs.push({
        type: 'info',
        message: 'Transportation costs are high',
        action: 'Consider booking flights earlier or using ground transport'
      })
    }

    if (accommodationCost > actualCost * 0.4) {
      recs.push({
        type: 'info',
        message: 'Accommodation costs are significant',
        action: 'Look for budget-friendly hotels or guesthouses'
      })
    }

    if (diningCost < actualCost * 0.1) {
      recs.push({
        type: 'success',
        message: 'Great job keeping dining costs low',
        action: 'You could try some premium restaurants with the savings'
      })
    }

    setRecommendations(recs)
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'warning': return FaExclamationTriangle
      case 'success': return FaCheckCircle
      case 'info': return FaDollarSign
      default: return FaDollarSign
    }
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-600 bg-red-50 border-red-200'
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    const value = showPerPerson ? amount / travelers : amount
    return `$${value.toFixed(2)}${showPerPerson ? '/person' : ''}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaCalculator className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Budget Calculator</h2>
              <p className="text-gray-600">Analyze and optimize your trip expenses</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="p-2"
          >
            ✕
          </Button>
        </div>

        <div className="p-6">
          {/* Budget Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <FaDollarSign className="text-3xl text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalBudget)}</div>
              <div className="text-blue-700">Total Budget</div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <FaChartPie className="text-3xl text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-900">{formatCurrency(actualCost)}</div>
              <div className="text-purple-700">Actual Cost</div>
            </div>
            
            <div className={`rounded-xl p-6 text-center ${
              remaining >= 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {remaining >= 0 ? (
                <FaArrowUp className="text-3xl text-green-600 mx-auto mb-3" />
              ) : (
                <FaArrowDown className="text-3xl text-red-600 mx-auto mb-3" />
              )}
              <div className={`text-2xl font-bold ${
                remaining >= 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {formatCurrency(Math.abs(remaining))}
              </div>
              <div className={remaining >= 0 ? 'text-green-700' : 'text-red-700'}>
                {remaining >= 0 ? 'Remaining' : 'Over Budget'}
              </div>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Budget Usage</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={showPerPerson}
                    onChange={(e) => setShowPerPerson(e.target.checked)}
                    className="mr-2"
                  />
                  Show per person
                </label>
                <span className="text-sm text-gray-600">{budgetUsed.toFixed(1)}% used</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all ${
                  budgetUsed > 100 ? 'bg-red-500' : 
                  budgetUsed > 90 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, budgetUsed)}%` }}
              ></div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
            <div className="space-y-3">
              {breakdown.map((item) => {
                const IconComponent = item.icon
                return (
                  <div key={item.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mr-4`}>
                        <IconComponent />
                      </div>
                      <div>
                        <div className="font-medium">{item.category}</div>
                        <div className="text-sm text-gray-600">{item.percentage.toFixed(1)}% of total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(item.amount)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Budget Adjustment */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Adjust Budget</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">New Budget:</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  step="50"
                />
                <Button
                  onClick={() => onBudgetUpdate(newBudget)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Update Budget
                </Button>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Current budget utilization would be: {((actualCost / newBudget) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Budget Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => {
                const IconComponent = getRecommendationIcon(rec.type)
                return (
                  <div key={index} className={`border rounded-lg p-4 ${getRecommendationColor(rec.type)}`}>
                    <div className="flex items-start">
                      <IconComponent className="mr-3 mt-1" />
                      <div>
                        <div className="font-medium">{rec.message}</div>
                        {rec.action && (
                          <div className="text-sm mt-1 opacity-90">{rec.action}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Daily Expenses</h3>
            <div className="space-y-2">
              {days.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Day {index + 1}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(day.totalCost)}</div>
                    <div className="text-sm text-gray-600">{day.items.length} activities</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // Export budget report functionality
                alert('Budget report export functionality coming soon!')
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetCalculator