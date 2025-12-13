// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  ME: '/api/auth/me',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
} as const

// Future endpoints can be added here
export const USER_ENDPOINTS = {
  PROFILE: '/api/user/profile',
  UPDATE_PROFILE: '/api/user/profile',
} as const

export const TOUR_ENDPOINTS = {
  LIST: '/api/tours',
  DETAIL: (id: string) => `/api/tours/${id}`,
} as const
