import React from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaCar, FaUsers, FaSuitcase, FaCog, FaGasPump, FaShieldAlt,
  FaStar, FaWifi, FaSnowflake, FaRoad, FaInfoCircle, FaArrowRight,
  FaCheckCircle, FaTimesCircle
} from 'react-icons/fa'

export interface CarRental {
  id: string
  name: string
  category: 'economy' | 'compact' | 'suv' | 'luxury' | 'van'
  company: string
  image: string
  features: string[]
  pricePerDay: number
  totalPrice: number
  passengers: number
  luggage: number
  doors: number
  transmission: 'manual' | 'automatic'
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric'
  airConditioning: boolean
  gps: boolean
  insurance: string[]
  rating: number
  reviews: number
  availability: boolean
  fuelPolicy: string
  mileage: string
  deposit: number
  location: string
}

interface CarCardProps {
  car: CarRental
  onSelect: (car: CarRental) => void
  onViewDetails: (car: CarRental) => void
  searchDays: number
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  onSelect,
  onViewDetails,
  searchDays
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economy': return 'bg-green-100 text-green-800'
      case 'compact': return 'bg-blue-100 text-blue-800'
      case 'suv': return 'bg-orange-100 text-orange-800'
      case 'luxury': return 'bg-purple-100 text-purple-800'
      case 'van': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransmissionIcon = () => {
    return car.transmission === 'automatic' ? FaCog : FaCog
  }

  const getFuelIcon = () => {
    switch (car.fuelType) {
      case 'electric': return FaCheckCircle
      case 'hybrid': return FaCheckCircle
      default: return FaGasPump
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-900 mr-3">{car.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(car.category)}`}>
              {car.category.charAt(0).toUpperCase() + car.category.slice(1)}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{car.company}</p>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-medium">{car.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({car.reviews} reviews)</span>
          </div>
        </div>
        
        {/* Availability Status */}
        <div className="text-right">
          {car.availability ? (
            <div className="flex items-center text-green-600">
              <FaCheckCircle className="mr-1" />
              <span className="text-sm font-medium">Available</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <FaTimesCircle className="mr-1" />
              <span className="text-sm font-medium">Not Available</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">{car.location}</div>
        </div>
      </div>

      {/* Car Image Placeholder */}
      <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-4">
        <FaCar className="text-4xl text-gray-400" />
        <span className="ml-2 text-gray-500">Car Image</span>
      </div>

      {/* Car Specifications */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <FaUsers className="text-blue-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500">Passengers</div>
          <div className="font-semibold">{car.passengers}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <FaSuitcase className="text-green-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500">Luggage</div>
          <div className="font-semibold">{car.luggage}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          {React.createElement(getTransmissionIcon(), { className: "text-purple-500 mx-auto mb-1" })}
          <div className="text-xs text-gray-500">Transmission</div>
          <div className="font-semibold text-xs capitalize">{car.transmission}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          {React.createElement(getFuelIcon(), { className: "text-orange-500 mx-auto mb-1" })}
          <div className="text-xs text-gray-500">Fuel</div>
          <div className="font-semibold text-xs capitalize">{car.fuelType}</div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Included Features</h4>
        <div className="flex flex-wrap gap-2">
          {car.airConditioning && (
            <div className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <FaSnowflake className="mr-1" />
              A/C
            </div>
          )}
          {car.gps && (
            <div className="flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              <FaRoad className="mr-1" />
              GPS
            </div>
          )}
          {car.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
          {car.features.length > 3 && (
            <span className="text-xs text-blue-600 cursor-pointer">
              +{car.features.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Insurance */}
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FaShieldAlt className="mr-2 text-green-500" />
          <span>Insurance: {car.insurance.join(', ')}</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">${car.pricePerDay}/day</div>
            <div className="text-sm text-gray-600">
              Total: ${car.totalPrice} for {searchDays} days
            </div>
            <div className="text-xs text-gray-500">
              + ${car.deposit} deposit
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">{car.fuelPolicy}</div>
            <div className="text-xs text-gray-500">{car.mileage}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => onViewDetails(car)}
            className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <FaInfoCircle className="mr-2" />
            Details
          </Button>
          <Button
            onClick={() => onSelect(car)}
            disabled={!car.availability}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {car.availability ? (
              <>
                Select Car
                <FaArrowRight className="ml-2" />
              </>
            ) : (
              'Not Available'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CarCard