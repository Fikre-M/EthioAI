import { Routes, Route } from 'react-router-dom'
import { LoginPage, RegisterPage, ForgotPasswordPage, ProfilePage, EditProfilePage } from '@features/auth/pages'
import { HomePage } from '@features/dashboard/pages'
import { ChatPage } from '@features/chat/pages'
import { BookingPage, CartPage, CheckoutPage, MyBookingsPage } from '@features/booking/pages'
import { PaymentPage, ConfirmationPage } from '@features/payment/pages'
import { CultureHubPage, VirtualMuseumPage, ArticlePage, ArtifactDetailPage, ArticleEditorPage, CulturalCategoriesPage, LanguagePage, RecipesPage, RecipeDetailPage, CulturalLearningHub, CulturalCommunityHub, ContributePage, CulturalQuizPage } from '@features/cultural/pages'
import { TransportPage, FlightsPage, CarRentalPage } from '@features/transport/pages'
import { ItineraryPage, GenerateItineraryPage, GeneratedItineraryPage, SharedItineraryPage, CollaborationDemoPage } from '@features/itinerary/pages'
import { MarketplacePage, ProductDetailPage, CategoriesPage, CategoryPage, MyOrdersPage, VendorPage, VendorDashboardPage } from '@features/marketplace/pages'
import { ReviewsPage } from '@features/reviews/pages'
import { MainLayout } from '@components/layout'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import { ROUTES } from '@utils/constants'
import { Card, CardContent } from '@components/common/Card'

/**
 * AppRoutes Component
 * 
 * Central routing configuration for the entire application.
 * Organized into:
 * - Public routes (accessible to everyone)
 * - Restricted public routes (login, register - redirect if authenticated)
 * - Private routes (require authentication)
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes (no layout, redirect if authenticated) */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute restricted>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute restricted>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <PublicRoute restricted>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />

      {/* Routes with MainLayout */}
      <Route element={<MainLayout />}>
        {/* Home Page - Public */}
        <Route path="/" element={<HomePage />} />

        {/* Dashboard - Private (same as home but requires auth) */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.PROFILE}
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.BOOKINGS}
          element={
            <PrivateRoute>
              <MyBookingsPage />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.SETTINGS}
          element={
            <PrivateRoute>
              <PlaceholderPage title="Settings" icon="⚙️" />
            </PrivateRoute>
          }
        />

        {/* Public Routes - Accessible to Everyone */}
        <Route
          path={ROUTES.TOURS}
          element={<PlaceholderPage title="Tours & Packages" icon="🗺️" />}
        />

        <Route
          path={ROUTES.DESTINATIONS}
          element={<PlaceholderPage title="Destinations" icon="🏔️" />}
        />

        <Route
          path={ROUTES.CULTURAL}
          element={<CultureHubPage />}
        />

        {/* Cultural sub-routes */}
        <Route
          path="/cultural/museum/:museumId?"
          element={<VirtualMuseumPage />}
        />
        
        <Route
          path="/cultural/artifact/:artifactId"
          element={<ArtifactDetailPage />}
        />
        
        <Route
          path="/cultural/article/:articleId"
          element={<ArticlePage />}
        />
        
        <Route
          path="/cultural/editor"
          element={<ArticleEditorPage />}
        />
        
        <Route
          path="/cultural/categories"
          element={<CulturalCategoriesPage />}
        />
        
        <Route
          path="/cultural/language"
          element={<LanguagePage />}
        />
        
        <Route
          path="/cultural/recipes"
          element={<RecipesPage />}
        />
        
        <Route
          path="/cultural/recipe/:id"
          element={<RecipeDetailPage />}
        />
        
        <Route
          path="/cultural/learning"
          element={<CulturalLearningHub />}
        />
        
        <Route
          path="/cultural/community"
          element={<CulturalCommunityHub />}
        />
        
        <Route
          path="/cultural/contribute"
          element={<ContributePage />}
        />
        
        <Route
          path="/cultural/quiz"
          element={<CulturalQuizPage />}
        />

        {/* Transport Routes */}
        <Route
          path="/transport"
          element={<TransportPage />}
        />
        
        <Route
          path="/transport/flights"
          element={<FlightsPage />}
        />
        
        <Route
          path="/transport/cars"
          element={<CarRentalPage />}
        />

        {/* Itinerary Routes */}
        <Route
          path="/itinerary"
          element={<ItineraryPage />}
        />
        
        <Route
          path="/itinerary/generate"
          element={<GenerateItineraryPage />}
        />
        
        <Route
          path="/itinerary/generated"
          element={<GeneratedItineraryPage />}
        />
        
        <Route
          path="/itinerary/shared/:token"
          element={<SharedItineraryPage />}
        />
        
        <Route
          path="/itinerary/collaboration-demo"
          element={<CollaborationDemoPage />}
        />

        <Route
          path={ROUTES.MARKETPLACE}
          element={<MarketplacePage />}
        />
        
        <Route
          path="/marketplace/product/:productId"
          element={<ProductDetailPage />}
        />
        
        <Route
          path="/marketplace/categories"
          element={<CategoriesPage />}
        />
        
        <Route
          path="/marketplace/category/:categoryId"
          element={<CategoryPage />}
        />
        
        <Route
          path="/marketplace/orders"
          element={
            <PrivateRoute>
              <MyOrdersPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/marketplace/vendor/:vendorId"
          element={<VendorPage />}
        />
        
        <Route
          path="/marketplace/vendor-dashboard"
          element={
            <PrivateRoute>
              <VendorDashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/reviews"
          element={<ReviewsPage />}
        />

        <Route
          path="/about"
          element={<PlaceholderPage title="About Us" icon="ℹ️" />}
        />

        <Route
          path="/contact"
          element={<PlaceholderPage title="Contact" icon="📧" />}
        />

        <Route
          path="/help"
          element={<PlaceholderPage title="Help Center" icon="❓" />}
        />

        {/* Chat Page - Public */}
        <Route
          path="/chat"
          element={<ChatPage />}
        />

        {/* Booking & Cart Pages */}
        <Route
          path="/booking/:tourId"
          element={<BookingPage />}
        />
        <Route
          path="/cart"
          element={<CartPage />}
        />
        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />
        <Route
          path="/payment"
          element={<PaymentPage />}
        />
        <Route
          path="/confirmation"
          element={<ConfirmationPage />}
        />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

// Placeholder Page Component
interface PlaceholderPageProps {
  title: string
  icon?: string
}

function PlaceholderPage({ title, icon = '🚧' }: PlaceholderPageProps) {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-muted-foreground mb-6">
            This page is coming soon. We're working hard to bring you amazing features!
          </p>
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Expected in upcoming weeks</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

// 404 Not Found Page
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Page Not Found
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="btn bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="btn bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Go Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AppRoutes
