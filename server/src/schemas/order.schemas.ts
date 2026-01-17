import { z } from 'zod';

/**
 * Order validation schemas
 */

// Order item schema
const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(100, 'Quantity must not exceed 100'),
  variant: z.object({
    color: z.string().optional(),
    size: z.string().optional(),
    material: z.string().optional(),
  }).optional(),
});

// Address schema
const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address1: z.string().min(5, 'Address line 1 is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().optional(),
});

// Create order schema
export const createOrderSchema = z.object({
  items: z.array(orderItemSchema)
    .min(1, 'At least one item is required')
    .max(50, 'Maximum 50 items per order'),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  notes: z.string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional(),
  promoCode: z.string().optional(),
});

// Update order schema
export const updateOrderSchema = z.object({
  shippingAddress: addressSchema.optional(),
  billingAddress: addressSchema.optional(),
  notes: z.string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional(),
  trackingNumber: z.string()
    .max(100, 'Tracking number must not exceed 100 characters')
    .optional(),
});

// Update order status schema
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters')
    .optional(),
  trackingNumber: z.string()
    .max(100, 'Tracking number must not exceed 100 characters')
    .optional(),
});

// Order query/filter schema
export const orderQuerySchema = z.object({
  // Pagination
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  
  // Sorting
  sortBy: z.enum(['createdAt', 'total', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  
  // Filtering
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  
  // Date range
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  
  // Amount range
  minTotal: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  maxTotal: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  
  // Search
  search: z.string().optional(),
  orderNumber: z.string().optional(),
});

// Cancel order schema
export const cancelOrderSchema = z.object({
  reason: z.string()
    .min(10, 'Cancellation reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters'),
  requestRefund: z.boolean().default(true),
});

// Order statistics schema
export const orderStatsQuerySchema = z.object({
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  userId: z.string().uuid('Invalid user ID').optional(),
  vendorId: z.string().uuid('Invalid vendor ID').optional(),
});

// Validate cart schema
export const validateCartSchema = z.object({
  items: z.array(orderItemSchema)
    .min(1, 'At least one item is required')
    .max(50, 'Maximum 50 items per order'),
  promoCode: z.string().optional(),
});

// Type exports for TypeScript
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type OrderStatsQueryInput = z.infer<typeof orderStatsQuerySchema>;
export type ValidateCartInput = z.infer<typeof validateCartSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type AddressInput = z.infer<typeof addressSchema>;