import React from 'react'
import { Button } from '@components/common/Button/Button'
import { Flight } from './FlightCard'
import {
  FaTimes, FaPlane, FaClock, FaWifi, FaUtensils, FaSuitcase,
  FaStar, FaMapMarkerAlt, FaInfoCircle, FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa'

interface FlightDetailsModalProps {
  flight: Flight | null
  isOpen: boolean
  onClose: () => void
  onSelect: (flight: Flight) => void
  selectedClass: 'economy' | 'business' | 'first'
}

const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({
  flight,
  isOpen,
  onClose,
  onSelect,
  selectedClass
}) => {
  if (!isOpen || !flight) return null

  const currentPrice = flight.price[selectedClass] || flight.price.economy
  const isAvailable = flight.availability[selectedClass] > 0

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FaPlane className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{flight.airline}</h2>
              <p className="text-gray-600">{flight.flightNumber} • {flight.aircraft}</p>
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
          {/* Flight Route Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Departure */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                Departure
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{formatTime(flight.departure.time)}</div>
                  <div className="text-sm text-gray-600">{formatDate(flight.departure.date)}</div>
                </div>
                <div>
                  <div className="font-semibold">{flight.departure.airport}</div>
                  <div className="text-sm text-gray-600">{flight.departure.city} ({flight.departure.airportCode})</div>
                  {flight.departure.terminal && (
                    <div className="text-sm text-gray-500">Terminal {flight.departure.terminal}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Arrival */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-red-600" />
                Arrival
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{formatTime(flight.arrival.time)}</div>
                  <div className="text-sm text-gray-600">{formatDate(flight.arrival.date)}</div>
                </div>
                <div>
                  <div className="font-semibold">{flight.arrival.airport}</div>
                  <div className="text-sm text-gray-600">{flight.arrival.city} ({flight.arrival.airportCode})</div>
                  {flight.arrival.terminal && (
                    <div className="text-sm text-gray-500">Terminal {flight.arrival.terminal}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Flight Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <FaClock className="text-2xl text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Duration</div>
              <div className="text-sm text-gray-600">{flight.duration}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <FaPlane className="text-2xl text-green-600 mx-auto mb-2" />
              <div className="font-semibold">Aircraft</div>
              <div className="text-sm text-gray-600">{flight.aircraft}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <FaStar className="text-2xl text-purple-600 mx-auto mb-2" />
              <div className="font-semibold">Rating</div>
              <div className="text-sm text-gray-600">{flight.rating}/5 ({flight.reviews} reviews)</div>
            </div>
          </div>

          {/* Stops Information */}
          {flight.stops > 0 && flight.stopDetails && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaExclamationTriangle className="mr-2 text-orange-600" />
                Stop Information
              </h3>
              <div className="bg-orange-50 rounded-xl p-6">
                <div className="space-y-3">
                  {flight.stopDetails.map((stop, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{stop.airport}</div>
                        <div className="text-sm text-gray-600">Stop {index + 1}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{stop.duration}</div>
                        <div className="text-sm text-gray-600">Layover</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaCheckCircle className="mr-2 text-green-600" />
              Included Amenities
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {flight.amenities.includes('wifi') && (
                  <div className="flex items-center">
                    <FaWifi className="mr-3 text-blue-500" />
                    <span>In-flight WiFi</span>
                  </div>
                )}
                {flight.amenities.includes('meals') && (
                  <div className="flex items-center">
                    <FaUtensils className="mr-3 text-green-500" />
                    <span>Complimentary meals</span>
                  </div>
                )}
                {flight.amenities.includes('entertainment') && (
                  <div className="flex items-center">
                    <FaInfoCircle className="mr-3 text-purple-500" />
                    <span>In-flight entertainment</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaSuitcase className="mr-3 text-orange-500" />
                  <span>Carry-on: {flight.baggage.carry}</span>
                </div>
                <div className="flex items-center">
                  <FaSuitcase className="mr-3 text-red-500" />
                  <span>Checked: {flight.baggage.checked}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Pricing by Class</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border-2 ${selectedClass === 'economy' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <div className="text-center">
                  <div className="font-semibold">Economy</div>
                  <div className="text-2xl font-bold text-blue-600">${flight.price.economy}</div>
                  <div className="text-sm text-gray-600">{flight.availability.economy} seats left</div>
                </div>
              </div>
              {flight.price.business && (
                <div className={`p-4 rounded-xl border-2 ${selectedClass === 'business' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="text-center">
                    <div className="font-semibold">Business</div>
                    <div className="text-2xl font-bold text-blue-600">${flight.price.business}</div>
                    <div className="text-sm text-gray-600">{flight.availability.business} seats left</div>
                  </div>
                </div>
              )}
              {flight.price.first && (
                <div className={`p-4 rounded-xl border-2 ${selectedClass === 'first' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="text-center">
                    <div className="font-semibold">First Class</div>
                    <div className="text-2xl font-bold text-blue-600">${flight.price.first}</div>
                    <div className="text-sm text-gray-600">{flight.availability.first} seats left</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              <div className="text-2xl font-bold text-blue-600">${currentPrice}</div>
              <div className="text-sm text-gray-600 capitalize">{selectedClass} class</div>
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
                  onSelect(flight)
                  onClose()
                }}
                disabled={!isAvailable}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isAvailable ? 'Select Flight' : 'Not Available'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightDetailsModal