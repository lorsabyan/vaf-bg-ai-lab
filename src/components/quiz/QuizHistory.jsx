import React, { useState, useContext, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const QuizHistory = () => {
  const { state, dispatch, ActionTypes } = useApp();
  const [quizHistory, setQuizHistory] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      dispatch({ type: ActionTypes.SET_SUCCESS, payload: message });
    } else {
      dispatch({ type: ActionTypes.SET_ERROR, payload: message });
    }
  };

  const loadQuizHistory = () => {
    try {
      const saved = localStorage.getItem('quiz_history');
      if (saved) {
        const history = JSON.parse(saved);
        setQuizHistory(history.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)));
      }
    } catch (error) {
      console.error('Error loading quiz history:', error);
      showMessage('Error loading quiz history', 'error');
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all quiz history? This action cannot be undone.')) {
      localStorage.removeItem('quiz_history');
      setQuizHistory([]);
      showMessage('Quiz history cleared', 'success');
    }
  };

  const deleteQuizResult = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz result?')) {
      const updatedHistory = quizHistory.filter(quiz => quiz.id !== quizId);
      setQuizHistory(updatedHistory);
      localStorage.setItem('quiz_history', JSON.stringify(updatedHistory));
      showMessage('Quiz result deleted', 'success');
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
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
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
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz History</h3>
        <p className="text-gray-600 mb-4">
          You haven't completed any quizzes yet. Generate and take a quiz to see your results here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalQuizzes}</div>
              <div className="text-sm text-gray-600">Total Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.bestScore}%</div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.recentAverage}%</div>
              <div className="text-sm text-gray-600">Recent Average</div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz History List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Quiz History</h3>
            <Button onClick={clearHistory} variant="outline" size="sm">
              Clear History
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
                      {quiz.title || 'Untitled Quiz'}
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(quiz.score)}`}>
                      {quiz.score}% • {getScoreLabel(quiz.score)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {quiz.correctAnswers || 0} / {quiz.totalQuestions || 0} correct
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
                    View Details
                  </Button>
                  <Button
                    onClick={() => deleteQuizResult(quiz.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete
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
          title="Quiz Details"
          size="lg"
        >
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedQuiz.title || 'Untitled Quiz'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Completed: {formatDate(selectedQuiz.completedAt)}</span>
                <span>Score: {selectedQuiz.score}%</span>
                <span>Questions: {selectedQuiz.totalQuestions}</span>
                {selectedQuiz.model && <span>Model: {selectedQuiz.model}</span>}
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
                                {optIndex === question.correctAnswer && ' ✓'}
                                {optIndex === userAnswer && !isCorrect && ' (Your answer)'}
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
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuizHistory;
