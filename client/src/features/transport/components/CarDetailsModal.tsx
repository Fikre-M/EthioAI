import React from 'react'
import { Button } from '@components/common/Button/Button'
import { CarRental } from './CarCard'
import {
  FaTimes, FaCar, FaUsers, FaSuitcase, FaCog, FaGasPump,
  FaShieldAlt, FaStar, FaMapMarkerAlt,
  FaCheckCircle, FaSnowflake, FaRoad, FaCalendarAlt,
  FaDollarSign, FaExclamationTriangle
} from 'react-icons/fa'

interface CarDetailsModalProps {
  car: CarRental | null
  isOpen: boolean
  onClose: () => void
  onSelect: (car: CarRental) => void
  searchDays: number
  pickupDate: string
  returnDate: string
}

const CarDetailsModal: React.FC<CarDetailsModalProps> = ({
  car,
  isOpen,
  onClose,
  onSelect,
  searchDays,
  pickupDate,
  returnDate
}) => {
  if (!isOpen || !car) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FaCar className="text-blue-600" />
            </div>
            <div>
              <div className="flex items-center mb-1">
                <h2 className="text-2xl font-bold text-gray-900 mr-3">{car.name}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(car.category)}`}>
                  {car.category.charAt(0).toUpperCase() + car.category.slice(1)}
                </span>
              </div>
              <p className="text-gray-600">{car.company}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="p-2"
          >
            <FaTimes />
          </Button>
        </div>

        <div className="p-6">
          {/* Car Image and Basic Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Car Image */}
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <FaCar className="text-6xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Car Image</p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-2" />
                <span className="font-semibold">{car.rating}/5</span>
                <span className="text-gray-500 ml-2">({car.reviews} reviews)</span>
              </div>
              
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <span>{car.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaUsers className="text-blue-500 mx-auto mb-2" />
                  <div className="font-semibold">{car.passengers}</div>
                  <div className="text-sm text-gray-600">Passengers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaSuitcase className="text-green-500 mx-auto mb-2" />
                  <div className="font-semibold">{car.luggage}</div>
                  <div className="text-sm text-gray-600">Luggage</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Rental Period
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Pickup Date</div>
                <div className="font-semibold">{formatDate(pickupDate)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Return Date</div>
                <div className="font-semibold">{formatDate(returnDate)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold">{searchDays} days</div>
              </div>
            </div>
          </div>

          {/* Vehicle Specifications */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaCog className="mr-2 text-gray-600" />
              Vehicle Specifications
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FaCog className="text-purple-500 mx-auto mb-2" />
                <div className="font-semibold capitalize">{car.transmission}</div>
                <div className="text-sm text-gray-600">Transmission</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FaGasPump className="text-orange-500 mx-auto mb-2" />
                <div className="font-semibold capitalize">{car.fuelType}</div>
                <div className="text-sm text-gray-600">Fuel Type</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FaCar className="text-blue-500 mx-auto mb-2" />
                <div className="font-semibold">{car.doors}</div>
                <div className="text-sm text-gray-600">Doors</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FaRoad className="text-green-500 mx-auto mb-2" />
                <div className="font-semibold">{car.mileage}</div>
                <div className="text-sm text-gray-600">Mileage</div>
              </div>
            </div>
          </div>

          {/* Features and Amenities */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaCheckCircle className="mr-2 text-green-600" />
              Included Features
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {car.airConditioning && (
                  <div className="flex items-center">
                    <FaSnowflake className="mr-3 text-blue-500" />
                    <span>Air Conditioning</span>
                  </div>
                )}
                {car.gps && (
                  <div className="flex items-center">
                    <FaRoad className="mr-3 text-green-500" />
                    <span>GPS Navigation</span>
                  </div>
                )}
                {car.features.slice(0, Math.ceil(car.features.length / 2)).map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <FaCheckCircle className="mr-3 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {car.features.slice(Math.ceil(car.features.length / 2)).map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <FaCheckCircle className="mr-3 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insurance Coverage */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaShieldAlt className="mr-2 text-green-600" />
              Insurance Coverage
            </h3>
            <div className="bg-green-50 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {car.insurance.map((coverage, index) => (
                  <div key={index} className="flex items-center">
                    <FaShieldAlt className="mr-3 text-green-600" />
                    <span>{coverage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaDollarSign className="mr-2 text-blue-600" />
              Pricing Breakdown
            </h3>
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Daily Rate</span>
                  <span className="font-semibold">${car.pricePerDay}/day</span>
                </div>
                <div className="flex justify-between">
                  <span>Rental Period ({searchDays} days)</span>
                  <span className="font-semibold">${car.pricePerDay * searchDays}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${car.totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Security Deposit</span>
                  <span className="text-orange-600">${car.deposit} (refundable)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaExclamationTriangle className="mr-2 text-orange-600" />
              Important Information
            </h3>
            <div className="bg-orange-50 rounded-xl p-6">
              <div className="space-y-2 text-sm">
                <div><strong>Fuel Policy:</strong> {car.fuelPolicy}</div>
                <div><strong>Mileage:</strong> {car.mileage}</div>
                <div><strong>Minimum Age:</strong> 21 years (25+ for luxury vehicles)</div>
                <div><strong>License:</strong> Valid driver's license required</div>
                <div><strong>Deposit:</strong> ${car.deposit} security deposit required</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              <div className="text-2xl font-bold text-blue-600">${car.totalPrice}</div>
              <div className="text-sm text-gray-600">Total for {searchDays} days</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  onSelect(car)
                  onClose()
                }}
                disabled={!car.availability}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {car.availability ? 'Select This Car' : 'Not Available'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailsModal