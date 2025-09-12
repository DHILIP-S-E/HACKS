import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useAccessibilityStore } from '@/stores/accessibilityStore';
import { AccessibilityToolbar } from '../accessibility/AccessibilityToolbar';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { theme } = useAccessibilityStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo and branding */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AL</span>
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Assistive Learning
            </span>
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="search"
              placeholder={t('lessons.search')}
              className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-700 border-none rounded-lg focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-neutral-100"
              aria-label={t('lessons.search')}
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <AccessibilityToolbar />
          
          {/* Notifications */}
          <button
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {user?.name}
              </span>
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50">
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  <hr className="my-2 border-neutral-200 dark:border-neutral-700" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};