import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import quizService from '../../services/quizService';
import { GoogleSearchService } from '../../services/googleSearchService';

function ApiKeyModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { state, dispatch, ActionTypes } = useApp();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('gemini');
  
  // Form states
  const [geminiApiKey, setGeminiApiKey] = useState(state.apiKeys.gemini || '');
  const [googleSearchApiKey, setGoogleSearchApiKey] = useState(state.apiKeys.googleSearch || '');
  const [googleSearchEngineId, setGoogleSearchEngineId] = useState(state.googleSearchEngineId || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (activeTab === 'gemini') {
      return handleSaveGemini();
    } else {
      return handleSaveGoogleSearch();
    }
  };

  const handleSaveGemini = async () => {
    if (!geminiApiKey.trim()) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: t('apiKey.required')
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Test the API key by initializing the service
      quizService.initializeAPI(geminiApiKey.trim());
      
      // Save to state and localStorage
      dispatch({
        type: ActionTypes.SET_API_KEY,
        payload: { type: 'gemini', key: geminiApiKey.trim() }
      });
      
      dispatch({
        type: ActionTypes.SET_SUCCESS,
        payload: t('apiKey.successMessage')
      });
      
      onClose();
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: t('apiKey.errorMessage', { error: error.message })
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGoogleSearch = async () => {
    if (!googleSearchApiKey.trim() || !googleSearchEngineId.trim()) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: t('apiKey.googleSearch.bothRequired')
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Test the API key and engine ID
      const testSearchService = new GoogleSearchService();
      testSearchService.initializeAPI(googleSearchApiKey.trim(), googleSearchEngineId.trim());
      await testSearchService.searchImages('test', 'en', 1); // Test search
      
      // Save to state and localStorage
      dispatch({
        type: ActionTypes.SET_API_KEY,
        payload: { type: 'googleSearch', key: googleSearchApiKey.trim() }
      });
      
      dispatch({
        type: ActionTypes.SET_GOOGLE_SEARCH_ENGINE_ID,
        payload: googleSearchEngineId.trim()
      });
      
      dispatch({
        type: ActionTypes.SET_SUCCESS,
        payload: t('apiKey.googleSearch.successMessage')
      });
      
      onClose();
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: t('apiKey.googleSearch.errorMessage', { error: error.message })
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (activeTab === 'gemini') {
      setGeminiApiKey('');
      dispatch({
        type: ActionTypes.SET_API_KEY,
        payload: { type: 'gemini', key: '' }
      });
      dispatch({
        type: ActionTypes.SET_SUCCESS,
        payload: t('apiKey.clearMessage')
      });
    } else {
      setGoogleSearchApiKey('');
      setGoogleSearchEngineId('');
      dispatch({
        type: ActionTypes.SET_API_KEY,
        payload: { type: 'googleSearch', key: '' }
      });
      dispatch({
        type: ActionTypes.SET_GOOGLE_SEARCH_ENGINE_ID,
        payload: ''
      });
      dispatch({
        type: ActionTypes.SET_SUCCESS,
        payload: t('apiKey.googleSearch.clearMessage')
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('apiKey.title')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('gemini')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'gemini'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('apiKey.gemini.title')}
            </button>
            <button
              onClick={() => setActiveTab('googleSearch')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'googleSearch'
                  ? 'text-sky-600 border-b-2 border-sky-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('apiKey.googleSearch.title')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'gemini' && (
              <>
                <div>
                  <label htmlFor="gemini-api-key" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('apiKey.gemini.label')}
                  </label>
                  <input
                    id="gemini-api-key"
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder={t('apiKey.gemini.placeholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm"
                    disabled={isLoading}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  {t('apiKey.storageInfo')}
                </p>
                
                <p className="text-xs text-blue-600">
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/api-key" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {t('apiKey.gemini.getKeyLink')}
                  </a>
                </p>
              </>
            )}

            {activeTab === 'googleSearch' && (
              <>
                <div>
                  <label htmlFor="google-search-api-key" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('apiKey.googleSearch.apiKeyLabel')}
                  </label>
                  <input
                    id="google-search-api-key"
                    type="password"
                    value={googleSearchApiKey}
                    onChange={(e) => setGoogleSearchApiKey(e.target.value)}
                    placeholder={t('apiKey.googleSearch.apiKeyPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="google-search-engine-id" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('apiKey.googleSearch.engineIdLabel')}
                  </label>
                  <input
                    id="google-search-engine-id"
                    type="text"
                    value={googleSearchEngineId}
                    onChange={(e) => setGoogleSearchEngineId(e.target.value)}
                    placeholder={t('apiKey.googleSearch.engineIdPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm"
                    disabled={isLoading}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  {t('apiKey.storageInfo')}
                </p>
                
                <div className="text-xs text-blue-600 space-y-1">
                  <p>
                    <a 
                      href="https://developers.google.com/custom-search/v1/introduction" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {t('apiKey.googleSearch.getApiKeyLink')}
                    </a>
                  </p>
                  <p>
                    <a 
                      href="https://cse.google.com/cse/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {t('apiKey.googleSearch.createEngineLink')}
                    </a>
                  </p>
                </div>
              </>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                {isLoading ? t('apiKey.validating') : t('apiKey.save')}
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                {t('apiKey.clear')}
              </button>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
