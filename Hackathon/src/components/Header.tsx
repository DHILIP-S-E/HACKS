import React from 'react'
import { useTranslation } from 'react-i18next'
import { useUIStore, useAccessibilityStore } from '@/lib/store'
import { 
  Sun, 
  Moon, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff,
  Ruler,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ttsAdapter } from '@/adapters/ttsAdapter'

const Header: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    readingRuler, 
    toggleReadingRuler,
    ttsActive,
    setTTSActive 
  } = useUIStore()
  const { preferences, updatePreferences } = useAccessibilityStore()

  const handleThemeChange = () => {
    const themes = ['light', 'dark', 'system'] as const
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
  }

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'hi' : 'en'
    setLanguage(newLanguage)
    i18n.changeLanguage(newLanguage)
  }

  const handleTTSToggle = () => {
    if (ttsActive) {
      ttsAdapter.stop()
      setTTSActive(false)
    } else {
      setTTSActive(true)
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun
      case 'dark':
        return Moon
      default:
        return Monitor
    }
  }

  const ThemeIcon = getThemeIcon()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('common.loading')}
            </h1>
          </div>

          {/* Accessibility toolbar */}
          <div className="flex items-center space-x-2">
            {/* Language toggle */}
            <button
              onClick={handleLanguageChange}
              className={cn(
                'p-2 rounded-md transition-colors',
                'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                'dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
              aria-label={t('accessibility.language')}
              title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Reading ruler toggle */}
            <button
              onClick={toggleReadingRuler}
              className={cn(
                'p-2 rounded-md transition-colors',
                readingRuler
                  ? 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
              aria-label={t('accessibility.readingRuler')}
              aria-pressed={readingRuler}
            >
              <Ruler className="h-5 w-5" />
            </button>

            {/* TTS toggle */}
            <button
              onClick={handleTTSToggle}
              className={cn(
                'p-2 rounded-md transition-colors',
                ttsActive
                  ? 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
              aria-label={t('accessibility.textToSpeech')}
              aria-pressed={ttsActive}
            >
              {ttsActive ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </button>

            {/* High contrast toggle */}
            <button
              onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
              className={cn(
                'p-2 rounded-md transition-colors',
                preferences.highContrast
                  ? 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
              aria-label={t('accessibility.highContrast')}
              aria-pressed={preferences.highContrast}
            >
              <div className="h-5 w-5 rounded-full bg-current" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={handleThemeChange}
              className={cn(
                'p-2 rounded-md transition-colors',
                'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                'dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
              aria-label={`${t('accessibility.theme')}: ${theme}`}
            >
              <ThemeIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header