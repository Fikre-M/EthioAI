import React, { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import { ItineraryItem } from '../pages/ItineraryPage'
import {
  FaRoute, FaCalculator,
  FaExclamationTriangle, FaCheckCircle, FaArrowRight, FaCar,
  FaWalking, FaTaxi, FaMotorcycle
} from 'react-icons/fa'

interface RouteOptimizerProps {
  items: ItineraryItem[]
  onOptimize: (optimizedItems: ItineraryItem[]) => void
  isOpen: boolean
  onClose: () => void
}

interface RouteSegment {
  from: string
  to: string
  distance: number // in km
  duration: number // in minutes
  mode: 'walking' | 'driving' | 'taxi' | 'motorcycle'
  cost: number
}

interface OptimizationResult {
  originalOrder: ItineraryItem[]
  optimizedOrder: ItineraryItem[]
  timeSaved: number
  distanceSaved: number
  costSaved: number
  routes: RouteSegment[]
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({
  items,
  onOptimize,
  isOpen,
  onClose
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [selectedMode, setSelectedMode] = useState<'walking' | 'driving' | 'taxi' | 'motorcycle'>('driving')

  // Mock distance/time calculation between locations
  const calculateRoute = (from: string, to: string, mode: string): RouteSegment => {
    // Mock data - in real app, this would use Google Maps API or similar
    const mockDistances: { [key: string]: number } = {
      'Bole International Airport-Lalibela Hotel': 15,
      'Lalibela Hotel-Lalibela Rock Churches': 2,
      'Lalibela Rock Churches-Seven Olives Hotel Restaurant': 1.5,
      'Seven Olives Hotel Restaurant-Lalibela Market': 0.8,
      'Lalibela Market-Lalibela Hotel': 1.2
    }

    const key = `${from}-${to}`
    const distance = mockDistances[key] || Math.random() * 10 + 1

    let duration: number
    let cost: number

    switch (mode) {
      case 'walking':
        duration = distance * 12 // 12 minutes per km
        cost = 0
        break
      case 'driving':
        duration = distance * 3 // 3 minutes per km
        cost = distance * 0.5 // $0.5 per km
        break
      case 'taxi':
        duration = distance * 4 // 4 minutes per km
        cost = 5 + distance * 1.2 // $5 base + $1.2 per km
        break
      case 'motorcycle':
        duration = distance * 2.5 // 2.5 minutes per km
        cost = 2 + distance * 0.8 // $2 base + $0.8 per km
        break
      default:
        duration = distance * 3
        cost = distance * 0.5
    }

    return {
      from,
      to,
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(duration),
      mode: mode as any,
      cost: Math.round(cost * 100) / 100
    }
  }

  const optimizeRoute = async () => {
    setIsOptimizing(true)

    // Simulate optimization calculation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simple optimization: sort by location proximity (mock algorithm)
    const locationGroups: { [key: string]: ItineraryItem[] } = {}
    
    items.forEach(item => {
      const area = item.location.includes('Rock Churches') ? 'churches' :
                   item.location.includes('Market') ? 'market' :
                   item.location.includes('Hotel') ? 'hotel' :
                   item.location.includes('Airport') ? 'airport' : 'other'
      
      if (!locationGroups[area]) locationGroups[area] = []
      locationGroups[area].push(item)
    })

    // Reorder to minimize travel
    const optimizedItems: ItineraryItem[] = []
    const areas = ['airport', 'hotel', 'churches', 'market', 'other']
    
    areas.forEach(area => {
      if (locationGroups[area]) {
        optimizedItems.push(...locationGroups[area].sort((a, b) => a.startTime.localeCompare(b.startTime)))
      }
    })

    // Calculate routes for both orders
    const originalRoutes: RouteSegment[] = []
    const optimizedRoutes: RouteSegment[] = []

    for (let i = 0; i < items.length - 1; i++) {
      originalRoutes.push(calculateRoute(items[i].location, items[i + 1].location, selectedMode))
    }

    for (let i = 0; i < optimizedItems.length - 1; i++) {
      optimizedRoutes.push(calculateRoute(optimizedItems[i].location, optimizedItems[i + 1].location, selectedMode))
    }

    const originalTime = originalRoutes.reduce((sum, route) => sum + route.duration, 0)
    const optimizedTime = optimizedRoutes.reduce((sum, route) => sum + route.duration, 0)
    const originalDistance = originalRoutes.reduce((sum, route) => sum + route.distance, 0)
    const optimizedDistance = optimizedRoutes.reduce((sum, route) => sum + route.distance, 0)
    const originalCost = originalRoutes.reduce((sum, route) => sum + route.cost, 0)
    const optimizedCost = optimizedRoutes.reduce((sum, route) => sum + route.cost, 0)

    setResult({
      originalOrder: items,
      optimizedOrder: optimizedItems,
      timeSaved: originalTime - optimizedTime,
      distanceSaved: originalDistance - optimizedDistance,
      costSaved: originalCost - optimizedCost,
      routes: optimizedRoutes
    })

    setIsOptimizing(false)
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'walking': return FaWalking
      case 'driving': return FaCar
      case 'taxi': return FaTaxi
      case 'motorcycle': return FaMotorcycle
      default: return FaCar
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'walking': return 'text-green-600'
      case 'driving': return 'text-blue-600'
      case 'taxi': return 'text-yellow-600'
      case 'motorcycle': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <FaRoute className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Route Optimizer</h2>
              <p className="text-gray-600">Optimize your daily route to save time and money</p>
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
          {/* Transportation Mode Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Transportation Mode</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { mode: 'walking', label: 'Walking', icon: FaWalking, desc: 'Free, slow' },
                { mode: 'driving', label: 'Driving', icon: FaCar, desc: 'Fast, moderate cost' },
                { mode: 'taxi', label: 'Taxi', icon: FaTaxi, desc: 'Convenient, higher cost' },
                { mode: 'motorcycle', label: 'Motorcycle', icon: FaMotorcycle, desc: 'Fast, low cost' }
              ].map(({ mode, label, icon: Icon, desc }) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode as any)}
                  className={`p-4 border-2 rounded-lg transition-all text-center ${
                    selectedMode === mode
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <Icon className={`mx-auto mb-2 text-xl ${getModeColor(mode)}`} />
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Route */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Current Route ({items.length} stops)</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.location}</div>
                    </div>
                    <div className="text-sm text-gray-500">{item.startTime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optimization Button */}
          {!result && (
            <div className="text-center mb-6">
              <Button
                onClick={optimizeRoute}
                disabled={isOptimizing || items.length < 2}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                {isOptimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Optimizing Route...
                  </>
                ) : (
                  <>
                    <FaCalculator className="mr-2" />
                    Optimize Route
                  </>
                )}
              </Button>
              {items.length < 2 && (
                <p className="text-sm text-gray-500 mt-2">Need at least 2 activities to optimize</p>
              )}
            </div>
          )}

          {/* Optimization Results */}
          {result && (
            <div className="space-y-6">
              {/* Savings Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <FaCheckCircle className="text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-900">Optimization Results</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.timeSaved > 0 ? `${Math.round(result.timeSaved)}m` : 'No change'}
                    </div>
                    <div className="text-sm text-green-700">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.distanceSaved > 0 ? `${result.distanceSaved.toFixed(1)}km` : 'No change'}
                    </div>
                    <div className="text-sm text-green-700">Distance Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.costSaved > 0 ? `$${result.costSaved.toFixed(2)}` : 'No change'}
                    </div>
                    <div className="text-sm text-green-700">Cost Saved</div>
                  </div>
                </div>
              </div>

              {/* Optimized Route */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Optimized Route</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {result.optimizedOrder.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-600">{item.location}</div>
                          </div>
                          <div className="text-sm text-gray-500">{item.startTime}</div>
                        </div>
                        
                        {/* Route segment */}
                        {index < result.routes.length && (
                          <div className="ml-9 mt-2 mb-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <FaArrowRight className="mr-2" />
                              {React.createElement(getModeIcon(result.routes[index].mode), { 
                                className: `mr-2 ${getModeColor(result.routes[index].mode)}` 
                              })}
                              <span>
                                {result.routes[index].distance}km • {result.routes[index].duration}min • ${result.routes[index].cost.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    onOptimize(result.optimizedOrder)
                    onClose()
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Apply Optimization
                </Button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-yellow-600 mr-2 mt-1" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Optimization Tips</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Group activities by location to minimize travel time</li>
                  <li>• Consider traffic patterns and peak hours</li>
                  <li>• Walking is free but takes longer between distant locations</li>
                  <li>• Taxis are convenient but more expensive for short distances</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteOptimizer