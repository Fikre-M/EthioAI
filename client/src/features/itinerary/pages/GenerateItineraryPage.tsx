import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import TripPreferences from '../components/TripPreferences'
import {
  FaRobot, FaArrowLeft, FaArrowRight, FaCheck, FaSpinner,
  FaLightbulb, FaStar, FaCalendarAlt, FaMapMarkedAlt
} from 'react-icons/fa'

export interface TripPreferencesData {
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  interests: string[]
  pace: 'relaxed' | 'moderate' | 'packed'
  accommodation: 'budget' | 'mid-range' | 'luxury'
  transportation: 'walking' | 'public' | 'private' | 'mixed'
  dietaryRestrictions: string[]
  accessibility: string[]
  specialRequests: string
}

interface GenerationStep {
  id: number
  title: string
  description: string
  component: string
}

const GenerateItineraryPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [preferences, setPreferences] = useState<TripPreferencesData>({
    destination: 'Ethiopia',
    startDate: '',
    endDate: '',
    budget: 1500,
    travelers: 2,
    interests: [],
    pace: 'moderate',
    accommodation: 'mid-range',
    transportation: 'mixed',
    dietaryRestrictions: [],
    accessibility: [],
    specialRequests: ''
  })

  const steps: GenerationStep[] = [
    {
      id: 1,
      title: 'Trip Basics',
      description: 'Tell us about your trip dates, budget, and travelers',
      component: 'basics'
    },
    {
      id: 2,
      title: 'Interests & Pace',
      description: 'What do you love to do and how fast do you like to travel?',
      component: 'interests'
    },
    {
      id: 3,
      title: 'Preferences',
      description: 'Accommodation, transportation, and special requirements',
      component: 'preferences'
    },
    {
      id: 4,
      title: 'Generate',
      description: 'Let AI create your perfect Ethiopian itinerary',
      component: 'generate'
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Navigate to generated itinerary (will be implemented in Phase 2)
    navigate('/itinerary/generated', { state: { preferences } })
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return preferences.startDate && preferences.endDate && preferences.budget > 0
      case 2:
        return preferences.interests.length > 0
      case 3:
        return true // All preferences are optional
      case 4:
        return true
      default:
        return false
    }
  }

  const calculateDays = () => {
    if (!preferences.startDate || !preferences.endDate) return 0
    const start = new Date(preferences.startDate)
    const end = new Date(preferences.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={() => navigate('/itinerary')}
            variant="outline"
            className="mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaRobot className="mr-3 text-purple-600" />
              AI Itinerary Generator
            </h1>
            <p className="text-gray-600">Let AI create your perfect Ethiopian adventure</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep > step.id ? 'bg-green-500 border-green-500 text-white' :
                  currentStep === step.id ? 'bg-purple-600 border-purple-600 text-white' :
                  'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? <FaCheck /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 transition-all ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {currentStep < 4 ? (
            <TripPreferences
              preferences={preferences}
              onPreferencesChange={setPreferences}
              currentStep={currentStep}
            />
          ) : (
            /* Generation Step */
            <div className="p-8">
              <div className="text-center mb-8">
                <FaLightbulb className="text-6xl text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Generate Your Itinerary!</h2>
                <p className="text-gray-600 mb-6">
                  Based on your preferences, we'll create a personalized {calculateDays()}-day Ethiopian adventure.
                </p>
              </div>

              {/* Trip Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <FaCalendarAlt className="text-2xl text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold">{calculateDays()} Days</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <FaMapMarkedAlt className="text-2xl text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold">{preferences.destination}</div>
                    <div className="text-sm text-gray-600">Destination</div>
                  </div>
                  <div className="text-center">
                    <FaStar className="text-2xl text-yellow-600 mx-auto mb-2" />
                    <div className="font-semibold">${preferences.budget}</div>
                    <div className="text-sm text-gray-600">Budget</div>
                  </div>
                  <div className="text-center">
                    <FaRobot className="text-2xl text-green-600 mx-auto mb-2" />
                    <div className="font-semibold">{preferences.interests.length} Interests</div>
                    <div className="text-sm text-gray-600">Selected</div>
                  </div>
                </div>
              </div>

              {/* AI Features */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <FaRobot className="text-3xl text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Smart Planning</h4>
                  <p className="text-sm text-gray-600">AI optimizes your route and timing for maximum enjoyment</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <FaStar className="text-3xl text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Personalized</h4>
                  <p className="text-sm text-gray-600">Tailored to your interests, budget, and travel style</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <FaLightbulb className="text-3xl text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Local Insights</h4>
                  <p className="text-sm text-gray-600">Hidden gems and authentic experiences included</p>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" />
                      Generating Your Perfect Itinerary...
                    </>
                  ) : (
                    <>
                      <FaRobot className="mr-3" />
                      Generate My Itinerary
                    </>
                  )}
                </Button>
                
                {isGenerating && (
                  <div className="mt-6">
                    <div className="bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Analyzing your preferences and creating the perfect Ethiopian adventure...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between p-6 bg-gray-50 border-t">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="outline"
              >
                <FaArrowLeft className="mr-2" />
                Previous
              </Button>
              
              <div className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </div>
              
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next
                <FaArrowRight className="ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start">
            <FaLightbulb className="text-yellow-600 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">AI Generation Tips</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Be specific about your interests for better recommendations</li>
                <li>• Consider seasonal weather when selecting your travel dates</li>
                <li>• Budget includes accommodation, activities, and meals (flights separate)</li>
                <li>• You can always customize the generated itinerary afterward</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateItineraryPage