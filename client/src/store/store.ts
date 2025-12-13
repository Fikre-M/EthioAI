import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import chatReducer from './slices/chatSlice'
import tourReducer from './slices/tourSlice'
import bookingReducer from './slices/bookingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    tours: tourReducer,
    booking: bookingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
