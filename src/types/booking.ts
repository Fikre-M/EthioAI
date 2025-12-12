export interface AddOn {
  id: string
  name: string
  price: number
  description: string
  type: 'meal' | 'transport' | 'guide'
}

export interface BookingItem {
  id: string
  tourId: string
  tourName: string
  tourImage: string
  date: string
  participants: {
    adults: number
    children: number
  }
  pricePerAdult: number
  pricePerChild: number
  addOns: AddOn[]
  totalPrice: number
  meetingPoint: string
  duration: string
  specialRequests?: string
}

export interface BookingFormData {
  tourId: string
  date: string
  adults: number
  children: number
  selectedAddOns: string[]
  specialRequests?: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

export interface PromoCode {
  code: string
  discount: number // percentage or fixed amount
  type: 'percentage' | 'fixed'
  minPurchase?: number
  maxDiscount?: number
  expiryDate?: string
}

export interface TravelerDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  passportNumber?: string
  dietaryRequirements?: string
  medicalConditions?: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email: string
}

export interface CheckoutFormData {
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    postalCode: string
  }
  travelers: TravelerDetails[]
  emergencyContact: EmergencyContact
  travelInsurance: boolean
  termsAccepted: boolean
  marketingConsent: boolean
  specialRequests?: string
}

export interface CartState {
  items: BookingItem[]
  totalItems: number
  subtotal: number
  discount: number
  totalPrice: number
  appliedPromo: PromoCode | null
}
