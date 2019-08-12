import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorPageSection from './ErrorPageSection';
import ErrorInline from './ErrorInline';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <ErrorPageSection
      errorHeader={t('errors.notFound')}
      errorGeneralInfo={t('errors.notFoundDescription')}
    />
  );
};

export { ErrorPageSection, ErrorInline, NotFound };
