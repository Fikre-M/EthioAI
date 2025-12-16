import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@utils/constants'

export const MobileNav = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/', label: t('nav.home'), icon: '🏠' },
    { path: '/tours', label: t('nav.tours'), icon: '🗺️' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/bookings', label: t('nav.bookings'), icon: '📅' },
    { path: ROUTES.PROFILE, label: t('nav.profile'), icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t lg:hidden safe-bottom overflow-hidden">
      <div className="grid grid-cols-5 h-14 sm:h-16 w-full">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 transition-colors touch-manipulation min-w-0 overflow-hidden ${
              isActive(item.path)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-lg sm:text-xl flex-shrink-0">{item.icon}</span>
            <span className="text-xs font-medium truncate max-w-full px-1 min-w-0">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
