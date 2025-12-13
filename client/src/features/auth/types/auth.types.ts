export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface ForgotPasswordData {
  email: string
}

export interface AuthResponse {
  user: User
  token: string
}
