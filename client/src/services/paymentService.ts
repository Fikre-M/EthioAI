// Payment Service for EthioAI - Stripe & Chapa/Telebirr Integration

export interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'mobile_money' | 'bank_transfer'
  provider: 'stripe' | 'chapa' | 'telebirr'
  icon: string
  description: string
  currencies: string[]
  countries: string[]
}

export interface PaymentRequest {
  amount: number
  currency: string
  paymentMethodId: string
  customerInfo: {
    name: string
    email: string
    phone?: string
  }
  bookingDetails: {
    bookingId: string
    items: any[]
    metadata: Record<string, any>
  }
}

export interface PaymentResponse {
  success: boolean
  paymentId: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  redirectUrl?: string
  qrCode?: string
  message: string
  transactionRef?: string
}

// Available payment methods
export const PAYMENT_METHODS: PaymentMethod[] = [
  // International Cards via Stripe
  {
    id: 'stripe_card',
    name: 'Credit/Debit Card',
    type: 'card',
    provider: 'stripe',
    icon: '💳',
    description: 'Visa, Mastercard, American Express',
    currencies: ['USD', 'EUR', 'GBP', 'ETB'],
    countries: ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'ET']
  },
  
  // Ethiopian Mobile Money via Chapa
  {
    id: 'chapa_telebirr',
    name: 'Telebirr',
    type: 'mobile_money',
    provider: 'chapa',
    icon: '📱',
    description: 'Ethiopian mobile money service',
    currencies: ['ETB'],
    countries: ['ET']
  },
  {
    id: 'chapa_cbe',
    name: 'CBE Birr',
    type: 'mobile_money',
    provider: 'chapa',
    icon: '🏦',
    description: 'Commercial Bank of Ethiopia',
    currencies: ['ETB'],
    countries: ['ET']
  },
  {
    id: 'chapa_awash',
    name: 'Awash Bank',
    type: 'bank_transfer',
    provider: 'chapa',
    icon: '🏛️',
    description: 'Bank transfer via Awash Bank',
    currencies: ['ETB'],
    countries: ['ET']
  }
]

class PaymentService {
  private apiBaseUrl: string

  constructor() {
    this.apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api'
  }

  /**
   * Get available payment methods based on user location and currency
   */
  getAvailablePaymentMethods(currency: string = 'USD', country: string = 'US'): PaymentMethod[] {
    return PAYMENT_METHODS.filter(method => 
      method.currencies.includes(currency) && method.countries.includes(country)
    )
  }

  /**
   * Process payment based on selected method
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const method = PAYMENT_METHODS.find(m => m.id === paymentRequest.paymentMethodId)
    
    if (!method) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        message: 'Invalid payment method selected',
      }
    }

    // Mock payment processing for development
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      success: true,
      paymentId: `${method.provider}_mock_${Date.now()}`,
      status: 'completed',
      message: `Payment completed successfully via ${method.name} (Mock)`,
      transactionRef: `TXN_MOCK_${Date.now()}`,
    }
  }

  /**
   * Get payment method by ID
   */
  getPaymentMethod(methodId: string): PaymentMethod | undefined {
    return PAYMENT_METHODS.find(method => method.id === methodId)
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }
}

export const paymentService = new PaymentService()
export default paymentService