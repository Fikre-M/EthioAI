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
    BY_ID: (id: string) => `/api/bookings/${id}`,
    BY_NUMBER: (bookingNumber: string) => `/api/bookings/number/${bookingNumber}`,
    UPDATE: (id: string) => `/api/bookings/${id}`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
    UPDATE_STATUS: (id: string) => `/api/bookings/${id}/status`,
    MY_BOOKINGS: '/api/bookings/my-bookings',
    UPCOMING: '/api/bookings/upcoming',
    PAST: '/api/bookings/past',
    VALIDATE_PROMO: '/api/bookings/validate-promo',
    STATS: '/api/bookings/admin/stats',
  },
  PAYMENTS: {
    LIST: '/api/payments',
    BY_ID: (id: string) => `/api/payments/${id}`,
    MY_PAYMENTS: '/api/payments/my-payments',
    REFUND: (id: string) => `/api/payments/${id}/refund`,
    STATS: '/api/payments/admin/stats',
    STRIPE: {
      CREATE_INTENT: '/api/payments/stripe/create-intent',
      CONFIRM: '/api/payments/stripe/confirm',
      CONFIG: '/api/payments/stripe/config',
      WEBHOOK: '/api/payments/stripe/webhook',
    },
    CHAPA: {
      INITIALIZE: '/api/payments/chapa/initialize',
      VERIFY: (txRef: string) => `/api/payments/chapa/verify/${txRef}`,
      WEBHOOK: '/api/payments/chapa/webhook',
    },
  },
  MARKETPLACE: {
    PRODUCTS: {
      LIST: '/api/marketplace/products',
      CREATE: '/api/marketplace/products',
      BY_ID: (id: string) => `/api/marketplace/products/${id}`,
      UPDATE: (id: string) => `/api/marketplace/products/${id}`,
      DELETE: (id: string) => `/api/marketplace/products/${id}`,
      MY_PRODUCTS: '/api/marketplace/products/my-products',
      FEATURED: '/api/marketplace/products/featured',
      POPULAR: '/api/marketplace/products/popular',
      SEARCH: '/api/marketplace/products/search',
      BY_CATEGORY: (categoryId: string) => `/api/marketplace/products/category/${categoryId}`,
      BY_VENDOR: (vendorId: string) => `/api/marketplace/products/vendor/${vendorId}`,
      FILTERS: '/api/marketplace/products/filters',
      UPDATE_STATUS: (id: string) => `/api/marketplace/products/${id}/status`,
    },
    ORDERS: {
      LIST: '/api/marketplace/orders',
      CREATE: '/api/marketplace/orders',
      BY_ID: (id: string) => `/api/marketplace/orders/${id}`,
      UPDATE: (id: string) => `/api/marketplace/orders/${id}`,
      CANCEL: (id: string) => `/api/marketplace/orders/${id}/cancel`,
      MY_ORDERS: '/api/marketplace/orders/my-orders',
      RECENT: '/api/marketplace/orders/recent',
      SUMMARY: '/api/marketplace/orders/summary',
      BY_NUMBER: (orderNumber: string) => `/api/marketplace/orders/number/${orderNumber}`,
      VALIDATE_CART: '/api/marketplace/orders/validate-cart',
      UPDATE_STATUS: (id: string) => `/api/marketplace/orders/${id}/status`,
      VENDOR_ORDERS: '/api/marketplace/orders/vendor-orders',
    },
    VENDORS: {
      LIST: '/api/marketplace/vendors',
      BY_ID: (id: string) => `/api/marketplace/vendors/${id}`,
      CREATE_PROFILE: '/api/marketplace/vendors/profile',
      MY_PROFILE: '/api/marketplace/vendors/my-profile',
      UPDATE_PROFILE: (id: string) => `/api/marketplace/vendors/profile/${id}`,
      DASHBOARD: '/api/marketplace/vendors/dashboard',
      UPDATE_VERIFICATION: (id: string) => `/api/marketplace/vendors/${id}/verification`,
    },
    CATEGORIES: {
      LIST: '/api/marketplace/categories',
      CREATE: '/api/marketplace/categories',
      BY_ID: (id: string) => `/api/marketplace/categories/${id}`,
      UPDATE: (id: string) => `/api/marketplace/categories/${id}`,
      DELETE: (id: string) => `/api/marketplace/categories/${id}`,
    },
  },
  CHAT: {
    MESSAGES: {
      SEND: '/api/chat/messages',
      LIST: '/api/chat/messages',
      BY_ID: (id: string) => `/api/chat/messages/${id}`,
      UPDATE: (id: string) => `/api/chat/messages/${id}`,
      DELETE: (id: string) => `/api/chat/messages/${id}`,
      CLEAR_ALL: '/api/chat/messages',
      FEEDBACK: (id: string) => `/api/chat/messages/${id}/feedback`,
    },
    SUGGESTIONS: '/api/chat/suggestions',
    RECENT: '/api/chat/recent',
    EXPORT: '/api/chat/export',
    SUMMARY: '/api/chat/summary',
    HEALTH: '/api/chat/health',
    TEST: '/api/chat/test',
    STATS: '/api/chat/stats',
    TOPICS: '/api/chat/topics',
  },
  CULTURAL: {
    OVERVIEW: '/api/cultural/overview',
    CONTENT: {
      LIST: '/api/cultural/content',
      CREATE: '/api/cultural/content',
      BY_ID: (id: string) => `/api/cultural/content/${id}`,
      UPDATE: (id: string) => `/api/cultural/content/${id}`,
      DELETE: (id: string) => `/api/cultural/content/${id}`,
      UPDATE_STATUS: (id: string) => `/api/cultural/content/${id}/status`,
      INTERACT: (id: string) => `/api/cultural/content/${id}/interact`,
    },
    FEATURED: '/api/cultural/featured',
    POPULAR: '/api/cultural/popular',
    RECENT: '/api/cultural/recent',
    SEARCH: '/api/cultural/search',
    ADVANCED_SEARCH: '/api/cultural/advanced-search',
    RECOMMENDATIONS: '/api/cultural/recommendations',
    CATEGORIES: '/api/cultural/categories',
    TYPES: '/api/cultural/types',
    TAGS: '/api/cultural/tags',
    BY_TYPE: (type: string) => `/api/cultural/type/${type}`,
    BY_CATEGORY: (category: string) => `/api/cultural/category/${category}`,
    STATS: '/api/cultural/stats',
    BULK: '/api/cultural/bulk',
  },
} as const
