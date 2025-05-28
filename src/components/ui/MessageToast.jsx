import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

function MessageToast() {
  const { state, dispatch, ActionTypes } = useApp();

  useEffect(() => {
    if (state.error || state.success) {
      const timer = setTimeout(() => {
        dispatch({ type: ActionTypes.CLEAR_MESSAGES });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.error, state.success, dispatch, ActionTypes]);

  if (!state.error && !state.success) {
    return null;
  }

  const message = state.error || state.success;
  const isError = !!state.error;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div
        className={`
          p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out
          ${isError 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-green-50 border-green-200 text-green-800'
          }
        `}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {isError ? (
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => dispatch({ type: ActionTypes.CLEAR_MESSAGES })}
              className={`
                rounded-md p-1.5 inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isError 
                  ? 'text-red-500 hover:bg-red-100 focus:ring-red-500' 
                  : 'text-green-500 hover:bg-green-100 focus:ring-green-500'
                }
              `}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageToast;
