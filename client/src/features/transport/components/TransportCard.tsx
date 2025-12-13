import React from 'react'
import { Button } from '@components/common/Button/Button'
import { FaArrowRight, FaStar, FaClock, FaDollarSign } from 'react-icons/fa'

interface TransportOption {
  id: string
  type: 'flight' | 'car' | 'bus' | 'train' | 'boat'
  title: string
  description: string
  icon: React.ComponentType
  color: string
  features: string[]
  popularRoutes?: string[]
  startingPrice?: string
}

interface TransportCardProps {
  option: TransportOption
  onSelect: () => void
}

const TransportCard: React.FC<TransportCardProps> = ({ option, onSelect }) => {
  const IconComponent = option.icon

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Header with gradient background */}
      <div className={`bg-gradient-to-r ${option.color} p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">
              <IconComponent />
            </div>
            {option.startingPrice && (
              <div className="text-right">
                <div className="text-sm opacity-90">Starting from</div>
                <div className="text-xl font-bold">{option.startingPrice}</div>
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
          <p className="text-lg opacity-90">{option.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Features */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
          <div className="grid grid-cols-2 gap-2">
            {option.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Popular Routes */}
        {option.popularRoutes && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Popular Routes</h4>
            <div className="space-y-2">
              {option.popularRoutes.slice(0, 3).map((route, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{route}</span>
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="text-xs mr-1" />
                    <span className="text-xs text-gray-500">Popular</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <FaClock className="text-blue-500 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Quick</div>
            <div className="text-sm font-semibold">Booking</div>
          </div>
          <div className="text-center">
            <FaDollarSign className="text-green-500 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Best</div>
            <div className="text-sm font-semibold">Prices</div>
          </div>
          <div className="text-center">
            <FaStar className="text-yellow-500 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Top</div>
            <div className="text-sm font-semibold">Rated</div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onSelect}
          className={`w-full bg-gradient-to-r ${option.color} text-white hover:opacity-90 transition-all duration-300 group-hover:scale-105`}
        >
          <span>Book {option.title}</span>
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}

export default TransportCard