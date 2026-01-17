import { z } from 'zod';

/**
 * Transport validation schemas
 */

// Flight search schema
export const flightSearchSchema = z.object({
  origin: z.string()
    .min(3, 'Origin airport code must be at least 3 characters')
    .max(3, 'Origin airport code must be exactly 3 characters')
    .regex(/^[A-Z]{3}$/, 'Origin must be a valid 3-letter airport code'),
  destination: z.string()
    .min(3, 'Destination airport code must be at least 3 characters')
    .max(3, 'Destination airport code must be exactly 3 characters')
    .regex(/^[A-Z]{3}$/, 'Destination must be a valid 3-letter airport code'),
  departureDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Departure date must be in YYYY-MM-DD format'),
  returnDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Return date must be in YYYY-MM-DD format')
    .optional(),
  passengers: z.object({
    adults: z.number().int().min(1, 'At least 1 adult passenger required').max(9, 'Maximum 9 adult passengers'),
    children: z.number().int().min(0).max(8, 'Maximum 8 child passengers').default(0),
    infants: z.number().int().min(0).max(4, 'Maximum 4 infant passengers').default(0),
  }),
  class: z.enum(['economy', 'premium_economy', 'business', 'first']).default('economy'),
  tripType: z.enum(['one_way', 'round_trip', 'multi_city']).default('round_trip'),
  directFlightsOnly: z.boolean().default(false),
  maxStops: z.number().int().min(0).max(3).optional(),
  preferredAirlines: z.array(z.string()).optional(),
  maxPrice: z.number().positive().optional(),
  currency: z.string().length(3, 'Currency must be 3-letter code').default('USD'),
});

// Car rental search schema
export const carRentalSearchSchema = z.object({
  pickupLocation: z.string()
    .min(1, 'Pickup location is required')
    .max(200, 'Pickup location must not exceed 200 characters'),
  dropoffLocation: z.string()
    .min(1, 'Dropoff location is required')
    .max(200, 'Dropoff location must not exceed 200 characters')
    .optional(),
  pickupDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Pickup date must be in YYYY-MM-DD format'),
  pickupTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Pickup time must be in HH:MM format')
    .default('10:00'),
  dropoffDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Dropoff date must be in YYYY-MM-DD format'),
  dropoffTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Dropoff time must be in HH:MM format')
    .default('10:00'),
  driverAge: z.number().int().min(18, 'Driver must be at least 18 years old').max(99),
  carType: z.enum(['economy', 'compact', 'midsize', 'fullsize', 'suv', 'luxury', 'van', '4wd']).optional(),
  transmission: z.enum(['automatic', 'manual']).optional(),
  fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'electric']).optional(),
  airConditioning: z.boolean().default(true),
  unlimitedMileage: z.boolean().default(true),
  currency: z.string().length(3, 'Currency must be 3-letter code').default('USD'),
  maxPrice: z.number().positive().optional(),
});

// Bus/transport search schema
export const busSearchSchema = z.object({
  origin: z.string()
    .min(1, 'Origin is required')
    .max(100, 'Origin must not exceed 100 characters'),
  destination: z.string()
    .min(1, 'Destination is required')
    .max(100, 'Destination must not exceed 100 characters'),
  departureDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Departure date must be in YYYY-MM-DD format'),
  returnDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Return date must be in YYYY-MM-DD format')
    .optional(),
  passengers: z.number().int().min(1, 'At least 1 passenger required').max(50, 'Maximum 50 passengers'),
  busType: z.enum(['standard', 'luxury', 'sleeper', 'express']).optional(),
  departureTime: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
  maxPrice: z.number().positive().optional(),
  currency: z.string().length(3, 'Currency must be 3-letter code').default('ETB'),
});

// Transport booking schema
export const transportBookingSchema = z.object({
  transportType: z.enum(['flight', 'car_rental', 'bus', 'train', 'taxi']),
  providerId: z.string().min(1, 'Provider ID is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
  bookingReference: z.string().optional(),
  
  // Passenger/traveler information
  travelers: z.array(z.object({
    type: z.enum(['adult', 'child', 'infant']),
    title: z.enum(['Mr', 'Mrs', 'Ms', 'Dr']).optional(),
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format').optional(),
    passportNumber: z.string().optional(),
    nationality: z.string().length(2, 'Nationality must be 2-letter country code').optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
  })).min(1, 'At least one traveler is required'),
  
  // Booking details
  totalPrice: z.number().positive('Total price must be positive'),
  currency: z.string().length(3, 'Currency must be 3-letter code'),
  
  // Contact information
  contactInfo: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    emergencyContact: z.object({
      name: z.string().min(1, 'Emergency contact name is required'),
      phone: z.string().min(1, 'Emergency contact phone is required'),
      relationship: z.string().optional(),
    }).optional(),
  }),
  
  // Special requests
  specialRequests: z.string().max(500, 'Special requests must not exceed 500 characters').optional(),
  
  // Payment information (will be handled by payment service)
  paymentMethod: z.enum(['stripe', 'chapa', 'telebirr', 'cbe_birr']).optional(),
});

// Transport booking query schema
export const transportBookingQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  sortBy: z.enum(['createdAt', 'departureDate', 'totalPrice', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  
  transportType: z.enum(['flight', 'car_rental', 'bus', 'train', 'taxi']).optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  
  origin: z.string().optional(),
  destination: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
});

// Update transport booking schema
export const updateTransportBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  specialRequests: z.string().max(500).optional(),
  contactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    emergencyContact: z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      relationship: z.string().optional(),
    }).optional(),
  }).optional(),
});

// Transport provider schema
export const transportProviderSchema = z.object({
  name: z.string().min(1, 'Provider name is required').max(100),
  type: z.enum(['airline', 'car_rental', 'bus_company', 'train_operator', 'taxi_service']),
  description: z.string().max(500).optional(),
  logo: z.string().url('Invalid logo URL').optional(),
  website: z.string().url('Invalid website URL').optional(),
  contactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  serviceAreas: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  isActive: z.boolean().default(true),
  apiConfig: z.record(z.any()).optional(), // For storing API configuration
});

// Airport/location schema
export const locationSchema = z.object({
  code: z.string().min(3).max(10, 'Location code must be 3-10 characters'),
  name: z.string().min(1, 'Location name is required').max(200),
  type: z.enum(['airport', 'city', 'bus_station', 'train_station', 'port']),
  country: z.string().length(2, 'Country must be 2-letter code'),
  city: z.string().min(1, 'City is required').max(100),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  timezone: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Transport route schema
export const transportRouteSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  transportType: z.enum(['flight', 'bus', 'train']),
  providerId: z.string().uuid('Invalid provider ID'),
  duration: z.number().positive('Duration must be positive'), // in minutes
  distance: z.number().positive('Distance must be positive').optional(), // in kilometers
  frequency: z.enum(['daily', 'weekly', 'seasonal']).optional(),
  operatingDays: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])).optional(),
  basePrice: z.number().positive('Base price must be positive'),
  currency: z.string().length(3, 'Currency must be 3-letter code'),
  isActive: z.boolean().default(true),
});

// Transport statistics query schema
export const transportStatsQuerySchema = z.object({
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  transportType: z.enum(['flight', 'car_rental', 'bus', 'train', 'taxi']).optional(),
  providerId: z.string().uuid().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
});

// Popular routes query schema
export const popularRoutesQuerySchema = z.object({
  transportType: z.enum(['flight', 'car_rental', 'bus', 'train', 'taxi']).optional(),
  limit: z.number().int().min(1).max(50).default(10),
  period: z.enum(['week', 'month', 'quarter', 'year']).default('month'),
});

// Type exports for TypeScript
export type FlightSearchInput = z.infer<typeof flightSearchSchema>;
export type CarRentalSearchInput = z.infer<typeof carRentalSearchSchema>;
export type BusSearchInput = z.infer<typeof busSearchSchema>;
export type TransportBookingInput = z.infer<typeof transportBookingSchema>;
export type TransportBookingQueryInput = z.infer<typeof transportBookingQuerySchema>;
export type UpdateTransportBookingInput = z.infer<typeof updateTransportBookingSchema>;
export type TransportProviderInput = z.infer<typeof transportProviderSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type TransportRouteInput = z.infer<typeof transportRouteSchema>;
export type TransportStatsQueryInput = z.infer<typeof transportStatsQuerySchema>;
export type PopularRoutesQueryInput = z.infer<typeof popularRoutesQuerySchema>;