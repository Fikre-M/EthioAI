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
}
