import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { OrderService } from '../services/order.service';
import { ResponseUtil } from '../utils/response';
import { log } from '../utils/logger';
import { asyncHandler } from '../middlewares/error.middleware';
import { 
  CreateOrderInput, 
  UpdateOrderInput, 
  OrderQueryInput,
  UpdateOrderStatusInput,
  CancelOrderInput,
  OrderStatsQueryInput,
  ValidateCartInput
} from '../schemas/order.schemas';

const prisma = new PrismaClient();

export class OrderController {
  /**
   * Validate cart
   * POST /api/orders/validate-cart
   */
  static validateCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: ValidateCartInput = req.body;
    
    const result = await OrderService.validateCart(data);
    
    if (!result.valid) {
      return ResponseUtil.badRequest(res, 'Cart validation failed', result.errors);
    }
    
    return ResponseUtil.success(res, result, 'Cart validated successfully');
  });

  /**
   * Create a new order
   * POST /api/orders
   */
  static createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CreateOrderInput = req.body;
    const userId = req.userId!;
    
    const order = await OrderService.createOrder(data, userId);
    
    log.info('Order created via API', { 
      orderId: order.id, 
      orderNumber: order.orderNumber,
      userId, 
      ip: req.ip 
    });

    return ResponseUtil.created(res, { order }, 'Order created successfully');
  });

  /**
   * Get all orders with filtering and pagination (admin)
   * GET /api/orders
   */
  static getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: OrderQueryInput = req.query as any;
    
    const result = await OrderService.getOrders(query);
    
    return ResponseUtil.paginated(
      res, 
      result.orders, 
      result.pagination, 
      'Orders retrieved successfully'
    );
  });

  /**
   * Get order by ID
   * GET /api/orders/:id
   */
  static getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    
    const order = await OrderService.getOrderById(id, userId);
    
    return ResponseUtil.success(res, { order }, 'Order retrieved successfully');
  });

  /**
   * Update order
   * PUT /api/orders/:id
   */
  static updateOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateOrderInput = req.body;
    const userId = req.userId!;
    
    const order = await OrderService.updateOrder(id, data, userId);
    
    log.info('Order updated via API', { orderId: id, userId, ip: req.ip });

    return ResponseUtil.success(res, { order }, 'Order updated successfully');
  });

  /**
   * Cancel order
   * POST /api/orders/:id/cancel
   */
  static cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: CancelOrderInput = req.body;
    const userId = req.userId!;
    
    const order = await OrderService.cancelOrder(id, data, userId);
    
    log.info('Order cancelled via API', { 
      orderId: id, 
      userId, 
      reason: data.reason,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { order }, 'Order cancelled successfully');
  });

  /**
   * Update order status (admin/vendor)
   * PATCH /api/orders/:id/status
   */
  static updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data: UpdateOrderStatusInput = req.body;
    const userId = req.userId!;
    
    const order = await OrderService.updateOrderStatus(id, data, userId);
    
    log.info('Order status updated via API', { 
      orderId: id, 
      userId, 
      newStatus: data.status,
      ip: req.ip 
    });

    return ResponseUtil.success(res, { order }, 'Order status updated successfully');
  });

  /**
   * Get user's orders
   * GET /api/orders/my-orders
   */
  static getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const query: Partial<OrderQueryInput> = req.query as any;
    
    const result = await OrderService.getUserOrders(userId, query);
    
    return ResponseUtil.paginated(
      res, 
      result.orders, 
      result.pagination, 
      'Your orders retrieved successfully'
    );
  });

  /**
   * Get order by order number
   * GET /api/orders/number/:orderNumber
   */
  static getOrderByNumber = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { orderNumber } = req.params;
    const userId = req.userId;
    
    const result = await OrderService.getOrders({
      orderNumber,
      page: 1,
      limit: 1,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    
    if (result.orders.length === 0) {
      return ResponseUtil.notFound(res, 'Order not found');
    }
    
    const order = result.orders[0];
    
    // Verify ownership if not admin
    if (userId && order.userId !== userId) {
      return ResponseUtil.forbidden(res, 'You do not have permission to view this order');
    }
    
    return ResponseUtil.success(res, { order }, 'Order retrieved successfully');
  });

  /**
   * Get recent orders
   * GET /api/orders/recent
   */
  static getRecentOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const limit = parseInt(req.query.limit as string) || 5;
    
    const result = await OrderService.getUserOrders(userId, {
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit,
      page: 1,
    });
    
    return ResponseUtil.success(
      res, 
      { orders: result.orders }, 
      'Recent orders retrieved successfully'
    );
  });

  /**
   * Get order statistics
   * GET /api/orders/stats
   */
  static getOrderStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const query: OrderStatsQueryInput = req.query as any;
    
    const stats = await OrderService.getOrderStats(query);
    
    return ResponseUtil.success(res, stats, 'Order statistics retrieved successfully');
  });

  /**
   * Get order summary for dashboard
   * GET /api/orders/summary
   */
  static getOrderSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    
    // Get user's order stats
    const userStats = await OrderService.getOrderStats({ userId });
    
    // Get recent orders by user
    const recentOrders = await OrderService.getUserOrders(userId, {
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    
    const summary = {
      totalOrders: userStats.totalOrders,
      pendingOrders: userStats.pendingOrders,
      deliveredOrders: userStats.deliveredOrders,
      totalSpent: userStats.totalRevenue,
      recentOrders: recentOrders.orders,
    };
    
    return ResponseUtil.success(res, summary, 'Order summary retrieved successfully');
  });

  /**
   * Get vendor orders (for vendor dashboard)
   * GET /api/orders/vendor-orders
   */
  static getVendorOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const query: Partial<OrderQueryInput> = req.query as any;
    
    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendorProfile) {
      return ResponseUtil.badRequest(res, 'You must have a vendor profile to view orders');
    }
    
    const result = await OrderService.getOrderStats({ vendorId: vendorProfile.id });
    
    return ResponseUtil.success(res, result, 'Vendor orders retrieved successfully');
  });
}