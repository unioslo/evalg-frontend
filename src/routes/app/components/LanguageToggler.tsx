/* @flow */
import React from 'react';
import { useTranslation } from 'react-i18next';

const Toggler: React.FunctionComponent = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentLang = i18n.language;
    i18n.changeLanguage(currentLang === 'nb' ? 'en' : 'nb');
  };

  return (
    <a style={{ color: "inherit" }} onClick={toggleLanguage} href="/" >
      {i18n.language === 'nb' ? 'English' : 'Norsk'}
    </a>
  );
};

export default Toggler;
