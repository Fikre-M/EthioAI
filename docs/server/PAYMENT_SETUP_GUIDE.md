# Payment Integration Setup Guide

## Quick Start

### 1. Install Required Packages

```bash
cd server
npm install stripe@latest axios
```

### 2. Get API Keys

#### Stripe (International Payments)
1. Go to https://dashboard.stripe.com/register
2. Create an account or login
3. Navigate to **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)
6. For webhooks: **Developers** → **Webhooks** → **Add endpoint**
   - URL: `https://your-domain.com/api/payments/stripe/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the **Signing secret** (starts with `whsec_`)

#### Chapa (Ethiopian Payments)
1. Go to https://dashboard.chapa.co
2. Create an account
3. Navigate to **Settings** → **API Keys**
4. Copy your **Secret Key**
5. Copy your **Public Key**

### 3. Update Environment Variables

Edit `server/.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret

# Chapa Configuration
CHAPA_SECRET_KEY=your_actual_chapa_secret_key
CHAPA_PUBLIC_KEY=your_actual_chapa_public_key
```

### 4. Test the Integration

```bash
cd server
npm run dev
```

In another terminal:
```bash
cd server
npx tsx test-payment.ts
```

## Payment Methods Supported

### 1. Stripe
- **Credit/Debit Cards**: Visa, Mastercard, Amex, etc.
- **Digital Wallets**: Apple Pay, Google Pay
- **Bank Transfers**: ACH, SEPA
- **Buy Now Pay Later**: Klarna, Afterpay
- **Currencies**: USD, EUR, GBP, and 135+ more

### 2. Chapa (Ethiopia)
- **Mobile Money**: Telebirr, M-Pesa
- **Bank Transfers**: CBE Birr, Commercial Bank of Ethiopia
- **Cards**: Local and international cards
- **Currency**: ETB (Ethiopian Birr), USD

## Testing Payment Flows

### Test Stripe Payment

```bash
# Create payment intent
curl -X POST http://localhost:5000/api/payments/stripe/create-intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "your-booking-id",
    "amount": 100,
    "currency": "USD"
  }'
```

### Test Chapa Payment

```bash
# Initialize payment
curl -X POST http://localhost:5000/api/payments/chapa/initialize \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "your-booking-id",
    "amount": 5000,
    "currency": "ETB",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "returnUrl": "http://localhost:3001/payment/success"
  }'
```

## Stripe Test Cards

Use these test card numbers in development:

| Card Number | Description |
|------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Payment declined |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |
| 4000 0000 0000 0341 | Charge succeeds but card is declined |

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## Webhook Setup

### Local Development (Using Stripe CLI)

1. Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:5000/api/payments/stripe/webhook
```

4. Copy the webhook signing secret and add to `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Production Webhook Setup

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your production URL: `https://your-domain.com/api/payments/stripe/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`
5. Copy the signing secret to your production `.env`

## Common Issues & Solutions

### Issue: "No such payment_intent"
**Solution**: Make sure you're using the correct API key (test vs production)

### Issue: "Invalid API Key"
**Solution**: Check that your `.env` file is loaded and keys are correct

### Issue: "Webhook signature verification failed"
**Solution**: Ensure you're using the raw request body for webhook verification

### Issue: Chapa payment not initializing
**Solution**: Verify your Chapa API keys and check if your account is activated

### Issue: Payment intent creation fails
**Solution**: Check that the booking/order exists and belongs to the user

## Security Best Practices

1. **Never expose secret keys**: Keep them in `.env` file, never commit to git
2. **Use HTTPS in production**: Required for PCI compliance
3. **Verify webhook signatures**: Prevent unauthorized webhook calls
4. **Validate amounts**: Always verify payment amounts match booking totals
5. **Log all transactions**: Keep audit trail for debugging and compliance
6. **Handle errors gracefully**: Show user-friendly error messages
7. **Test refund flows**: Ensure refunds work correctly before going live

## Going Live Checklist

- [ ] Replace test API keys with production keys
- [ ] Set up production webhook endpoints
- [ ] Test payment flow end-to-end
- [ ] Test refund flow
- [ ] Verify email notifications work
- [ ] Check error handling and logging
- [ ] Review security settings
- [ ] Test with real payment methods
- [ ] Set up monitoring and alerts
- [ ] Document payment policies for users

## Support

### Stripe Support
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

### Chapa Support
- Documentation: https://developer.chapa.co/docs
- Support: support@chapa.co

## Additional Resources

- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Chapa Integration Guide](https://developer.chapa.co/docs/getting-started)
- [PCI Compliance](https://stripe.com/docs/security/guide)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
