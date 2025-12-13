import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@utils/constants'

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: ROUTES.DASHBOARD, label: t('nav.dashboard'), icon: '📊' },
    { path: '/tours', label: t('nav.tours'), icon: '🗺️' },
    { path: '/destinations', label: t('nav.destinations'), icon: '🏔️' },
    { path: '/cultural', label: t('nav.culture'), icon: '🎭' },
    { path: '/marketplace', label: t('nav.marketplace'), icon: '🛍️' },
    { path: '/bookings', label: t('nav.bookings'), icon: '📅' },
    { path: ROUTES.PROFILE, label: t('nav.profile'), icon: '👤' },
    { path: '/settings', label: t('nav.settings'), icon: '⚙️' },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌍</span>
              <span className="font-bold text-gradient-ethiopian">EthioAI</span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-md hover:bg-accent"
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              <p>{t('footer.copyright')}</p>
              <p className="mt-1">{t('footer.brand.madeWith')}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
