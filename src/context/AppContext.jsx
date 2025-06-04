import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Helper function to safely access localStorage
const getFromLocalStorage = (key, defaultValue = '') => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

// Initial state
const initialState = {
  // Authentication
  isAuthenticated: false,
  user: null,
  accessToken: null,
  
  // Article explorer
  articles: [],
  selectedArticle: null,
  searchTerm: '',
  searchResults: [],
  isSearching: false,
  
  // Quiz functionality
  currentQuiz: null,
  quizProgress: {
    currentQuestion: 0,
    answers: [],
    score: 0,
    isCompleted: false
  },
  
  // API configuration
  apiKeys: {
    gemini: '',
    googleSearch: '',
  },
  googleSearchEngineId: '',  // UI state
  sidebarOpen: false,
  activeTab: 'explorer', // Only 'explorer' now - quiz removed
  theme: 'light',
  loading: false,
  error: null,
  success: null,
  selectedLanguage: 'en', // Default to English
  
  // Quiz state for article viewer
  showQuizModal: false,
  showQuizInterface: false,
  generatedQuiz: null
};

// Action types
const ActionTypes = {
  // Authentication
  SET_AUTH: 'SET_AUTH',
  LOGOUT: 'LOGOUT',
  
  // Articles
  SET_ARTICLES: 'SET_ARTICLES',
  SET_SELECTED_ARTICLE: 'SET_SELECTED_ARTICLE',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCHING: 'SET_SEARCHING',
  
  // Quiz
  SET_CURRENT_QUIZ: 'SET_CURRENT_QUIZ',
  UPDATE_QUIZ_PROGRESS: 'UPDATE_QUIZ_PROGRESS',
  RESET_QUIZ: 'RESET_QUIZ',
  
  // API
  SET_API_KEY: 'SET_API_KEY',
  SET_GOOGLE_SEARCH_ENGINE_ID: 'SET_GOOGLE_SEARCH_ENGINE_ID',
    // UI
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  SET_SELECTED_LANGUAGE: 'SET_SELECTED_LANGUAGE',
  
  // Quiz modal management
  SHOW_QUIZ_MODAL: 'SHOW_QUIZ_MODAL',
  HIDE_QUIZ_MODAL: 'HIDE_QUIZ_MODAL',
  SHOW_QUIZ_INTERFACE: 'SHOW_QUIZ_INTERFACE',
  HIDE_QUIZ_INTERFACE: 'HIDE_QUIZ_INTERFACE',
  SET_GENERATED_QUIZ: 'SET_GENERATED_QUIZ'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_AUTH:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken
      };
    
    case ActionTypes.LOGOUT:
      localStorage.removeItem('accessToken');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        articles: [],
        selectedArticle: null,
        searchResults: []
      };
    
    case ActionTypes.SET_ARTICLES:
      return {
        ...state,
        articles: action.payload
      };
    
    case ActionTypes.SET_SELECTED_ARTICLE:
      return {
        ...state,
        selectedArticle: action.payload
      };
    
    case ActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };
    
    case ActionTypes.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload
      };
    
    case ActionTypes.SET_SEARCHING:
      return {
        ...state,
        isSearching: action.payload
      };
    
    case ActionTypes.SET_CURRENT_QUIZ:
      return {
        ...state,
        currentQuiz: action.payload,
        quizProgress: {
          currentQuestion: 0,
          answers: [],
          score: 0,
          isCompleted: false
        }
      };
    
    case ActionTypes.UPDATE_QUIZ_PROGRESS:
      return {
        ...state,
        quizProgress: {
          ...state.quizProgress,
          ...action.payload
        }
      };
    
    case ActionTypes.RESET_QUIZ:
      return {
        ...state,
        currentQuiz: null,
        quizProgress: {
          currentQuestion: 0,
          answers: [],
          score: 0,
          isCompleted: false
        }
      };
    
    case ActionTypes.SET_API_KEY:
      const newApiKeys = {
        ...state.apiKeys,
        [action.payload.type]: action.payload.key
      };
      // Safely store to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`${action.payload.type}ApiKey`, action.payload.key);
      }
      return {
        ...state,
        apiKeys: newApiKeys
      };
    
    case ActionTypes.SET_GOOGLE_SEARCH_ENGINE_ID:
      // Safely store to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('googleSearchEngineId', action.payload);
      }
      return {
        ...state,
        googleSearchEngineId: action.payload
      };
    
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    
    case ActionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case ActionTypes.SET_SUCCESS:
      return {
        ...state,
        success: action.payload,
        loading: false
      };
      case ActionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        error: null,
        success: null
      };
    
    case ActionTypes.SET_SELECTED_LANGUAGE:
      return {
        ...state,
        selectedLanguage: action.payload
      };
    
    case ActionTypes.SHOW_QUIZ_MODAL:
      return {
        ...state,
        showQuizModal: true
      };
    
    case ActionTypes.HIDE_QUIZ_MODAL:
      return {
        ...state,
        showQuizModal: false
      };
    
    case ActionTypes.SHOW_QUIZ_INTERFACE:
      return {
        ...state,
        showQuizInterface: true,
        showQuizModal: false
      };
    
    case ActionTypes.HIDE_QUIZ_INTERFACE:
      return {
        ...state,
        showQuizInterface: false,
        generatedQuiz: null
      };
    
    case ActionTypes.SET_GENERATED_QUIZ:
      return {
        ...state,
        generatedQuiz: action.payload
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize localStorage values after component mounts
  useEffect(() => {
    // Initialize API keys from localStorage
    const geminiKey = getFromLocalStorage('geminiApiKey');
    if (geminiKey) {
      dispatch({
        type: ActionTypes.SET_API_KEY,
        payload: { type: 'gemini', key: geminiKey }
      });
    }

    const googleSearchKey = getFromLocalStorage('googleSearchApiKey');
    if (googleSearchKey) {
      dispatch({
        type: ActionTypes.SET_API_KEY,
        payload: { type: 'googleSearch', key: googleSearchKey }
      });
    }

    const googleSearchEngineId = getFromLocalStorage('googleSearchEngineId');
    if (googleSearchEngineId) {
      dispatch({
        type: ActionTypes.SET_GOOGLE_SEARCH_ENGINE_ID,
        payload: googleSearchEngineId
      });
    }

    // Initialize selected language from localStorage
    const savedLanguage = getFromLocalStorage('selectedLanguage', 'en');
    dispatch({
      type: ActionTypes.SET_SELECTED_LANGUAGE,
      payload: savedLanguage
    });

    // Check for existing auth token
    const token = getFromLocalStorage('accessToken');
    const userEmail = getFromLocalStorage('userEmail');
    if (token) {
      dispatch({
        type: ActionTypes.SET_AUTH,
        payload: {
          user: { email: userEmail || '' },
          accessToken: token
        }
      });
    }
  }, []);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (state.error || state.success) {
      const timer = setTimeout(() => {
        dispatch({ type: ActionTypes.CLEAR_MESSAGES });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error, state.success]);

  const value = {
    state,
    dispatch,
    ActionTypes
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
