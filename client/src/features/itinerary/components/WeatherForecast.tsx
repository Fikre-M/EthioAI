import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaCloud, FaSun, FaCloudShowersHeavy, FaSnowflake, FaBolt,
  FaTemperatureHigh, FaTemperatureLow, FaEye, FaWind, FaTint,
  FaUmbrella, FaTshirt, FaGlasses, FaExclamationTriangle,
  FaCheckCircle, FaLightbulb
} from 'react-icons/fa'

export interface WeatherData {
  date: string
  location: string
  temperature: {
    high: number
    low: number
    current?: number
  }
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy'
  humidity: number
  windSpeed: number
  visibility: number
  precipitation: number
  uvIndex: number
  description: string
}

export interface WeatherRecommendation {
  type: 'clothing' | 'activity' | 'packing' | 'warning'
  title: string
  description: string
  icon: React.ComponentType
  priority: 'high' | 'medium' | 'low'
}

interface WeatherForecastProps {
  dates: string[]
  location: string
  onWeatherUpdate?: (weather: WeatherData[]) => void
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({
  dates,
  location,
  onWeatherUpdate
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(0)
  const [showRecommendations, setShowRecommendations] = useState(true)

  useEffect(() => {
    fetchWeatherData()
  }, [dates, location])

  const fetchWeatherData = async () => {
    setIsLoading(true)
    
    // Simulate API call - in production, this would call a weather API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockWeatherData: WeatherData[] = dates.map((date) => {
      // Generate realistic Ethiopian weather data
      const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy']
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
      
      // Ethiopian weather patterns (dry season vs rainy season)
      const month = new Date(date).getMonth()
      const isDrySeason = month >= 9 || month <= 2 // Oct-Mar
      
      return {
        date,
        location,
        temperature: {
          high: isDrySeason ? 25 + Math.random() * 8 : 20 + Math.random() * 6,
          low: isDrySeason ? 12 + Math.random() * 6 : 10 + Math.random() * 5,
          current: 18 + Math.random() * 10
        },
        condition: isDrySeason ? (Math.random() > 0.8 ? 'cloudy' : 'sunny') : randomCondition,
        humidity: isDrySeason ? 30 + Math.random() * 30 : 60 + Math.random() * 30,
        windSpeed: 5 + Math.random() * 15,
        visibility: 8 + Math.random() * 7,
        precipitation: isDrySeason ? Math.random() * 5 : Math.random() * 25,
        uvIndex: isDrySeason ? 7 + Math.random() * 3 : 4 + Math.random() * 4,
        description: getWeatherDescription(randomCondition, isDrySeason)
      }
    })
    
    setWeatherData(mockWeatherData)
    setIsLoading(false)
    
    if (onWeatherUpdate) {
      onWeatherUpdate(mockWeatherData)
    }
  }

  const getWeatherDescription = (condition: WeatherData['condition'], isDrySeason: boolean) => {
    const descriptions = {
      sunny: isDrySeason ? 'Clear skies with bright sunshine' : 'Sunny intervals between clouds',
      cloudy: isDrySeason ? 'Partly cloudy with mild temperatures' : 'Overcast with possible light showers',
      rainy: isDrySeason ? 'Light occasional showers' : 'Moderate to heavy rainfall expected',
      stormy: 'Thunderstorms with heavy rain',
      snowy: 'Snow possible at high altitudes'
    }
    return descriptions[condition]
  }

  const getWeatherIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny': return FaSun
      case 'cloudy': return FaCloud
      case 'rainy': return FaCloudShowersHeavy
      case 'stormy': return FaBolt
      case 'snowy': return FaSnowflake
      default: return FaSun
    }
  }

  const getWeatherColor = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny': return 'text-yellow-500 bg-yellow-50'
      case 'cloudy': return 'text-gray-500 bg-gray-50'
      case 'rainy': return 'text-blue-500 bg-blue-50'
      case 'stormy': return 'text-purple-500 bg-purple-50'
      case 'snowy': return 'text-blue-300 bg-blue-50'
      default: return 'text-yellow-500 bg-yellow-50'
    }
  }

  const generateRecommendations = (weather: WeatherData): WeatherRecommendation[] => {
    const recommendations: WeatherRecommendation[] = []
    
    // Temperature-based recommendations
    if (weather.temperature.low < 15) {
      recommendations.push({
        type: 'clothing',
        title: 'Bring Warm Layers',
        description: 'Temperatures drop to ' + Math.round(weather.temperature.low) + '°C. Pack a jacket or sweater.',
        icon: FaTshirt,
        priority: 'high'
      })
    }
    
    if (weather.temperature.high > 30) {
      recommendations.push({
        type: 'clothing',
        title: 'Sun Protection',
        description: 'High temperatures expected. Bring sunscreen, hat, and light clothing.',
        icon: FaGlasses,
        priority: 'high'
      })
    }
    
    // Weather condition recommendations
    if (weather.condition === 'rainy' || weather.precipitation > 10) {
      recommendations.push({
        type: 'packing',
        title: 'Rain Gear Essential',
        description: 'Pack waterproof jacket and umbrella. Consider indoor alternatives.',
        icon: FaUmbrella,
        priority: 'high'
      })
      
      recommendations.push({
        type: 'activity',
        title: 'Indoor Activities',
        description: 'Visit museums, cultural centers, or covered markets during rain.',
        icon: FaCheckCircle,
        priority: 'medium'
      })
    }
    
    // UV Index recommendations
    if (weather.uvIndex > 7) {
      recommendations.push({
        type: 'warning',
        title: 'High UV Index',
        description: 'UV index is ' + Math.round(weather.uvIndex) + '. Use SPF 30+ sunscreen and seek shade.',
        icon: FaExclamationTriangle,
        priority: 'high'
      })
    }
    
    // Visibility recommendations
    if (weather.visibility < 5) {
      recommendations.push({
        type: 'warning',
        title: 'Limited Visibility',
        description: 'Foggy conditions may affect scenic views and photography.',
        icon: FaEye,
        priority: 'medium'
      })
    }
    
    // Wind recommendations
    if (weather.windSpeed > 20) {
      recommendations.push({
        type: 'activity',
        title: 'Windy Conditions',
        description: 'Strong winds expected. Secure loose items and avoid outdoor dining.',
        icon: FaWind,
        priority: 'medium'
      })
    }
    
    return recommendations
  }

  const getPackingList = (weatherData: WeatherData[]) => {
    const items = new Set<string>()
    
    weatherData.forEach(weather => {
      // Essential items
      items.add('Comfortable walking shoes')
      items.add('Sunscreen (SPF 30+)')
      items.add('Water bottle')
      
      // Temperature-based items
      if (weather.temperature.low < 15) {
        items.add('Warm jacket or fleece')
        items.add('Long pants')
        items.add('Closed-toe shoes')
      }
      
      if (weather.temperature.high > 25) {
        items.add('Light, breathable clothing')
        items.add('Hat or cap')
        items.add('Sunglasses')
      }
      
      // Weather condition items
      if (weather.condition === 'rainy' || weather.precipitation > 5) {
        items.add('Waterproof jacket')
        items.add('Umbrella')
        items.add('Quick-dry clothing')
        items.add('Waterproof bag covers')
      }
      
      if (weather.uvIndex > 6) {
        items.add('Wide-brimmed hat')
        items.add('UV-protective clothing')
      }
    })
    
    return Array.from(items)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">Loading weather forecast...</span>
        </div>
      </div>
    )
  }

  const selectedWeather = weatherData[selectedDay]
  const recommendations = selectedWeather ? generateRecommendations(selectedWeather) : []
  const packingList = getPackingList(weatherData)

  return (
    <div className="space-y-6">
      {/* Weather Overview */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Weather Forecast</h3>
              <p className="text-blue-100">{location} • {weatherData.length} days</p>
            </div>
            <FaCloud className="text-3xl opacity-75" />
          </div>
        </div>

        {/* Daily Weather Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {weatherData.map((weather, index) => {
              const WeatherIcon = getWeatherIcon(weather.condition)
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`flex-shrink-0 px-4 py-3 text-center transition-all ${
                    selectedDay === index
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="text-xs font-medium mb-1">
                    {new Date(weather.date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <WeatherIcon className="mx-auto mb-1" />
                  <div className="text-xs">
                    {Math.round(weather.temperature.high)}°/{Math.round(weather.temperature.low)}°
                  </div>
                </button>
              )
            })}
          </div>
        </div>      
  {/* Selected Day Details */}
        {selectedWeather && (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Weather Details */}
              <div>
                <div className="flex items-center mb-4">
                  <div className={`text-4xl mr-4 ${getWeatherColor(selectedWeather.condition).split(' ')[0]}`}>
                    {React.createElement(getWeatherIcon(selectedWeather.condition))}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold capitalize">{selectedWeather.condition}</h4>
                    <p className="text-gray-600">{selectedWeather.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <FaTemperatureHigh className="text-red-500 mx-auto mb-1" />
                    <div className="font-semibold">{Math.round(selectedWeather.temperature.high)}°C</div>
                    <div className="text-xs text-gray-600">High</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <FaTemperatureLow className="text-blue-500 mx-auto mb-1" />
                    <div className="font-semibold">{Math.round(selectedWeather.temperature.low)}°C</div>
                    <div className="text-xs text-gray-600">Low</div>
                  </div>
                </div>
              </div>

              {/* Weather Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FaTint className="text-blue-500 mr-2" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <span className="font-medium">{Math.round(selectedWeather.humidity)}%</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FaWind className="text-gray-500 mr-2" />
                    <span className="text-sm">Wind Speed</span>
                  </div>
                  <span className="font-medium">{Math.round(selectedWeather.windSpeed)} km/h</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FaEye className="text-green-500 mr-2" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <span className="font-medium">{Math.round(selectedWeather.visibility)} km</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FaUmbrella className="text-purple-500 mr-2" />
                    <span className="text-sm">Precipitation</span>
                  </div>
                  <span className="font-medium">{Math.round(selectedWeather.precipitation)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold flex items-center">
              <FaLightbulb className="text-yellow-500 mr-2" />
              Weather Recommendations
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRecommendations(false)}
            >
              Hide
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                    rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`mr-3 mt-1 ${
                      rec.priority === 'high' ? 'text-red-600' :
                      rec.priority === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      <IconComponent />
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">{rec.title}</h5>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Packing List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <FaTshirt className="text-blue-500 mr-2" />
          Weather-Based Packing List
        </h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {packingList.map((item) => (
            <div key={item} className="flex items-center p-2 bg-gray-50 rounded">
              <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <FaLightbulb className="inline mr-1" />
            Tip: Ethiopia's weather can vary significantly by altitude and region. 
            Pack layers for temperature changes throughout the day.
          </p>
        </div>
      </div>

      {/* Weather Alerts */}
      {weatherData.some(w => w.precipitation > 20 || w.temperature.low < 10 || w.uvIndex > 8) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-yellow-600 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Weather Alerts</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                {weatherData.some(w => w.precipitation > 20) && (
                  <li>• Heavy rain expected on some days - plan indoor alternatives</li>
                )}
                {weatherData.some(w => w.temperature.low < 10) && (
                  <li>• Cold temperatures possible - pack warm clothing</li>
                )}
                {weatherData.some(w => w.uvIndex > 8) && (
                  <li>• High UV levels - bring strong sun protection</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherForecast