/* @flow */
import * as React from 'react';
import { useTranslation } from 'react-i18next';

const Toggler: React.FunctionComponent = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    i18n.changeLanguage(currentLang === 'nb' ? 'en' : 'nb');
  };

  return (
    <a onClick={toggleLanguage}>
      {i18n.language === 'nb' ? 'English' : 'Norsk'}
    </a>
  );
};

export default Toggler;
