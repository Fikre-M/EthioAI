import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { Button } from '@components/common/Button'
import { Card } from '@components/common/Card'

interface Tour {
  id: string
  title: string
  location: string
  price: number
  duration: string
  image: string
  rating: number
  reviews: number
}

const featuredTours: Tour[] = [
  {
    id: '1',
    title: 'Historic Route',
    location: 'Lalibela, Gondar, Axum',
    price: 1200,
    duration: '8 days',
    image: '🏛️',
    rating: 4.9,
    reviews: 234,
  },
  {
    id: '2',
    title: 'Simien Mountains Trek',
    location: 'Simien National Park',
    price: 850,
    duration: '5 days',
    image: '🏔️',
    rating: 4.8,
    reviews: 189,
  },
  {
    id: '3',
    title: 'Danakil Depression',
    location: 'Afar Region',
    price: 950,
    duration: '4 days',
    image: '🌋',
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '4',
    title: 'Omo Valley Cultural Tour',
    location: 'South Omo',
    price: 1100,
    duration: '7 days',
    image: '🎭',
    rating: 4.9,
    reviews: 201,
  },
]

export const HomePage = () => {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredTours.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredTours.length) % featuredTours.length)
  }

  const quickAccessCards = [
    {
      icon: '🗺️',
      title: t('nav.tours'),
      description: 'Explore curated tour packages',
      link: '/tours',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '🏔️',
      title: t('nav.destinations'),
      description: 'Discover amazing places',
      link: '/destinations',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🎭',
      title: t('nav.culture'),
      description: 'Experience local traditions',
      link: '/cultural',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '🛍️',
      title: t('nav.marketplace'),
      description: 'Shop authentic crafts',
      link: '/marketplace',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              {isAuthenticated ? (
                <>
                  Welcome back, <span className="text-gradient-ethiopian">{user?.name?.split(' ')[0]}</span>! 👋
                </>
              ) : (
                <>
                  Discover <span className="text-gradient-ethiopian">Ethiopia</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Your AI-powered companion for exploring the ancient wonders, vibrant culture, and breathtaking landscapes of Ethiopia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/tours" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">Explore Tours</Button>
              </Link>
              <Link to="/chat" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">Chat with AI Guide</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full min-w-0 overflow-hidden">
            {quickAccessCards.map((card) => (
              <div key={card.title} className="min-w-0 w-full">
                <Link to={card.link} className="block w-full min-w-0">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full min-w-0">
                    <div className="p-4 sm:p-6 min-w-0">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 flex-shrink-0`}>
                        {card.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{card.description}</p>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Carousel */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Tours</h2>
            <Link to="/tours" className="text-primary hover:underline text-sm sm:text-base">
              View All →
            </Link>
          </div>

          {/* Carousel */}
          <div className="relative overflow-hidden">
            {/* Main Carousel */}
            <div className="overflow-hidden rounded-xl sm:rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out h-auto lg:h-96"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredTours.map((tour) => (
                  <div key={tour.id} className="min-w-full flex-shrink-0 px-1 sm:px-2">
                    <Card className="overflow-hidden h-full">
                      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 min-w-0 h-full">
                        {/* Image */}
                        <div className="flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-gray-800 dark:to-gray-700 rounded-lg sm:rounded-xl h-40 sm:h-48 md:h-56 lg:h-64 md:w-1/2 flex-shrink-0 overflow-hidden">
                          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{tour.image}</span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center md:w-1/2 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3 min-w-0">
                            <span className="text-yellow-500 flex-shrink-0">⭐</span>
                            <span className="font-semibold text-sm sm:text-base flex-shrink-0">{tour.rating}</span>
                            <span className="text-xs sm:text-sm text-muted-foreground truncate min-w-0">
                              ({tour.reviews} reviews)
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 leading-tight line-clamp-2">{tour.title}</h3>
                          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                            📍 {tour.location}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 min-w-0">
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-muted-foreground text-sm">⏱️</span>
                              <span className="text-sm sm:text-base whitespace-nowrap">{tour.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary whitespace-nowrap">
                                ${tour.price}
                              </span>
                              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">per person</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 min-w-0 mt-auto">
                            <Link to={`/tours/${tour.id}`} className="flex-1 sm:flex-none min-w-0">
                              <Button variant="primary" className="w-full sm:w-auto whitespace-nowrap" size="sm">View Details</Button>
                            </Link>
                            <Link to={`/tours/${tour.id}/book`} className="flex-1 sm:flex-none min-w-0">
                              <Button variant="outline" className="w-full sm:w-auto whitespace-nowrap" size="sm">Book Now</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4 sm:mt-6">
              {featuredTours.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-primary w-6 sm:w-8'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-ethiopian mb-1 sm:mb-2">50+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Tour Packages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-ethiopian mb-1 sm:mb-2">15+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-ethiopian mb-1 sm:mb-2">10K+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-ethiopian mb-1 sm:mb-2">4.8</div>
              <div className="text-sm sm:text-base text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 sm:py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Ready to Start Your Journey?</h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90">
              Join thousands of travelers discovering Ethiopia
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md mx-auto">
              <Link to="/register" className="flex-1 sm:flex-none">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">Create Account</Button>
              </Link>
              <Link to="/login" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-orange-500 w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage
