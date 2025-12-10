import { Link } from 'react-router-dom'
import { useTours } from '@/hooks/useTours'
import { Tour } from '@/types/tour'

// Helper function to find best value in comparison
const findBestValue = (tours: Tour[], key: keyof Tour, type: 'lowest' | 'highest' = 'lowest') => {
  if (tours.length === 0) return null
  
  const values = tours.map(tour => {
    const value = tour[key]
    return typeof value === 'number' ? value : 0
  })
  
  return type === 'lowest' ? Math.min(...values) : Math.max(...values)
}

// Helper to check if value is best
const isBestValue = (value: number, bestValue: number | null, type: 'lowest' | 'highest' = 'lowest') => {
  if (bestValue === null) return false
  return type === 'lowest' ? value === bestValue : value === bestValue
}

export const TourComparisonPage = () => {
  const { comparisonTours, removeTourFromComparison, resetComparison } = useTours()
  
  // Calculate best values for highlighting
  const bestPrice = findBestValue(comparisonTours, 'price', 'lowest')
  const bestRating = findBestValue(comparisonTours, 'rating', 'highest')
  const bestDuration = findBestValue(comparisonTours, 'durationDays', 'lowest')

  if (comparisonTours.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center py-16">
          <svg
            className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No tours to compare
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add up to 3 tours to compare their features side by side
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Compare Tours
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comparing {comparisonTours.length} {comparisonTours.length === 1 ? 'tour' : 'tours'} side by side
            </p>
          </div>

          <button
            onClick={resetComparison}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        </div>

        {/* Legend */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-green-600 dark:text-green-400">Green highlights</span> indicate the best value in each category
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                Feature
              </th>
              {comparisonTours.map((tour) => (
                <th
                  key={tour.id}
                  className="p-4 text-center border-b border-l border-gray-200 dark:border-gray-700"
                >
                  <div className="relative">
                    <button
                      onClick={() => removeTourFromComparison(tour.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      aria-label="Remove from comparison"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <img
                      src={tour.imageUrl}
                      alt={tour.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {tour.title}
                    </h3>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price
                </div>
              </td>
              {comparisonTours.map((tour) => {
                const isLowest = isBestValue(tour.price, bestPrice, 'lowest')
                return (
                  <td 
                    key={tour.id} 
                    className={`p-4 text-center border-l border-gray-200 dark:border-gray-700 ${
                      isLowest ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-lg font-bold ${isLowest ? 'text-green-600 dark:text-green-400' : 'text-orange-600'}`}>
                        {tour.currency} {tour.price.toLocaleString()}
                      </span>
                      {isLowest && (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Best Price
                        </span>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>

            {/* Duration */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration
                </div>
              </td>
              {comparisonTours.map((tour) => {
                const isShortest = isBestValue(tour.durationDays, bestDuration, 'lowest')
                return (
                  <td 
                    key={tour.id} 
                    className={`p-4 text-center border-l border-gray-200 dark:border-gray-700 ${
                      isShortest ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className={isShortest ? 'font-semibold text-green-600 dark:text-green-400' : ''}>
                        {tour.duration}
                      </span>
                      {isShortest && (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">Shortest</span>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>

            {/* Rating */}
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Rating
                </div>
              </td>
              {comparisonTours.map((tour) => {
                const isHighest = isBestValue(tour.rating, bestRating, 'highest')
                return (
                  <td 
                    key={tour.id} 
                    className={`p-4 text-center border-l border-gray-200 dark:border-gray-700 ${
                      isHighest ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className={`font-semibold ${isHighest ? 'text-green-600 dark:text-green-400' : ''}`}>
                          {tour.rating}
                        </span>
                        <span className="text-sm text-gray-500">({tour.reviewCount})</span>
                      </div>
                      {isHighest && (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Highest Rated
                        </span>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>

            {/* Category */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Category
                </div>
              </td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium capitalize">
                    {tour.category}
                  </span>
                </td>
              ))}
            </tr>

            {/* Difficulty */}
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Difficulty
                </div>
              </td>
              {comparisonTours.map((tour) => {
                const difficultyColors = {
                  easy: 'text-green-600 dark:text-green-400',
                  moderate: 'text-yellow-600 dark:text-yellow-400',
                  challenging: 'text-orange-600 dark:text-orange-400',
                  extreme: 'text-red-600 dark:text-red-400',
                }
                return (
                  <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                    <span className={`capitalize font-medium ${difficultyColors[tour.difficulty as keyof typeof difficultyColors] || ''}`}>
                      {tour.difficulty}
                    </span>
                  </td>
                )
              })}
            </tr>

            {/* Group Size */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Max Group Size
                </div>
              </td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  {tour.maxGroupSize} people
                </td>
              ))}
            </tr>

            {/* Min Age */}
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Minimum Age
                </div>
              </td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  {tour.minAge}+ years
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </div>
              </td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-medium">{tour.location}</span>
                    <span className="text-xs text-gray-500">{tour.region}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Highlights */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <td className="p-4 font-medium text-gray-900 dark:text-white align-top">Highlights</td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 border-l border-gray-200 dark:border-gray-700">
                  <ul className="text-sm text-left space-y-1">
                    {tour.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                    {tour.highlights.length > 3 && (
                      <li className="text-gray-500 text-xs">+{tour.highlights.length - 3} more</li>
                    )}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="p-4"></td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  <Link
                    to={`/tours/${tour.id}`}
                    className="inline-block w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add More Tours */}
      {comparisonTours.length < 3 && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You can compare up to 3 tours. Add {3 - comparisonTours.length} more{' '}
            {3 - comparisonTours.length === 1 ? 'tour' : 'tours'}.
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      )}
    </div>
  )
}

export default TourComparisonPage
