import i18n from 'i18next';
import textsEn from 'text/en';
import textsNb from 'text/nb';

i18n.init({
  // we init with resources
  resources: {
    en: {
      translations: textsEn,
    },
    nb: {
      translations: textsNb,
    },
  },
  fallbackLng: 'nb',
  debug: process.NODE_ENV !== 'production',

  ns: ['translations'],
  defaultNS: 'translations',

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
});

export default i18n;
