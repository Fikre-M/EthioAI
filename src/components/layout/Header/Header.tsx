import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { Button } from '@components/common/Button'
import { LanguageSwitcher } from '@components/common/LanguageSwitcher'
import { ROUTES, APP_NAME } from '@utils/constants'

export const Header = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate(ROUTES.LOGIN)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🌍</span>
          <span className="text-xl font-bold text-gradient-ethiopian">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/tours"
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            {t('nav.tours')}
          </Link>
          <Link
            to="/destinations"
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            {t('nav.destinations')}
          </Link>
          <Link
            to="/cultural"
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            {t('nav.culture')}
          </Link>
          <Link
            to="/marketplace"
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            {t('nav.marketplace')}
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 rounded-full p-2 hover:bg-accent transition-colors"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border z-50 animate-in slide-in-from-top-2">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      
                      <Link
                        to={ROUTES.DASHBOARD}
                        className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('nav.dashboard')}
                      </Link>
                      
                      <Link
                        to={ROUTES.PROFILE}
                        className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('nav.profile')}
                      </Link>
                      
                      <Link
                        to="/bookings"
                        className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('nav.bookings')}
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('nav.settings')}
                      </Link>
                      
                      <div className="border-t">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                        >
                          {t('nav.signOut')}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                {t('nav.signIn')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                {t('nav.signUp')}
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
