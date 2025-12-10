import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export interface MainLayoutProps {
  children?: React.ReactNode
  showSidebar?: boolean
  showMobileNav?: boolean
  showFooter?: boolean
}

export const MainLayout = ({ 
  children, 
  showSidebar = false,
  showMobileNav = true,
  showFooter = true 
}: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (optional) */}
        {showSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}

        {/* Page Content */}
        <main className={`flex-1 ${showMobileNav ? 'pb-16 md:pb-0' : ''}`}>
          {children || <Outlet />}
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Mobile Navigation */}
      {showMobileNav && <MobileNav />}
    </div>
  )
}

export default MainLayout
