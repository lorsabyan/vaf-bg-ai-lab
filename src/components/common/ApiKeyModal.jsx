import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import quizService from '../../services/quizService';

function ApiKeyModal({ isOpen, onClose }) {
  const { state, dispatch, ActionTypes } = useApp();
  const [apiKey, setApiKey] = useState(state.apiKeys.gemini);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim()) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Խնդրում ենք մուտքագրել Gemini API բանալին։'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Test the API key by initializing the service
      quizService.initializeAPI(apiKey.trim());
      
      // Save to state and localStorage
      dispatch({
        type: ActionTypes.SET_API_KEY,
        payload: { type: 'gemini', key: apiKey.trim() }
      });
      
      dispatch({
        type: ActionTypes.SET_SUCCESS,
        payload: 'Gemini API բանալին պահպանված է։'
      });
      
      onClose();
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: `API բանալին սխալ է։ ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    dispatch({
      type: ActionTypes.SET_API_KEY,
      payload: { type: 'gemini', key: '' }
    });
    dispatch({
      type: ActionTypes.SET_SUCCESS,
      payload: 'Gemini API բանալին մաքրված է։'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Gemini API բանալի
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

          <div className="space-y-4">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
                API բանալի
              </label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ձեր Gemini API բանալին"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm"
                disabled={isLoading}
              />
            </div>

            <p className="text-xs text-gray-500">
              Բանալին պահպանվում է ձեր զննարկչի localStorage-ում։
            </p>
            
            <p className="text-xs text-blue-600">
              <a 
                href="https://ai.google.dev/gemini-api/docs/api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Ինչպես ստանալ Gemini API բանալի →
              </a>
            </p>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                {isLoading ? 'Ստուգում...' : 'Պահպանել'}
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                Մաքրել
              </button>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                Չեղարկել
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
