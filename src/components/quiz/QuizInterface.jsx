import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const QuizInterface = ({ quiz, onComplete, onClose }) => {
  const { t } = useTranslation();
  const { dispatch, ActionTypes } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const totalQuestions = quiz?.questions?.length || 0;

  const handleAnswerSelect = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(calculatedScore);
    setShowResults(true);
  };  const handleFinish = () => {
    onComplete({ score, answers, totalQuestions });
    dispatch({ 
      type: ActionTypes.SET_SUCCESS,
      payload: t('quiz.errors.completionSuccess')
    });
  };

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <Modal isOpen={true} onClose={onClose} title={t('quiz.interface.quizError')}>
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">{t('quiz.interface.noQuestionsAvailable')}</p>
          <Button onClick={onClose} variant="outline">
            {t('quiz.interface.close')}
          </Button>
        </div>
      </Modal>
    );
  }

  if (showResults) {
    return (
      <Modal isOpen={true} onClose={onClose} title={t('quiz.interface.results')} size="lg">
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className={`text-6xl font-bold mb-2 ${
                score >= 80 ? 'text-green-600' : 
                score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score}%
              </div>
              <p className="text-xl text-gray-600">
                {score >= 80 ? t('quiz.interface.excellent') : 
                 score >= 60 ? t('quiz.interface.goodJob') : t('quiz.interface.keepPracticing')}
              </p>
            </div>            <p className="text-gray-600 mb-6">
              {t('quiz.interface.correctAnswers', { 
                correct: Object.values(answers).filter((answer, index) => 
                  answer === quiz.questions[index]?.answer
                ).length,
                total: totalQuestions
              })}
            </p>
          </div>

          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">            {quiz.questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.answer;
              
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
                      <div className="space-y-1 text-sm">                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className={`p-2 rounded ${
                            optIndex === question.answer ? 'bg-green-100 text-green-800' :
                            optIndex === userAnswer && !isCorrect ? 'bg-red-100 text-red-800' :
                            'text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {optIndex === question.answer && ' ✓'}
                            {optIndex === userAnswer && !isCorrect && ` ${t('quiz.interface.yourAnswer')}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-end">
            <Button onClick={onClose} variant="outline">
              {t('quiz.interface.close')}
            </Button>
            <Button onClick={handleFinish}>
              {t('quiz.interface.saveResults')}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`Quiz: ${quiz.title || 'Untitled'}`} size="lg">
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t('quiz.interface.questionProgress', { current: currentQuestionIndex + 1, total: totalQuestions })}</span>
            <span>{t('quiz.interface.percentComplete', { percent: Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) })}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQuestionIndex] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={index}
                    checked={answers[currentQuestionIndex] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[currentQuestionIndex] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestionIndex] === index && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900 mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-gray-900">{option}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            {t('quiz.interface.previous')}
          </Button>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline">
              {t('quiz.interface.cancel')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestionIndex] === undefined}
            >
              {currentQuestionIndex === totalQuestions - 1 ? t('quiz.interface.finishQuiz') : t('quiz.interface.nextQuestion')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuizInterface;
