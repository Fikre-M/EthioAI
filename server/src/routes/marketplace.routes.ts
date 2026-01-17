import { Router } from 'express';
import { z } from 'zod';
import { ProductController } from '../controllers/product.controller';
import { OrderController } from '../controllers/order.controller';
import { VendorController } from '../controllers/vendor.controller';
import { authenticate, optionalAuth, requireRoles } from '../middlewares/auth.middleware';
import { validate, commonSchemas } from '../middlewares/validation.middleware';

// Import schemas
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  updateProductStatusSchema,
  productStatsQuerySchema,
} from '../schemas/product.schemas';

import {
  createOrderSchema,
  updateOrderSchema,
  orderQuerySchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
  orderStatsQuerySchema,
  validateCartSchema,
} from '../schemas/order.schemas';

import {
  createVendorProfileSchema,
  updateVendorProfileSchema,
  vendorQuerySchema,
  updateVendorVerificationSchema,
  vendorStatsQuerySchema,
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
} from '../schemas/vendor.schemas';

const router = Router();

/**
 * Marketplace Routes
 * All routes are prefixed with /api/marketplace
 */

// ===== PRODUCT ROUTES =====

// Public product routes
router.get('/products/search', 
  optionalAuth,
  ProductController.searchProducts
);

router.get('/products/featured', 
  optionalAuth,
  ProductController.getFeaturedProducts
);

router.get('/products/popular', 
  optionalAuth,
  ProductController.getPopularProducts
);

router.get('/products/filters', 
  optionalAuth,
  ProductController.getProductFilters
);

router.get('/products/category/:categoryId', 
  optionalAuth,
  validate({ 
    params: z.object({ categoryId: z.string().uuid('Invalid category ID') })
  }),
  ProductController.getProductsByCategory
);

router.get('/products/vendor/:vendorId', 
  optionalAuth,
  validate({ 
    params: z.object({ vendorId: z.string().uuid('Invalid vendor ID') }),
    query: productQuerySchema 
  }),
  ProductController.getVendorProducts
);

router.get('/products/:id', 
  optionalAuth,
  ProductController.getProductById
);

router.get('/products', 
  optionalAuth,
  validate({ query: productQuerySchema }),
  ProductController.getProducts
);

// Vendor product routes
router.post('/products', 
  authenticate, 
  requireRoles.vendor,
  validate({ body: createProductSchema }), 
  ProductController.createProduct
);

router.get('/products/my-products', 
  authenticate,
  requireRoles.vendor,
  validate({ query: productQuerySchema }), 
  ProductController.getMyProducts
);

router.put('/products/:id', 
  authenticate, 
  requireRoles.vendor,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateProductSchema 
  }), 
  ProductController.updateProduct
);

router.delete('/products/:id', 
  authenticate, 
  requireRoles.vendor,
  validate({ params: commonSchemas.uuidParam.params }), 
  ProductController.deleteProduct
);

router.patch('/products/:id/status', 
  authenticate, 
  requireRoles.vendor,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateProductStatusSchema 
  }), 
  ProductController.updateProductStatus
);

// Admin product routes
router.get('/admin/products/stats', 
  authenticate, 
  requireRoles.admin,
  validate({ query: productStatsQuerySchema }), 
  ProductController.getProductStats
);

// ===== ORDER ROUTES =====

// Public order routes (require authentication)
router.post('/orders/validate-cart', 
  authenticate,
  validate({ body: validateCartSchema }), 
  OrderController.validateCart
);

router.post('/orders', 
  authenticate, 
  validate({ body: createOrderSchema }), 
  OrderController.createOrder
);

router.get('/orders/my-orders', 
  authenticate,
  validate({ query: orderQuerySchema }), 
  OrderController.getMyOrders
);

router.get('/orders/recent', 
  authenticate, 
  OrderController.getRecentOrders
);

router.get('/orders/summary', 
  authenticate, 
  OrderController.getOrderSummary
);

router.get('/orders/number/:orderNumber', 
  authenticate, 
  OrderController.getOrderByNumber
);

router.get('/orders/:id', 
  authenticate,
  validate({ params: commonSchemas.uuidParam.params }), 
  OrderController.getOrderById
);

router.put('/orders/:id', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateOrderSchema 
  }), 
  OrderController.updateOrder
);

router.post('/orders/:id/cancel', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: cancelOrderSchema 
  }), 
  OrderController.cancelOrder
);

// Vendor order routes
router.get('/orders/vendor-orders', 
  authenticate,
  requireRoles.vendor,
  validate({ query: orderQuerySchema }), 
  OrderController.getVendorOrders
);

// Admin order routes
router.get('/orders', 
  authenticate, 
  requireRoles.admin,
  validate({ query: orderQuerySchema }), 
  OrderController.getOrders
);

router.patch('/orders/:id/status', 
  authenticate, 
  requireRoles.adminOrVendor,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateOrderStatusSchema 
  }), 
  OrderController.updateOrderStatus
);

router.get('/admin/orders/stats', 
  authenticate, 
  requireRoles.admin,
  validate({ query: orderStatsQuerySchema }), 
  OrderController.getOrderStats
);

// ===== VENDOR ROUTES =====

// Public vendor routes
router.get('/vendors/:id', 
  optionalAuth,
  validate({ params: commonSchemas.uuidParam.params }),
  VendorController.getVendorProfileById
);

// Vendor profile routes
router.post('/vendors/profile', 
  authenticate, 
  validate({ body: createVendorProfileSchema }), 
  VendorController.createVendorProfile
);

router.get('/vendors/my-profile', 
  authenticate,
  VendorController.getMyVendorProfile
);

router.put('/vendors/profile/:id', 
  authenticate,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateVendorProfileSchema 
  }), 
  VendorController.updateVendorProfile
);

router.get('/vendors/dashboard', 
  authenticate,
  requireRoles.vendor,
  VendorController.getVendorDashboard
);

// Admin vendor routes
router.get('/vendors', 
  authenticate, 
  requireRoles.admin,
  validate({ query: vendorQuerySchema }), 
  VendorController.getVendorProfiles
);

router.patch('/vendors/:id/verification', 
  authenticate, 
  requireRoles.admin,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateVendorVerificationSchema 
  }), 
  VendorController.updateVendorVerification
);

router.get('/admin/vendors/stats', 
  authenticate, 
  requireRoles.admin,
  validate({ query: vendorStatsQuerySchema }), 
  VendorController.getVendorStats
);

// ===== CATEGORY ROUTES =====

// Public category routes
router.get('/categories', 
  optionalAuth,
  validate({ query: categoryQuerySchema }),
  VendorController.getCategories
);

router.get('/categories/:id', 
  optionalAuth,
  VendorController.getCategoryById
);

// Admin category routes
router.post('/categories', 
  authenticate, 
  requireRoles.admin,
  validate({ body: createCategorySchema }), 
  VendorController.createCategory
);

router.put('/categories/:id', 
  authenticate, 
  requireRoles.admin,
  validate({ 
    params: commonSchemas.uuidParam.params,
    body: updateCategorySchema 
  }), 
  VendorController.updateCategory
);

router.delete('/categories/:id', 
  authenticate, 
  requireRoles.admin,
  validate({ params: commonSchemas.uuidParam.params }), 
  VendorController.deleteCategory
);

export default router;