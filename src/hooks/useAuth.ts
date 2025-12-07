import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import type { AppDispatch } from '@store/store'
import {
  loginAsync,
  registerAsync,
  logoutAsync,
  checkAuthAsync,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  clearError,
} from '@store/slices/authSlice'
import type { LoginCredentials, RegisterData } from '@features/auth/types/auth.types'

/**
 * Custom hook for authentication
 * Provides easy access to auth state and actions
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  
  // Selectors
  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)

  // Actions
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return dispatch(loginAsync(credentials)).unwrap()
    },
    [dispatch]
  )

  const register = useCallback(
    async (data: RegisterData) => {
      return dispatch(registerAsync(data)).unwrap()
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    return dispatch(logoutAsync()).unwrap()
  }, [dispatch])

  const checkAuth = useCallback(async () => {
    return dispatch(checkAuthAsync()).unwrap()
  }, [dispatch])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    auth,
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    clearError: clearAuthError,
  }
}

export default useAuth
