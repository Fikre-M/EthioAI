import { PrismaClient, Order, OrderStatus, Prisma } from '@prisma/client';
import { 
  CreateOrderInput, 
  UpdateOrderInput, 
  OrderQueryInput,
  UpdateOrderStatusInput,
  CancelOrderInput,
  OrderStatsQueryInput,
  ValidateCartInput
} from '../schemas/order.schemas';
import { 
  NotFoundError, 
  ValidationError, 
  ForbiddenError 
} from '../middlewares/error.middleware';
import { calculatePagination, PaginationMeta } from '../utils/response';
import { log } from '../utils/logger';

const prisma = new PrismaClient();

export class OrderService {
  /**
   * Generate unique order number
   */
  private static async generateOrderNumber(): Promise<string> {
    const prefix = 'ORD';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `${prefix}${timestamp}${random}`;
    
    // Check if order number already exists
    const existing = await prisma.order.findUnique({
      where: { orderNumber },
    });
    
    if (existing) {
      // Recursively generate new number if collision
      return this.generateOrderNumber();
    }
    
    return orderNumber;
  }

  /**
   * Validate cart items and calculate totals
   */
  static async validateCart(data: ValidateCartInput): Promise<{
    valid: boolean;
    items: any[];
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    const validatedItems: any[] = [];
    let subtotal = 0;

    for (const item of data.items) {
      // Get product details
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          vendor: true,
        },
      });

      if (!product) {
        errors.push(`Product ${item.productId} not found`);
        continue;
      }

      if (product.status !== 'PUBLISHED') {
        errors.push(`Product ${product.name} is not available`);
        continue;
      }

      if (product.stock < item.quantity) {
        errors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        continue;
      }

      const itemPrice = Number(product.discountPrice || product.price);
      const itemTotal = itemPrice * item.quantity;

      validatedItems.push({
        productId: product.id,
        product,
        quantity: item.quantity,
        price: itemPrice,
        total: itemTotal,
        variant: item.variant,
      });

      subtotal += itemTotal;
    }

    // Calculate tax (10% for now)
    const tax = subtotal * 0.1;

    // Calculate shipping (free for orders over $100)
    const shipping = subtotal > 100 ? 0 : 10;

    // Calculate discount (promo code validation would go here)
    let discount = 0;
    if (data.promoCode) {
      const promoCode = await prisma.promoCode.findUnique({
        where: { code: data.promoCode.toUpperCase() },
      });

      if (promoCode && promoCode.isActive && promoCode.applicableToProducts) {
        const now = new Date();
        if (now >= promoCode.validFrom && now <= promoCode.validUntil) {
          if (!promoCode.minOrderAmount || subtotal >= Number(promoCode.minOrderAmount)) {
            if (promoCode.discountType === 'percentage') {
              discount = (subtotal * Number(promoCode.discountValue)) / 100;
              if (promoCode.maxDiscount) {
                discount = Math.min(discount, Number(promoCode.maxDiscount));
              }
            } else {
              discount = Number(promoCode.discountValue);
            }
          }
        }
      }
    }

    const total = Math.max(0, subtotal + tax + shipping - discount);

    return {
      valid: errors.length === 0,
      items: validatedItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      errors,
    };
  }

  /**
   * Create a new order
   */
  static async createOrder(data: CreateOrderInput, userId: string): Promise<Order> {
    // Validate cart
    const cartValidation = await this.validateCart({
      items: data.items,
      promoCode: data.promoCode,
    });

    if (!cartValidation.valid) {
      throw new ValidationError(`Cart validation failed: ${cartValidation.errors.join(', ')}`);
    }

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          subtotal: cartValidation.subtotal,
          tax: cartValidation.tax,
          shipping: cartValidation.shipping,
          discount: cartValidation.discount,
          total: cartValidation.total,
          status: 'PENDING',
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress || data.shippingAddress,
          notes: data.notes,
        },
      });

      // Create order items and update product stock
      for (const item of cartValidation.items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            variant: item.variant || null,
          },
        });

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Fetch complete order with relations
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                vendor: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    log.info('Order created', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId,
      total: order.total,
      itemCount: data.items.length,
    });

    return completeOrder!;
  }

  /**
   * Get all orders with filtering and pagination
   */
  static async getOrders(query: OrderQueryInput): Promise<{
    orders: Order[];
    pagination: PaginationMeta;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      userId,
      startDate,
      endDate,
      minTotal,
      maxTotal,
      search,
      orderNumber,
    } = query;

    // Build where clause
    const where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (orderNumber) {
      where.orderNumber = { contains: orderNumber };
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Total range filter
    if (minTotal !== undefined || maxTotal !== undefined) {
      where.total = {};
      if (minTotal !== undefined) where.total.gte = minTotal;
      if (maxTotal !== undefined) where.total.lte = maxTotal;
    }

    // Search filter
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build order by clause
    const orderBy: Prisma.OrderOrderByWithRelationInput = {};
    if (sortBy === 'total') {
      orderBy.total = sortOrder;
    } else if (sortBy === 'status') {
      orderBy.status = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Execute queries
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true,
                  vendor: {
                    select: {
                      businessName: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const pagination = calculatePagination(page, limit, total);

    return {
      orders,
      pagination,
    };
  }

  /**
   * Get order by ID
   */
  static async getOrderById(id: string, userId?: string): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                vendor: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Verify ownership if userId is provided
    if (userId && order.userId !== userId) {
      throw new ForbiddenError('You do not have permission to view this order');
    }

    return order;
  }

  /**
   * Update order
   */
  static async updateOrder(id: string, data: UpdateOrderInput, userId: string): Promise<Order> {
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundError('Order not found');
    }

    // Verify ownership
    if (existingOrder.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this order');
    }

    // Cannot update shipped or delivered orders
    if (['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(existingOrder.status)) {
      throw new ValidationError(`Cannot update order with status: ${existingOrder.status}`);
    }

    const order = await prisma.order.update({
      where: { id },
      data,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    log.info('Order updated', { orderId: id, userId });

    return order;
  }

  /**
   * Cancel order
   */
  static async cancelOrder(id: string, data: CancelOrderInput, userId: string): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Verify ownership
    if (order.userId !== userId) {
      throw new ForbiddenError('You do not have permission to cancel this order');
    }

    // Cannot cancel shipped or delivered orders
    if (['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status)) {
      throw new ValidationError(`Cannot cancel order with status: ${order.status}`);
    }

    // Update order and restore stock in transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const cancelledOrder = await tx.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: data.reason,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      // Restore product stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return cancelledOrder;
    });

    log.info('Order cancelled', {
      orderId: id,
      userId,
      reason: data.reason,
      requestRefund: data.requestRefund,
    });

    // TODO: Process refund if requested
    if (data.requestRefund) {
      log.info('Refund requested', { orderId: id, userId });
    }

    return updatedOrder;
  }

  /**
   * Update order status (admin/vendor only)
   */
  static async updateOrderStatus(
    id: string, 
    data: UpdateOrderStatusInput, 
    userId: string
  ): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        trackingNumber: data.trackingNumber,
        notes: data.reason ? `${order.notes || ''}\n\nStatus Update: ${data.reason}` : order.notes,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    log.info('Order status updated', {
      orderId: id,
      userId,
      oldStatus: order.status,
      newStatus: data.status,
      reason: data.reason,
      trackingNumber: data.trackingNumber,
    });

    return updatedOrder;
  }

  /**
   * Get user orders
   */
  static async getUserOrders(userId: string, query: Partial<OrderQueryInput> = {}): Promise<{
    orders: Order[];
    pagination: PaginationMeta;
  }> {
    return this.getOrders({
      ...query,
      userId,
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder || 'desc',
    } as OrderQueryInput);
  }

  /**
   * Get order statistics
   */
  static async getOrderStats(query: OrderStatsQueryInput = {}): Promise<any> {
    const where: Prisma.OrderWhereInput = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.vendorId) {
      where.items = {
        some: {
          product: {
            vendorId: query.vendorId,
          },
        },
      };
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = query.startDate;
      if (query.endDate) where.createdAt.lte = query.endDate;
    }

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.count({ where: { ...where, status: 'PENDING' } }),
      prisma.order.count({ where: { ...where, status: 'PROCESSING' } }),
      prisma.order.count({ where: { ...where, status: 'SHIPPED' } }),
      prisma.order.count({ where: { ...where, status: 'DELIVERED' } }),
      prisma.order.count({ where: { ...where, status: 'CANCELLED' } }),
      prisma.order.aggregate({
        where: { ...where, status: { in: ['DELIVERED', 'SHIPPED', 'PROCESSING'] } },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      averageOrderValue: totalOrders > 0 
        ? Number(totalRevenue._sum.total || 0) / totalOrders 
        : 0,
      fulfillmentRate: totalOrders > 0 
        ? ((deliveredOrders + shippedOrders) / totalOrders) * 100 
        : 0,
    };
  }
}