import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BookingItem, CartState, PromoCode } from '@/types/booking'

// Mock promo codes (in production, validate these on the backend)
export const AVAILABLE_PROMO_CODES: PromoCode[] = [
  {
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    minPurchase: 50,
  },
  {
    code: 'SUMMER20',
    discount: 20,
    type: 'percentage',
    minPurchase: 100,
    maxDiscount: 50,
  },
  {
    code: 'FIRST25',
    discount: 25,
    type: 'fixed',
    minPurchase: 75,
  },
  {
    code: 'HOLIDAY15',
    discount: 15,
    type: 'percentage',
    expiryDate: '2025-12-31',
  },
]

const calculateTotals = (state: CartState) => {
  state.subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0)
  state.totalItems = state.items.length
  
  // Calculate discount
  if (state.appliedPromo) {
    const promo = state.appliedPromo
    
    if (promo.type === 'percentage') {
      state.discount = (state.subtotal * promo.discount) / 100
      if (promo.maxDiscount) {
        state.discount = Math.min(state.discount, promo.maxDiscount)
      }
    } else {
      state.discount = promo.discount
    }
  } else {
    state.discount = 0
  }
  
  state.totalPrice = Math.max(0, state.subtotal - state.discount)
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  discount: 0,
  totalPrice: 0,
  appliedPromo: null,
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<BookingItem>) => {
      // Check if item already exists (same tour, same date)
      const existingIndex = state.items.findIndex(
        item => item.tourId === action.payload.tourId && item.date === action.payload.date
      )
      
      if (existingIndex !== -1) {
        // Update existing item
        state.items[existingIndex] = action.payload
      } else {
        // Add new item
        state.items.push(action.payload)
      }
      
      calculateTotals(state)
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      calculateTotals(state)
    },
    
    updateCartItem: (state, action: PayloadAction<BookingItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        calculateTotals(state)
      }
    },
    
    updateParticipants: (state, action: PayloadAction<{ id: string; adults: number; children: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        item.participants.adults = action.payload.adults
        item.participants.children = action.payload.children
        
        // Recalculate total price
        const participantsTotal = 
          (item.participants.adults * item.pricePerAdult) + 
          (item.participants.children * item.pricePerChild)
        const addOnsTotal = item.addOns?.reduce((sum, addon) => sum + addon.price, 0) || 0
        item.totalPrice = participantsTotal + addOnsTotal
        
        calculateTotals(state)
      }
    },
    
    applyPromoCode: (state, action: PayloadAction<string>) => {
      const code = action.payload.toUpperCase()
      const promo = AVAILABLE_PROMO_CODES.find(p => p.code === code)
      
      if (!promo) {
        return // Invalid code
      }
      
      // Check expiry
      if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
        return // Expired
      }
      
      // Check minimum purchase
      if (promo.minPurchase && state.subtotal < promo.minPurchase) {
        return // Doesn't meet minimum
      }
      
      state.appliedPromo = promo
      calculateTotals(state)
    },
    
    removePromoCode: (state) => {
      state.appliedPromo = null
      calculateTotals(state)
    },
    
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.subtotal = 0
      state.discount = 0
      state.totalPrice = 0
      state.appliedPromo = null
    },
  },
})

export const { 
  addToCart, 
  removeFromCart, 
  updateCartItem, 
  updateParticipants,
  applyPromoCode,
  removePromoCode,
  clearCart 
} = bookingSlice.actions

export default bookingSlice.reducer
