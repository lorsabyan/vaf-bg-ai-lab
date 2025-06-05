import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import articleService from '../../services/articleService';
import quizService from '../../services/quizService';
import googleSearchService from '../../services/googleSearchService';
import { validateGeminiApiKey } from '../../utils/apiHelpers';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import EnhancedTooltip from '../ui/EnhancedTooltip';
import QuizModal from '../quiz/QuizModal';
import QuizInterfacePage from '../quiz/QuizInterfacePage';
import ArticleToolbar from './ArticleToolbar';

const ArticleViewer = React.memo(function ArticleViewer() {
  const { t, i18n } = useTranslation();
  const { state, dispatch, ActionTypes } = useApp();
  const [isExplaining, setIsExplaining] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [showKeyPointsModal, setShowKeyPointsModal] = useState(false);
  const [keyPoints, setKeyPoints] = useState('');
  const [isLoadingKeyPoints, setIsLoadingKeyPoints] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [isShowingTranslation, setIsShowingTranslation] = useState(false);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  
  const articleRef = useRef(null);
  const tooltipRef = useRef(null);

  // Memoize expensive article formatting operation
  const formattedContent = useMemo(() => {
    return state.selectedArticle ? 
      articleService.formatArticleContent(state.selectedArticle) : null;
  }, [state.selectedArticle]);

  // Memoize content for AI operations to avoid recalculation
  const contentForAI = useMemo(() => {
    return isShowingTranslation ? 
      (translatedContent ? translatedContent.replace(/<[^>]*>/g, '') : '') : 
      (formattedContent?.plainText || '');
  }, [isShowingTranslation, translatedContent, formattedContent?.plainText]);

  useEffect(() => {
    setShowTooltip(false);
    setSelectedText('');
    setExplanation('');
    setTranslatedContent(null);
    setIsShowingTranslation(false);
    setIsSelectMode(false);
    setKeyPoints(''); // Clear key points when article changes
  }, [state.selectedArticle]);

  // Clear key points when translation state changes
  useEffect(() => {
    setKeyPoints('');
  }, [isShowingTranslation]);

  // Memoize the text selection handler to prevent unnecessary re-renders
  const handleTextSelection = useCallback(async () => {
    if (!isSelectMode) return;
    
    const selection = window.getSelection();
    const selectedTerm = selection.toString().trim();
    
    if (!selectedTerm || selectedTerm.length < 2) {
      setShowTooltip(false);
      return;
    }

    if (!validateGeminiApiKey(state, dispatch, ActionTypes, t)) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setSelectedText(selectedTerm);
    setTooltipPosition({
      x: rect.left + (rect.width / 2),
      y: rect.bottom + window.scrollY + 8
    });
    setShowTooltip(true);
    setIsExplaining(true);
    setSearchResults(null);
    setIsLoadingSearch(false); // Initialize to false
    setExplanation(t('articleViewer.loading.explanation'));

    // Start both AI explanation and Google search concurrently
    const promises = [];

    // AI Explanation      
    promises.push(
      quizService.explainTerm(
        selectedTerm,
        contentForAI,
        state.apiKeys.gemini,
        state.selectedLanguage
      )
    );

    // Google Search (if configured)
    
    if (state.apiKeys.googleSearch && state.googleSearchEngineId) {
      setIsLoadingSearch(true);
      googleSearchService.initializeAPI(state.apiKeys.googleSearch, state.googleSearchEngineId);
      
      // Pass article context to improve search relevance
      const articleContext = contentForAI ? contentForAI.substring(0, 2000) : ''; // First 2000 chars for context
      
      promises.push(
        googleSearchService.searchAll(selectedTerm, state.selectedLanguage, articleContext)
      );
    }

    try {
      const results = await Promise.allSettled(promises);
      
      // Handle AI explanation result
      const explanationResult = results[0];
      if (explanationResult.status === 'fulfilled' && explanationResult.value.success) {
        setExplanation(explanationResult.value.data);
      } else {
        const error = explanationResult.status === 'fulfilled' ? 
          explanationResult.value.error : 
          explanationResult.reason?.message || 'Unknown error';
        setExplanation(`<span class="text-red-600">${error}</span>`);
      }

      // Handle Google search result (if available)
      if (results.length > 1) {
        const searchResult = results[1];
        if (searchResult.status === 'fulfilled' && searchResult.value.success) {
          setSearchResults(searchResult.value);
        }
      }
      
      // Always reset loading state
      setIsLoadingSearch(false);

    } catch (error) {
      setExplanation(`<span class="text-red-600">${t('articleViewer.errors.explanationFailed')}</span>`);
    } finally {
      setIsExplaining(false);
    }
  }, [isSelectMode, state, dispatch, ActionTypes, t, contentForAI]);

  // Memoize the key points generation handler
  const handleGetKeyPoints = useCallback(async () => {
    if (!formattedContent?.plainText) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: t('articleViewer.errors.noArticleSelected')
      });
      return;
    }

    if (!validateGeminiApiKey(state, dispatch, ActionTypes, t)) {
      return;
    }

    setShowKeyPointsModal(true);
    setIsLoadingKeyPoints(true);
    setKeyPoints('');

    const contentToAnalyze = isShowingTranslation && translatedContent ? 
      translatedContent.replace(/<[^>]*>/g, '') : 
      formattedContent.plainText;

    const targetLanguage = t(`language.languages.${state.selectedLanguage}`);
    
    const promptText = `Extract the key points from the following article and present them in ${targetLanguage}.

REQUIREMENTS:
1. Provide 5-8 main key points
2. Write each point as a complete sentence
3. Use clear and concise language in ${targetLanguage}
4. Focus on the most important information
5. Format as a bullet list

Article content:
---
${contentToAnalyze}
---

Please provide the key points in ${targetLanguage}, formatted as a bullet list with clear, informative sentences.`;

    try {
      if (!quizService.genAI) {
        quizService.initializeAPI(state.apiKeys.gemini);
      }

      const generativeModel = quizService.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
        const result = await generativeModel.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: { 
          temperature: 0.4,
        },
      });      const response = await result.response;
      
      let keyPointsText = response.text();

      if (keyPointsText) {
        // Convert to HTML list
        const points = keyPointsText.split('\n').filter(line => line.trim());
        const htmlKeyPoints = '<ul class="list-disc pl-5 space-y-2">' + 
          points.map(point => `<li class="text-gray-700 leading-relaxed">${point.replace(/^[-•*]\s*/, '')}</li>`).join('') + 
          '</ul>';
        setKeyPoints(htmlKeyPoints);
      } else {
        setKeyPoints(`<p class="text-red-600">${t('articleViewer.errors.keyPointsFailed')}</p>`);
      }
    } catch (error) {
      console.error('Error getting key points:', error);
      setKeyPoints(`<p class="text-red-600">${t('articleViewer.errors.keyPointsError', { error: error.message })}</p>`);
    } finally {
      setIsLoadingKeyPoints(false);
    }
  }, [formattedContent?.plainText, dispatch, ActionTypes, t, state, isShowingTranslation, translatedContent]);
  
  // Memoize the translation handler
  const handleTranslate = useCallback(async () => {
    if (!formattedContent?.html) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: t('articleViewer.errors.noArticleSelected')
      });
      return;
    }

    if (!validateGeminiApiKey(state, dispatch, ActionTypes, t)) {
      return;
    }

    // If already showing translation, toggle back to original
    if (isShowingTranslation) {
      setIsShowingTranslation(false);
      return;
    }

    // If translation already exists, show it
    if (translatedContent) {
      setIsShowingTranslation(true);
      return;
    }

    setIsLoadingTranslation(true);

    try {
      if (!quizService.genAI) {
        quizService.initializeAPI(state.apiKeys.gemini);
      }

      const generativeModel = quizService.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-preview-05-20' 
      });

      // Enhanced translation prompt with detailed instructions
      const translationPrompt = `You are a professional translator with expertise in preserving HTML formatting. Your task is to translate the following article content to ${t(`language.languages.${state.selectedLanguage}`)}.

CRITICAL REQUIREMENTS:
1. Maintain ALL HTML tags, attributes, and structure exactly as they appear
2. Only translate the text content within HTML tags
3. Preserve all class names, IDs, styles, and attributes
4. Keep HTML entities and special characters intact
5. Maintain the exact spacing and formatting structure
6. Do not add any markdown formatting or extra tags
7. Translate naturally while preserving the original meaning and tone

Article content to translate:
${formattedContent.html}

Please provide the translation with the exact same HTML structure, translating only the text content within the tags.`;

      const result = await generativeModel.generateContent({
        contents: [{ role: "user", parts: [{ text: translationPrompt }] }],
        generationConfig: { 
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192
        },
      });

      const response = await result.response;
      let translatedText = response.text();

      if (translatedText) {
        // Clean up response (remove markdown formatting if present)
        translatedText = translatedText.replace(/^```html\s*|\s*```$/g, '');
        translatedText = translatedText.replace(/^```\s*|\s*```$/g, '');
        
        // Validate that the response contains HTML
        if (translatedText.includes('<') && translatedText.includes('>')) {
          setTranslatedContent(translatedText);
          setIsShowingTranslation(true);
        } else {
          throw new Error('Translation response does not contain valid HTML');
        }
      } else {
        throw new Error('Empty translation response');
      }
    } catch (error) {
      console.error('Error translating article:', error);
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: t('articleViewer.errors.translationError', { error: error.message })
      });
    } finally {
      setIsLoadingTranslation(false);
    }
  }, [formattedContent?.html, dispatch, ActionTypes, t, state, isShowingTranslation, translatedContent]);
  
  // Memoize simple event handlers
  const handleSelectAndExplain = useCallback((enabled) => {
    setIsSelectMode(enabled);
    if (!enabled) {
      setShowTooltip(false);
    }
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setShowTooltip(false);
    }
  }, []);

  const handleBackToArticle = useCallback(() => {
    dispatch({ type: ActionTypes.HIDE_QUIZ_INTERFACE });
  }, [dispatch, ActionTypes]);

  const handleQuizCompleted = (results) => {
    // Quiz results are handled by QuizInterface component
    // We can add additional logic here if needed
  };  const handleGenerateNewQuiz = () => {
    dispatch({ type: ActionTypes.HIDE_QUIZ_INTERFACE });
    dispatch({ type: ActionTypes.SHOW_QUIZ_MODAL });
  };

  useEffect(() => {
    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTooltip, handleClickOutside]);
  if (!state.selectedArticle) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-8">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('articleViewer.noArticle.title')}
          </h3>
          <p className="text-gray-500">
            {t('articleViewer.noArticle.message')}
          </p>
        </div>
      </div>
    );
  }  // Show quiz interface if quiz is active
  if (state.showQuizInterface && state.generatedQuiz) {
    return (
      <div className="h-full bg-white">
        <QuizInterfacePage 
          quiz={state.generatedQuiz}
          onBack={handleBackToArticle}
          onComplete={handleQuizCompleted}
          onGenerateNew={handleGenerateNewQuiz}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Article Toolbar */}
      <ArticleToolbar
        onSelectAndExplain={handleSelectAndExplain}
        onKeyPoints={handleGetKeyPoints}
        onQuizGeneration={() => dispatch({ type: ActionTypes.SHOW_QUIZ_MODAL })}
        onTranslateArticle={handleTranslate}
        isSelectMode={isSelectMode}
        isShowingTranslation={isShowingTranslation}
        isLoadingTranslation={isLoadingTranslation}
      />
      
      {/* Article Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div 
            ref={articleRef}
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-sky-600 prose-strong:text-gray-900"
            onMouseUp={handleTextSelection}
            dangerouslySetInnerHTML={{ 
              __html: (isShowingTranslation && translatedContent) ? 
                translatedContent : 
                (formattedContent?.html || `<p>${t('articleViewer.errors.contentNotAvailable')}</p>`)
            }}
          />
        </div>
      </div>

      {/* Enhanced Tooltip for explanations */}
      {showTooltip && (
        <EnhancedTooltip
          selectedText={selectedText}
          explanation={explanation}
          isExplaining={isExplaining}
          position={tooltipPosition}
          searchResults={searchResults}
          isLoadingSearch={isLoadingSearch}
          isGoogleSearchConfigured={!!(state.apiKeys.googleSearch && state.googleSearchEngineId)}
          onClose={() => setShowTooltip(false)}
        />
      )}      {/* Key Points Modal */}
      <Modal
        isOpen={showKeyPointsModal}
        onClose={() => setShowKeyPointsModal(false)}
        title={`${t('articleViewer.modals.keyPointsTitle')}${isShowingTranslation ? ` (${t(`language.languages.${state.selectedLanguage}`)})` : ''}`}
        size="lg"
      >
        <div className="p-6">
          {isLoadingKeyPoints ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-sky-600 mr-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">{t('articleViewer.loading.keyPoints')}</span>
            </div>
          ) : (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: keyPoints }}
            />
          )}
        </div>
      </Modal>

      {/* Quiz Modal */}
      <QuizModal />
    </div>
  );
});

export default ArticleViewer;
