import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import quizService from '../../services/quizService';
import articleService from '../../services/articleService';
import { GEMINI_MODELS, DEFAULT_QUIZ_INSTRUCTIONS } from '../../utils/constants';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';
import ApiKeyModal from '../common/ApiKeyModal';

function QuizModal() {
  const { state, dispatch, ActionTypes } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  // Form state
  const [instructions, setInstructions] = useState(DEFAULT_QUIZ_INSTRUCTIONS);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [temperature, setTemperature] = useState(0.7);

  const handleClose = () => {
    dispatch({ type: ActionTypes.HIDE_QUIZ_MODAL });
  };

  const handleGenerateQuiz = async () => {
    // Check if API key is available
    if (!state.apiKeys.gemini) {
      setShowApiKeyModal(true);
      return;
    }

    // Check if there's a selected article
    if (!state.selectedArticle) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Please select an article first from the Article Search tab.'
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Initialize the quiz service with API key
      quizService.initializeAPI(state.apiKeys.gemini);
      
      // Get the formatted article content
      const formattedContent = articleService.formatArticleContent(state.selectedArticle);
      
      if (!formattedContent || !formattedContent.html) {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: 'Selected article has no content available for quiz generation.'
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
        // Store the generated quiz in context
        dispatch({
          type: ActionTypes.SET_GENERATED_QUIZ,
          payload: result.data
        });

        // Show the quiz interface
        dispatch({
          type: ActionTypes.SHOW_QUIZ_INTERFACE
        });
        
        dispatch({
          type: ActionTypes.SET_SUCCESS,
          payload: `Quiz generated successfully with ${result.data.questions.length} questions!`
        });        // Close the modal
        handleClose();
      } else {
        const errorMessage = result.error || 'Failed to generate quiz. Please try again.';
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: errorMessage
        });
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.message || 'Failed to generate quiz. Please check your API key and try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApiKeySave = () => {
    setShowApiKeyModal(false);
    // Try generating quiz again if API key was just saved
    if (state.apiKeys.gemini) {
      handleGenerateQuiz();
    }
  };
  return (
    <>      <Modal
        isOpen={state.showQuizModal}
        onClose={handleClose}
        title="Վիկտորինայի ստեղծման կարգավորումներ"
        size="lg"
      >
        <div className="p-6 space-y-6">          {/* Article Status */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Ընտրված հոդված</h3>
              {state.selectedArticle && (
                <span className="text-xs text-gray-500">
                  {(() => {
                    const formattedContent = articleService.formatArticleContent(state.selectedArticle);
                    return formattedContent?.plainText?.length || 0;
                  })()} նիշ
                </span>
              )}
            </div>
            {state.selectedArticle ? (
              <p className="text-sm font-medium text-green-700 mt-1">
                {state.selectedArticle.mainTitle || state.selectedArticle.shortTitle}
              </p>
            ) : (
              <p className="text-sm text-amber-600 mt-1">
                Հոդված ընտրված չէ: Խնդրում ենք նախ ընտրել հոդված հոդվածների որոնման բաժնից:
              </p>
            )}
          </div>          {/* Custom Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI հուշում
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Մուտքագրեք վիկտորինա ստեղծելու համար հատուկ հրահանգներ..."
            />
          </div>          {/* AI Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI մոդել
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
          </div>          {/* Temperature Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ստեղծագործական մակարդակ (ջերմաստիճան): {temperature}
            </label>            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Պահպանողական (0.0)</span>
              <span>Հավասարակշռված (1.0)</span>
              <span>Ստեղծագործական (2.0)</span>
            </div>
          </div>

          {/* API Key Status */}
          {!state.apiKeys.gemini && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>                <p className="text-sm text-yellow-800">
                  Վիկտորինա ստեղծելու համար անհրաժեշտ է Gemini API բանալի
                </p>
              </div>
              <Button
                variant="warning"
                size="sm"
                className="mt-2"
                onClick={() => setShowApiKeyModal(true)}
              >
                Սահմանել API բանալի
              </Button>
            </div>
          )}          {/* Actions */}          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isGenerating}
            >
              Չեղարկել
            </Button>
            <Button
              onClick={handleGenerateQuiz}
              disabled={!state.selectedArticle || isGenerating}
              loading={isGenerating}
            >
              {isGenerating ? 'Վիկտորինա ստեղծվում է...' : 'Ստեղծել վիկտորինա'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
      />
    </>
  );
}

export default QuizModal;
