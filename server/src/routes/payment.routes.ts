import { Router } from 'express';
import { createPaymentIntent, getPublishableKey } from '../controllers/payment.controller';

const router = Router();

// Get Stripe publishable key
router.get('/config', getPublishableKey);

// Create payment intent
router.post('/create-payment-intent', createPaymentIntent);

export default router;
