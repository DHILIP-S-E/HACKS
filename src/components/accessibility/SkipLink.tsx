import React from 'react';
import { useTranslation } from 'react-i18next';

export const SkipLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="skip-link"
      tabIndex={1}
    >
      {t('a11y.skipToMain')}
    </a>
  );
};