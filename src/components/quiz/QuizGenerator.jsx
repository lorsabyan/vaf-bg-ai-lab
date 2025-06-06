import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import quizService from '../../services/quizService';
import articleService from '../../services/articleService';
import { GEMINI_MODELS, DEFAULT_QUIZ_INSTRUCTIONS, QUIZ_TEMPLATES } from '../../utils/constants';
import { validateGeminiApiKey } from '../../utils/apiHelpers';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import QuizInterface from './QuizInterface';
import ApiKeyModal from '../common/ApiKeyModal';

function QuizGenerator({ onQuizGenerate }) {
  const { t } = useTranslation();
  const { state, dispatch, ActionTypes } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    // Form state
  const [instructions, setInstructions] = useState(DEFAULT_QUIZ_INSTRUCTIONS);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-preview-05-20');
  const [temperature, setTemperature] = useState(0.7);
  const [selectedTemplate, setSelectedTemplate] = useState('ARMENIAN_COMPREHENSIVE');

  // Memoize the current quiz template
  const currentTemplate = useMemo(() => {
    return QUIZ_TEMPLATES[selectedTemplate];
  }, [selectedTemplate]);

  // Memoize the formatted article content to avoid recalculation
  const formattedContent = useMemo(() => {
    return state.selectedArticle ? 
      articleService.formatArticleContent(state.selectedArticle) : null;
  }, [state.selectedArticle]);

  // Memoize the template change handler
  const handleTemplateChange = useCallback((templateKey) => {
    setSelectedTemplate(templateKey);
    const template = QUIZ_TEMPLATES[templateKey];
    if (template) {
      setInstructions(template.instructions);
      setSelectedModel(template.model);
      setTemperature(template.temperature);
    }
  }, []);

  // Memoize the quiz generation handler
  const handleGenerateQuiz = useCallback(async () => {
    // Check if API key is available
    if (!validateGeminiApiKey(state, dispatch, ActionTypes, t)) {
      setShowApiKeyModal(true);
      return;
    }

    // Check if there's a selected article
    if (!state.selectedArticle) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: t('quiz.errors.noArticleSelected')
      });
      return;
    }

    setIsGenerating(true);
      try {
      // Initialize the quiz service with API key
      quizService.initializeAPI(state.apiKeys.gemini);      
      
      if (!formattedContent || !formattedContent.html) {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: t('quiz.errors.noArticleSelected')
        });
        setIsGenerating(false);
        return;
      }
        // Generate quiz using the formatted article content
      const result = await quizService.generateQuiz({
        instructions,
        articleContent: formattedContent.html,
        model: selectedModel,
        temperature
      });

      if (result.success && result.data && result.data.questions && result.data.questions.length > 0) {
        setGeneratedQuiz(result.data);
        setShowQuiz(true);
        
        dispatch({
          type: ActionTypes.SET_SUCCESS,
          payload: t('quiz.errors.quizGeneratedSuccess', { count: result.data.questions.length })
        });

        if (onQuizGenerate) {
          onQuizGenerate();
        }
      } else {
        const errorMessage = result.error || t('quiz.errors.generationFailed');
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: errorMessage
        });
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.message || t('quiz.errors.generationError')
      });
    } finally {
      setIsGenerating(false);
    }
  }, [state, dispatch, ActionTypes, t, formattedContent, instructions, selectedModel, temperature, onQuizGenerate]);

  const handleQuizComplete = (results) => {
    // Save quiz results to history
    const quizWithResults = {
      ...generatedQuiz,
      results,
      completedAt: new Date().toISOString(),
      article: {
        title: state.selectedArticle?.title || 'Unknown Article',
        id: state.selectedArticle?.id
      }
    };

    // Add to quiz history
    dispatch({
      type: ActionTypes.ADD_QUIZ_HISTORY,
      payload: quizWithResults
    });

    setShowQuiz(false);
    setGeneratedQuiz(null);
    
    dispatch({
      type: ActionTypes.SET_SUCCESS,
      payload: t('quiz.errors.quizCompletedSuccess', { score: results.score, total: results.totalQuestions })
    });
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setGeneratedQuiz(null);
  };

  const handleApiKeySave = () => {
    setShowApiKeyModal(false);
    // Try generating quiz again if API key was just saved
    if (validateGeminiApiKey(state, dispatch, ActionTypes, t)) {
      handleGenerateQuiz();
    }
  };

  if (showQuiz && generatedQuiz) {
    return (
      <QuizInterface
        quiz={generatedQuiz}
        onComplete={handleQuizComplete}
        onClose={handleCloseQuiz}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t('quiz.generator.title')}
        </h2>
        <p className="text-sm text-gray-600">
          {t('quiz.generator.subtitle')}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">        {/* Article Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">{t('quiz.generator.selectedArticle')}</h3>
          {state.selectedArticle ? (
            <div className="text-sm">
              <p className="font-medium text-green-700">{state.selectedArticle.mainTitle || state.selectedArticle.shortTitle}</p>
              <p className="text-gray-600 mt-1">
                {t('quiz.generator.contentAvailable', { 
                  count: (() => {
                    const formattedContent = articleService.formatArticleContent(state.selectedArticle);
                    return formattedContent?.plainText?.length || 0;
                  })()
                })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-amber-600">
              {t('quiz.generator.noArticleSelected')}
            </p>
          )}
        </div>

        {/* Quiz Template */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('quiz.generator.quizTemplate')}
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            {Object.entries(QUIZ_TEMPLATES).map(([key, template]) => (
              <option key={key} value={key}>
                {key.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('quiz.generator.customInstructions')}
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder={t('quiz.generator.instructionsPlaceholder')}
          />
        </div>

        {/* AI Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('quiz.generator.aiModel')}
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            {GEMINI_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
        </div>

        {/* Temperature Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('quiz.generator.creativityLevel', { temperature })}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{t('quiz.generator.conservative')}</span>
            <span>{t('quiz.generator.balanced')}</span>
            <span>{t('quiz.generator.creative')}</span>
          </div>
        </div>

        {/* API Key Status */}
        {!state.apiKeys.gemini && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-800">
                {t('quiz.generator.apiKeyRequired')}
              </p>
            </div>
            <Button
              variant="warning"
              size="sm"
              className="mt-2"
              onClick={() => setShowApiKeyModal(true)}
            >
              {t('quiz.generator.setApiKey')}
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={handleGenerateQuiz}
          disabled={!state.selectedArticle || isGenerating}
          loading={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">{t('quiz.generator.generatingQuiz')}</span>
            </div>
          ) : (
            t('quiz.generator.generateQuiz')
          )}
        </Button>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
      />
    </div>
  );
}

export default QuizGenerator;