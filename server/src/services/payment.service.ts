import { PrismaClient, Payment, PaymentStatus, PaymentMethod, Prisma } from '@prisma/client';
import Stripe from 'stripe';
import axios from 'axios';
import { 
  CreatePaymentIntentInput, 
  InitializeChapaPaymentInput,
  ConfirmPaymentInput,
  PaymentQueryInput,
  RefundPaymentInput,
  PaymentStatsQueryInput
} from '../schemas/payment.schemas';
import { 
  NotFoundError, 
  ValidationError,
  AppError 
} from '../middlewares/error.middleware';

// Custom payment error class
export class PaymentError extends AppError {
  constructor(message: string) {
    super(message, 400, 'PAYMENT_ERROR');
  }
}
import { calculatePagination, PaginationMeta } from '../utils/response';
import { log } from '../utils/logger';
import { config } from '../config/index';

const prisma = new PrismaClient();

// Initialize Stripe only if key is provided
let stripe: Stripe | null = null;

if (config.payment.stripe.secretKey) {
  stripe = new Stripe(config.payment.stripe.secretKey, {
    apiVersion: '2023-10-16',
  });
} else {
  console.warn('⚠️ Stripe secret key not provided - Stripe payments disabled');
}

export class PaymentService {
  /**
   * Create Stripe payment intent
   */
  static async createStripePaymentIntent(
    data: CreatePaymentIntentInput,
    userId: string
  ): Promise<{ clientSecret: string; paymentIntentId: string; payment: Payment }> {
    if (!stripe) {
      throw new PaymentError('Stripe is not configured');
    }
    // Verify booking or order exists
    if (data.bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: data.bookingId },
      });

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      if (booking.userId !== userId) {
        throw new ValidationError('You do not have permission to pay for this booking');
      }

      // Check if booking already has a completed payment
      const existingPayment = await prisma.payment.findFirst({
        where: {
          bookingId: data.bookingId,
          status: 'COMPLETED',
        },
      });

      if (existingPayment) {
        throw new ValidationError('Booking has already been paid');
      }
    }

    if (data.orderId) {
      const order = await prisma.order.findUnique({
        where: { id: data.orderId },
      });

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      if (order.userId !== userId) {
        throw new ValidationError('You do not have permission to pay for this order');
      }
    }

    try {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        metadata: {
          userId,
          bookingId: data.bookingId || '',
          orderId: data.orderId || '',
          ...data.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create payment record in database
      const payment = await prisma.payment.create({
        data: {
          paymentId: paymentIntent.id,
          userId,
          bookingId: data.bookingId,
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          method: 'STRIPE',
          status: 'PENDING',
          gatewayResponse: paymentIntent as any,
        },
      });

      log.info('Stripe payment intent created', {
        paymentId: payment.id,
        paymentIntentId: paymentIntent.id,
        userId,
        amount: data.amount,
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        payment,
      };
    } catch (error: any) {
      log.error('Failed to create Stripe payment intent', { error: error.message, userId });
      throw new PaymentError(`Failed to create payment intent: ${error.message}`);
    }
  }

  /**
   * Initialize Chapa payment
   */
  static async initializeChapaPayment(
    data: InitializeChapaPaymentInput,
    userId: string
  ): Promise<{ checkoutUrl: string; txRef: string; payment: Payment }> {
    // Verify booking or order exists
    if (data.bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: data.bookingId },
      });

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      if (booking.userId !== userId) {
        throw new ValidationError('You do not have permission to pay for this booking');
      }
    }

    if (data.orderId) {
      const order = await prisma.order.findUnique({
        where: { id: data.orderId },
      });

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      if (order.userId !== userId) {
        throw new ValidationError('You do not have permission to pay for this order');
      }
    }

    try {
      // Generate unique transaction reference
      const txRef = `CHAPA-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Initialize Chapa payment
      const response = await axios.post(
        'https://api.chapa.co/v1/transaction/initialize',
        {
          amount: data.amount,
          currency: data.currency,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone_number: data.phone,
          tx_ref: txRef,
          callback_url: data.callbackUrl || `${config.client.url}/payment/callback`,
          return_url: data.returnUrl,
          customization: data.customization,
        },
        {
          headers: {
            Authorization: `Bearer ${config.payment.chapa.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status !== 'success') {
        throw new PaymentError('Failed to initialize Chapa payment');
      }

      // Create payment record in database
      const payment = await prisma.payment.create({
        data: {
          paymentId: txRef,
          userId,
          bookingId: data.bookingId,
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          method: 'CHAPA',
          status: 'PENDING',
          gatewayResponse: response.data as any,
        },
      });

      log.info('Chapa payment initialized', {
        paymentId: payment.id,
        txRef,
        userId,
        amount: data.amount,
      });

      return {
        checkoutUrl: response.data.data.checkout_url,
        txRef,
        payment,
      };
    } catch (error: any) {
      log.error('Failed to initialize Chapa payment', { error: error.message, userId });
      throw new PaymentError(`Failed to initialize payment: ${error.message}`);
    }
  }

  /**
   * Confirm Stripe payment
   */
  static async confirmStripePayment(
    data: ConfirmPaymentInput,
    userId: string
  ): Promise<Payment> {
    if (!stripe) {
      throw new PaymentError('Stripe is not configured');
    }
    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(data.paymentIntentId);

      // Find payment in database
      const payment = await prisma.payment.findUnique({
        where: { paymentId: data.paymentIntentId },
      });

      if (!payment) {
        throw new NotFoundError('Payment not found');
      }

      if (payment.userId !== userId) {
        throw new ValidationError('You do not have permission to access this payment');
      }

      // Update payment status based on Stripe status
      let status: PaymentStatus = 'PENDING';
      if (paymentIntent.status === 'succeeded') {
        status = 'COMPLETED';
      } else if (paymentIntent.status === 'processing') {
        status = 'PROCESSING';
      } else if (paymentIntent.status === 'canceled' || paymentIntent.status === 'requires_payment_method') {
        status = 'FAILED';
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status,
          gatewayResponse: paymentIntent as any,
        },
      });

      // Update booking status if payment is completed
      if (status === 'COMPLETED' && payment.bookingId) {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: 'CONFIRMED' },
        });
      }

      log.info('Stripe payment confirmed', {
        paymentId: payment.id,
        status,
        userId,
      });

      return updatedPayment;
    } catch (error: any) {
      log.error('Failed to confirm Stripe payment', { error: error.message, userId });
      throw new PaymentError(`Failed to confirm payment: ${error.message}`);
    }
  }

  /**
   * Verify Chapa payment
   */
  static async verifyChapaPayment(txRef: string, userId: string): Promise<Payment> {
    try {
      // Verify payment with Chapa
      const response = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${txRef}`,
        {
          headers: {
            Authorization: `Bearer ${config.payment.chapa.secretKey}`,
          },
        }
      );

      // Find payment in database
      const payment = await prisma.payment.findUnique({
        where: { paymentId: txRef },
      });

      if (!payment) {
        throw new NotFoundError('Payment not found');
      }

      if (payment.userId !== userId) {
        throw new ValidationError('You do not have permission to access this payment');
      }

      // Update payment status based on Chapa status
      let status: PaymentStatus = 'PENDING';
      if (response.data.status === 'success' && response.data.data.status === 'success') {
        status = 'COMPLETED';
      } else if (response.data.data.status === 'failed') {
        status = 'FAILED';
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status,
          gatewayResponse: response.data as any,
        },
      });

      // Update booking status if payment is completed
      if (status === 'COMPLETED' && payment.bookingId) {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: 'CONFIRMED' },
        });
      }

      log.info('Chapa payment verified', {
        paymentId: payment.id,
        status,
        userId,
      });

      return updatedPayment;
    } catch (error: any) {
      log.error('Failed to verify Chapa payment', { error: error.message, userId });
      throw new PaymentError(`Failed to verify payment: ${error.message}`);
    }
  }

  /**
   * Get all payments with filtering and pagination
   */
  static async getPayments(query: PaymentQueryInput): Promise<{
    payments: Payment[];
    pagination: PaginationMeta;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      method,
      userId,
      bookingId,
      orderId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
    } = query;

    // Build where clause
    const where: Prisma.PaymentWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (method) {
      where.method = method;
    }

    if (userId) {
      where.userId = userId;
    }

    if (bookingId) {
      where.bookingId = bookingId;
    }

    if (orderId) {
      where.orderId = orderId;
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Amount range filter
    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) where.amount.gte = minAmount;
      if (maxAmount !== undefined) where.amount.lte = maxAmount;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build order by clause
    const orderBy: Prisma.PaymentOrderByWithRelationInput = {};
    if (sortBy === 'amount') {
      orderBy.amount = sortOrder;
    } else if (sortBy === 'status') {
      orderBy.status = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Execute queries
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          booking: {
            select: {
              bookingNumber: true,
              tour: {
                select: {
                  title: true,
                },
              },
            },
          },
          order: {
            select: {
              orderNumber: true,
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    const pagination = calculatePagination(page, limit, total);

    return {
      payments,
      pagination,
    };
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(id: string, userId?: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        booking: {
          include: {
            tour: true,
          },
        },
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Verify ownership if userId is provided
    if (userId && payment.userId !== userId) {
      throw new ValidationError('You do not have permission to view this payment');
    }

    return payment;
  }

  /**
   * Get user payments
   */
  static async getUserPayments(userId: string, query: Partial<PaymentQueryInput> = {}): Promise<{
    payments: Payment[];
    pagination: PaginationMeta;
  }> {
    return this.getPayments({
      ...query,
      userId,
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder || 'desc',
    } as PaymentQueryInput);
  }

  /**
   * Refund payment
   */
  static async refundPayment(data: RefundPaymentInput, userId: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id: data.paymentId },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    if (payment.status !== 'COMPLETED') {
      throw new ValidationError('Only completed payments can be refunded');
    }

    try {
      let refundAmount = data.amount || Number(payment.amount);

      if (payment.method === 'STRIPE') {
        // Create Stripe refund
        const refund = await stripe.refunds.create({
          payment_intent: payment.paymentId,
          amount: data.amount ? Math.round(data.amount * 100) : undefined,
          reason: 'requested_by_customer',
          metadata: {
            reason: data.reason,
            userId,
          },
        });

        // Update payment status
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
            failureReason: data.reason,
            gatewayResponse: { ...payment.gatewayResponse, refund } as any,
          },
        });

        // Update booking status if applicable
        if (payment.bookingId) {
          await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { status: 'REFUNDED' },
          });
        }

        log.info('Stripe payment refunded', {
          paymentId: payment.id,
          refundAmount,
          userId,
        });

        return updatedPayment;
      } else if (payment.method === 'CHAPA') {
        // Chapa doesn't have direct refund API, mark as refunded
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
            failureReason: data.reason,
          },
        });

        if (payment.bookingId) {
          await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { status: 'REFUNDED' },
          });
        }

        log.info('Chapa payment marked as refunded', {
          paymentId: payment.id,
          refundAmount,
          userId,
        });

        return updatedPayment;
      }

      throw new ValidationError('Unsupported payment method for refund');
    } catch (error: any) {
      log.error('Failed to refund payment', { error: error.message, paymentId: payment.id });
      throw new PaymentError(`Failed to refund payment: ${error.message}`);
    }
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStats(query: PaymentStatsQueryInput = {}): Promise<any> {
    const where: Prisma.PaymentWhereInput = {};

    if (query.method) {
      where.method = query.method;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = query.startDate;
      if (query.endDate) where.createdAt.lte = query.endDate;
    }

    const [
      totalPayments,
      completedPayments,
      failedPayments,
      refundedPayments,
      totalRevenue,
      stripeRevenue,
      chapaRevenue,
    ] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.payment.count({ where: { ...where, status: 'FAILED' } }),
      prisma.payment.count({ where: { ...where, status: 'REFUNDED' } }),
      prisma.payment.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { ...where, status: 'COMPLETED', method: 'STRIPE' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { ...where, status: 'COMPLETED', method: 'CHAPA' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalPayments,
      completedPayments,
      failedPayments,
      refundedPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
      stripeRevenue: stripeRevenue._sum.amount || 0,
      chapaRevenue: chapaRevenue._sum.amount || 0,
      successRate: totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0,
    };
  }

  /**
   * Get Stripe publishable key
   */
  static getStripePublishableKey(): string {
    return config.payment.stripe.publishableKey;
  }
}
