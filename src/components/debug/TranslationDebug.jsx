import React from 'react';
import { useTranslation } from 'react-i18next';

function TranslationDebug() {
  const { t, i18n } = useTranslation();
  
  const testKeys = [
    'auth.welcome',
    'auth.appName',
    'auth.login',
    'auth.email',
    'auth.password',
    'language.languages.hy',
    'language.languages.hyw',
    'language.languages.en',
    'language.languages.ru'
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Translation Debug</h1>
      
      <div className="mb-4">
        <strong>Current Language:</strong> {i18n.language}
      </div>
      
      <div className="mb-4">
        <strong>Available Languages:</strong> {Object.keys(i18n.options.resources).join(', ')}
      </div>
      
      <div className="mb-4">
        <strong>localStorage Language:</strong> {localStorage.getItem('selectedLanguage')}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testKeys.map(key => (
          <div key={key} className="bg-white p-3 rounded shadow">
            <div className="font-mono text-sm text-gray-600">{key}</div>
            <div className="font-medium">{t(key)}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Language Switching Test</h2>
        <div className="space-x-2">
          <button 
            onClick={() => i18n.changeLanguage('en')}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            English
          </button>
          <button 
            onClick={() => i18n.changeLanguage('hy')}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Armenian (Eastern)
          </button>
          <button 
            onClick={() => i18n.changeLanguage('hyw')}
            className="px-3 py-1 bg-purple-500 text-white rounded"
          >
            Armenian (Western)
          </button>
          <button 
            onClick={() => i18n.changeLanguage('ru')}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Russian
          </button>
        </div>
      </div>
    </div>
  );
}

export default TranslationDebug;
