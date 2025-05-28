import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import articleService from '../../services/articleService';
import quizService from '../../services/quizService';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import QuizModal from '../quiz/QuizModal';
import QuizInterfacePage from '../quiz/QuizInterfacePage';

function ArticleViewer() {
  const { state, dispatch, ActionTypes } = useApp();
  const [isExplaining, setIsExplaining] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [showKeyPointsModal, setShowKeyPointsModal] = useState(false);
  const [keyPoints, setKeyPoints] = useState('');
  const [isLoadingKeyPoints, setIsLoadingKeyPoints] = useState(false);
  
  const articleRef = useRef(null);
  const tooltipRef = useRef(null);

  const formattedContent = state.selectedArticle ? 
    articleService.formatArticleContent(state.selectedArticle) : null;

  useEffect(() => {
    setShowTooltip(false);
    setSelectedText('');
    setExplanation('');
  }, [state.selectedArticle]);

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const selectedTerm = selection.toString().trim();
    
    if (!selectedTerm || selectedTerm.length < 2) {
      setShowTooltip(false);
      return;
    }

    if (!state.apiKeys.gemini) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Խնդրում ենք նախ մուտքագրել Gemini API բանալին։'
      });
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
    setExplanation('Բացատրությունը բեռնվում է...');

    try {
      const result = await quizService.explainTerm(
        selectedTerm,
        formattedContent?.plainText || '',
        state.apiKeys.gemini
      );

      if (result.success) {
        setExplanation(result.data);
      } else {
        setExplanation(`<span class="text-red-600">${result.error}</span>`);
      }
    } catch (error) {
      setExplanation(`<span class="text-red-600">Բացատրությունը բերելիս սխալ տեղի ունեցավ։</span>`);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleGetKeyPoints = async () => {
    if (!formattedContent?.plainText) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Խնդրում ենք նախ ընտրել հոդված։'
      });
      return;
    }

    if (!state.apiKeys.gemini) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Խնդրում ենք նախ մուտքագրել Gemini API բանալին։'
      });
      return;
    }

    setShowKeyPointsModal(true);
    setIsLoadingKeyPoints(true);
    setKeyPoints('');

    const promptText = `Հոդվածի ամբողջական տեքստը հետևյալն է՝
---
${formattedContent.plainText}
---
Խնդրում եմ այս հոդվածից առանձնացրու հիմնական կետերը (key points) հայերենով։ Ներկայացրու դրանք որպես կարճ, հստակ կետերի ցանկ։ Յուրաքանչյուր կետ սկսիր նոր տողից։`;

    try {
      if (!quizService.genAI) {
        quizService.initializeAPI(state.apiKeys.gemini);
      }

      const generativeModel = quizService.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const result = await generativeModel.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: { 
          temperature: 0.4,
          maxOutputTokens: 1000,
        },
      });

      const response = await result.response;
      let keyPointsText = response.text();

      if (keyPointsText) {
        // Convert to HTML list
        const points = keyPointsText.split('\n').filter(line => line.trim());
        const htmlKeyPoints = '<ul class="list-disc pl-5 space-y-2">' + 
          points.map(point => `<li class="text-gray-700 leading-relaxed">${point.replace(/^[-•*]\s*/, '')}</li>`).join('') + 
          '</ul>';
        setKeyPoints(htmlKeyPoints);
      } else {
        setKeyPoints('<p class="text-red-600">Հիմնական կետերը ստանալ չհաջողվեց։</p>');
      }
    } catch (error) {
      console.error('Error getting key points:', error);
      setKeyPoints(`<p class="text-red-600">Հիմնական կետերը բերելիս սխալ տեղի ունեցավ։ (${error.message})</p>`);
    } finally {
      setIsLoadingKeyPoints(false);
    }
  };
  const handleClickOutside = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setShowTooltip(false);
    }
  };

  const handleBackToArticle = () => {
    dispatch({ type: ActionTypes.HIDE_QUIZ_INTERFACE });
  };

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
  }, [showTooltip]);
  if (!state.selectedArticle) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-8">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ընտրեք հոդված
          </h3>
          <p className="text-gray-500">
            Ընտրեք հոդված ձախ վահանակից՝ բովանդակությունը դիտելու համար
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
      {/* Article Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
            {state.selectedArticle.mainTitle || state.selectedArticle.shortTitle}
          </h2>
          <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
            <Button
              onClick={handleGetKeyPoints}
              variant="outline"
              size="sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Հիմնական կետեր
            </Button>            <Button
              onClick={() => dispatch({ type: ActionTypes.SHOW_QUIZ_MODAL })}
              variant="primary"
              size="sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Վիկտորինա
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>ID: {state.selectedArticle.id}</span>
          {state.selectedArticle.categoryName && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {state.selectedArticle.categoryName}
            </span>
          )}
        </div>
        
        <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md mt-3 border border-amber-200">
          💡 <strong>Հուշում:</strong> Ցանկացած տեքստ ընտրելով կարող եք ստանալ դրա բացատրությունը։
        </p>
      </div>

      {/* Article Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div 
            ref={articleRef}
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-sky-600 prose-strong:text-gray-900"
            onMouseUp={handleTextSelection}
            dangerouslySetInnerHTML={{ 
              __html: formattedContent?.html || '<p>Բովանդակությունը հասանելի չէ։</p>' 
            }}
          />
        </div>
      </div>

      {/* Tooltip for explanations */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-xs z-50 transform -translate-x-1/2"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <div className="text-sm">
            <div className="font-semibold text-gray-900 mb-2 border-b pb-1">
              {selectedText}
            </div>
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: explanation }}
            />
            {isExplaining && (
              <div className="flex items-center mt-2 text-sky-600">
                <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs">Բեռնվում է...</span>
              </div>
            )}
          </div>
        </div>
      )}      {/* Key Points Modal */}
      <Modal
        isOpen={showKeyPointsModal}
        onClose={() => setShowKeyPointsModal(false)}
        title="Հիմնական կետեր"
        size="lg"
      >
        <div className="p-6">
          {isLoadingKeyPoints ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-sky-600 mr-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Հիմնական կետերի բեռնում...</span>
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
}

export default ArticleViewer;
