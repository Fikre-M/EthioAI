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
      <section className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
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
            <p className="text-xl text-muted-foreground mb-8">
              Your AI-powered companion for exploring the ancient wonders, vibrant culture, and breathtaking landscapes of Ethiopia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/tours">
                <Button variant="primary" size="lg">Explore Tours</Button>
              </Link>
              <Link to="/chat">
                <Button variant="outline" size="lg">Chat with AI Guide</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessCards.map((card) => (
              <Link key={card.title} to={card.link}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl mb-4`}>
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Carousel */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Tours</h2>
            <Link to="/tours" className="text-primary hover:underline">
              View All →
            </Link>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Main Carousel */}
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredTours.map((tour) => (
                  <div key={tour.id} className="min-w-full">
                    <Card className="mx-2">
                      <div className="grid md:grid-cols-2 gap-6 p-8">
                        {/* Image */}
                        <div className="flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-gray-800 dark:to-gray-700 rounded-xl h-64 md:h-full">
                          <span className="text-9xl">{tour.image}</span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold">{tour.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({tour.reviews} reviews)
                            </span>
                          </div>
                          <h3 className="text-3xl font-bold mb-3">{tour.title}</h3>
                          <p className="text-lg text-muted-foreground mb-4">
                            📍 {tour.location}
                          </p>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">⏱️</span>
                              <span>{tour.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-primary">
                                ${tour.price}
                              </span>
                              <span className="text-sm text-muted-foreground">per person</span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Link to={`/tours/${tour.id}`}>
                              <Button variant="primary">View Details</Button>
                            </Link>
                            <Link to={`/tours/${tour.id}/book`}>
                              <Button variant="outline">Book Now</Button>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {featuredTours.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-primary w-8'
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
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient-ethiopian mb-2">50+</div>
              <div className="text-muted-foreground">Tour Packages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient-ethiopian mb-2">15+</div>
              <div className="text-muted-foreground">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient-ethiopian mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient-ethiopian mb-2">4.8</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of travelers discovering Ethiopia
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button variant="secondary" size="lg">Create Account</Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-orange-500"
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
