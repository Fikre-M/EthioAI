import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTours } from '@/hooks/useTours'
import { TourCard } from '../components/TourCard'

export const WishlistPage = () => {
  const { wishlistTours, loading, toggleTourWishlist, resetWishlist } = useTours()

  useEffect(() => {
    // Load wishlist tours if needed
  }, [])

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
          </div>
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
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {wishlistTours.length} {wishlistTours.length === 1 ? 'tour' : 'tours'} saved
          </p>
        </div>

        {wishlistTours.length > 0 && (
          <button
            onClick={resetWishlist}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {wishlistTours.length === 0 ? (
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding tours you love to your wishlist
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Browse Tours
          </Link>
        </div>
      ) : (
        <>
          {/* Tour Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistTours.map((tour) => (
              <div key={tour.id} className="relative">
                <button
                  onClick={() => toggleTourWishlist(tour.id)}
                  className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <TourCard tour={tour} />
              </div>
            ))}
          </div>

          {/* Share Wishlist */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Share Your Wishlist
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share your favorite tours with friends and family
                </p>
              </div>
              <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors">
                Share
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default WishlistPage
