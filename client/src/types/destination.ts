export interface Destination {
  id: string
  name: string
  description: string
  shortDescription: string
  imageUrl: string
  images: string[]
  location: string
  region: string
  category: string[]
  rating: number
  reviewCount: number
  featured: boolean
  tags: string[]
  tours: string[]
  highlights: string[]
  bestTimeToVisit: string
  weather: {
    temperature: string
    season: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface DestinationFilters {
  searchQuery?: string
  regions?: string[]
  categories?: string[]
  minRating?: number
  tags?: string[]
  sortBy?: 'name' | 'rating' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}
