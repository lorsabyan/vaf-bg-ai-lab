import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const QuizHistory = () => {
  const { t } = useTranslation();
  const { state, dispatch, ActionTypes } = useApp();
  const [quizHistory, setQuizHistory] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const showMessage = useCallback((message, type = 'success') => {
    if (type === 'success') {
      dispatch({ type: ActionTypes.SET_SUCCESS, payload: message });
    } else {
      dispatch({ type: ActionTypes.SET_ERROR, payload: message });
    }
  }, [dispatch, ActionTypes]);

  const loadQuizHistory = useCallback(() => {
    try {
      const saved = typeof window !== 'undefined' && window.localStorage 
        ? localStorage.getItem('quiz_history') 
        : null;
      if (saved) {
        const history = JSON.parse(saved);
        setQuizHistory(history.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)));
      }
    } catch (error) {
      console.error('Error loading quiz history:', error);
      showMessage(t('quiz.history.loadError'), 'error');
    }
  }, [t, showMessage]);

  useEffect(() => {
    loadQuizHistory();
  }, [loadQuizHistory]);

  const clearHistory = () => {
    if (window.confirm(t('quiz.history.confirmClearHistory'))) {
      localStorage.removeItem('quiz_history');
      setQuizHistory([]);
      showMessage(t('quiz.history.historyCleared'), 'success');
    }
  };

  const deleteQuizResult = (quizId) => {
    if (window.confirm(t('quiz.history.confirmDeleteQuiz'))) {
      const updatedHistory = quizHistory.filter(quiz => quiz.id !== quizId);
      setQuizHistory(updatedHistory);
      localStorage.setItem('quiz_history', JSON.stringify(updatedHistory));
      showMessage(t('quiz.history.quizDeleted'), 'success');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return t('quiz.history.excellent');
    if (score >= 60) return t('quiz.history.good');
    return t('quiz.history.needsImprovement');
  };

  const calculateStats = () => {
    if (quizHistory.length === 0) return null;

    const totalQuizzes = quizHistory.length;
    const averageScore = Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes);
    const bestScore = Math.max(...quizHistory.map(quiz => quiz.score));
    const recentQuizzes = quizHistory.slice(0, 5);
    const recentAverage = Math.round(recentQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / recentQuizzes.length);

    return {
      totalQuizzes,
      averageScore,
      bestScore,
      recentAverage
    };
  };

  const stats = calculateStats();

  if (quizHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('quiz.history.noHistoryTitle')}</h3>
          <p className="text-gray-600 mb-4">
            {t('quiz.history.noHistoryMessage')}
          </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quiz.history.statistics')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalQuizzes}</div>
              <div className="text-sm text-gray-600">{t('quiz.history.totalQuizzes')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600">{t('quiz.history.averageScore')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.bestScore}%</div>
              <div className="text-sm text-gray-600">{t('quiz.history.bestScore')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.recentAverage}%</div>
              <div className="text-sm text-gray-600">{t('quiz.history.recentAverage')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz History List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{t('quiz.history.title')}</h3>
            <Button onClick={clearHistory} variant="outline" size="sm">
              {t('quiz.history.clearHistory')}
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {quizHistory.map((quiz) => (
            <div key={quiz.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {quiz.title || t('quiz.history.untitledQuiz')}
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(quiz.score)}`}>
                      {quiz.score}% • {getScoreLabel(quiz.score)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {t('quiz.history.correctAnswers', { 
                        correct: quiz.correctAnswers || 0, 
                        total: quiz.totalQuestions || 0 
                      })}
                    </span>
                    <span>{formatDate(quiz.completedAt)}</span>
                    {quiz.model && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {quiz.model}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      setShowDetails(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    {t('quiz.history.viewDetails')}
                  </Button>
                  <Button
                    onClick={() => deleteQuizResult(quiz.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    {t('quiz.history.delete')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Details Modal */}
      {showDetails && selectedQuiz && (
        <Modal 
          isOpen={showDetails} 
          onClose={() => setShowDetails(false)} 
          title={t('quiz.history.quizDetails')}
          size="lg"
        >
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedQuiz.title || t('quiz.history.untitledQuiz')}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{t('quiz.history.completedOn', { date: formatDate(selectedQuiz.completedAt) })}</span>
                <span>{t('quiz.history.score', { score: selectedQuiz.score })}</span>
                <span>{t('quiz.history.questions', { count: selectedQuiz.totalQuestions })}</span>
                {selectedQuiz.model && <span>{t('quiz.history.model', { model: selectedQuiz.model })}</span>}
              </div>
            </div>

            {selectedQuiz.questions && selectedQuiz.answers && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedQuiz.questions.map((question, index) => {
                  const userAnswer = selectedQuiz.answers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">
                            {index + 1}. {question.question}
                          </p>
                          <div className="space-y-1 text-sm">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className={`p-2 rounded ${
                                optIndex === question.correctAnswer ? 'bg-green-100 text-green-800' :
                                optIndex === userAnswer && !isCorrect ? 'bg-red-100 text-red-800' :
                                'text-gray-600'
                              }`}>
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {optIndex === question.correctAnswer && ` ${t('quiz.history.correctAnswer')}`}
                                {optIndex === userAnswer && !isCorrect && ` ${t('quiz.history.yourAnswer')}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button onClick={() => setShowDetails(false)}>
                {t('quiz.history.close')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuizHistory;
