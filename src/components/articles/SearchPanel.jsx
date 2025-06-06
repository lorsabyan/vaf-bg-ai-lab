import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import articleService from '../../services/articleService';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';

function SearchPanel({ onArticleSelect }) {
  const { t } = useTranslation();
  const { state, dispatch, ActionTypes } = useApp();
  const [searchTerm, setSearchTerm] = useState(state.searchTerm);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: t('search.enterKeyword')
      });
      return;
    }

    dispatch({ type: ActionTypes.SET_SEARCHING, payload: true });
    dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: searchTerm });

    try {
      const result = await articleService.searchArticles(
        searchTerm,
        state.accessToken
      );

      if (result.success) {
        dispatch({
          type: ActionTypes.SET_SEARCH_RESULTS,
          payload: result.data
        });
        
        if (result.data.length === 0) {
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: t('search.noResults')
          });
        }
      } else {
        if (result.unauthorized) {
          dispatch({ type: ActionTypes.LOGOUT });
          return;
        }
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: result.error
        });
      }
    } catch (error) {        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: t('search.searchError')
        });
    } finally {
      dispatch({ type: ActionTypes.SET_SEARCHING, payload: false });
    }
  };

  const handleArticleClick = (article) => {
    dispatch({
      type: ActionTypes.SET_SELECTED_ARTICLE,
      payload: article
    });
    onArticleSelect?.();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          {t('search.title')}
        </h2>
        
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('search.placeholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-gray-50 focus:bg-white transition-colors"
              disabled={state.isSearching}
            />
            <svg 
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={state.isSearching || !searchTerm.trim()}
            loading={state.isSearching}
            className="w-full"
          >
            {state.isSearching ? t('search.searching') : t('search.searchButton')}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        {state.isSearching ? (
          <div className="p-8">
            <LoadingSpinner size="md" text={t('search.searching')} />
          </div>
        ) : state.searchResults.length > 0 ? (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {t('search.resultsCount', { count: state.searchResults.length })}
            </h3>
            {state.searchResults.map((article, index) => (
              <div
                key={article.id || index}
                onClick={() => handleArticleClick(article)}
                className={`
                  p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200
                  hover:border-sky-300 hover:shadow-md hover:bg-sky-50
                  ${state.selectedArticle?.id === article.id ? 'border-sky-500 bg-sky-100 shadow-sm' : 'bg-white'}
                `}
              >
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                  {article.mainTitle || article.shortTitle || t('search.untitledArticle')}
                </h4>
                
                {article.summary && (
                  <p className="text-xs text-gray-600 line-clamp-3 mb-2">
                    {article.summary}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>ID: {article.id}</span>
                  {article.categoryName && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {article.categoryName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : state.searchTerm ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm">
              Ոչ մի արդյունք չգտնվեց
            </p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 text-sm">
              Սկսեք որոնումը բառ մուտքագրելով
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPanel;
