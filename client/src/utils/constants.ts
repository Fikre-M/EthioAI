// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'EthioAI Tourism Platform'
export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'auth_token'

// Feature Flags
export const ENABLE_CHAT = import.meta.env.VITE_ENABLE_CHAT === 'true'
export const ENABLE_MARKETPLACE = import.meta.env.VITE_ENABLE_MARKETPLACE === 'true'

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
  SETTINGS: '/settings',
  BOOKINGS: '/bookings',
  TOURS: '/tours',
  DESTINATIONS: '/destinations',
  CULTURAL: '/cultural',
  MARKETPLACE: '/marketplace',
} as const

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: TOKEN_KEY,
  USER: 'auth_user',
  LANGUAGE: 'app_language',
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
