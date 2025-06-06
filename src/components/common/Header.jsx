import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import ApiKeyModal from './ApiKeyModal';
import LanguageSelector from './LanguageSelector';

function Header() {
  const { t } = useTranslation();
  const { state, dispatch, ActionTypes } = useApp();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const handleLogout = () => {
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const toggleSidebar = () => {
    dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
  };

  const handleTabChange = (tab) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab });
  };

  return (
    <>
      <header className="bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md hover:bg-sky-600 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">{t('header.title')}</h1>
                  <p className="text-xs text-sky-100 hidden sm:block">{t('header.subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="p-2 bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
                title={t('header.apiKeyTooltip')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1721.75 8.25z" />
                </svg>
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors shadow-sm"
              >
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <ApiKeyModal 
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />
    </>
  );
}

export default Header;
