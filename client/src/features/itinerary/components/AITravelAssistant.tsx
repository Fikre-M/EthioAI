import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@components/common/Button/Button'
import { Itinerary } from '../pages/ItineraryPage'
import {
  FaRobot, FaMicrophone, FaPaperPlane, FaTimes, FaSun
} from 'react-icons/fa'

interface AITravelAssistantProps {
  itinerary: Itinerary
  isOpen: boolean
  onClose: () => void
  onUpdateItinerary: (itinerary: Itinerary) => void
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  suggestions?: Suggestion[]
  actions?: Action[]
}

interface Suggestion {
  id: string
  type: 'activity' | 'restaurant' | 'transport' | 'accommodation'
  title: string
  description: string
  price?: number
  rating?: number
  location?: string
  duration?: number
  weatherDependent?: boolean
}

interface Action {
  id: string
  type: 'add_to_itinerary' | 'replace_activity' | 'optimize_route' | 'adjust_budget'
  label: string
  data: any
}

const AITravelAssistant: React.FC<AITravelAssistantProps> = ({
  itinerary,
  isOpen,
  onClose,
  onUpdateItinerary
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [conversationMode, setConversationMode] = useState<'chat' | 'suggestions' | 'analysis'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeConversation = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: `Hello! I'm your AI Travel Assistant. I've analyzed your "${itinerary.title}" itinerary and I'm here to help you optimize your trip. I can help you with:

• Finding better activities and restaurants
• Optimizing your route and schedule
• Budget recommendations and cost savings
• Weather-based activity suggestions
• Local insights and hidden gems
• Safety and travel tips

What would you like to explore first?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        {
          id: 'opt-route',
          type: 'transport',
          title: 'Optimize Route',
          description: 'Reorganize activities for better travel efficiency'
        },
        {
          id: 'budget-tips',
          type: 'activity',
          title: 'Budget Optimization',
          description: 'Find cost-effective alternatives and savings'
        },
        {
          id: 'local-gems',
          type: 'activity',
          title: 'Hidden Gems',
          description: 'Discover local favorites and unique experiences'
        },
        {
          id: 'weather-plan',
          type: 'activity',
          title: 'Weather Planning',
          description: 'Adapt activities based on weather forecasts'
        }
      ]
    }
    setMessages([welcomeMessage])
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()
    
    // Analyze user input and generate contextual response
    if (input.includes('budget') || input.includes('cost') || input.includes('cheap')) {
      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `I've analyzed your budget for ${itinerary.destination}. Here are some cost-saving opportunities I found:

💰 **Current Budget**: $${itinerary.actualCost} of $${itinerary.totalBudget}
📊 **Savings Potential**: Up to $${Math.floor(itinerary.actualCost * 0.2)}

Here are my recommendations:`,
        timestamp: new Date().toISOString(),
        suggestions: [
          {
            id: 'budget-1',
            type: 'restaurant',
            title: 'Local Eateries',
            description: 'Replace expensive restaurants with highly-rated local spots',
            price: 25,
            rating: 4.6
          },
          {
            id: 'budget-2',
            type: 'transport',
            title: 'Public Transport',
            description: 'Use local buses and trains instead of taxis',
            price: 15,
            rating: 4.2
          },
          {
            id: 'budget-3',
            type: 'activity',
            title: 'Free Walking Tours',
            description: 'Join free walking tours instead of paid guided tours',
            price: 0,
            rating: 4.8
          }
        ],
        actions: [
          {
            id: 'optimize-budget',
            type: 'adjust_budget',
            label: 'Apply Budget Optimizations',
            data: { savings: Math.floor(itinerary.actualCost * 0.2) }
          }
        ]
      }
    }

    if (input.includes('weather') || input.includes('rain') || input.includes('sunny')) {
      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `Based on the weather forecast for ${itinerary.destination}, I have some smart recommendations:

🌤️ **Weather Insights**:
• Days 1-3: Sunny, perfect for outdoor activities
• Days 4-5: Light rain expected, indoor alternatives recommended
• Days 6-7: Clear skies, ideal for sightseeing

Here are weather-optimized activity suggestions:`,
        timestamp: new Date().toISOString(),
        suggestions: [
          {
            id: 'weather-1',
            type: 'activity',
            title: 'National Museum Visit',
            description: 'Perfect indoor activity for rainy day 4',
            price: 15,
            rating: 4.7,
            weatherDependent: false
          },
          {
            id: 'weather-2',
            type: 'activity',
            title: 'Mountain Hiking',
            description: 'Best done on sunny day 2 with clear views',
            price: 0,
            rating: 4.9,
            weatherDependent: true
          },
          {
            id: 'weather-3',
            type: 'activity',
            title: 'Cultural Center',
            description: 'Indoor cultural experience with traditional shows',
            price: 20,
            rating: 4.5,
            weatherDependent: false
          }
        ]
      }
    }

    if (input.includes('route') || input.includes('optimize') || input.includes('travel')) {
      return {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: `I've analyzed your current route and found several optimization opportunities:

🗺️ **Route Analysis**:
• Current total travel time: ${itinerary.days.reduce((sum, day) => sum + day.totalDuration, 0)} minutes
• Potential time savings: 45-60 minutes per day
• Reduced travel costs: Up to $30 per day

Here's my optimized route suggestion:`,
        timestamp: new Date().toISOString(),
        suggestions: [
          {
            id: 'route-1',
            type: 'transport',
            title: 'Cluster Activities by Area',
            description: 'Group nearby attractions to minimize travel time',
            duration: 180
          },
          {
            id: 'route-2',
            type: 'transport',
            title: 'Morning-Evening Optimization',
            description: 'Schedule based on opening hours and crowd patterns',
            duration: 240
          }
        ],
        actions: [
          {
            id: 'apply-route',
            type: 'optimize_route',
            label: 'Apply Route Optimization',
            data: { timeSaved: 45, costSaved: 30 }
          }
        ]
      }
    }

    // Default response for general queries
    return {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: `I understand you're asking about "${userInput}". Let me help you with that!

Based on your ${itinerary.destination} itinerary, here are some personalized recommendations:`,
      timestamp: new Date().toISOString(),
      suggestions: [
        {
          id: 'general-1',
          type: 'activity',
          title: 'Local Experience',
          description: 'Authentic cultural activity recommended by locals',
          price: 35,
          rating: 4.8,
          location: itinerary.destination
        },
        {
          id: 'general-2',
          type: 'restaurant',
          title: 'Highly Rated Restaurant',
          description: 'Top-rated local cuisine with great reviews',
          price: 45,
          rating: 4.7,
          location: itinerary.destination
        }
      ]
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const message = `Tell me more about "${suggestion.title}"`
    setInputMessage(message)
    handleSendMessage()
  }

  const handleActionClick = (action: Action) => {
    // Implement action handling
    switch (action.type) {
      case 'optimize_route':
        // Apply route optimization
        alert(`Route optimized! Saved ${action.data.timeSaved} minutes and $${action.data.costSaved}`)
        break
      case 'adjust_budget':
        // Apply budget adjustments
        alert(`Budget optimized! Potential savings: $${action.data.savings}`)
        break
      case 'add_to_itinerary':
        // Add suggestion to itinerary
        alert('Added to itinerary!')
        break
    }
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
      }
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    } else {
      alert('Speech recognition not supported in this browser')
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <FaRobot className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Travel Assistant</h2>
              <p className="text-sm text-gray-600">Powered by advanced travel intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setConversationMode('chat')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  conversationMode === 'chat' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setConversationMode('suggestions')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  conversationMode === 'suggestions' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                }`}
              >
                Suggestions
              </button>
              <button
                onClick={() => setConversationMode('analysis')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  conversationMode === 'analysis' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
                }`}
              >
                Analysis
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
                    : 'bg-gray-100 text-gray-900 rounded-r-2xl rounded-tl-2xl'
                } p-4`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                          <div className="flex items-center space-x-2">
                            {suggestion.price !== undefined && (
                              <span className="text-green-600 font-medium">${suggestion.price}</span>
                            )}
                            {suggestion.rating && (
                              <span className="text-yellow-600">★ {suggestion.rating}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                        {suggestion.weatherDependent && (
                          <div className="flex items-center mt-2 text-xs text-blue-600">
                            <FaSun className="mr-1" />
                            Weather dependent
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Actions */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.actions.map((action) => (
                      <Button
                        key={action.id}
                        onClick={() => handleActionClick(action)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="text-xs opacity-75 mt-2">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-r-2xl rounded-tl-2xl p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-gray-600 text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about your trip..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <button
                onClick={handleVoiceInput}
                disabled={isListening}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all ${
                  isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-blue-600'
                }`}
              >
                <FaMicrophone />
              </button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              <FaPaperPlane />
            </Button>
          </div>
          
          <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500">
            <span>💡 Try: "Optimize my budget" or "Find indoor activities"</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AITravelAssistant