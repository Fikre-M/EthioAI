import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { RootState } from '@store/store'
import { Button } from '@components/common/Button/Button'
import { Card, CardContent } from '@components/common/Card'
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers, FaQrcode, FaDownload, FaTimes, FaFilter, FaSearch } from 'react-icons/fa'

interface Booking {
  id: string
  tourName: string
  tourImage: string
  date: string
  participants: {
    adults: number
    children: number
  }
  totalPrice: number
  currency: string
  status: 'upcoming' | 'completed' | 'cancelled'
  bookingReference: string
  meetingPoint: string
  duration: string
  paymentStatus: 'paid' | 'pending' | 'refunded'
  createdAt: string
  qrCode?: string
}

// Mock bookings data - replace with API call
const mockBookings: Booking[] = [
  {
    id: '1',
    tourName: 'Lalibela Rock Churches Tour',
    tourImage: '/images/lalibela.jpg',
    date: '2025-01-15',
    participants: { adults: 2, children: 0 },
    totalPrice: 598,
    currency: 'USD',
    status: 'upcoming',
    bookingReference: 'ETH-2025001',
    meetingPoint: 'Lalibela Airport',
    duration: '3 Days / 2 Nights',
    paymentStatus: 'paid',
    createdAt: '2024-12-10T10:30:00Z',
    qrCode: 'https://ethioai-tours.com/booking/ETH-2025001'
  },
  {
    id: '2',
    tourName: 'Simien Mountains Trekking',
    tourImage: '/images/simien.jpg',
    date: '2024-11-20',
    participants: { adults: 1, children: 1 },
    totalPrice: 450,
    currency: 'USD',
    status: 'completed',
    bookingReference: 'ETH-2024089',
    meetingPoint: 'Gondar City Center',
    duration: '4 Days / 3 Nights',
    paymentStatus: 'paid',
    createdAt: '2024-11-15T14:20:00Z'
  },
  {
    id: '3',
    tourName: 'Danakil Depression Adventure',
    tourImage: '/images/danakil.jpg',
    date: '2024-12-25',
    participants: { adults: 3, children: 0 },
    totalPrice: 897,
    currency: 'USD',
    status: 'cancelled',
    bookingReference: 'ETH-2024156',
    meetingPoint: 'Mekelle Airport',
    duration: '5 Days / 4 Nights',
    paymentStatus: 'refunded',
    createdAt: '2024-12-05T09:15:00Z'
  }
]

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate()
  // const { user } = useSelector((state: RootState) => state.auth) // TODO: Use for user-specific bookings
  
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(mockBookings)
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchUserBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [activeFilter, searchTerm, bookings])

  const filterBookings = () => {
    let filtered = bookings

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === activeFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredBookings(filtered)
  }

  const handleCancelBooking = async (bookingId: string) => {
    setLoading(true)
    try {
      // TODO: API call to cancel booking
      // await bookingService.cancelBooking(bookingId)
      
      // Mock cancellation
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' as const, paymentStatus: 'refunded' as const }
          : booking
      ))
      
      setShowCancelModal(false)
      setSelectedBooking(null)
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'refunded': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const downloadTicket = (booking: Booking) => {
    // TODO: Implement PDF ticket download
    alert(`Downloading ticket for ${booking.bookingReference}`)
  }

  const viewQRCode = (booking: Booking) => {
    // TODO: Show QR code modal or navigate to QR code page
    alert(`Showing QR code for ${booking.bookingReference}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your tour bookings and view booking history</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaFilter className="inline mr-2" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || activeFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : "You haven't made any bookings yet"
                }
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/tours')}
              >
                Browse Tours
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="md:flex">
                    {/* Tour Image */}
                    <div className="md:w-48 h-48 md:h-auto bg-gray-200 flex items-center justify-center">
                      <div className="text-4xl">🏔️</div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{booking.tourName}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <FaCalendar className="mr-2 text-blue-600" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-2 text-red-600" />
                              <span>{booking.meetingPoint}</span>
                            </div>
                            <div className="flex items-center">
                              <FaClock className="mr-2 text-green-600" />
                              <span>{booking.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <FaUsers className="mr-2 text-purple-600" />
                              <span>{booking.participants.adults} Adults{booking.participants.children > 0 && `, ${booking.participants.children} Children`}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-gray-900">
                              Booking: {booking.bookingReference}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="mt-4 md:mt-0 md:ml-6 text-right">
                          <div className="text-2xl font-bold text-gray-900 mb-4">
                            {formatPrice(booking.totalPrice, booking.currency)}
                          </div>

                          <div className="flex flex-col gap-2">
                            {booking.status === 'upcoming' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadTicket(booking)}
                                  className="flex items-center justify-center"
                                >
                                  <FaDownload className="mr-2" />
                                  Download Ticket
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => viewQRCode(booking)}
                                  className="flex items-center justify-center"
                                >
                                  <FaQrcode className="mr-2" />
                                  Show QR Code
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(booking)
                                    setShowCancelModal(true)
                                  }}
                                  className="flex items-center justify-center text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <FaTimes className="mr-2" />
                                  Cancel Booking
                                </Button>
                              </>
                            )}
                            {booking.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadTicket(booking)}
                                className="flex items-center justify-center"
                              >
                                <FaDownload className="mr-2" />
                                Download Receipt
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Cancel Booking Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Booking</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your booking for "{selectedBooking.tourName}"? 
                This action cannot be undone and refund processing may take 3-5 business days.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-yellow-800 mb-2">Cancellation Policy</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Free cancellation up to 24 hours before tour</li>
                  <li>• 50% refund for cancellations within 24 hours</li>
                  <li>• No refund for same-day cancellations</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelModal(false)
                    setSelectedBooking(null)
                  }}
                  className="flex-1"
                >
                  Keep Booking
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Cancelling...' : 'Cancel Booking'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookingsPage