import { Request, Response } from "express";
import Stripe from "stripe";

// Initialize Stripe only if key is provided
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
} else {
  console.warn('⚠️ Stripe secret key not provided - Subscription features disabled');
}

export const createSubscription = async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(400).json({ error: 'Stripe is not configured' });
    }

    const { customerId, priceId, paymentMethodId } = req.body;

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    res.json(subscription);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
