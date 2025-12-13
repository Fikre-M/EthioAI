// import axios from '@/api/axios.config' // Uncomment when using real API

export interface AvailabilityResponse {
  available: boolean
  spotsLeft: number
  totalCapacity: number
  isFullyBooked: boolean
  waitlistAvailable: boolean
}

export interface WaitlistRequest {
  tourId: string
  date: string
  email: string
  name: string
  participants: {
    adults: number
    children: number
  }
}

// Mock availability data (replace with real API calls)
const MOCK_AVAILABILITY: Record<string, AvailabilityResponse> = {
  '1-2024-12-20': { available: true, spotsLeft: 3, totalCapacity: 20, isFullyBooked: false, waitlistAvailable: false },
  '1-2024-12-21': { available: true, spotsLeft: 15, totalCapacity: 20, isFullyBooked: false, waitlistAvailable: false },
  '1-2024-12-25': { available: false, spotsLeft: 0, totalCapacity: 20, isFullyBooked: true, waitlistAvailable: true },
}

export const bookingService = {
  // Check availability for a specific tour and date
  checkAvailability: async (tourId: string, date: string): Promise<AvailabilityResponse> => {
    try {
      // In production, use real API:
      // const response = await axios.get(`/api/tours/${tourId}/availability`, { params: { date } })
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      
      const key = `${tourId}-${date}`
      return MOCK_AVAILABILITY[key] || {
        available: true,
        spotsLeft: Math.floor(Math.random() * 15) + 5,
        totalCapacity: 20,
        isFullyBooked: false,
        waitlistAvailable: false,
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      throw error
    }
  },

  // Add item to cart
  addToCart: async (cartItem: any) => {
    try {
      // In production:
      // const response = await axios.post('/api/cart', cartItem)
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, item: cartItem }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  },

  // Update cart item
  updateCartItem: async (itemId: string, updates: any) => {
    try {
      // In production:
      // const response = await axios.put(`/api/cart/${itemId}`, updates)
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, itemId, updates }
    } catch (error) {
      console.error('Error updating cart item:', error)
      throw error
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId: string) => {
    try {
      // In production:
      // const response = await axios.delete(`/api/cart/${itemId}`)
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, itemId }
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  },

  // Validate promo code
  validatePromoCode: async (code: string, _cartTotal: number) => {
    try {
      // In production:
      // const response = await axios.post('/api/promo/validate', { code, cartTotal })
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // This is handled in bookingSlice, but could be validated server-side
      return { valid: true, code }
    } catch (error) {
      console.error('Error validating promo code:', error)
      throw error
    }
  },

  // Join waitlist
  joinWaitlist: async (waitlistData: WaitlistRequest) => {
    try {
      // In production:
      // const response = await axios.post('/api/waitlist', waitlistData)
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500))
      return { 
        success: true, 
        message: 'Successfully added to waitlist. We\'ll notify you if spots become available.',
        waitlistData 
      }
    } catch (error) {
      console.error('Error joining waitlist:', error)
      throw error
    }
  },

  // Get user's bookings
  getUserBookings: async (_filters?: { status?: string; search?: string }) => {
    try {
      // In production:
      // const response = await axios.get('/api/bookings', { params: filters })
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // This would return actual user bookings from the API
      return {
        success: true,
        bookings: [], // Will be populated by the component with mock data
        total: 0
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw error
    }
  },

  // Create a new booking
  createBooking: async (bookingData: any) => {
    try {
      // In production:
      // const response = await axios.post('/api/bookings', bookingData)
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const bookingReference = `ETH-${Date.now().toString().slice(-6)}`
      return {
        success: true,
        booking: {
          id: Date.now().toString(),
          bookingReference,
          ...bookingData,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  },

  // Cancel a booking
  cancelBooking: async (bookingId: string, _reason?: string) => {
    try {
      // In production:
      // const response = await axios.put(`/api/bookings/${bookingId}/cancel`, { reason })
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      return {
        success: true,
        message: 'Booking cancelled successfully. Refund will be processed within 3-5 business days.',
        bookingId,
        refundAmount: 0, // Would be calculated based on cancellation policy
        refundStatus: 'processing'
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  },

  // Get booking details
  getBookingDetails: async (bookingId: string) => {
    try {
      // In production:
      // const response = await axios.get(`/api/bookings/${bookingId}`)
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        success: true,
        booking: {
          id: bookingId,
          // Would return full booking details
        }
      }
    } catch (error) {
      console.error('Error fetching booking details:', error)
      throw error
    }
  },

  // Download booking ticket/receipt
  downloadTicket: async (bookingId: string, type: 'ticket' | 'receipt' = 'ticket') => {
    try {
      // In production:
      // const response = await axios.get(`/api/bookings/${bookingId}/download/${type}`, {
      //   responseType: 'blob'
      // })
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800))
      
      return {
        success: true,
        message: `${type} download started`,
        downloadUrl: `#${type}-${bookingId}` // Would be actual download URL
      }
    } catch (error) {
      console.error(`Error downloading ${type}:`, error)
      throw error
    }
  },
}
