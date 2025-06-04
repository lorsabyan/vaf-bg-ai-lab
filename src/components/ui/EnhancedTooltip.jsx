import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../ui/LoadingSpinner';

function EnhancedTooltip({ 
  selectedText, 
  explanation, 
  isExplaining, 
  position, 
  onClose,
  searchResults = null,
  isLoadingSearch = false,
  isGoogleSearchConfigured = false
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('explanation');

  const tabs = [
    { id: 'explanation', label: t('tooltip.explanation'), icon: '💡' },
    { id: 'images', label: t('tooltip.images'), icon: '🖼️' },
    { id: 'links', label: t('tooltip.links'), icon: '🔗' },
    { id: 'citations', label: t('tooltip.citations'), icon: '📚' }
  ];

  const hasResults = searchResults && (
    searchResults.images?.length > 0 ||
    searchResults.webLinks?.length > 0 ||
    searchResults.citations?.length > 0
  );

  // Debug logging
  console.log('EnhancedTooltip render:', {
    searchResults,
    isLoadingSearch,
    isGoogleSearchConfigured,
    hasResults,
    activeTab
  });

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl max-w-lg z-50 transform -translate-x-1/2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxHeight: '500px',
        minWidth: '400px'
      }}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm truncate flex-1 mr-2">
            {selectedText}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-sky-700 bg-white border-b-2 border-sky-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            disabled={tab.id !== 'explanation' && isLoadingSearch}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Explanation Tab */}
        {activeTab === 'explanation' && (
          <div className="text-sm">
            {isExplaining ? (
              <div className="flex items-center text-sky-600">
                <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs">{t('articleViewer.loading.explanation')}</span>
              </div>
            ) : (
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: explanation }}
              />
            )}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div>
            {isLoadingSearch ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="sm" text={t('tooltip.loadingImages')} />
              </div>
            ) : searchResults?.images?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {searchResults.images.map((image, index) => (
                  <div key={index} className="group cursor-pointer" onClick={() => window.open(image.contextLink, '_blank')}>
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-sky-300 transition-colors">
                      <img
                        src={image.thumbnailLink}
                        alt={image.title}
                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 shadow-lg">
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                      {/* Fallback for broken images */}
                      <div className="absolute inset-0 bg-gray-100 items-center justify-center hidden">
                        <div className="text-center text-gray-400">
                          <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs">Image unavailable</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 px-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-sky-700 transition-colors">
                        {image.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{image.displayLink}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : !isGoogleSearchConfigured ? (
              <div className="text-center py-6 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs mb-2">Configure Google Search API to see images</p>
                <p className="text-xs text-blue-600 cursor-pointer hover:underline">Settings → API Configuration</p>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">{t('tooltip.noImages')}</p>
              </div>
            )}
          </div>
        )}

        {/* Web Links Tab */}
        {activeTab === 'links' && (
          <div>
            {isLoadingSearch ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="sm" text={t('tooltip.loadingLinks')} />
              </div>
            ) : searchResults?.webLinks?.length > 0 ? (
              <div className="space-y-3">
                {searchResults.webLinks.map((link, index) => (
                  <div key={index} className="border rounded p-3 hover:bg-gray-50 transition-colors">
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-sky-700 group-hover:text-sky-800 line-clamp-2">
                        {link.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {link.snippet}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {link.displayLink}
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : !isGoogleSearchConfigured ? (
              <div className="text-center py-6 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs mb-2">Configure Google Search API to see links</p>
                <p className="text-xs text-blue-600 cursor-pointer hover:underline">Settings → API Configuration</p>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p className="text-xs">{t('tooltip.noLinks')}</p>
              </div>
            )}
          </div>
        )}

        {/* Citations Tab */}
        {activeTab === 'citations' && (
          <div>
            {isLoadingSearch ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="sm" text={t('tooltip.loadingCitations')} />
              </div>
            ) : searchResults?.citations?.length > 0 ? (
              <div className="space-y-3">
                {searchResults.citations.map((citation, index) => (
                  <div key={index} className="border rounded p-3 hover:bg-gray-50 transition-colors">
                    <a
                      href={citation.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-sky-700 line-clamp-2">
                        {citation.title}
                      </h4>
                      {(citation.authors || citation.year) && (
                        <p className="text-xs text-gray-600 mt-1">
                          {citation.authors && <span>{citation.authors}</span>}
                          {citation.authors && citation.year && <span> • </span>}
                          {citation.year && <span>{citation.year}</span>}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1 line-clamp-3">
                        {citation.snippet}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {citation.displayLink}
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : !isGoogleSearchConfigured ? (
              <div className="text-center py-6 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs mb-2">Configure Google Search API to see citations</p>
                <p className="text-xs text-blue-600 cursor-pointer hover:underline">Settings → API Configuration</p>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-xs">{t('tooltip.noCitations')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with search status */}
      {hasResults && (
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 rounded-b-lg">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('tooltip.poweredByGoogle')}
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedTooltip;
