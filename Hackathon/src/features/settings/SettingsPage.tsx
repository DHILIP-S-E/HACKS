import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAccessibilityStore, useUIStore } from '@/lib/store'
import { ttsAdapter } from '@/adapters/ttsAdapter'
import { 
  Type, 
  Eye, 
  Volume2, 
  Palette, 
  Moon, 
  Sun, 
  Monitor,
  Globe,
  Ruler,
  Contrast
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { preferences, updatePreferences } = useAccessibilityStore()
  const { theme, setTheme, language, setLanguage } = useUIStore()

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => {
    updatePreferences({ fontSize })
  }

  const handleFontFamilyChange = (fontFamily: 'default' | 'dyslexia-friendly') => {
    updatePreferences({ fontFamily })
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    i18n.changeLanguage(newLanguage)
  }

  const handleTTSSpeedChange = (speed: number) => {
    updatePreferences({ ttsSpeed: speed })
  }

  const handleLineSpacingChange = (lineSpacing: number) => {
    updatePreferences({ lineSpacing })
  }

  const handleLetterSpacingChange = (letterSpacing: number) => {
    updatePreferences({ letterSpacing })
  }

  const testTTS = async () => {
    try {
      await ttsAdapter.synthesize('This is a test of the text to speech feature.', {
        speed: preferences.ttsSpeed,
        voice: preferences.ttsVoice,
      })
    } catch (error) {
      console.error('TTS test failed:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('navigation.settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your accessibility preferences and learning experience
        </p>
      </div>

      {/* Visual Settings */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Eye className="h-5 w-5 text-primary-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Visual Settings
          </h2>
        </div>

        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('accessibility.fontSize')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={cn(
                    'p-3 text-center border rounded-lg transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    preferences.fontSize === size
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  )}
                >
                  <Type className={cn(
                    'mx-auto mb-1',
                    size === 'small' && 'h-4 w-4',
                    size === 'medium' && 'h-5 w-5',
                    size === 'large' && 'h-6 w-6',
                    size === 'extra-large' && 'h-7 w-7'
                  )} />
                  <span className="text-xs capitalize">{size.replace('-', ' ')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('accessibility.fontFamily')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => handleFontFamilyChange('default')}
                className={cn(
                  'p-4 text-left border rounded-lg transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  preferences.fontFamily === 'default'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                <div className="font-normal">Default Font</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Standard readable font
                </div>
              </button>
              
              <button
                onClick={() => handleFontFamilyChange('dyslexia-friendly')}
                className={cn(
                  'p-4 text-left border rounded-lg transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  preferences.fontFamily === 'dyslexia-friendly'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                <div className="font-dyslexia">Dyslexia Friendly</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Designed for easier reading
                </div>
              </button>
            </div>
          </div>

          {/* Line Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('accessibility.lineSpacing')}: {preferences.lineSpacing}
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={preferences.lineSpacing}
              onChange={(e) => handleLineSpacingChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Tight</span>
              <span>Normal</span>
              <span>Loose</span>
            </div>
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('accessibility.letterSpacing')}: {preferences.letterSpacing}em
            </label>
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.01"
              value={preferences.letterSpacing}
              onChange={(e) => handleLetterSpacingChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Normal</span>
              <span>Wide</span>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {t('accessibility.highContrast')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Increase color contrast
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.highContrast}
                onChange={(e) => updatePreferences({ highContrast: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {t('accessibility.reducedMotion')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Minimize animations
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.reducedMotion}
                onChange={(e) => updatePreferences({ reducedMotion: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Volume2 className="h-5 w-5 text-primary-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Audio Settings
          </h2>
        </div>

        <div className="space-y-6">
          {/* TTS Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('accessibility.textToSpeech')} Speed: {preferences.ttsSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={preferences.ttsSpeed}
              onChange={(e) => handleTTSSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
            <button
              onClick={testTTS}
              className="mt-2 px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Test Voice
            </button>
          </div>

          {/* TTS Toggle */}
          <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {t('accessibility.ttsEnabled')}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Enable text-to-speech for content
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.ttsEnabled}
              onChange={(e) => updatePreferences({ ttsEnabled: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </label>
        </div>
      </div>

      {/* Theme & Language */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Palette className="h-5 w-5 text-primary-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Theme & Language
          </h2>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor },
              ] as const).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={cn(
                    'p-3 text-center border rounded-lg transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    theme === value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Language
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleLanguageChange('en')}
                className={cn(
                  'p-4 text-left border rounded-lg transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  language === 'en'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                <div className="font-medium">English</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Default language</div>
              </button>
              
              <button
                onClick={() => handleLanguageChange('hi')}
                className={cn(
                  'p-4 text-left border rounded-lg transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  language === 'hi'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                <div className="font-medium">हिन्दी</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Hindi</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Settings */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Reset Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Reset all accessibility preferences to their default values.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all settings to default?')) {
              // Reset to defaults would be implemented here
              console.log('Resetting settings to defaults')
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}

export default SettingsPage