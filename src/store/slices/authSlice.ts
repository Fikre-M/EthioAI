import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@services/authService'
import { getToken, getUser, clearAuth } from '@utils/storage'
import type { 
  AuthState, 
  LoginCredentials, 
  RegisterData, 
  User,
  AuthResponse 
} from '@features/auth/types/auth.types'

// Initial state
const initialState: AuthState = {
  user: getUser<User>(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  isLoading: false,
  error: null,
}

// Async thunks
export const loginAsync = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      )
    }
  }
)

export const registerAsync = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.register(data)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      )
    }
  }
)

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout()
  }
)

export const checkAuthAsync = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser()
      return user
    } catch (error: any) {
      clearAuth()
      return rejectWithValue('Session expired')
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearAuthState: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      clearAuth()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Login failed'
      })

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Registration failed'
      })

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })

    // Check Auth
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

// Actions
export const { setUser, clearAuthState, clearError } = authSlice.actions

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading
export const selectError = (state: { auth: AuthState }) => state.auth.error

// Reducer
export default authSlice.reducer
