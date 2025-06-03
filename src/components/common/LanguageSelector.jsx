import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Import flag components from country-flag-icons
import { AM as AmFlag, US as UsFlag, RU as RuFlag } from 'country-flag-icons/react/3x2';

function FlagIcon({ country, className = "" }) {
  const flagComponents = {
    AM: AmFlag,
    US: UsFlag,
    RU: RuFlag
  };

  const FlagComponent = flagComponents[country] || AmFlag;

  return (
    <span className={`inline-block ${className}`}>
      <FlagComponent 
        className="w-6 h-4 rounded-sm border border-gray-200"
        title={`${country} flag`}
        role="img"
        aria-label={`${country} flag`}
      />
    </span>
  );
}

function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const languages = [
    { code: 'hy', name: t('language.languages.hy'), country: 'AM' },
    { code: 'hyw', name: t('language.languages.hyw'), country: 'AM' },
    { code: 'en', name: t('language.languages.en'), country: 'US' },
    { code: 'ru', name: t('language.languages.ru'), country: 'RU' }
  ];

  // Update current language when i18n language changes
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedLanguage', languageCode);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
        title={t('language.select')}
      >
        <FlagIcon 
          country={currentLanguage.country}
          className="min-w-[1.5rem]" 
        />
        <span className="hidden sm:inline font-medium text-gray-700">
          {currentLanguage.name}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40 overflow-hidden">
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                {t('language.select')}
              </div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                    i18n.language === language.code 
                      ? 'bg-sky-50 text-sky-700 border-r-2 border-sky-500' 
                      : 'text-gray-700'
                  }`}
                >
                  <FlagIcon 
                    country={language.country}
                    className="min-w-[1.5rem]" 
                  />
                  <span className="font-medium">{language.name}</span>
                  {i18n.language === language.code && (
                    <svg className="w-4 h-4 text-sky-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageSelector;
