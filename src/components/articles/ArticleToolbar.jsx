import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

function ArticleToolbar({ 
  onSelectAndExplain, 
  onKeyPoints, 
  onQuizGeneration,
  onTranslateArticle,
  isSelectMode = false,
  isShowingTranslation = false,
  isLoadingTranslation = false
}) {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState(null);

  // Sync internal state with external prop
  useEffect(() => {
    setActiveMode(isSelectMode ? 'select' : null);
  }, [isSelectMode]);

  const handleSelectAndExplain = () => {
    const newMode = activeMode === 'select' ? null : 'select';
    setActiveMode(newMode);
    onSelectAndExplain(newMode === 'select');
  };

  const handleKeyPoints = () => {
    setActiveMode(null);
    onKeyPoints();
  };

  const handleQuizGeneration = () => {
    setActiveMode(null);
    onQuizGeneration();
  };

  const handleTranslateArticle = () => {
    setActiveMode(null);
    onTranslateArticle();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-medium text-gray-700">
            {t('articleToolbar.title')}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSelectAndExplain}
              variant={activeMode === 'select' ? 'primary' : 'outline'}
              size="sm"
              className={activeMode === 'select' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('articleToolbar.selectAndExplain')}
            </Button>
            
            <Button
              onClick={handleKeyPoints}
              variant="outline"
              size="sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {t('articleToolbar.keyPoints')}
            </Button>
            
            <Button
              onClick={handleQuizGeneration}
              variant="outline"
              size="sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('articleToolbar.quiz')}
            </Button>
            
            <Button
              onClick={handleTranslateArticle}
              variant={isShowingTranslation ? 'primary' : 'outline'}
              size="sm"
              disabled={isLoadingTranslation}
            >
              {isLoadingTranslation ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('articleViewer.loading.translation')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  {isShowingTranslation ? t('articleToolbar.showOriginal') : t('articleToolbar.translate')}
                </>
              )}
            </Button>
          </div>
        </div>
        
        {activeMode === 'select' && (
          <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('articleToolbar.selectModeActive')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleToolbar;
