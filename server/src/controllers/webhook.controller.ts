import { Request, Response } from "express";
import Stripe from "stripe";
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { log } from '../utils/logger';
import { EmailService } from '../services/email.service';
import { BookingService } from '../services/booking.service';
import { PaymentService } from '../services/payment.service';

// Initialize Stripe only if key is provided
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
} else {
  console.warn('⚠️ Stripe secret key not provided - Stripe webhooks disabled');
}

const prisma = new PrismaClient();

export class WebhookController {
  /**
   * Handle Stripe webhooks with proper verification
   */
  static async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    if (!stripe) {
      log.error('Stripe not configured for webhooks');
      res.status(500).json({ error: 'Stripe not configured' });
      return;
    }

    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    
    if (!endpointSecret) {
      log.error('Stripe webhook secret not configured');
      res.status(500).json({ error: 'Webhook configuration error' });
      return;
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      
      log.info('Stripe webhook received', {
        type: event.type,
        id: event.id,
        created: event.created
      });
    } catch (err: any) {
      log.error('Stripe webhook signature verification failed', {
        error: err.message,
        signature: sig?.substring(0, 20) + '...'
      });
      res.status(400).json({ error: `Webhook Error: ${err.message}` });
      return;
    }

    try {
      // Process webhook event
      await WebhookController.processStripeEvent(event);
      
      log.info('Stripe webhook processed successfully', {
        type: event.type,
        id: event.id
      });
      
      res.json({ received: true });
    } catch (error: any) {
      log.error('Stripe webhook processing failed', {
        type: event.type,
        id: event.id,
        error: error.message
      });
      
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  /**
   * Handle Chapa webhooks with proper verification
   */
  static async handleChapaWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers['chapa-signature'] as string;
    const secret = process.env.CHAPA_WEBHOOK_SECRET || '';
    
    if (!secret) {
      log.error('Chapa webhook secret not configured');
      res.status(500).json({ error: 'Webhook configuration error' });
      return;
    }

    try {
      // Verify Chapa webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (!crypto.timingSafeEqual(
        Buffer.from(signature || '', 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )) {
        log.security('Chapa webhook signature verification failed', undefined, undefined, {
          providedSignature: signature?.substring(0, 20) + '...',
          expectedSignature: expectedSignature.substring(0, 20) + '...'
        });
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      log.info('Chapa webhook received', {
        event: req.body.event,
        tx_ref: req.body.tx_ref
      });

      // Process Chapa webhook event
      await WebhookController.processChapaEvent(req.body);
      
      log.info('Chapa webhook processed successfully', {
        event: req.body.event,
        tx_ref: req.body.tx_ref
      });
      
      res.json({ received: true });
    } catch (error: any) {
      log.error('Chapa webhook processing failed', {
        event: req.body.event,
        error: error.message
      });
      
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  /**
   * Process Stripe webhook events
   */
  private static async processStripeEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "payment_intent.succeeded":
        await WebhookController.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await WebhookController.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.canceled":
        await WebhookController.handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.dispute.created":
        await WebhookController.handleChargeDispute(event.data.object as Stripe.Dispute);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await WebhookController.handleSubscriptionEvent(event);
        break;

      case "invoice.payment_succeeded":
        await WebhookController.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await WebhookController.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "account.updated":
        await WebhookController.handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        log.info('Unhandled Stripe webhook event type', { type: event.type });
    }
  }

  /**
   * Process Chapa webhook events
   */
  private static async processChapaEvent(data: any): Promise<void> {
    switch (data.event) {
      case "charge.success":
        await WebhookController.handleChapaChargeSuccess(data);
        break;

      case "charge.failed":
        await WebhookController.handleChapaChargeFailed(data);
        break;

      case "transfer.success":
        await WebhookController.handleChapaTransferSuccess(data);
        break;

      case "transfer.failed":
        await WebhookController.handleChapaTransferFailed(data);
        break;

      default:
        log.info('Unhandled Chapa webhook event type', { event: data.event });
    }
  }

  // Stripe Event Handlers

  private static async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      // Find payment record
      const payment = await prisma.payment.findUnique({
        where: { paymentId: paymentIntent.id },
        include: {
          booking: {
            include: {
              user: true,
              tour: true
            }
          },
          user: true
        }
      });

      if (!payment) {
        log.error('Payment not found for successful payment intent', {
          paymentIntentId: paymentIntent.id
        });
        return;
      }

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          gatewayResponse: paymentIntent as any,
          updatedAt: new Date()
        }
      });

      // Update booking status if this is a booking payment
      if (payment.booking) {
        await prisma.booking.update({
          where: { id: payment.booking.id },
          data: {
            status: 'CONFIRMED',
            updatedAt: new Date()
          }
        });

        // Send booking confirmation email
        await EmailService.sendBookingConfirmation(
          payment.booking.user.email,
          payment.booking.user.name || 'Customer',
          {
            bookingNumber: payment.booking.bookingNumber,
            tourTitle: payment.booking.tour.title,
            startDate: payment.booking.startDate.toDateString(),
            endDate: payment.booking.endDate.toDateString(),
            totalPrice: Number(payment.booking.totalPrice),
            participants: payment.booking.adults + payment.booking.children
          }
        );

        // Send payment confirmation email
        await EmailService.sendPaymentConfirmation(
          payment.user.email,
          payment.user.name || 'Customer',
          {
            amount: Number(payment.amount),
            currency: payment.currency,
            paymentMethod: payment.method,
            bookingNumber: payment.booking.bookingNumber,
            tourTitle: payment.booking.tour.title
          }
        );
      }

      log.info('Payment intent succeeded processed', {
        paymentId: payment.id,
        bookingId: payment.bookingId,
        amount: payment.amount
      });
    } catch (error) {
      log.error('Failed to process payment intent succeeded', error);
      throw error;
    }
  }

  private static async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      // Find payment record
      const payment = await prisma.payment.findUnique({
        where: { paymentId: paymentIntent.id },
        include: {
          booking: {
            include: {
              user: true,
              tour: true
            }
          },
          user: true
        }
      });

      if (!payment) {
        log.error('Payment not found for failed payment intent', {
          paymentIntentId: paymentIntent.id
        });
        return;
      }

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
          gatewayResponse: paymentIntent as any,
          updatedAt: new Date()
        }
      });

      // Update booking status if this is a booking payment
      if (payment.booking) {
        await prisma.booking.update({
          where: { id: payment.booking.id },
          data: {
            status: 'CANCELLED',
            updatedAt: new Date()
          }
        });

        // Send payment failure notification
        await EmailService.sendEmail({
          to: payment.user.email,
          subject: 'Payment Failed - Booking Cancelled',
          html: `
            <h2>Payment Failed</h2>
            <p>Hello ${payment.user.name || 'Customer'},</p>
            <p>Unfortunately, your payment for booking ${payment.booking.bookingNumber} has failed.</p>
            <p><strong>Reason:</strong> ${paymentIntent.last_payment_error?.message || 'Payment processing error'}</p>
            <p>Your booking has been cancelled. Please try booking again or contact support if you need assistance.</p>
            <p>Best regards,<br>The EthioAI Tourism Team</p>
          `,
          text: `Payment failed for booking ${payment.booking.bookingNumber}. Reason: ${paymentIntent.last_payment_error?.message || 'Payment processing error'}`
        });
      }

      log.info('Payment intent failed processed', {
        paymentId: payment.id,
        bookingId: payment.bookingId,
        reason: paymentIntent.last_payment_error?.message
      });
    } catch (error) {
      log.error('Failed to process payment intent failed', error);
      throw error;
    }
  }

  private static async handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      // Find payment record
      const payment = await prisma.payment.findUnique({
        where: { paymentId: paymentIntent.id },
        include: {
          booking: {
            include: {
              user: true,
              tour: true
            }
          }
        }
      });

      if (!payment) {
        return;
      }

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason: 'Payment cancelled',
          gatewayResponse: paymentIntent as any,
          updatedAt: new Date()
        }
      });

      // Update booking status if this is a booking payment
      if (payment.booking) {
        await prisma.booking.update({
          where: { id: payment.booking.id },
          data: {
            status: 'CANCELLED',
            updatedAt: new Date()
          }
        });
      }

      log.info('Payment intent canceled processed', {
        paymentId: payment.id,
        bookingId: payment.bookingId
      });
    } catch (error) {
      log.error('Failed to process payment intent canceled', error);
      throw error;
    }
  }

  private static async handleChargeDispute(dispute: Stripe.Dispute): Promise<void> {
    try {
      // Find payment record by charge ID
      const payment = await prisma.payment.findFirst({
        where: {
          gatewayResponse: {
            path: ['latest_charge'],
            equals: dispute.charge
          }
        },
        include: {
          booking: {
            include: {
              user: true,
              tour: true
            }
          },
          user: true
        }
      });

      if (!payment) {
        log.error('Payment not found for dispute', {
          chargeId: dispute.charge,
          disputeId: dispute.id
        });
        return;
      }

      // Send admin notification about dispute
      await EmailService.sendAdminNotification(
        'Payment Dispute Created',
        `A payment dispute has been created for booking ${payment.booking?.bookingNumber || 'N/A'}`,
        {
          disputeId: dispute.id,
          chargeId: dispute.charge,
          amount: dispute.amount,
          reason: dispute.reason,
          status: dispute.status,
          paymentId: payment.id,
          bookingId: payment.bookingId,
          customerEmail: payment.user.email
        }
      );

      log.info('Charge dispute processed', {
        disputeId: dispute.id,
        paymentId: payment.id,
        amount: dispute.amount,
        reason: dispute.reason
      });
    } catch (error) {
      log.error('Failed to process charge dispute', error);
      throw error;
    }
  }

  private static async handleSubscriptionEvent(event: Stripe.Event): Promise<void> {
    // Handle subscription events if you have subscription features
    log.info('Subscription event received', {
      type: event.type,
      subscriptionId: (event.data.object as any).id
    });
  }

  private static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    // Handle successful invoice payments
    log.info('Invoice payment succeeded', {
      invoiceId: invoice.id,
      amount: invoice.amount_paid
    });
  }

  private static async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    // Handle failed invoice payments
    log.info('Invoice payment failed', {
      invoiceId: invoice.id,
      amount: invoice.amount_due
    });
  }

  private static async handleAccountUpdated(account: Stripe.Account): Promise<void> {
    // Handle account updates (for marketplace features)
    log.info('Stripe account updated', {
      accountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled
    });
  }

  // Chapa Event Handlers

  private static async handleChapaChargeSuccess(data: any): Promise<void> {
    try {
      // Find payment record by transaction reference
      const payment = await prisma.payment.findFirst({
        where: {
          gatewayResponse: {
            path: ['tx_ref'],
            equals: data.tx_ref
          }
        },
        include: {
          booking: {
            include: {
              user: true,
              tour: true
            }
          },
          user: true
        }
      });

      if (!payment) {
        log.error('Payment not found for Chapa charge success', {
          tx_ref: data.tx_ref
        });
        return;
      }

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          gatewayResponse: data,
          updatedAt: new Date()
        }
      });

      // Update booking status if this is a booking payment
      if (payment.booking) {
        await prisma.booking.update({
          where: { id: payment.booking.id },
          data: {
            status: 'CONFIRMED',
            updatedAt: new Date()
          }
        });

        // Send confirmation emails (similar to Stripe success handler)
        await EmailService.sendBookingConfirmation(
          payment.booking.user.email,
          payment.booking.user.name || 'Customer',
          {
            bookingNumber: payment.booking.bookingNumber,
            tourTitle: payment.booking.tour.title,
            startDate: payment.booking.startDate.toDateString(),
            endDate: payment.booking.endDate.toDateString(),
            totalPrice: Number(payment.booking.totalPrice),
            participants: payment.booking.adults + payment.booking.children
          }
        );
      }

      log.info('Chapa charge success processed', {
        paymentId: payment.id,
        tx_ref: data.tx_ref,
        amount: data.amount
      });
    } catch (error) {
      log.error('Failed to process Chapa charge success', error);
      throw error;
    }
  }

  private static async handleChapaChargeFailed(data: any): Promise<void> {
    try {
      // Find payment record by transaction reference
      const payment = await prisma.payment.findFirst({
        where: {
          gatewayResponse: {
            path: ['tx_ref'],
            equals: data.tx_ref
          }
        },
        include: {
          booking: {
            include: {
              user: true,
              tour: true
            }
          },
          user: true
        }
      });

      if (!payment) {
        log.error('Payment not found for Chapa charge failed', {
          tx_ref: data.tx_ref
        });
        return;
      }

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason: data.message || 'Payment failed',
          gatewayResponse: data,
          updatedAt: new Date()
        }
      });

      // Update booking status if this is a booking payment
      if (payment.booking) {
        await prisma.booking.update({
          where: { id: payment.booking.id },
          data: {
            status: 'CANCELLED',
            updatedAt: new Date()
          }
        });

        // Send failure notification
        await EmailService.sendEmail({
          to: payment.user.email,
          subject: 'Payment Failed - Booking Cancelled',
          html: `
            <h2>Payment Failed</h2>
            <p>Hello ${payment.user.name || 'Customer'},</p>
            <p>Unfortunately, your payment for booking ${payment.booking.bookingNumber} has failed.</p>
            <p><strong>Reason:</strong> ${data.message || 'Payment processing error'}</p>
            <p>Your booking has been cancelled. Please try booking again or contact support if you need assistance.</p>
            <p>Best regards,<br>The EthioAI Tourism Team</p>
          `,
          text: `Payment failed for booking ${payment.booking.bookingNumber}. Reason: ${data.message || 'Payment processing error'}`
        });
      }

      log.info('Chapa charge failed processed', {
        paymentId: payment.id,
        tx_ref: data.tx_ref,
        reason: data.message
      });
    } catch (error) {
      log.error('Failed to process Chapa charge failed', error);
      throw error;
    }
  }

  private static async handleChapaTransferSuccess(data: any): Promise<void> {
    // Handle successful transfers (for marketplace payouts)
    log.info('Chapa transfer success', {
      tx_ref: data.tx_ref,
      amount: data.amount
    });
  }

  private static async handleChapaTransferFailed(data: any): Promise<void> {
    // Handle failed transfers
    log.info('Chapa transfer failed', {
      tx_ref: data.tx_ref,
      reason: data.message
    });
  }

  /**
   * Webhook health check endpoint
   */
  static async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      webhooks: {
        stripe: {
          configured: !!process.env.STRIPE_WEBHOOK_SECRET,
          endpoint: '/api/webhooks/stripe'
        },
        chapa: {
          configured: !!process.env.CHAPA_WEBHOOK_SECRET,
          endpoint: '/api/webhooks/chapa'
        }
      }
    });
  }
}

// Legacy export for backward compatibility
export const handleWebhook = WebhookController.handleStripeWebhook;
