import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaBox, FaShippingFast, FaCheckCircle, FaTimes, FaEye,
  FaDownload, FaUndo, FaSearch, FaFilter, FaCalendar,
  FaTruck, FaMapMarkerAlt, FaClock, FaExclamationTriangle,
  FaStar, FaComment, FaPhone, FaEnvelope
} from 'react-icons/fa'

interface OrderItem {
  id: string
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  vendor: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    name: string
    address: string
    city: string
    country: string
    phone: string
  }
  tracking?: {
    carrier: string
    trackingNumber: string
    estimatedDelivery: string
    currentLocation: string
    updates: Array<{
      date: string
      status: string
      location: string
      description: string
    }>
  }
}

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'order-001',
      orderNumber: 'ETH-2024-001',
      date: '2024-01-20T10:30:00Z',
      status: 'shipped',
      items: [
        {
          id: 'item-001',
          productId: 'prod-001',
          name: 'Ethiopian Coffee Experience Set',
          image: '/products/coffee-set-1.jpg',
          price: 89.99,
          quantity: 2,
          vendor: 'Addis Coffee Roasters'
        },
        {
          id: 'item-002',
          productId: 'prod-002',
          name: 'Traditional Habesha Dress',
          image: '/products/dress-1.jpg',
          price: 149.99,
          quantity: 1,
          vendor: 'Ethiopian Heritage Clothing'
        }
      ],
      subtotal: 329.97,
      shipping: 15.99,
      tax: 27.50,
      total: 373.46,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'New York, NY 10001',
        country: 'United States',
        phone: '+1 (555) 123-4567'
      },
      tracking: {
        carrier: 'DHL Express',
        trackingNumber: 'DHL123456789',
        estimatedDelivery: '2024-01-25',
        currentLocation: 'New York Distribution Center',
        updates: [
          {
            date: '2024-01-23T14:30:00Z',
            status: 'In Transit',
            location: 'New York Distribution Center',
            description: 'Package arrived at distribution center'
          },
          {
            date: '2024-01-22T09:15:00Z',
            status: 'In Transit',
            location: 'JFK Airport',
            description: 'Package cleared customs'
          },
          {
            date: '2024-01-21T16:45:00Z',
            status: 'Shipped',
            location: 'Addis Ababa, Ethiopia',
            description: 'Package shipped from origin'
          }
        ]
      }
    }
  ]

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock />
      case 'confirmed': return <FaCheckCircle />
      case 'shipped': return <FaShippingFast />
      case 'delivered': return <FaBox />
      case 'cancelled': return <FaTimes />
      default: return <FaBox />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowTrackingModal(true)
  }

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as const }
          : order
      ))
      alert('Order cancelled successfully')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your marketplace orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start shopping to see your orders here'
              }
            </p>
            <Button
              onClick={() => navigate('/marketplace')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">Placed on {formatDate(order.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleViewOrder(order)}
                          size="sm"
                          variant="outline"
                        >
                          <FaEye className="mr-1" />
                          View
                        </Button>
                        {order.tracking && (
                          <Button
                            onClick={() => handleTrackOrder(order)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <FaTruck className="mr-1" />
                            Track
                          </Button>
                        )}
                        {order.status === 'pending' && (
                          <Button
                            onClick={() => handleCancelOrder(order.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.vendor}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  Order Details - #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2 capitalize">{selectedOrder.status}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Placed on {formatDate(selectedOrder.date)}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Items Ordered</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <p className="text-sm text-gray-600">{item.vendor}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Shipping Address</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-gray-600">{selectedOrder.shippingAddress.address}</p>
                    <p className="text-gray-600">{selectedOrder.shippingAddress.city}</p>
                    <p className="text-gray-600">{selectedOrder.shippingAddress.country}</p>
                    <p className="text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice(selectedOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(selectedOrder.tax)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Modal */}
        {showTrackingModal && selectedOrder?.tracking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Track Your Order</h3>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Tracking Info */}
                <div className="text-center">
                  <FaTruck className="text-4xl text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Order #{selectedOrder.orderNumber}
                  </h4>
                  <p className="text-gray-600">
                    Carrier: {selectedOrder.tracking.carrier}
                  </p>
                  <p className="text-gray-600">
                    Tracking: {selectedOrder.tracking.trackingNumber}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Estimated delivery: {formatDate(selectedOrder.tracking.estimatedDelivery)}
                  </p>
                </div>

                {/* Current Status */}
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <FaMapMarkerAlt className="text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Current Location</p>
                  <p className="text-blue-600">{selectedOrder.tracking.currentLocation}</p>
                </div>

                {/* Tracking Updates */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-4">Tracking History</h5>
                  <div className="space-y-4">
                    {selectedOrder.tracking.updates.map((update, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{update.status}</p>
                              <p className="text-sm text-gray-600">{update.description}</p>
                              <p className="text-sm text-gray-500">{update.location}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(update.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrdersPage