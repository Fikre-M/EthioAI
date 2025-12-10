import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { api } from './axios.config'
import { getToken, clearAuth } from '@utils/storage'

// Request interceptor - attach token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401) {
      clearAuth()
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied')
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found')
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error')
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - unable to connect to server')
    }
    
    return Promise.reject(error)
  }
)

export default api
