import React from 'react'
import { Button } from '@components/common/Button/Button'
import {
  FaPlane, FaWifi, FaUtensils, FaSuitcase,
  FaStar, FaInfoCircle, FaArrowRight
} from 'react-icons/fa'

export interface Flight {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  aircraft: string
  departure: {
    airport: string
    airportCode: string
    city: string
    time: string
    date: string
    terminal?: string
  }
  arrival: {
    airport: string
    airportCode: string
    city: string
    time: string
    date: string
    terminal?: string
  }
  duration: string
  stops: number
  stopDetails?: Array<{
    airport: string
    duration: string
  }>
  price: {
    economy: number
    business?: number
    first?: number
  }
  amenities: string[]
  baggage: {
    carry: string
    checked: string
  }
  rating: number
  reviews: number
  availability: {
    economy: number
    business: number
    first: number
  }
}

interface FlightCardProps {
  flight: Flight
  selectedClass: 'economy' | 'business' | 'first'
  onSelect: (flight: Flight) => void
  onViewDetails: (flight: Flight) => void
}

const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  selectedClass,
  onSelect,
  onViewDetails
}) => {
  const currentPrice = flight.price[selectedClass] || flight.price.economy
  const isAvailable = flight.availability[selectedClass] > 0

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStopsText = () => {
    if (flight.stops === 0) return 'Direct'
    if (flight.stops === 1) return '1 Stop'
    return `${flight.stops} Stops`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <FaPlane className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{flight.airline}</h3>
            <p className="text-sm text-gray-600">{flight.flightNumber} • {flight.aircraft}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center mb-1">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-medium">{flight.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({flight.reviews})</span>
          </div>
          <div className="text-sm text-gray-600">{getStopsText()}</div>
        </div>
      </div>

      {/* Flight Route */}
      <div className="flex items-center justify-between mb-4">
        {/* Departure */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{formatTime(flight.departure.time)}</div>
          <div className="text-sm font-medium text-gray-700">{flight.departure.airportCode}</div>
          <div className="text-xs text-gray-500">{flight.departure.city}</div>
          {flight.departure.terminal && (
            <div className="text-xs text-gray-400">Terminal {flight.departure.terminal}</div>
          )}
        </div>

        {/* Flight Path */}
        <div className="flex-1 mx-6">
          <div className="relative">
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t-2 border-gray-300"></div>
              <div className="mx-4 text-center">
                <FaPlane className="text-blue-600 mx-auto mb-1" />
                <div className="text-xs text-gray-500">{flight.duration}</div>
              </div>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>
            {flight.stops > 0 && (
              <div className="text-center mt-1">
                <div className="text-xs text-orange-600 font-medium">{getStopsText()}</div>
              </div>
            )}
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{formatTime(flight.arrival.time)}</div>
          <div className="text-sm font-medium text-gray-700">{flight.arrival.airportCode}</div>
          <div className="text-xs text-gray-500">{flight.arrival.city}</div>
          {flight.arrival.terminal && (
            <div className="text-xs text-gray-400">Terminal {flight.arrival.terminal}</div>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div className="flex items-center justify-center space-x-6 mb-4 py-3 bg-gray-50 rounded-lg">
        {flight.amenities.includes('wifi') && (
          <div className="flex items-center text-sm text-gray-600">
            <FaWifi className="mr-1 text-blue-500" />
            <span>WiFi</span>
          </div>
        )}
        {flight.amenities.includes('meals') && (
          <div className="flex items-center text-sm text-gray-600">
            <FaUtensils className="mr-1 text-green-500" />
            <span>Meals</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <FaSuitcase className="mr-1 text-purple-500" />
          <span>{flight.baggage.carry} + {flight.baggage.checked}</span>
        </div>
      </div>

      {/* Price and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">${currentPrice}</div>
            <div className="text-sm text-gray-500 capitalize">{selectedClass} class</div>
          </div>
          {!isAvailable && (
            <div className="text-sm text-red-600 font-medium">
              No seats available
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => onViewDetails(flight)}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <FaInfoCircle className="mr-2" />
            Details
          </Button>
          <Button
            onClick={() => onSelect(flight)}
            disabled={!isAvailable}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Select Flight
            <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Stop Details */}
      {flight.stops > 0 && flight.stopDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Stops: </span>
            {flight.stopDetails.map((stop, index) => (
              <span key={index}>
                {stop.airport} ({stop.duration})
                {index < flight.stopDetails!.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FlightCard