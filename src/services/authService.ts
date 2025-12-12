import { api } from '@api/axios.config'
import { AUTH_ENDPOINTS } from '@api/endpoints'
import { setToken, setUser, clearAuth } from '@utils/storage'
import type { 
  LoginCredentials, 
  RegisterData, 
  ForgotPasswordData, 
  AuthResponse, 
  User 
} from '@features/auth/types/auth.types'

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials)
      
      // Store token and user data
      if (response.data.token) {
        setToken(response.data.token)
        setUser(response.data.user)
      }
      
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      
      // Optionally auto-login after registration
      if (response.data.token) {
        setToken(response.data.token)
        setUser(response.data.user)
      }
      
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data)
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error
    }
  }

  /**
   * Get current user data
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>(AUTH_ENDPOINTS.ME)
      
      // Update stored user data
      setUser(response.data)
      
      return response.data
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional - depends on backend)
      await api.post(AUTH_ENDPOINTS.LOGOUT)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local auth data
      clearAuth()
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token')
    return !!token
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
