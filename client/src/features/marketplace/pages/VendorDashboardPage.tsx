import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaChartLine, FaShoppingBag,
  FaDollarSign, FaUsers, FaStar, FaEnvelope, FaBox, FaTruck,
  FaCalendar, FaFilter, FaSearch, FaDownload, FaUpload,
  FaImage, FaTimes, FaCheckCircle, FaExclamationTriangle,
  FaClock, FaArrowUp, FaArrowDown, FaPercent, FaHeart
} from 'react-icons/fa'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  averageRating: number
  pendingOrders: number
  lowStockProducts: number
  monthlyGrowth: number
  conversionRate: number
}

interface VendorProduct {
  id: string
  name: string
  image: string
  price: number
  stock: number
  status: 'active' | 'inactive' | 'out-of-stock'
  sales: number
  views: number
  rating: number
  reviewCount: number
  createdAt: string
}

interface VendorOrder {
  id: string
  orderNumber: string
  customerName: string
  items: Array<{
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  date: string
}

interface CustomerMessage {
  id: string
  customerName: string
  customerAvatar: string
  subject: string
  message: string
  date: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
}

const VendorDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'messages' | 'analytics'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null)
  
  // Dashboard data
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageRating: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    monthlyGrowth: 0,
    conversionRate: 0
  })
  
  const [products, setProducts] = useState<VendorProduct[]>([])
  const [orders, setOrders] = useState<VendorOrder[]>([])
  const [messages, setMessages] = useState<CustomerMessage[]>([])

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [] as File[],
    features: [] as string[],
    tags: [] as string[]
  })

  // Mock data
  const mockStats: DashboardStats = {
    totalRevenue: 45250.75,
    totalOrders: 1247,
    totalProducts: 45,
    averageRating: 4.9,
    pendingOrders: 12,
    lowStockProducts: 3,
    monthlyGrowth: 15.3,
    conversionRate: 3.2
  }

  const mockProducts: VendorProduct[] = [
    {
      id: 'prod-001',
      name: 'Ethiopian Coffee Experience Set',
      image: '/products/coffee-set-1.jpg',
      price: 89.99,
      stock: 25,
      status: 'active',
      sales: 156,
      views: 2340,
      rating: 4.8,
      reviewCount: 89,
      createdAt: '2024-01-15'
    }
  ]

  const mockOrders: VendorOrder[] = [
    {
      id: 'order-001',
      orderNumber: 'ETH-2024-001',
      customerName: 'John Doe',
      items: [
        { productName: 'Ethiopian Coffee Experience Set', quantity: 2, price: 89.99 }
      ],
      total: 179.98,
      status: 'pending',
      date: '2024-01-20T10:30:00Z'
    }
  ]

  const mockMessages: CustomerMessage[] = [
    {
      id: 'msg-001',
      customerName: 'Sarah Johnson',
      customerAvatar: '/avatars/sarah.jpg',
      subject: 'Question about coffee brewing',
      message: 'Hi, I purchased your coffee set and have a question about the traditional brewing method...',
      date: '2024-01-20T14:30:00Z',
      isRead: false,
      priority: 'medium'
    }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    // Simulate API calls
    setTimeout(() => {
      setStats(mockStats)
      setProducts(mockProducts)
      setOrders(mockOrders)
      setMessages(mockMessages)
      setIsLoading(false)
    }, 1000)
  }

  const handleAddProduct = () => {
    // Validate form
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields')
      return
    }

    const product: VendorProduct = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      image: '/products/placeholder.jpg',
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: 'active',
      sales: 0,
      views: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    }

    setProducts([...products, product])
    setNewProduct({
      name: '', description: '', price: '', stock: '', category: '',
      images: [], features: [], tags: []
    })
    setShowAddProductModal(false)
    alert('Product added successfully!')
  }

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
      alert('Product deleted successfully!')
    }
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: VendorOrder['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    alert('Order status updated!')
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
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'out-of-stock': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your products, orders, and business analytics</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartLine },
              { id: 'products', label: 'Products', icon: FaShoppingBag },
              { id: 'orders', label: 'Orders', icon: FaBox },
              { id: 'messages', label: 'Messages', icon: FaEnvelope },
              { id: 'analytics', label: 'Analytics', icon: FaChartLine }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2" />
                {tab.label}
                {tab.id === 'messages' && messages.filter(m => !m.isRead).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {messages.filter(m => !m.isRead).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaDollarSign className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                  <span className="text-sm text-green-600">+{stats.monthlyGrowth}% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaBox className="text-blue-600 text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">{stats.pendingOrders} pending orders</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaShoppingBag className="text-purple-600 text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-red-600">{stats.lowStockProducts} low stock</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FaStar className="text-yellow-600 text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">{stats.conversionRate}% conversion rate</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <Button
                    onClick={() => setActiveTab('orders')}
                    size="sm"
                    variant="outline"
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                  <Button
                    onClick={() => setActiveTab('products')}
                    size="sm"
                    variant="outline"
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 text-sm mr-1" />
                          <span className="text-sm text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Products</h2>
                <p className="text-gray-600">Manage your product catalog</p>
              </div>
              <Button
                onClick={() => setShowAddProductModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FaPlus className="mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg mr-4"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.views} views</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900">{product.sales}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <FaEye />
                            </Button>
                            <Button size="sm" variant="outline">
                              <FaEdit />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Orders</h2>
              <p className="text-gray-600">Manage customer orders</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900">{order.customerName}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{formatPrice(order.total)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                            className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-600">{formatDate(order.date)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button size="sm" variant="outline">
                            <FaEye />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customer Messages</h2>
              <p className="text-gray-600">Respond to customer inquiries</p>
            </div>

            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`bg-white rounded-lg shadow-sm p-6 ${!message.isRead ? 'border-l-4 border-blue-500' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={message.customerAvatar}
                        alt={message.customerName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{message.customerName}</h4>
                          {!message.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(message.date)}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      message.priority === 'high' ? 'bg-red-100 text-red-800' :
                      message.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {message.priority} priority
                    </span>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">{message.subject}</h5>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Reply
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="traditional-clothing">Traditional Clothing</option>
                      <option value="coffee-spices">Coffee & Spices</option>
                      <option value="handicrafts">Handicrafts</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="art-paintings">Art & Paintings</option>
                      <option value="home-decor">Home Decor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop images here, or click to select</p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowAddProductModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddProduct}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add Product
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorDashboardPage