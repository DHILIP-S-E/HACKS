import React from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAuthStore } from '@/store/authStore'

const Layout: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="skip-link"
        onFocus={() => setSidebarOpen(false)}
      >
        {t('nav.skipToMain', 'Skip to main content')}
      </a>

      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main 
          id="main-content"
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'ml-0'
          }`}
          role="main"
          aria-label={t('nav.mainContent', 'Main content')}
        >
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default Layout