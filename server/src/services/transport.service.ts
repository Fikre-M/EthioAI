import { PrismaClient, Prisma } from '@prisma/client';
import { 
  FlightSearchInput, 
  CarRentalSearchInput, 
  BusSearchInput,
  TransportBookingInput,
  TransportBookingQueryInput,
  UpdateTransportBookingInput,
  TransportProviderInput,
  LocationInput,
  TransportRouteInput,
  TransportStatsQueryInput,
  PopularRoutesQueryInput
} from '../schemas/transport.schemas';
import { 
  NotFoundError, 
  ValidationError, 
  ForbiddenError 
} from '../middlewares/error.middleware';
import { calculatePagination, PaginationMeta } from '../utils/response';
import { log } from '../utils/logger';
import axios from 'axios';

const prisma = new PrismaClient();

// Mock data for demonstration - in production, these would come from real APIs
const MOCK_AIRLINES = ['Ethiopian Airlines', 'Kenya Airways', 'Turkish Airlines', 'Emirates', 'Qatar Airways'];
const MOCK_CAR_COMPANIES = ['Hertz Ethiopia', 'Avis Ethiopia', 'Budget Ethiopia', 'Local Car Rental'];
const MOCK_BUS_COMPANIES = ['Sky Bus', 'Selam Bus', 'Golden Bus', 'Abay Bus'];

export class TransportService {
  /**
   * Search for flights
   */
  static async searchFlights(data: FlightSearchInput): Promise<any[]> {
    try {
      // In production, integrate with real flight APIs like Amadeus, Sabre, etc.
      // For now, return mock data
      
      const mockFlights = this.generateMockFlights(data);
      
      log.info('Flight search performed', {
        origin: data.origin,
        destination: data.destination,
        departureDate: data.departureDate,
        passengers: data.passengers,
        resultsCount: mockFlights.length,
      });

      return mockFlights;

    } catch (error: any) {
      log.error('Flight search error', { error: error.message, searchData: data });
      throw new Error('Failed to search flights. Please try again.');
    }
  }

  /**
   * Search for car rentals
   */
  static async searchCarRentals(data: CarRentalSearchInput): Promise<any[]> {
    try {
      // In production, integrate with car rental APIs like Booking.com, Expedia, etc.
      // For now, return mock data
      
      const mockCars = this.generateMockCarRentals(data);
      
      log.info('Car rental search performed', {
        pickupLocation: data.pickupLocation,
        pickupDate: data.pickupDate,
        dropoffDate: data.dropoffDate,
        resultsCount: mockCars.length,
      });

      return mockCars;

    } catch (error: any) {
      log.error('Car rental search error', { error: error.message, searchData: data });
      throw new Error('Failed to search car rentals. Please try again.');
    }
  }

  /**
   * Search for bus services
   */
  static async searchBuses(data: BusSearchInput): Promise<any[]> {
    try {
      // In production, integrate with local bus company APIs
      // For now, return mock data
      
      const mockBuses = this.generateMockBuses(data);
      
      log.info('Bus search performed', {
        origin: data.origin,
        destination: data.destination,
        departureDate: data.departureDate,
        resultsCount: mockBuses.length,
      });

      return mockBuses;

    } catch (error: any) {
      log.error('Bus search error', { error: error.message, searchData: data });
      throw new Error('Failed to search buses. Please try again.');
    }
  }

  /**
   * Create transport booking
   */
  static async createBooking(
    data: TransportBookingInput, 
    userId: string
  ): Promise<any> {
    try {
      // Generate booking reference
      const bookingReference = this.generateBookingReference(data.transportType);

      // In production, this would integrate with actual booking APIs
      // For now, create a mock booking record
      
      const booking = {
        id: `booking_${Date.now()}`,
        userId,
        transportType: data.transportType,
        providerId: data.providerId,
        serviceId: data.serviceId,
        bookingReference,
        status: 'pending',
        travelers: data.travelers,
        totalPrice: data.totalPrice,
        currency: data.currency,
        contactInfo: data.contactInfo,
        specialRequests: data.specialRequests,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      log.info('Transport booking created', {
        bookingId: booking.id,
        userId,
        transportType: data.transportType,
        totalPrice: data.totalPrice,
        currency: data.currency,
      });

      return booking;

    } catch (error: any) {
      log.error('Transport booking creation error', { error: error.message, bookingData: data });
      throw new Error('Failed to create transport booking. Please try again.');
    }
  }

  /**
   * Get transport bookings with filtering
   */
  static async getBookings(
    query: TransportBookingQueryInput,
    userId?: string
  ): Promise<{
    bookings: any[];
    pagination: PaginationMeta;
  }> {
    try {
      // In production, this would query actual booking records
      // For now, return mock data
      
      const mockBookings = this.generateMockBookings(userId);
      
      // Apply filters
      let filteredBookings = mockBookings;
      
      if (query.transportType) {
        filteredBookings = filteredBookings.filter(b => b.transportType === query.transportType);
      }
      
      if (query.status) {
        filteredBookings = filteredBookings.filter(b => b.status === query.status);
      }
      
      if (query.origin) {
        filteredBookings = filteredBookings.filter(b => 
          b.route?.origin?.toLowerCase().includes(query.origin!.toLowerCase())
        );
      }
      
      if (query.destination) {
        filteredBookings = filteredBookings.filter(b => 
          b.route?.destination?.toLowerCase().includes(query.destination!.toLowerCase())
        );
      }

      // Apply pagination
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;
      const paginatedBookings = filteredBookings.slice(skip, skip + limit);
      
      const pagination = calculatePagination(page, limit, filteredBookings.length);

      return {
        bookings: paginatedBookings,
        pagination,
      };

    } catch (error: any) {
      log.error('Get bookings error', { error: error.message, query });
      throw new Error('Failed to retrieve bookings. Please try again.');
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(id: string, userId?: string): Promise<any> {
    try {
      // In production, query actual booking record
      // For now, return mock data
      
      const mockBooking = {
        id,
        userId: userId || 'mock_user',
        transportType: 'flight',
        providerId: 'ethiopian_airlines',
        serviceId: 'ET_123',
        bookingReference: 'ET123456789',
        status: 'confirmed',
        route: {
          origin: 'ADD',
          destination: 'JFK',
          departureDate: '2024-03-15',
          returnDate: '2024-03-22',
        },
        travelers: [
          {
            type: 'adult',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
          },
        ],
        totalPrice: 1200,
        currency: 'USD',
        contactInfo: {
          email: 'john.doe@example.com',
          phone: '+1234567890',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (userId && mockBooking.userId !== userId) {
        throw new ForbiddenError('You do not have permission to view this booking');
      }

      return mockBooking;

    } catch (error: any) {
      if (error instanceof ForbiddenError) throw error;
      log.error('Get booking by ID error', { error: error.message, bookingId: id });
      throw new NotFoundError('Booking not found');
    }
  }

  /**
   * Update transport booking
   */
  static async updateBooking(
    id: string,
    data: UpdateTransportBookingInput,
    userId: string
  ): Promise<any> {
    try {
      // In production, update actual booking record
      // For now, return mock updated booking
      
      const existingBooking = await this.getBookingById(id, userId);
      
      const updatedBooking = {
        ...existingBooking,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      log.info('Transport booking updated', {
        bookingId: id,
        userId,
        updates: Object.keys(data),
      });

      return updatedBooking;

    } catch (error: any) {
      log.error('Update booking error', { error: error.message, bookingId: id });
      throw error;
    }
  }

  /**
   * Cancel transport booking
   */
  static async cancelBooking(id: string, userId: string, reason?: string): Promise<any> {
    try {
      const booking = await this.getBookingById(id, userId);
      
      if (booking.status === 'cancelled') {
        throw new ValidationError('Booking is already cancelled');
      }
      
      if (booking.status === 'completed') {
        throw new ValidationError('Cannot cancel completed booking');
      }

      const updatedBooking = {
        ...booking,
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      log.info('Transport booking cancelled', {
        bookingId: id,
        userId,
        reason,
      });

      return updatedBooking;

    } catch (error: any) {
      log.error('Cancel booking error', { error: error.message, bookingId: id });
      throw error;
    }
  }

  /**
   * Get popular routes
   */
  static async getPopularRoutes(query: PopularRoutesQueryInput): Promise<any[]> {
    try {
      // In production, this would analyze actual booking data
      // For now, return mock popular routes
      
      const mockRoutes = [
        {
          origin: 'Addis Ababa',
          destination: 'Lalibela',
          transportType: 'flight',
          bookingCount: 245,
          averagePrice: 150,
          currency: 'USD',
        },
        {
          origin: 'Addis Ababa',
          destination: 'Bahir Dar',
          transportType: 'bus',
          bookingCount: 189,
          averagePrice: 25,
          currency: 'ETB',
        },
        {
          origin: 'Addis Ababa',
          destination: 'Axum',
          transportType: 'flight',
          bookingCount: 156,
          averagePrice: 180,
          currency: 'USD',
        },
        {
          origin: 'Addis Ababa',
          destination: 'Gondar',
          transportType: 'bus',
          bookingCount: 134,
          averagePrice: 30,
          currency: 'ETB',
        },
        {
          origin: 'Addis Ababa',
          destination: 'Hawassa',
          transportType: 'bus',
          bookingCount: 98,
          averagePrice: 20,
          currency: 'ETB',
        },
      ];

      let filteredRoutes = mockRoutes;
      
      if (query.transportType) {
        filteredRoutes = filteredRoutes.filter(r => r.transportType === query.transportType);
      }

      return filteredRoutes.slice(0, query.limit);

    } catch (error: any) {
      log.error('Get popular routes error', { error: error.message });
      throw new Error('Failed to retrieve popular routes');
    }
  }

  /**
   * Get transport statistics
   */
  static async getTransportStats(query: TransportStatsQueryInput): Promise<any> {
    try {
      // In production, this would analyze actual booking data
      // For now, return mock statistics
      
      const stats = {
        totalBookings: 1247,
        bookingsByType: {
          flight: 456,
          car_rental: 234,
          bus: 389,
          train: 89,
          taxi: 79,
        },
        totalRevenue: 245670,
        currency: 'USD',
        averageBookingValue: 197,
        topDestinations: [
          { destination: 'Lalibela', bookings: 89 },
          { destination: 'Bahir Dar', bookings: 76 },
          { destination: 'Axum', bookings: 65 },
        ],
        bookingTrends: {
          thisMonth: 156,
          lastMonth: 134,
          growth: 16.4,
        },
      };

      return stats;

    } catch (error: any) {
      log.error('Get transport stats error', { error: error.message });
      throw new Error('Failed to retrieve transport statistics');
    }
  }

  /**
   * Generate mock flight data
   */
  private static generateMockFlights(searchData: FlightSearchInput): any[] {
    const flights = [];
    const basePrice = 300;
    
    for (let i = 0; i < 5; i++) {
      const airline = MOCK_AIRLINES[i % MOCK_AIRLINES.length];
      const price = basePrice + (Math.random() * 500);
      const duration = 180 + (Math.random() * 300); // 3-8 hours
      
      flights.push({
        id: `flight_${i + 1}`,
        airline,
        flightNumber: `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
        origin: searchData.origin,
        destination: searchData.destination,
        departureDate: searchData.departureDate,
        returnDate: searchData.returnDate,
        departureTime: `${String(6 + Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        arrivalTime: `${String(8 + Math.floor(Math.random() * 14)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        duration: Math.floor(duration),
        stops: Math.floor(Math.random() * 2),
        class: searchData.class,
        price: Math.floor(price),
        currency: searchData.currency,
        availableSeats: Math.floor(Math.random() * 50) + 10,
        baggage: {
          carry_on: '7kg',
          checked: '23kg',
        },
        amenities: ['WiFi', 'Meals', 'Entertainment'],
      });
    }
    
    return flights.sort((a, b) => a.price - b.price);
  }

  /**
   * Generate mock car rental data
   */
  private static generateMockCarRentals(searchData: CarRentalSearchInput): any[] {
    const cars = [];
    const carTypes = ['economy', 'compact', 'midsize', 'fullsize', 'suv'];
    const basePrice = 25;
    
    for (let i = 0; i < 6; i++) {
      const company = MOCK_CAR_COMPANIES[i % MOCK_CAR_COMPANIES.length];
      const carType = carTypes[i % carTypes.length];
      const dailyRate = basePrice + (Math.random() * 75);
      
      cars.push({
        id: `car_${i + 1}`,
        company,
        carType,
        model: `${carType.charAt(0).toUpperCase() + carType.slice(1)} Car`,
        pickupLocation: searchData.pickupLocation,
        dropoffLocation: searchData.dropoffLocation || searchData.pickupLocation,
        pickupDate: searchData.pickupDate,
        dropoffDate: searchData.dropoffDate,
        dailyRate: Math.floor(dailyRate),
        totalPrice: Math.floor(dailyRate * this.calculateDays(searchData.pickupDate, searchData.dropoffDate)),
        currency: searchData.currency,
        transmission: searchData.transmission || 'automatic',
        fuelType: searchData.fuelType || 'petrol',
        seats: carType === 'suv' ? 7 : 5,
        doors: 4,
        airConditioning: searchData.airConditioning,
        unlimitedMileage: searchData.unlimitedMileage,
        features: ['GPS', 'Bluetooth', 'USB Charging'],
        insurance: {
          basic: true,
          comprehensive: false,
          thirdParty: true,
        },
      });
    }
    
    return cars.sort((a, b) => a.totalPrice - b.totalPrice);
  }

  /**
   * Generate mock bus data
   */
  private static generateMockBuses(searchData: BusSearchInput): any[] {
    const buses = [];
    const basePrice = 15;
    
    for (let i = 0; i < 4; i++) {
      const company = MOCK_BUS_COMPANIES[i % MOCK_BUS_COMPANIES.length];
      const price = basePrice + (Math.random() * 25);
      const duration = 120 + (Math.random() * 240); // 2-6 hours
      
      buses.push({
        id: `bus_${i + 1}`,
        company,
        busNumber: `${company.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
        origin: searchData.origin,
        destination: searchData.destination,
        departureDate: searchData.departureDate,
        returnDate: searchData.returnDate,
        departureTime: `${String(6 + i * 2).padStart(2, '0')}:00`,
        arrivalTime: `${String(8 + i * 2 + Math.floor(duration / 60)).padStart(2, '0')}:${String(duration % 60).padStart(2, '0')}`,
        duration: Math.floor(duration),
        busType: ['standard', 'luxury', 'express'][i % 3],
        price: Math.floor(price),
        currency: searchData.currency,
        availableSeats: Math.floor(Math.random() * 30) + 10,
        amenities: ['AC', 'Reclining Seats', 'Water'],
        stops: Math.floor(Math.random() * 3),
      });
    }
    
    return buses.sort((a, b) => a.price - b.price);
  }

  /**
   * Generate mock bookings
   */
  private static generateMockBookings(userId?: string): any[] {
    const bookings = [];
    const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    const transportTypes = ['flight', 'car_rental', 'bus'];
    
    for (let i = 0; i < 10; i++) {
      bookings.push({
        id: `booking_${i + 1}`,
        userId: userId || `user_${i + 1}`,
        transportType: transportTypes[i % transportTypes.length],
        bookingReference: `BK${Date.now() + i}`,
        status: statuses[i % statuses.length],
        route: {
          origin: 'Addis Ababa',
          destination: ['Lalibela', 'Bahir Dar', 'Gondar'][i % 3],
          departureDate: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        },
        totalPrice: 100 + (Math.random() * 500),
        currency: 'USD',
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      });
    }
    
    return bookings;
  }

  /**
   * Generate booking reference
   */
  private static generateBookingReference(transportType: string): string {
    const prefix = {
      flight: 'FL',
      car_rental: 'CR',
      bus: 'BS',
      train: 'TR',
      taxi: 'TX',
    }[transportType] || 'BK';
    
    return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  /**
   * Calculate days between dates
   */
  private static calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}