// Rich Message Types for Chat

export type MessageType = 'text' | 'image' | 'tour' | 'location' | 'itinerary'

export interface BaseMessage {
  id: string
  role: 'user' | 'assistant'
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  type: MessageType
}

export interface TextMessage extends BaseMessage {
  type: 'text'
  content: string
}

export interface ImageMessage extends BaseMessage {
  type: 'image'
  imageUrl: string
  caption?: string
  thumbnailUrl?: string
}

export interface TourCardData {
  id: string
  title: string
  description: string
  imageUrl: string
  duration: string
  price: number
  currency: string
  rating?: number
  reviewCount?: number
  highlights: string[]
  location: string
}

export interface TourMessage extends BaseMessage {
  type: 'tour'
  tour: TourCardData
}

export interface LocationData {
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  description?: string
  imageUrl?: string
}

export interface LocationMessage extends BaseMessage {
  type: 'location'
  location: LocationData
}

export interface ItineraryDay {
  day: number
  title: string
  activities: {
    time: string
    activity: string
    location: string
    description?: string
  }[]
}

export interface ItineraryData {
  title: string
  duration: string
  startDate?: string
  endDate?: string
  days: ItineraryDay[]
  totalCost?: number
  currency?: string
}

export interface ItineraryMessage extends BaseMessage {
  type: 'itinerary'
  itinerary: ItineraryData
}

export type RichMessage = TextMessage | ImageMessage | TourMessage | LocationMessage | ItineraryMessage
