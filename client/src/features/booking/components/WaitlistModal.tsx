import { useState } from 'react'
import { Button } from '@components/common/Button/Button'
import { Input } from '@components/common/Input/Input'
import { bookingService, WaitlistRequest } from '@/services/bookingService'
import { FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
  tourId: string
  tourName: string
  date: string
  participants: {
    adults: number
    children: number
  }
}

export default function WaitlistModal({ 
  isOpen, 
  onClose, 
  tourId, 
  tourName, 
  date,
  participants 
}: WaitlistModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const waitlistData: WaitlistRequest = {
        tourId,
        date,
        email,
        name,
        participants,
      }

      await bookingService.joinWaitlist(waitlistData)
      setSuccess(true)
      
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setName('')
        setEmail('')
      }, 2000)
    } catch (err) {
      setError('Failed to join waitlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Join Waitlist</h2>
            <p className="text-sm text-gray-600 mt-1">{tourName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              You're on the waitlist!
            </h3>
            <p className="text-gray-600">
              We'll notify you if spots become available for {new Date(date).toLocaleDateString()}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-gray-700 mb-4">
                This tour is fully booked for {new Date(date).toLocaleDateString()}. 
                Join the waitlist and we'll notify you if spots become available.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Requested:</strong> {participants.adults} adult{participants.adults > 1 ? 's' : ''}
                {participants.children > 0 && `, ${participants.children} child${participants.children > 1 ? 'ren' : ''}`}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Joining...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
