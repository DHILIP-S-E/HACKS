import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: '📊' },
    { path: '/profile', label: t('nav.profile'), icon: '👤' },
    { path: '/settings', label: t('nav.settings'), icon: '⚙️' },
  ]

  if (user?.role === 'teacher' || user?.role === 'admin') {
    navItems.push({ path: '/lesson/new', label: 'Create Lesson', icon: '➕' })
  }

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: t('nav.admin'), icon: '🔧' })
  }

  return (
    <aside
      className={`fixed left-0 top-16 h-full w-64 bg-background border-r border-border transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <nav className="p-4" role="navigation" aria-label={t('nav.main')}>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`
                }
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar