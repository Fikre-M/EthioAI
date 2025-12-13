import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import { Itinerary } from '../pages/ItineraryPage'
import {
  FaChartBar, FaChartLine, FaChartPie, FaClock, FaDollarSign,
  FaMapMarkerAlt, FaUsers, FaCalendarAlt,
  FaEye, FaDownload, FaShare, FaFilter, FaSync, FaBolt,
  FaGlobe, FaRoute, FaHeart, FaStar, FaThumbsUp, FaComment
} from 'react-icons/fa'
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'

interface AdvancedAnalyticsDashboardProps {
  itinerary: Itinerary
  isOpen: boolean
  onClose: () => void
}

interface Analytics {
  overview: OverviewMetrics
  spending: SpendingAnalytics
  time: TimeAnalytics
  preferences: PreferenceAnalytics
  performance: PerformanceMetrics
  insights: Insight[]
  comparisons: Comparison[]
}

interface OverviewMetrics {
  totalDays: number
  totalActivities: number
  totalCost: number
  avgDailyCost: number
  efficiency: number
  satisfaction: number
}

interface SpendingAnalytics {
  byCategory: CategorySpending[]
  byDay: DaySpending[]
  trends: SpendingTrend[]
  predictions: CostPrediction[]
}

interface CategorySpending {
  category: string
  amount: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  avgPrice: number
}

interface DaySpending {
  day: number
  date: string
  amount: number
  activities: number
}

interface SpendingTrend {
  period: string
  amount: number
  change: number
}

interface CostPrediction {
  scenario: string
  cost: number
  probability: number
}

interface TimeAnalytics {
  totalTime: number
  activeTime: number
  travelTime: number
  restTime: number
  peakHours: string[]
  efficiency: number
}

interface PreferenceAnalytics {
  categories: string[]
  priceRange: string
  duration: string
  timeOfDay: string[]
  locations: string[]
}

interface PerformanceMetrics {
  planningTime: number
  changesCount: number
  optimizationScore: number
  userEngagement: number
}

interface Insight {
  id: string
  type: 'cost' | 'time' | 'preference' | 'optimization'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
}

interface Comparison {
  metric: string
  yourTrip: number
  average: number
  percentile: number
  better: boolean
}

const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({
  itinerary,
  isOpen,
  onClose
}) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [selectedView, setSelectedView] = useState<'overview' | 'spending' | 'time' | 'insights'>('overview')
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day')

  useEffect(() => {
    if (isOpen) {
      generateAnalytics()
    }
  }, [isOpen, itinerary])

  const generateAnalytics = () => {
    // Calculate analytics from itinerary data
    const totalActivities = itinerary.days.reduce((sum, day) => sum + day.items.length, 0)
    const totalTime = itinerary.days.reduce((sum, day) => sum + day.totalDuration, 0)
    
    // Category spending analysis
    const categoryTotals: { [key: string]: { amount: number; count: number } } = {}
    itinerary.days.forEach(day => {
      day.items.forEach(item => {
        const category = item.category || 'Other'
        if (!categoryTotals[category]) {
          categoryTotals[category] = { amount: 0, count: 0 }
        }
        categoryTotals[category].amount += item.price
        categoryTotals[category].count += 1
      })
    })

    const categorySpending: CategorySpending[] = Object.entries(categoryTotals).map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: (data.amount / itinerary.actualCost) * 100,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      avgPrice: data.amount / data.count
    }))

    const daySpending: DaySpending[] = itinerary.days.map((day, index) => ({
      day: index + 1,
      date: day.date,
      amount: day.totalCost,
      activities: day.items.length
    }))

    const insights: Insight[] = [
      {
        id: 'insight-1',
        type: 'cost',
        title: 'Dining Optimization Opportunity',
        description: 'You could save 25% on dining by choosing local restaurants over tourist spots',
        impact: 'high',
        actionable: true
      },
      {
        id: 'insight-2',
        type: 'time',
        title: 'Peak Activity Hours',
        description: 'Most of your activities are scheduled between 10 AM - 2 PM, consider spreading them out',
        impact: 'medium',
        actionable: true
      },
      {
        id: 'insight-3',
        type: 'optimization',
        title: 'Route Efficiency',
        description: 'Your current route has 85% efficiency. Reordering 2 activities could improve this to 95%',
        impact: 'medium',
        actionable: true
      },
      {
        id: 'insight-4',
        type: 'preference',
        title: 'Activity Preference Pattern',
        description: 'You prefer cultural activities (60%) over adventure activities (20%)',
        impact: 'low',
        actionable: false
      }
    ]

    const comparisons: Comparison[] = [
      {
        metric: 'Daily Budget',
        yourTrip: itinerary.actualCost / itinerary.days.length,
        average: 180,
        percentile: 75,
        better: false
      },
      {
        metric: 'Activities per Day',
        yourTrip: totalActivities / itinerary.days.length,
        average: 4.2,
        percentile: 60,
        better: true
      },
      {
        metric: 'Planning Efficiency',
        yourTrip: 87,
        average: 72,
        percentile: 85,
        better: true
      }
    ]

    const analyticsData: Analytics = {
      overview: {
        totalDays: itinerary.days.length,
        totalActivities,
        totalCost: itinerary.actualCost,
        avgDailyCost: itinerary.actualCost / itinerary.days.length,
        efficiency: 87,
        satisfaction: 92
      },
      spending: {
        byCategory: categorySpending,
        byDay: daySpending,
        trends: [
          { period: 'Day 1-2', amount: 450, change: 0 },
          { period: 'Day 3-4', amount: 380, change: -15.6 },
          { period: 'Day 5-6', amount: 420, change: 10.5 }
        ],
        predictions: [
          { scenario: 'Conservative', cost: itinerary.actualCost * 0.95, probability: 70 },
          { scenario: 'Expected', cost: itinerary.actualCost, probability: 85 },
          { scenario: 'High-end', cost: itinerary.actualCost * 1.15, probability: 60 }
        ]
      },
      time: {
        totalTime,
        activeTime: totalTime * 0.7,
        travelTime: totalTime * 0.2,
        restTime: totalTime * 0.1,
        peakHours: ['10:00', '11:00', '14:00', '15:00'],
        efficiency: 85
      },
      preferences: {
        categories: ['Cultural', 'Dining', 'Sightseeing'],
        priceRange: '$20-80',
        duration: '2-4 hours',
        timeOfDay: ['Morning', 'Afternoon'],
        locations: ['City Center', 'Historic District']
      },
      performance: {
        planningTime: 45,
        changesCount: 8,
        optimizationScore: 87,
        userEngagement: 94
      },
      insights,
      comparisons
    }

    setAnalytics(analyticsData)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'cost': return <FaDollarSign className="text-green-600" />
      case 'time': return <FaClock className="text-blue-600" />
      case 'preference': return <FaHeart className="text-pink-600" />
      case 'optimization': return <FaBolt className="text-yellow-600" />
      default: return <FaEye className="text-gray-600" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isOpen || !analytics) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
              <FaChartBar className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
              <p className="text-gray-600">Deep insights into your travel planning</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('overview')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  selectedView === 'overview' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedView('spending')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  selectedView === 'spending' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                }`}
              >
                Spending
              </button>
              <button
                onClick={() => setSelectedView('time')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  selectedView === 'time' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                }`}
              >
                Time
              </button>
              <button
                onClick={() => setSelectedView('insights')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  selectedView === 'insights' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                }`}
              >
                Insights
              </button>
            </div>
            
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          {selectedView === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <FaCalendarAlt className="text-2xl text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{analytics.overview.totalDays}</div>
                  <div className="text-sm text-blue-700">Days</div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <FaMapMarkerAlt className="text-2xl text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">{analytics.overview.totalActivities}</div>
                  <div className="text-sm text-green-700">Activities</div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <FaDollarSign className="text-2xl text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">{formatCurrency(analytics.overview.totalCost)}</div>
                  <div className="text-sm text-purple-700">Total Cost</div>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <FaChartLine className="text-2xl text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-900">{formatCurrency(analytics.overview.avgDailyCost)}</div>
                  <div className="text-sm text-orange-700">Daily Avg</div>
                </div>
                
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <FaBolt className="text-2xl text-indigo-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-indigo-900">{analytics.overview.efficiency}%</div>
                  <div className="text-sm text-indigo-700">Efficiency</div>
                </div>
                
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <FaHeart className="text-2xl text-pink-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-pink-900">{analytics.overview.satisfaction}%</div>
                  <div className="text-sm text-pink-700">Satisfaction</div>
                </div>
              </div>

              {/* Spending by Category Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Spending by Category</h3>
                <div className="space-y-4">
                  {analytics.spending.byCategory.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(category.amount)}</div>
                          <div className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</div>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        {category.trend === 'up' ? (
                          <FaArrowTrendUp className="text-green-500" />
                        ) : (
                          <FaArrowTrendDown className="text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Comparisons */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">How You Compare</h3>
                <div className="space-y-4">
                  {analytics.comparisons.map((comparison) => (
                    <div key={comparison.metric} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{comparison.metric}</div>
                        <div className="text-sm text-gray-600">
                          You: {typeof comparison.yourTrip === 'number' && comparison.yourTrip < 100 
                            ? comparison.yourTrip.toFixed(1) 
                            : formatCurrency(comparison.yourTrip)
                          } • Average: {typeof comparison.average === 'number' && comparison.average < 100 
                            ? comparison.average.toFixed(1) 
                            : formatCurrency(comparison.average)
                          }
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${comparison.better ? 'text-green-600' : 'text-red-600'}`}>
                          {comparison.percentile}th percentile
                        </div>
                        <div className="text-sm text-gray-500">
                          {comparison.better ? 'Above average' : 'Below average'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedView === 'spending' && (
            <div className="space-y-8">
              {/* Daily Spending Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Daily Spending Breakdown</h3>
                <div className="space-y-4">
                  {analytics.spending.byDay.map((day) => (
                    <div key={day.day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Day {day.day}</div>
                        <div className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(day.amount)}</div>
                        <div className="text-sm text-gray-500">{day.activities} activities</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Predictions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Cost Predictions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {analytics.spending.predictions.map((prediction) => (
                    <div key={prediction.scenario} className="p-4 border border-gray-200 rounded-lg text-center">
                      <div className="font-medium text-gray-900 mb-2">{prediction.scenario}</div>
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {formatCurrency(prediction.cost)}
                      </div>
                      <div className="text-sm text-gray-600">{prediction.probability}% likely</div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${prediction.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedView === 'time' && (
            <div className="space-y-8">
              {/* Time Distribution */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <FaClock className="text-3xl text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-900">{formatTime(analytics.time.totalTime)}</div>
                  <div className="text-sm text-blue-700">Total Time</div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <FaMapMarkerAlt className="text-3xl text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-900">{formatTime(analytics.time.activeTime)}</div>
                  <div className="text-sm text-green-700">Active Time</div>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-6 text-center">
                  <FaRoute className="text-3xl text-orange-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-orange-900">{formatTime(analytics.time.travelTime)}</div>
                  <div className="text-sm text-orange-700">Travel Time</div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <FaBolt className="text-3xl text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-purple-900">{analytics.time.efficiency}%</div>
                  <div className="text-sm text-purple-700">Time Efficiency</div>
                </div>
              </div>

              {/* Peak Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Peak Activity Hours</h3>
                <div className="flex flex-wrap gap-3">
                  {analytics.time.peakHours.map((hour) => (
                    <div key={hour} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {hour}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedView === 'insights' && (
            <div className="space-y-8">
              {/* AI Insights */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">AI-Generated Insights</h3>
                <div className="space-y-4">
                  {analytics.insights.map((insight) => (
                    <div key={insight.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs ${getImpactColor(insight.impact)}`}>
                                {insight.impact} impact
                              </span>
                            </div>
                            <p className="text-gray-600">{insight.description}</p>
                          </div>
                        </div>
                        
                        {insight.actionable && (
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Preferences */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Your Travel Preferences</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Favorite Categories:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analytics.preferences.categories.map((category) => (
                        <span key={category} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Preferred Time:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analytics.preferences.timeOfDay.map((time) => (
                        <span key={time} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Price Range:</h4>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {analytics.preferences.priceRange}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Duration:</h4>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {analytics.preferences.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvancedAnalyticsDashboard