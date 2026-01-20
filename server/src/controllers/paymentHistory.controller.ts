import { Request, Response } from "express";
import Stripe from "stripe";

// Initialize Stripe only if key is provided
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
} else {
  console.warn('⚠️ Stripe secret key not provided - Payment history features disabled');
}

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(400).json({ error: 'Stripe is not configured' });
    }

    const { customerId, limit = 10, startingAfter } = req.query;
    const payments = await stripe.charges.list({
      customer: customerId as string,
      limit: Number(limit) || 10,
      ...(startingAfter && { starting_after: startingAfter as string }),
    });
    res.json(payments.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
