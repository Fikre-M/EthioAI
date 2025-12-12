import React, { useState, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import { Itinerary } from '../pages/ItineraryPage'
import {
  FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaInfoCircle,
  FaWeatherSun, FaUserMd, FaGlobe, FaMapMarkerAlt, FaClock,
  FaPhone, FaAmbulance, FaPassport, FaSuitcase, FaWifi,
  FaCreditCard, FaLanguage, FaRoute, FaEye, FaBell
} from 'react-icons/fa'

interface TravelRiskAssessmentProps {
  itinerary: Itinerary
  isOpen: boolean
  onClose: () => void
}

interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high'
  riskScore: number
  categories: RiskCategory[]
  alerts: Alert[]
  recommendations: Recommendation[]
  emergencyInfo: EmergencyInfo
  safetyTips: SafetyTip[]
}

interface RiskCategory {
  id: string
  name: string
  risk: 'low' | 'medium' | 'high'
  score: number
  description: string
  factors: string[]
  icon: string
}

interface Alert {
  id: string
  type: 'warning' | 'info' | 'critical'
  title: string
  description: string
  date?: string
  source: string
  actionRequired: boolean
}

interface Recommendation {
  id: string
  category: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  cost?: number
}

interface EmergencyInfo {
  police: string
  medical: string
  embassy: string
  localEmergency: string
  hospitals: Hospital[]
}

interface Hospital {
  name: string
  address: string
  phone: string
  distance: string
}

interface SafetyTip {
  id: string
  category: string
  tip: string
  importance: 'low' | 'medium' | 'high'
}

const TravelRiskAssessment: React.FC<TravelRiskAssessmentProps> = ({
  itinerary,
  isOpen,
  onClose
}) => {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false)

  useEffect(() => {
    if (isOpen) {
      generateRiskAssessment()
    }
  }, [isOpen, itinerary])

  const generateRiskAssessment = () => {
    // Mock risk assessment data based on destination
    const riskCategories: RiskCategory[] = [
      {
        id: 'health',
        name: 'Health & Medical',
        risk: 'low',
        score: 25,
        description: 'Low health risks with good medical infrastructure',
        factors: ['Good healthcare system', 'No major disease outbreaks', 'Clean water available'],
        icon: '🏥'
      },
      {
        id: 'security',
        name: 'Security & Crime',
        risk: 'medium',
        score: 45,
        description: 'Moderate security concerns in tourist areas',
        factors: ['Petty theft common', 'Tourist-targeted scams', 'Generally safe during day'],
        icon: '🔒'
      },
      {
        id: 'weather',
        name: 'Weather & Natural',
        risk: 'low',
        score: 20,
        description: 'Favorable weather conditions expected',
        factors: ['Dry season', 'No severe weather warnings', 'Stable climate'],
        icon: '🌤️'
      },
      {
        id: 'political',
        name: 'Political Stability',
        risk: 'low',
        score: 15,
        description: 'Stable political environment',
        factors: ['No recent unrest', 'Tourist-friendly policies', 'Stable government'],
        icon: '🏛️'
      },
      {
        id: 'transport',
        name: 'Transportation',
        risk: 'medium',
        score: 35,
        description: 'Some transportation safety concerns',
        factors: ['Road conditions vary', 'Traffic congestion', 'Public transport available'],
        icon: '🚗'
      }
    ]

    const alerts: Alert[] = [
      {
        id: 'alert-1',
        type: 'info',
        title: 'Seasonal Festival Period',
        description: 'Your visit coincides with Timkat festival. Expect crowds and higher prices.',
        date: '2024-01-19',
        source: 'Local Tourism Board',
        actionRequired: false
      },
      {
        id: 'alert-2',
        type: 'warning',
        title: 'Road Construction',
        description: 'Major highway construction between Addis Ababa and Lalibela may cause delays.',
        source: 'Transportation Authority',
        actionRequired: true
      },
      {
        id: 'alert-3',
        type: 'info',
        title: 'Currency Exchange',
        description: 'USD exchange rates are favorable. Consider exchanging money at banks.',
        source: 'Financial Advisory',
        actionRequired: false
      }
    ]

    const recommendations: Recommendation[] = [
      {
        id: 'rec-1',
        category: 'Health',
        title: 'Travel Insurance',
        description: 'Get comprehensive travel insurance covering medical emergencies',
        priority: 'high',
        cost: 150
      },
      {
        id: 'rec-2',
        category: 'Security',
        title: 'Secure Accommodation',
        description: 'Choose hotels with good security ratings and safe locations',
        priority: 'medium'
      },
      {
        id: 'rec-3',
        category: 'Communication',
        title: 'Local SIM Card',
        description: 'Purchase local SIM card for reliable communication',
        priority: 'medium',
        cost: 25
      },
      {
        id: 'rec-4',
        category: 'Documentation',
        title: 'Document Copies',
        description: 'Keep digital and physical copies of important documents',
        priority: 'high'
      }
    ]

    const emergencyInfo: EmergencyInfo = {
      police: '911',
      medical: '907',
      embassy: '+251-11-130-6000',
      localEmergency: '991',
      hospitals: [
        {
          name: 'Black Lion Hospital',
          address: 'Churchill Avenue, Addis Ababa',
          phone: '+251-11-551-7011',
          distance: '2.3 km'
        },
        {
          name: 'Myungsung Christian Medical Center',
          address: 'Entoto Road, Addis Ababa',
          phone: '+251-11-372-0000',
          distance: '4.1 km'
        }
      ]
    }

    const safetyTips: SafetyTip[] = [
      {
        id: 'tip-1',
        category: 'General',
        tip: 'Always inform someone of your daily itinerary',
        importance: 'high'
      },
      {
        id: 'tip-2',
        category: 'Money',
        tip: 'Use hotel safes for valuables and carry minimal cash',
        importance: 'high'
      },
      {
        id: 'tip-3',
        category: 'Health',
        tip: 'Drink bottled water and avoid street food initially',
        importance: 'medium'
      },
      {
        id: 'tip-4',
        category: 'Transport',
        tip: 'Use reputable taxi services or hotel-arranged transport',
        importance: 'medium'
      },
      {
        id: 'tip-5',
        category: 'Cultural',
        tip: 'Dress modestly when visiting religious sites',
        importance: 'medium'
      }
    ]

    const overallScore = riskCategories.reduce((sum, cat) => sum + cat.score, 0) / riskCategories.length
    const overallRisk: 'low' | 'medium' | 'high' = 
      overallScore < 30 ? 'low' : overallScore < 60 ? 'medium' : 'high'

    const riskAssessment: RiskAssessment = {
      overallRisk,
      riskScore: overallScore,
      categories: riskCategories,
      alerts,
      recommendations,
      emergencyInfo,
      safetyTips
    }

    setAssessment(riskAssessment)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <FaExclamationTriangle className="text-red-600" />
      case 'warning': return <FaExclamationTriangle className="text-yellow-600" />
      case 'info': return <FaInfoCircle className="text-blue-600" />
      default: return <FaInfoCircle className="text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isOpen || !assessment) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
              assessment.overallRisk === 'low' ? 'bg-green-100' :
              assessment.overallRisk === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <FaShieldAlt className={`text-xl ${
                assessment.overallRisk === 'low' ? 'text-green-600' :
                assessment.overallRisk === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Travel Risk Assessment</h2>
              <p className="text-gray-600">Safety analysis for {itinerary.destination}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                assessment.overallRisk === 'low' ? 'text-green-600' :
                assessment.overallRisk === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {assessment.overallRisk.toUpperCase()}
              </div>
              <div className="text-sm text-gray-500">Overall Risk</div>
            </div>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Risk Overview */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {assessment.categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                } ${getRiskColor(category.risk)}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-sm mb-1">{category.name}</div>
                  <div className="text-xs opacity-75">{category.risk} risk</div>
                  <div className="mt-2 w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        category.risk === 'low' ? 'bg-green-600' :
                        category.risk === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Category Details */}
          {selectedCategory && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              {(() => {
                const category = assessment.categories.find(c => c.id === selectedCategory)
                if (!category) return null
                
                return (
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{category.icon}</span>
                      <div>
                        <h3 className="text-xl font-semibold">{category.name}</h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Risk Factors:</h4>
                        <ul className="space-y-2">
                          {category.factors.map((factor, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Risk Score:</h4>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-4 mr-3">
                            <div
                              className={`h-4 rounded-full ${
                                category.risk === 'low' ? 'bg-green-500' :
                                category.risk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${category.score}%` }}
                            ></div>
                          </div>
                          <span className="font-bold">{category.score}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Active Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <FaBell className="mr-2 text-orange-600" />
              Active Alerts
            </h3>
            
            <div className="space-y-4">
              {assessment.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 rounded-r-lg ${
                    alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <p className="text-gray-700 mt-1">{alert.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <span>Source: {alert.source}</span>
                          {alert.date && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{new Date(alert.date).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {alert.actionRequired && (
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">Safety Recommendations</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {assessment.recommendations.map((rec) => (
                <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <span className="text-sm text-gray-600">{rec.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      {rec.cost && (
                        <span className="text-sm font-medium text-green-600">${rec.cost}</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3">{rec.description}</p>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Information */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-900 flex items-center">
                <FaAmbulance className="mr-2" />
                Emergency Information
              </h3>
              <Button
                onClick={() => setShowEmergencyInfo(!showEmergencyInfo)}
                variant="outline"
                size="sm"
              >
                {showEmergencyInfo ? 'Hide' : 'Show'} Details
              </Button>
            </div>
            
            {showEmergencyInfo && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-900 mb-3">Emergency Numbers:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Police:</span>
                      <span className="font-mono font-bold">{assessment.emergencyInfo.police}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical:</span>
                      <span className="font-mono font-bold">{assessment.emergencyInfo.medical}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Embassy:</span>
                      <span className="font-mono font-bold">{assessment.emergencyInfo.embassy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Local Emergency:</span>
                      <span className="font-mono font-bold">{assessment.emergencyInfo.localEmergency}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-900 mb-3">Nearby Hospitals:</h4>
                  <div className="space-y-3">
                    {assessment.emergencyInfo.hospitals.map((hospital, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{hospital.name}</div>
                        <div className="text-gray-700">{hospital.address}</div>
                        <div className="flex justify-between">
                          <span className="font-mono">{hospital.phone}</span>
                          <span className="text-blue-600">{hospital.distance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Safety Tips */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Essential Safety Tips</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessment.safetyTips.map((tip) => (
                <div
                  key={tip.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    tip.importance === 'high' ? 'border-red-500 bg-red-50' :
                    tip.importance === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{tip.category}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(tip.importance)}`}>
                      {tip.importance}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelRiskAssessment