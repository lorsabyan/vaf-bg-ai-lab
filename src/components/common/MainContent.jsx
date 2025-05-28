import React from 'react';
import { useApp } from '../../context/AppContext';
import ArticleViewer from '../articles/ArticleViewer';
import QuizGenerator from '../quiz/QuizGenerator';
import QuizHistory from '../quiz/QuizHistory';
import LoadingSpinner from '../ui/LoadingSpinner';

function MainContent() {
  const { state } = useApp();

  if (state.loading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </main>
    );
  }
  return (
    <main className="flex-1 overflow-hidden bg-gray-50">
      {state.activeTab === 'explorer' ? (
        <ArticleViewer />
      ) : state.activeTab === 'quiz' ? (
        <QuizGenerator />
      ) : state.activeTab === 'history' ? (
        <div className="h-full overflow-y-auto p-6">
          <QuizHistory />
        </div>
      ) : (
        <ArticleViewer />
      )}
    </main>
  );
}

export default MainContent;
