import { api } from '@api/axios.config'

// Types
export interface FlightSearchRequest {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: {
    adults: number
    children?: number
    infants?: number
  }
  class?: 'economy' | 'premium_economy' | 'business' | 'first'
  tripType?: 'one_way' | 'round_trip' | 'multi_city'
  directFlightsOnly?: boolean
  maxStops?: number
  preferredAirlines?: string[]
  maxPrice?: number
  currency?: string
}

export interface CarRentalSearchRequest {
  pickupLocation: string
  dropoffLocation?: string
  pickupDate: string
  pickupTime?: string
  dropoffDate: string
  dropoffTime?: string
  driverAge: number
  carType?: 'economy' | 'compact' | 'midsize' | 'fullsize' | 'suv' | 'luxury' | 'van' | '4wd'
  transmission?: 'automatic' | 'manual'
  fuelType?: 'petrol' | 'diesel' | 'hybrid' | 'electric'
  airConditioning?: boolean
  unlimitedMileage?: boolean
  currency?: string
  maxPrice?: number
}

export interface BusSearchRequest {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  busType?: 'standard' | 'luxury' | 'sleeper' | 'express'
  departureTime?: 'morning' | 'afternoon' | 'evening' | 'night'
  maxPrice?: number
  currency?: string
}

export interface TransportBookingRequest {
  transportType: 'flight' | 'car_rental' | 'bus' | 'train' | 'taxi'
  providerId: string
  serviceId: string
  bookingReference?: string
  travelers: Array<{
    type: 'adult' | 'child' | 'infant'
    title?: 'Mr' | 'Mrs' | 'Ms' | 'Dr'
    firstName: string
    lastName: string
    dateOfBirth?: string
    passportNumber?: string
    nationality?: string
    email?: string
    phone?: string
  }>
  totalPrice: number
  currency: string
  contactInfo: {
    email: string
    phone: string
    emergencyContact?: {
      name: string
      phone: string
      relationship?: string
    }
  }
  specialRequests?: string
  paymentMethod?: 'stripe' | 'chapa' | 'telebirr' | 'cbe_birr'
}

export interface TransportBooking {
  id: string
  userId: string
  transportType: 'flight' | 'car_rental' | 'bus' | 'train' | 'taxi'
  providerId: string
  serviceId: string
  bookingReference: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  travelers: any[]
  totalPrice: number
  currency: string
  contactInfo: any
  specialRequests?: string
  route?: {
    origin: string
    destination: string
    departureDate: string
    returnDate?: string
  }
  createdAt: string
  updatedAt: string
}

export interface PopularRoute {
  origin: string
  destination: string
  transportType: string
  bookingCount: number
  averagePrice: number
  currency: string
}

// Transport Service
export const transportService = {
  /**
   * Search flights
   * @param data - Flight search parameters
   * @returns Available flights
   */
  searchFlights: async (data: FlightSearchRequest): Promise<any[]> => {
    try {
      const response = await api.post<{ flights: any[] }>('/transport/flights/search', data)
      return response.data.flights
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to search flights. Please try again.'
      )
    }
  },

  /**
   * Search car rentals
   * @param data - Car rental search parameters
   * @returns Available car rentals
   */
  searchCarRentals: async (data: CarRentalSearchRequest): Promise<any[]> => {
    try {
      const response = await api.post<{ cars: any[] }>('/transport/cars/search', data)
      return response.data.cars
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to search car rentals. Please try again.'
      )
    }
  },

  /**
   * Search buses
   * @param data - Bus search parameters
   * @returns Available buses
   */
  searchBuses: async (data: BusSearchRequest): Promise<any[]> => {
    try {
      const response = await api.post<{ buses: any[] }>('/transport/buses/search', data)
      return response.data.buses
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to search buses. Please try again.'
      )
    }
  },

  /**
   * Search all transport types
   * @param data - Search parameters with transport type
   * @returns Transport options
   */
  searchAllTransport: async (data: {
    type: 'flight' | 'car' | 'bus' | 'all'
    [key: string]: any
  }): Promise<{
    flights?: any[]
    cars?: any[]
    buses?: any[]
  }> => {
    try {
      const response = await api.post('/transport/search', data)
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to search transport options. Please try again.'
      )
    }
  },

  /**
   * Get transport options for a specific route
   * @param origin - Origin location
   * @param destination - Destination location
   * @param date - Travel date (optional)
   * @returns Available transport options for the route
   */
  getRouteOptions: async (
    origin: string, 
    destination: string, 
    date?: string
  ): Promise<{
    flights: any[]
    buses: any[]
    route: { origin: string; destination: string; date?: string }
    totalOptions: number
  }> => {
    try {
      const response = await api.get('/transport/route-options', {
        params: { origin, destination, date },
      })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get route options. Please try again.'
      )
    }
  },

  /**
   * Get popular routes
   * @param params - Query parameters
   * @returns Popular transport routes
   */
  getPopularRoutes: async (params?: {
    transportType?: 'flight' | 'car_rental' | 'bus' | 'train' | 'taxi'
    limit?: number
    period?: 'week' | 'month' | 'quarter' | 'year'
  }): Promise<PopularRoute[]> => {
    try {
      const response = await api.get<{ routes: PopularRoute[] }>('/transport/popular-routes', {
        params,
      })
      return response.data.routes
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load popular routes.'
      )
    }
  },

  /**
   * Create transport booking
   * @param data - Booking data
   * @returns Created booking
   */
  createBooking: async (data: TransportBookingRequest): Promise<TransportBooking> => {
    try {
      const response = await api.post<{ booking: TransportBooking }>('/transport/bookings', data)
      return response.data.booking
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to create transport booking. Please try again.'
      )
    }
  },

  /**
   * Get user's transport bookings
   * @param params - Query parameters
   * @returns User's bookings with pagination
   */
  getMyBookings: async (params?: {
    page?: number
    limit?: number
    transportType?: string
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{
    bookings: TransportBooking[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> => {
    try {
      const response = await api.get('/transport/my-bookings', { params })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load your bookings.'
      )
    }
  },

  /**
   * Get upcoming bookings
   * @returns Upcoming confirmed bookings
   */
  getUpcomingBookings: async (): Promise<TransportBooking[]> => {
    try {
      const response = await api.get<{ bookings: TransportBooking[] }>('/transport/upcoming')
      return response.data.bookings
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load upcoming bookings.'
      )
    }
  },

  /**
   * Get booking history
   * @param params - Query parameters
   * @returns Completed bookings with pagination
   */
  getBookingHistory: async (params?: {
    page?: number
    limit?: number
    transportType?: string
  }): Promise<{
    bookings: TransportBooking[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> => {
    try {
      const response = await api.get('/transport/history', { params })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load booking history.'
      )
    }
  },

  /**
   * Get specific booking by ID
   * @param id - Booking ID
   * @returns Booking details
   */
  getBookingById: async (id: string): Promise<TransportBooking> => {
    try {
      const response = await api.get<{ booking: TransportBooking }>(`/transport/bookings/${id}`)
      return response.data.booking
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load booking details.'
      )
    }
  },

  /**
   * Update transport booking
   * @param id - Booking ID
   * @param data - Update data
   * @returns Updated booking
   */
  updateBooking: async (
    id: string, 
    data: {
      status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      specialRequests?: string
      contactInfo?: any
    }
  ): Promise<TransportBooking> => {
    try {
      const response = await api.put<{ booking: TransportBooking }>(`/transport/bookings/${id}`, data)
      return response.data.booking
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update booking.'
      )
    }
  },

  /**
   * Cancel transport booking
   * @param id - Booking ID
   * @param reason - Cancellation reason (optional)
   * @returns Updated booking
   */
  cancelBooking: async (id: string, reason?: string): Promise<TransportBooking> => {
    try {
      const response = await api.post<{ booking: TransportBooking }>(
        `/transport/bookings/${id}/cancel`, 
        { reason }
      )
      return response.data.booking
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to cancel booking.'
      )
    }
  },

  /**
   * Get transport statistics (admin only)
   * @param params - Statistics query parameters
   * @returns Transport statistics
   */
  getTransportStats: async (params?: {
    startDate?: string
    endDate?: string
    transportType?: string
    providerId?: string
    origin?: string
    destination?: string
  }): Promise<{
    totalBookings: number
    bookingsByType: Record<string, number>
    totalRevenue: number
    currency: string
    averageBookingValue: number
    topDestinations: Array<{ destination: string; bookings: number }>
    bookingTrends: {
      thisMonth: number
      lastMonth: number
      growth: number
    }
  }> => {
    try {
      const response = await api.get('/transport/stats', { params })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to load transport statistics.'
      )
    }
  },
}

export default transportService