import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@components/common/Button/Button'
import { 
  FaCheckCircle, 
  FaCalendar, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaClock, 
  FaDownload, 
  FaPrint,
  FaEnvelope,
  FaPhone,
  FaShieldAlt
} from 'react-icons/fa'

interface BookingConfirmation {
  bookingId: string
  checkoutData: any
  paymentData: any
  items: any[]
  totalPrice: number
  appliedPromo: any
  insuranceCost: number
  paymentStatus: string
  bookingDate: string
}

export default function ConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const bookingConfirmation = location.state?.bookingConfirmation as BookingConfirmation

  useEffect(() => {
    // Send confirmation email (in production)
    if (bookingConfirmation) {
      console.log('Sending confirmation email...', bookingConfirmation)
    }
  }, [bookingConfirmation])

  if (!bookingConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              We couldn't find your booking confirmation.
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { bookingId, checkoutData, items, totalPrice, appliedPromo, insuranceCost } = bookingConfirmation

  const handleDownloadConfirmation = () => {
    // In production, generate and download PDF
    console.log('Downloading confirmation PDF...')
  }

  const handlePrintConfirmation = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your booking. Your adventure awaits!
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-yellow-600 px-6 py-4">
            <div className="flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold">Booking Confirmation</h2>
                <p className="text-orange-100">Booking ID: {bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-orange-100">Booking Date</p>
                <p className="font-semibold">
                  {new Date(bookingConfirmation.bookingDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">
                    {checkoutData.contactInfo.firstName} {checkoutData.contactInfo.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{checkoutData.contactInfo.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{checkoutData.contactInfo.phone}</span>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <span className="ml-2 font-medium">
                    {checkoutData.contactInfo.city}, {checkoutData.contactInfo.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Booked Tours */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tours</h3>
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.tourImage}
                        alt={item.tourName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.tourName}
                        </h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaCalendar className="w-4 h-4 mr-2 text-orange-500" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUsers className="w-4 h-4 mr-2 text-orange-500" />
                            <span>
                              {item.participants.adults} Adult{item.participants.adults > 1 ? 's' : ''}
                              {item.participants.children > 0 && 
                                `, ${item.participants.children} Child${item.participants.children > 1 ? 'ren' : ''}`
                              }
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-orange-500" />
                            <span>{item.meetingPoint}</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="w-4 h-4 mr-2 text-orange-500" />
                            <span>{item.duration}</span>
                          </div>
                        </div>

                        {/* Add-ons */}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Add-ons:</p>
                            <div className="flex flex-wrap gap-2">
                              {item.addOns.map((addon: any) => (
                                <span
                                  key={addon.id}
                                  className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                                >
                                  {addon.name} (+${addon.price})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Special Requests */}
                        {item.specialRequests && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">Special Requests:</p>
                            <p className="text-sm text-gray-600">{item.specialRequests}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${item.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travelers */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travelers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checkoutData.travelers.map((traveler: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Traveler {index + 1}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Name:</span> {traveler.firstName} {traveler.lastName}</p>
                      <p><span className="text-gray-600">Date of Birth:</span> {traveler.dateOfBirth}</p>
                      <p><span className="text-gray-600">Nationality:</span> {traveler.nationality}</p>
                      {traveler.dietaryRequirements && (
                        <p><span className="text-gray-600">Dietary:</span> {traveler.dietaryRequirements}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{checkoutData.emergencyContact.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Relationship:</span>
                    <span className="ml-2 font-medium">{checkoutData.emergencyContact.relationship}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{checkoutData.emergencyContact.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{checkoutData.emergencyContact.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(totalPrice - insuranceCost).toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.code}):</span>
                      <span>-${appliedPromo.discount}</span>
                    </div>
                  )}
                  {insuranceCost > 0 && (
                    <div className="flex justify-between">
                      <span>Travel Insurance:</span>
                      <span>${insuranceCost}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total Paid:</span>
                    <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            variant="primary"
            onClick={handleDownloadConfirmation}
            className="flex items-center justify-center gap-2"
          >
            <FaDownload />
            Download Confirmation
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePrintConfirmation}
            className="flex items-center justify-center gap-2"
          >
            <FaPrint />
            Print Confirmation
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2"
          >
            Back to Home
          </Button>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Important Information</h3>
          <div className="space-y-3 text-blue-800 text-sm">
            <div className="flex items-start gap-2">
              <FaEnvelope className="w-4 h-4 mt-0.5 text-blue-600" />
              <p>A confirmation email has been sent to {checkoutData.contactInfo.email}</p>
            </div>
            <div className="flex items-start gap-2">
              <FaPhone className="w-4 h-4 mt-0.5 text-blue-600" />
              <p>Our team will contact you 24-48 hours before your tour with final details</p>
            </div>
            <div className="flex items-start gap-2">
              <FaShieldAlt className="w-4 h-4 mt-0.5 text-blue-600" />
              <p>Free cancellation up to 24 hours before your tour starts</p>
            </div>
            <div className="flex items-start gap-2">
              <FaCalendar className="w-4 h-4 mt-0.5 text-blue-600" />
              <p>Please arrive at the meeting point 15 minutes before the scheduled time</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help or have questions about your booking?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
            <Button variant="outline" onClick={() => navigate('/tours')}>
              Book Another Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}