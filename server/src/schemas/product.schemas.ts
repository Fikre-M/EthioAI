import { z } from 'zod';

/**
 * Product validation schemas
 */

// Create product schema
export const createProductSchema = z.object({
  name: z.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name must not exceed 200 characters'),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  shortDescription: z.string()
    .max(500, 'Short description must not exceed 500 characters')
    .optional(),
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
  price: z.number()
    .positive('Price must be positive')
    .max(100000, 'Price must not exceed $100,000'),
  discountPrice: z.number()
    .positive('Discount price must be positive')
    .optional(),
  stock: z.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(10000, 'Stock must not exceed 10,000'),
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must not exceed 50 characters')
    .optional(),
  weight: z.number()
    .positive('Weight must be positive')
    .max(1000, 'Weight must not exceed 1000kg')
    .optional(),
  dimensions: z.object({
    length: z.number().positive('Length must be positive'),
    width: z.number().positive('Width must be positive'),
    height: z.number().positive('Height must be positive'),
  }).optional(),
  materials: z.array(z.string().min(1, 'Material cannot be empty'))
    .max(10, 'Maximum 10 materials allowed')
    .optional(),
  colors: z.array(z.string().min(1, 'Color cannot be empty'))
    .max(20, 'Maximum 20 colors allowed')
    .optional(),
  sizes: z.array(z.string().min(1, 'Size cannot be empty'))
    .max(20, 'Maximum 20 sizes allowed')
    .optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  metaTitle: z.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .optional(),
  metaDescription: z.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .optional(),
  featured: z.boolean().default(false),
}).refine(
  (data) => !data.discountPrice || data.discountPrice < data.price,
  {
    message: 'Discount price must be less than regular price',
    path: ['discountPrice'],
  }
);

// Update product schema
export const updateProductSchema = z.object({
  name: z.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name must not exceed 200 characters')
    .optional(),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters')
    .optional(),
  shortDescription: z.string()
    .max(500, 'Short description must not exceed 500 characters')
    .optional(),
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed')
    .optional(),
  price: z.number()
    .positive('Price must be positive')
    .max(100000, 'Price must not exceed $100,000')
    .optional(),
  discountPrice: z.number()
    .positive('Discount price must be positive')
    .optional(),
  stock: z.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(10000, 'Stock must not exceed 10,000')
    .optional(),
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must not exceed 50 characters')
    .optional(),
  weight: z.number()
    .positive('Weight must be positive')
    .max(1000, 'Weight must not exceed 1000kg')
    .optional(),
  dimensions: z.object({
    length: z.number().positive('Length must be positive'),
    width: z.number().positive('Width must be positive'),
    height: z.number().positive('Height must be positive'),
  }).optional(),
  materials: z.array(z.string().min(1, 'Material cannot be empty'))
    .max(10, 'Maximum 10 materials allowed')
    .optional(),
  colors: z.array(z.string().min(1, 'Color cannot be empty'))
    .max(20, 'Maximum 20 colors allowed')
    .optional(),
  sizes: z.array(z.string().min(1, 'Size cannot be empty'))
    .max(20, 'Maximum 20 sizes allowed')
    .optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  metaTitle: z.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .optional(),
  metaDescription: z.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .optional(),
  featured: z.boolean().optional(),
}).refine(
  (data) => !data.discountPrice || !data.price || data.discountPrice < data.price,
  {
    message: 'Discount price must be less than regular price',
    path: ['discountPrice'],
  }
);

// Product query/filter schema
export const productQuerySchema = z.object({
  // Pagination
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  
  // Sorting
  sortBy: z.enum(['createdAt', 'name', 'price', 'rating', 'sales']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  
  // Filtering
  categoryId: z.string().uuid('Invalid category ID').optional(),
  vendorId: z.string().uuid('Invalid vendor ID').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  featured: z.string().optional().transform((val) => val === 'true'),
  inStock: z.string().optional().transform((val) => val === 'true'),
  
  // Price range
  minPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  
  // Search
  search: z.string().optional(),
  
  // Filters
  materials: z.string().optional(), // Comma-separated
  colors: z.string().optional(), // Comma-separated
  sizes: z.string().optional(), // Comma-separated
});

// Update product status schema
export const updateProductStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters')
    .optional(),
});

// Product statistics schema
export const productStatsQuerySchema = z.object({
  vendorId: z.string().uuid('Invalid vendor ID').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

// Type exports for TypeScript
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type UpdateProductStatusInput = z.infer<typeof updateProductStatusSchema>;
export type ProductStatsQueryInput = z.infer<typeof productStatsQuerySchema>;