// Tour Types

export interface MeetingPoint {
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  instructions: string
  contactPhone?: string
  contactEmail?: string
  meetingTime: string
  landmarks?: string[]
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  title: string
  comment: string
  date: Date
  helpful: number
  verified: boolean
  images?: string[]
}

export interface Tour {
  id: string
  title: string
  description: string
  shortDescription: string
  imageUrl: string
  images: string[]
  price: number
  currency: string
  duration: string
  durationDays: number
  location: string
  region: string
  category: TourCategory
  difficulty: TourDifficulty
  rating: number
  reviewCount: number
  maxGroupSize: number
  minAge: number
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: ItineraryDay[]
  guide: TourGuide
  availability: TourAvailability[]
  tags: string[]
  featured: boolean
  meetingPoint?: MeetingPoint
  reviews?: Review[]
  createdAt: Date
  updatedAt: Date
}

export type TourCategory = 
  | 'historical'
  | 'adventure'
  | 'cultural'
  | 'nature'
  | 'religious'
  | 'wildlife'
  | 'trekking'
  | 'city'

export type TourDifficulty = 'easy' | 'moderate' | 'challenging' | 'extreme'

export interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  meals: string[]
  accommodation?: string
}

export interface TourGuide {
  id: string
  name: string
  avatar: string
  languages: string[]
  rating: number
  toursGuided: number
}

export interface TourAvailability {
  startDate: Date
  endDate: Date
  availableSpots: number
  price: number
}

export interface TourFilters {
  search?: string
  category?: TourCategory[]
  priceRange?: [number, number]
  duration?: [number, number]
  difficulty?: TourDifficulty[]
  rating?: number
  region?: string[]
  sortBy?: 'price' | 'rating' | 'duration' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}

export interface TourSearchParams {
  page?: number
  limit?: number
  filters?: TourFilters
}
