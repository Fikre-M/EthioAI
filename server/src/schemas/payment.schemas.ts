import { z } from 'zod';

/**
 * Create payment intent schema
 */
export const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(3).max(3).default('USD'),
  bookingId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
  metadata: z.record(z.string()).optional()
});

/**
 * Initialize Chapa payment schema
 */
export const initializeChapaPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(3).max(3).default('ETB'),
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  bookingId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
  callbackUrl: z.string().url().optional(),
  returnUrl: z.string().url().optional(),
  customization: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().url().optional()
  }).optional()
});

/**
 * Confirm payment schema
 */
export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment intent ID is required')
});

/**
 * Payment query schema
 */
export const paymentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'amount', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  method: z.enum(['STRIPE', 'CHAPA', 'TELEBIRR', 'CBE_BIRR']).optional(),
  userId: z.string().uuid().optional(),
  bookingId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional()
});

/**
 * Refund payment schema
 */
export const refundPaymentSchema = z.object({
  paymentId: z.string().uuid('Invalid payment ID'),
  amount: z.number().positive('Refund amount must be positive').optional(),
  reason: z.string().min(1, 'Refund reason is required')
});

/**
 * Payment stats query schema
 */
export const paymentStatsQuerySchema = z.object({
  method: z.enum(['STRIPE', 'CHAPA', 'TELEBIRR', 'CBE_BIRR']).optional(),
  userId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
export type InitializeChapaPaymentInput = z.infer<typeof initializeChapaPaymentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type PaymentQueryInput = z.infer<typeof paymentQuerySchema>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;
export type PaymentStatsQueryInput = z.infer<typeof paymentStatsQuerySchema>;