import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import TransportCard from '../components/TransportCard'
import {
  FaPlane, FaCar, FaBus, FaTrain,
  FaMapMarkedAlt, FaCalendarAlt, FaUsers, FaSearch,
  FaFilter, FaStar, FaClock
} from 'react-icons/fa'

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

const TransportPage: React.FC = () => {
  const navigate = useNavigate()

  const transportOptions: TransportOption[] = [
    {
      id: 'flights',
      type: 'flight',
      title: 'Flights',
      description: 'Domestic and international flights to explore Ethiopia',
      icon: FaPlane,
      color: 'from-blue-500 to-indigo-600',
      features: ['Ethiopian Airlines', 'Multiple destinations', 'Flexible dates', 'Best prices'],
      popularRoutes: ['Addis Ababa → Lalibela', 'Addis Ababa → Bahir Dar', 'Addis Ababa → Axum'],
      startingPrice: 'From $89'
    },
    {
      id: 'cars',
      type: 'car',
      title: 'Car Rental',
      description: 'Rent a car for flexible travel across Ethiopia',
      icon: FaCar,
      color: 'from-green-500 to-emerald-600',
      features: ['4WD vehicles', 'GPS included', 'Insurance covered', 'Local support'],
      popularRoutes: ['Addis Ababa city', 'Historical Circuit', 'Omo Valley'],
      startingPrice: 'From $45/day'
    },
    {
      id: 'buses',
      type: 'bus',
      title: 'Bus Travel',
      description: 'Comfortable bus services connecting major cities',
      icon: FaBus,
      color: 'from-orange-500 to-red-600',
      features: ['Sky Bus service', 'AC coaches', 'Multiple schedules', 'Affordable rates'],
      popularRoutes: ['Addis → Bahir Dar', 'Addis → Hawassa', 'Addis → Dire Dawa'],
      startingPrice: 'From $12'
    },
    {
      id: 'trains',
      type: 'train',
      title: 'Railway',
      description: 'Modern railway connecting Ethiopia to Djibouti',
      icon: FaTrain,
      color: 'from-purple-500 to-pink-600',
      features: ['Addis-Djibouti line', 'Scenic views', 'Comfortable seating', 'Border crossing'],
      popularRoutes: ['Addis Ababa → Djibouti', 'Addis Ababa → Dire Dawa'],
      startingPrice: 'From $25'
    }
  ]

  const handleTransportSelect = (transportType: string) => {
    switch (transportType) {
      case 'flights':
        navigate('/transport/flights')
        break
      case 'cars':
        navigate('/transport/cars')
        break
      case 'buses':
        navigate('/transport/buses')
        break
      case 'trains':
        navigate('/transport/trains')
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transport & Travel
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find the best transportation options for your Ethiopian adventure. 
            From flights to car rentals, we've got you covered.
          </p>
          
          {/* Quick Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <FaMapMarkedAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="From"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <FaMapMarkedAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="To"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3">
                <FaSearch className="mr-2" />
                Search All
              </Button>
            </div>
          </div>
        </div>

        {/* Transport Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {transportOptions.map((option) => (
            <TransportCard
              key={option.id}
              option={option}
              onSelect={() => handleTransportSelect(option.id)}
            />
          ))}
        </div>

        {/* Popular Routes Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Popular Routes in Ethiopia
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
              <FaPlane className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Historical Circuit</h3>
              <p className="text-gray-600 mb-4">Addis Ababa → Lalibela → Gondar → Axum</p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <FaClock className="mr-1" />
                <span>7-10 days</span>
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
              <FaCar className="text-4xl text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Omo Valley Adventure</h3>
              <p className="text-gray-600 mb-4">Addis Ababa → Arba Minch → Jinka → Turmi</p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <FaClock className="mr-1" />
                <span>5-7 days</span>
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl">
              <FaBus className="text-4xl text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Rift Valley Lakes</h3>
              <p className="text-gray-600 mb-4">Addis Ababa → Hawassa → Arba Minch</p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <FaClock className="mr-1" />
                <span>3-5 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaStar className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Compare prices across multiple providers to find the best deals for your journey.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Support</h3>
            <p className="text-gray-600">
              24/7 customer support with local knowledge to help you throughout your trip.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFilter className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Simple and secure booking process with instant confirmation and flexible options.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-6 opacity-90">
            Book your transportation now and explore the wonders of Ethiopia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/transport/flights')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <FaPlane className="mr-2" />
              Book Flights
            </Button>
            <Button 
              onClick={() => navigate('/transport/cars')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <FaCar className="mr-2" />
              Rent a Car
            </Button>
            <Button 
              onClick={() => navigate('/itinerary')}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <FaCalendarAlt className="mr-2" />
              Plan Itinerary
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransportPage