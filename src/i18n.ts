import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      no: ['nb'],
      'en-US': ['en'],
      default: ['nb'],
    },
    debug: process.env['NODE_ENV'] !== 'production',

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    ns: ['translation'],
    defaultNS: 'translation',
    fallbackNS: 'translation',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      formatSeparator: ',',
    },
    keySeparator: '.',

    react: {
      wait: true,
    },
  });

export default i18n;
