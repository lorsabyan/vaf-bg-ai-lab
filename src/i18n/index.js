import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import hy from './locales/hy.json';
import hyw from './locales/hyw.json';
import ru from './locales/ru.json';

const resources = {
  en: {
    translation: en
  },
  hy: {
    translation: hy
  },
  hyw: {
    translation: hyw
  },
  ru: {
    translation: ru
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: undefined, // Let language detector work
    fallbackLng: ['en', 'hy'], // Try English first, then Armenian
    debug: false, // Disable debug logging
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'selectedLanguage',
      // Don't look at subdomain, path, or cookie
      lookupFromPathIndex: false,
      lookupFromSubdomainIndex: false
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // Configure namespace and key separators
    keySeparator: '.',
    nsSeparator: ':',
    
    // Ensure immediate initialization
    initImmediate: false,

    missingKeyHandler: function(lng, ns, key, fallbackValue) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('MISSING TRANSLATION:', lng, ns, key);
      }
    },
  })
  .then(() => {
    // Check if there's a stored language preference
    const storedLanguage = typeof window !== 'undefined' && window.localStorage 
      ? localStorage.getItem('selectedLanguage') 
      : null;
    const currentLang = i18n.language;
    const availableLanguages = Object.keys(resources);
    
    if (storedLanguage && availableLanguages.includes(storedLanguage) && storedLanguage !== currentLang) {
      // Force switch to stored language if it's different from current
      i18n.changeLanguage(storedLanguage);
    } else if (!availableLanguages.includes(currentLang)) {
      // Try to find a match by prefix (e.g., en-US -> en)
      const langPrefix = currentLang.split('-')[0];
      const matchedLang = availableLanguages.find(lang => lang.startsWith(langPrefix));
      
      if (matchedLang) {
        i18n.changeLanguage(matchedLang);
      } else {
        i18n.changeLanguage('en');
      }
    }
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;
