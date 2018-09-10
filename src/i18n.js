import i18n from "i18next";
import adminEn from 'text/admin-en';
import adminNb from 'text/admin-nb';

i18n.init({
  // we init with resources
  resources: {
    en: {
      translations: adminEn
    },
    nb: {
      translations: adminNb
    }
  },
  fallbackLng: "en",
  debug: process.NODE_ENV !== 'production',

  ns: ["translations"],
  defaultNS: "translations",

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
});

export default i18n;
