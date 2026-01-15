import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { api } from './axios.config'
import { getToken, getRefreshToken, setToken, clearAuth } from '@utils/storage'

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

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

// Response interceptor - handle errors globally and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', {
            refreshToken: refreshToken
          });
          
          const { accessToken } = response.data.data.tokens;
          setToken(accessToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          processQueue(null, accessToken);
          
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearAuth();
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available
        clearAuth();
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied - insufficient permissions');
      // Could show a toast notification here
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }
    
    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      console.error('Validation error:', error.response.data);
    }
    
    // Handle 429 Rate Limit
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded - please try again later');
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error - please try again later');
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - unable to connect to server');
    }
    
    return Promise.reject(error)
  }
)

export default api
