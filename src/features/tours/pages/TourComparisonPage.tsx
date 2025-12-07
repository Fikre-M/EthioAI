import { Link } from 'react-router-dom'
import { useTours } from '@/hooks/useTours'

export const TourComparisonPage = () => {
  const { comparisonTours, removeTourFromComparison, resetComparison } = useTours()

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Compare Tours
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comparing {comparisonTours.length} {comparisonTours.length === 1 ? 'tour' : 'tours'}
          </p>
        </div>

        <button
          onClick={resetComparison}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
        >
          Clear All
        </button>
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
              <td className="p-4 font-medium text-gray-900 dark:text-white">Price</td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-bold text-orange-600">
                    {tour.currency} {tour.price.toLocaleString()}
                  </span>
                </td>
              ))}
            </tr>

            {/* Duration */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <td className="p-4 font-medium text-gray-900 dark:text-white">Duration</td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  {tour.duration}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium text-gray-900 dark:text-white">Rating</td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-sm text-gray-500">({tour.reviewCount})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Difficulty */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <td className="p-4 font-medium text-gray-900 dark:text-white">Difficulty</td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  <span className="capitalize">{tour.difficulty}</span>
                </td>
              ))}
            </tr>

            {/* Group Size */}
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium text-gray-900 dark:text-white">Max Group Size</td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  {tour.maxGroupSize} people
                </td>
              ))}
            </tr>

            {/* Min Age */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <td className="p-4 font-medium text-gray-900 dark:text-white">Minimum Age</td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  {tour.minAge}+ years
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium text-gray-900 dark:text-white">Location</td>
              {comparisonTours.map((tour) => (
                <td key={tour.id} className="p-4 text-center border-l border-gray-200 dark:border-gray-700">
                  {tour.location}
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
