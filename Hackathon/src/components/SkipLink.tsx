import React from 'react'
import { useTranslation } from 'react-i18next'

const SkipLink: React.FC = () => {
  const { t } = useTranslation()

  return (
    <a
      href="#main-content"
      className="skip-link"
      onFocus={(e) => e.currentTarget.classList.add('focus:top-4')}
      onBlur={(e) => e.currentTarget.classList.remove('focus:top-4')}
    >
      {t('navigation.skipToContent')}
    </a>
  )
}

export default SkipLink