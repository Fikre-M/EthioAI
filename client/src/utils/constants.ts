// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'EthioAI Tourism Platform'
export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'auth_token'

// Feature Flags
export const ENABLE_CHAT = import.meta.env.VITE_ENABLE_CHAT === 'true'
export const ENABLE_MARKETPLACE = import.meta.env.VITE_ENABLE_MARKETPLACE === 'true'
export const ENABLE_TRANSPORT = import.meta.env.VITE_ENABLE_TRANSPORT === 'true'
export const ENABLE_CULTURAL = import.meta.env.VITE_ENABLE_CULTURAL === 'true'
export const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true'

// Validation Constants
export const PASSWORD_MIN_LENGTH = 8
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  SETTINGS: '/settings',
  BOOKINGS: '/bookings',
  MY_BOOKINGS: '/my-bookings',
  CART: '/cart',
  CHECKOUT: '/checkout',
  TOURS: '/tours',
  DESTINATIONS: '/destinations',
  CULTURAL: '/cultural',
  MARKETPLACE: '/marketplace',
  TRANSPORT: '/transport',
  ITINERARY: '/itinerary',
  REVIEWS: '/reviews',
  PAYMENT: '/payment',
  CONFIRMATION: '/confirmation',
} as const

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: TOKEN_KEY,
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user',
  LANGUAGE: 'app_language',
  CART: 'booking_cart',
} as const

// Supported Languages
export const LANGUAGES = {
  EN: 'en',
  AM: 'am',
  OM: 'om',
} as const

export const LANGUAGE_NAMES = {
  [LANGUAGES.EN]: 'English',
  [LANGUAGES.AM]: 'አማርኛ',
  [LANGUAGES.OM]: 'Afaan Oromoo',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    REFRESH: '/api/auth/refresh',
  },
  TOURS: {
    LIST: '/api/tours',
    DETAIL: (id: string) => `/api/tours/${id}`,
    SEARCH: '/api/tours/search',
    FEATURED: '/api/tours/featured',
    POPULAR: '/api/tours/popular',
    CATEGORIES: '/api/tours/categories',
    CATEGORY: (category: string) => `/api/tours/category/${category}`,
    AVAILABILITY: (id: string) => `/api/tours/${id}/availability`,
    STATUS: (id: string) => `/api/tours/${id}/status`,
  },
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    DETAIL: (id: string) => `/api/bookings/${id}`,
  },
  PAYMENTS: {
    CREATE_INTENT: '/api/payments/create-payment-intent',
    CONFIG: '/api/payments/config',
    HISTORY: '/api/payments/history',
  },
} as const
