import { Tour } from '@/types/tour'
import { TourCard } from './TourCard'

export interface TourGridProps {
  tours: Tour[]
  isLoading?: boolean
}

export const TourGrid = ({ tours, isLoading }: TourGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tours found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Try adjusting your filters or search criteria
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  )
}
