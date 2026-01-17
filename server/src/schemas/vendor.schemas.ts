import { z } from 'zod';

/**
 * Vendor validation schemas
 */

// Create vendor profile schema
export const createVendorProfileSchema = z.object({
  businessName: z.string()
    .min(3, 'Business name must be at least 3 characters')
    .max(200, 'Business name must not exceed 200 characters'),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  logo: z.string().url('Invalid logo URL').optional(),
  banner: z.string().url('Invalid banner URL').optional(),
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must not exceed 500 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must not exceed 20 characters'),
  website: z.string().url('Invalid website URL').optional(),
  businessLicense: z.string()
    .max(100, 'Business license must not exceed 100 characters')
    .optional(),
  taxId: z.string()
    .max(50, 'Tax ID must not exceed 50 characters')
    .optional(),
});

// Update vendor profile schema
export const updateVendorProfileSchema = z.object({
  businessName: z.string()
    .min(3, 'Business name must be at least 3 characters')
    .max(200, 'Business name must not exceed 200 characters')
    .optional(),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  logo: z.string().url('Invalid logo URL').optional(),
  banner: z.string().url('Invalid banner URL').optional(),
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must not exceed 500 characters')
    .optional(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must not exceed 20 characters')
    .optional(),
  website: z.string().url('Invalid website URL').optional(),
  businessLicense: z.string()
    .max(100, 'Business license must not exceed 100 characters')
    .optional(),
  taxId: z.string()
    .max(50, 'Tax ID must not exceed 50 characters')
    .optional(),
});

// Vendor query/filter schema
export const vendorQuerySchema = z.object({
  // Pagination
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  
  // Sorting
  sortBy: z.enum(['createdAt', 'businessName', 'rating', 'totalSales']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  
  // Filtering
  isVerified: z.string().optional().transform((val) => val === 'true'),
  
  // Search
  search: z.string().optional(),
});

// Update vendor verification schema
export const updateVendorVerificationSchema = z.object({
  isVerified: z.boolean(),
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters')
    .optional(),
});

// Vendor statistics schema
export const vendorStatsQuerySchema = z.object({
  vendorId: z.string().uuid('Invalid vendor ID').optional(),
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

// Category schema
export const createCategorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  image: z.string().url('Invalid image URL').optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional(),
});

// Update category schema
export const updateCategorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters')
    .optional(),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  image: z.string().url('Invalid image URL').optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional(),
});

// Category query schema
export const categoryQuerySchema = z.object({
  // Pagination
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  
  // Filtering
  parentId: z.string().uuid('Invalid parent category ID').optional(),
  includeChildren: z.string().optional().transform((val) => val === 'true'),
  
  // Search
  search: z.string().optional(),
});

// Type exports for TypeScript
export type CreateVendorProfileInput = z.infer<typeof createVendorProfileSchema>;
export type UpdateVendorProfileInput = z.infer<typeof updateVendorProfileSchema>;
export type VendorQueryInput = z.infer<typeof vendorQuerySchema>;
export type UpdateVendorVerificationInput = z.infer<typeof updateVendorVerificationSchema>;
export type VendorStatsQueryInput = z.infer<typeof vendorStatsQuerySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;