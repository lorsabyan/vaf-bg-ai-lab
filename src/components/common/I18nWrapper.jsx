import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../ui/LoadingSpinner';

function I18nWrapper({ children }) {
  const { ready, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en'); // Default to 'en' for SSR
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
    setCurrentLang(i18n.language);
    
    const handleLanguageChange = (lng) => {
      setCurrentLang(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  if (!ready || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Force re-render when language changes by using language as key
  return <div key={currentLang}>{children}</div>;
}

export default I18nWrapper;
