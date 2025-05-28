import React, { useState } from 'react';
import Button from '../ui/Button';
import { getArmenianDifficulty } from '../../utils/constants';

const QuizInterfacePage = ({ quiz, onBack, onComplete, onGenerateNew }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questionFeedback, setQuestionFeedback] = useState({}); // Track feedback for each question
  const [checkedQuestions, setCheckedQuestions] = useState({}); // Track which questions have been checked

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const totalQuestions = quiz?.questions?.length || 0;
  const handleAnswerSelect = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
    
    // Clear feedback when selecting a new answer (if question hasn't been checked yet)
    if (!checkedQuestions[currentQuestionIndex]) {
      setQuestionFeedback(prev => ({
        ...prev,
        [currentQuestionIndex]: null
      }));
    }
  };
  const handleCheckAnswer = () => {
    const userAnswer = answers[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;
    const isCorrect = userAnswer === correctAnswer;
    
    // Mark question as checked
    setCheckedQuestions(prev => ({
      ...prev,
      [currentQuestionIndex]: true
    }));
    
    // Set feedback for this question
    setQuestionFeedback(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        isCorrect,
        userAnswer,
        correctAnswer,
        isAnswered: userAnswer !== undefined
      }
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
    
    // Call onComplete with results
    if (onComplete) {
      onComplete({ score: calculatedScore, answers, totalQuestions });
    }
  };

  const currentFeedback = questionFeedback[currentQuestionIndex];
  const isQuestionChecked = checkedQuestions[currentQuestionIndex];
  const canProceed = isQuestionChecked || answers[currentQuestionIndex] === undefined;

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-8">
          <svg className="w-16 h-16 text-red-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Վիկտորինայի սխալ
          </h3>
          <p className="text-gray-500 mb-4">
            Վիկտորինայի հարցեր հասանելի չեն։
          </p>
          <Button onClick={onBack} variant="outline">
            Վերադառնալ հոդվածին
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Վիկտորինայի արդյունքներ
            </h2>
            <div className="flex items-center space-x-2">
              <Button onClick={onBack} variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Վերադառնալ հոդվածին
              </Button>
              {onGenerateNew && (
                <Button onClick={onGenerateNew} variant="primary" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Նոր վիկտորինա
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Score Display */}
            <div className="text-center mb-8 bg-gray-50 rounded-lg p-8">
              <div className="mb-4">
                <div className={`text-6xl font-bold mb-2 ${
                  score >= 80 ? 'text-green-600' : 
                  score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {score}%
                </div>
                <p className="text-xl text-gray-600">
                  {score >= 80 ? 'Գերազանց!' : 
                   score >= 60 ? 'Լավ արդյունք!' : 'Շարունակեք պարապել!'}
                </p>
              </div>              <p className="text-gray-600">
                Դուք ճիշտ պատասխանել եք {Object.values(answers).filter((answer, index) => 
                  answer === quiz.questions[index]?.answer
                ).length} հարցի {totalQuestions}-ից։
              </p>
            </div>

            {/* Detailed Results */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Մանրամասն արդյունքներ</h3>              {quiz.questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.answer;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-3 text-lg">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-2">                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className={`p-3 rounded-md border ${
                              optIndex === question.answer ? 'bg-green-50 border-green-200 text-green-800' :
                              optIndex === userAnswer && !isCorrect ? 'bg-red-50 border-red-200 text-red-800' :
                              'bg-gray-50 border-gray-200 text-gray-600'
                            }`}>                              <div className="flex items-center justify-between">
                                <span><strong>{String.fromCharCode(65 + optIndex)}.</strong> {option}</span>
                                <div className="flex items-center space-x-2">
                                  {optIndex === question.answer && (
                                    <span className="text-green-600 font-medium">✓ Ճիշտ պատասխան</span>
                                  )}
                                  {optIndex === userAnswer && !isCorrect && (
                                    <span className="text-red-600 font-medium">Ձեր պատասխանը</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {quiz.title || 'Վիկտորինա'}
            </h2>
            <p className="text-sm text-gray-600">
              Հարց {currentQuestionIndex + 1} / {totalQuestions}
            </p>
          </div>
          <Button onClick={onBack} variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Փակել
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-sky-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto">        <div className="max-w-3xl mx-auto p-6">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentQuestion?.question}
            </h3>            {/* Difficulty Display */}
            {currentQuestion?.difficulty && (
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-medium">Բարդություն:</span> {getArmenianDifficulty(currentQuestion.difficulty)}
              </p>
            )}<div className="space-y-3">
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = answers[currentQuestionIndex] === index;
                const isCorrect = index === currentQuestion.answer;
                const isUserAnswer = currentFeedback?.userAnswer === index;
                
                // Determine option styling based on feedback state
                let optionClasses = `flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors `;
                
                if (isQuestionChecked) {
                  // Question has been checked - show feedback styling
                  if (isCorrect) {
                    optionClasses += 'border-green-500 bg-green-50 text-green-800';
                  } else if (isUserAnswer && !isCorrect) {
                    optionClasses += 'border-red-500 bg-red-50 text-red-800';
                  } else {
                    optionClasses += 'border-gray-200 bg-gray-50 text-gray-600';
                  }
                } else {
                  // Question not checked yet - normal selection styling
                  if (isSelected) {
                    optionClasses += 'border-sky-500 bg-sky-50';
                  } else {
                    optionClasses += 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
                  }
                }

                return (
                  <label
                    key={index}
                    className={optionClasses}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={index}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(index)}
                      disabled={isQuestionChecked}
                      className="sr-only"
                    />                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      isQuestionChecked && isCorrect
                        ? 'border-green-500 bg-green-500'
                        : isQuestionChecked && isUserAnswer && !isCorrect
                        ? 'border-red-500 bg-red-500'
                        : isSelected && !isQuestionChecked
                        ? 'border-sky-500 bg-sky-500'
                        : 'border-gray-300'
                    }`}>
                      {isQuestionChecked && isCorrect && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {isQuestionChecked && isUserAnswer && !isCorrect && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      {isSelected && !isQuestionChecked && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div><span className="text-gray-900 flex-1">
                      {option}
                      {isQuestionChecked && isCorrect && (
                        <span className="ml-2 text-green-600 font-medium">✓ Ճիշտ պատասխան</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Check Answer Button */}
            {!isQuestionChecked && (
              <button
                onClick={handleCheckAnswer}
                disabled={answers[currentQuestionIndex] === undefined}
                className={`mt-4 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  answers[currentQuestionIndex] !== undefined
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Ստուգել պատասխանը
              </button>
            )}

            {/* Instant Feedback */}
            {currentFeedback && (
              <div className={`mt-4 p-4 rounded-lg border-l-4 ${
                currentFeedback.isCorrect
                  ? 'bg-green-50 border-green-400'
                  : currentFeedback.isAnswered
                  ? 'bg-red-50 border-red-400'
                  : 'bg-yellow-50 border-yellow-400'
              }`}>
                {currentFeedback.isAnswered ? (
                  currentFeedback.isCorrect ? (
                    <div className="text-green-700">
                      <strong>Ճիշտ է!</strong>
                    </div>                ) : (
                  <div className="text-red-700">
                    <strong>Սխալ է:</strong> Ճիշտ պատասխանն էր՝ "{currentQuestion.options[currentFeedback.correctAnswer]}"
                  </div>
                )
              ) : (
                  <div className="text-yellow-700">
                    <strong>Պատասխանված չէ:</strong> Խնդրում ենք ընտրել պատասխան։
                  </div>
                )}
                
                {/* Explanation */}
                {currentQuestion?.explanation && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-md border-l-4 border-gray-400">
                    <div className="text-gray-700 text-sm">
                      <strong>Բացատրություն:</strong> {currentQuestion.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Նախորդ
          </Button>

          <Button
            onClick={handleNext}
            disabled={answers[currentQuestionIndex] === undefined}
            variant="primary"
          >
            {currentQuestionIndex === totalQuestions - 1 ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ավարտել վիկտորինան
              </>
            ) : (
              <>
                Հաջորդ
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizInterfacePage;
