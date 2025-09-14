import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAccessibilityStore } from '@/store/accessibilityStore'

const Settings: React.FC = () => {
  const { t } = useTranslation()
  const { preferences, updatePreferences } = useAccessibilityStore()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">
        {t('nav.settings')}
      </h1>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {t('accessibility.preferences')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('accessibility.theme')}
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => updatePreferences({ theme: e.target.value as any })}
              className="block w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="light">{t('theme.light')}</option>
              <option value="dark">{t('theme.dark')}</option>
              <option value="high-contrast">{t('theme.highContrast')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('accessibility.fontSize')}
            </label>
            <select
              value={preferences.fontSize}
              onChange={(e) => updatePreferences({ fontSize: e.target.value as any })}
              className="block w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="small">{t('fontSize.small')}</option>
              <option value="medium">{t('fontSize.medium')}</option>
              <option value="large">{t('fontSize.large')}</option>
              <option value="extra-large">{t('fontSize.extraLarge')}</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.readingRuler}
                onChange={(e) => updatePreferences({ readingRuler: e.target.checked })}
                className="rounded border-border focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm font-medium text-foreground">
                {t('accessibility.readingRuler')}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings