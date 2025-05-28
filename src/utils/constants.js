// API Configuration
export const API_CONFIG = {
  IDENTITY_BASE_URL: 'https://identity.api.bg.cluster.vecto.digital/api',
  INDEXING_BASE_URL: 'https://indexing.api.bg.cluster.vecto.digital/api',
  GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/'
};

// Quiz Templates
export const QUIZ_TEMPLATES = {
  ARMENIAN_COMPREHENSIVE: {
    instructions: `Generate a comprehensive single-choice quiz in Armenian, formatted as a JSON object with OpenAPI scheme provided below. Output clean JSON from the provided HTML article provided below. The article is written in Armenian and enclosed within an <article> tag with an id attribute. Extract the article ID from the article tag and use it in the articleIds field for each question. Prioritize generating a large number of relevant and diverse questions.`,
    temperature: 0.7,
    model: 'gemini-2.5-flash-preview-05-20'
  },
  ENGLISH_BASIC: {
    instructions: `Create a basic multiple-choice quiz in English based on the provided article content. The article content is enclosed within an <article> tag with an id attribute. Extract the article ID from the article tag and use it in the articleIds field for each question. Focus on key facts and main concepts.`,
    temperature: 0.5,
    model: 'gemini-2.5-flash-preview-05-20'
  }
};

// JSON Schema for Quiz Generation
export const QUIZ_JSON_SCHEMA = {
  type: "object",
  properties: {
    quizTitle: { type: "string" },
    quizDescription: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: { type: "number" },
          articleIds: { 
            type: "array", 
            items: { type: "string" },
            description: "Array containing the article ID extracted from the article tag's id attribute"
          },          explanation: { type: "string" },
          difficulty: { type: "string", enum: ["Հեշտ", "Միջին", "Բարդ"] }
        },
        required: ["question", "options", "answer", "articleIds", "explanation", "difficulty"]
      }
    }
  },
  required: ["quizTitle", "quizDescription", "questions"]
};

// Available Gemini Models
export const GEMINI_MODELS = [
  {
    id: 'gemini-2.5-pro-preview-05-06',
    name: 'Gemini 2.5 Pro Preview 05-06',
    description: 'Most capable model'
  },
  {
    id: 'gemini-2.5-flash-preview-05-20',
    name: 'Gemini 2.5 Flash Preview 05-20',
    description: 'Enhanced flash model'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Fast and efficient model'
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    description: 'Lightweight model'
  }
];

export const DEFAULT_QUIZ_INSTRUCTIONS = `Generate a comprehensive single-choice quiz in Armenian, formatted as a JSON object with OpenAPI scheme provided below. Output clean JSON from the provided HTML article provided below. The article is written in Armenian and enclosed within an <article> tag with an id attribute. Extract the article ID from the article tag and use it in the articleIds field for each question. Prioritize generating a large number of relevant and diverse questions. Use Armenian difficulty levels: "Հեշտ" for easy questions, "Միջին" for medium questions, and "Բարդ" for hard questions.`;

// UI Messages
export const MESSAGES = {
  hy: {
    // Authentication
    login: 'Մուտք գործել',
    logout: 'Դուրս գալ',
    email: 'Էլեկտրոնային փոստ',
    password: 'Գաղտնաբառ',
    emailPlaceholder: 'մուտքագրեք էլ. փոստը',
    passwordPlaceholder: 'մուտքագրեք գաղտնաբառը',
    loginSuccess: 'Հաջողությամբ մուտք գործեցիք',
    loginError: 'Մուտքի ժամանակ տեղի ունեցավ սխալ',
    logoutSuccess: 'Դուք հաջողությամբ դուրս եկաք',
    
    // Search and Articles
    search: 'Որոնում',
    searchPlaceholder: 'Մուտքագրեք որոնման բառ',
    searchResults: 'Որոնման արդյունքներ',
    noResults: 'Արդյունքներ չկան',
    searching: 'Որոնում...',
    selectArticle: 'Ընտրեք հոդված ձախ վահանակից՝ բովանդակությունը դիտելու համար',
    
    // Quiz
    generateQuiz: 'Ստեղծել վիկտորինա',
    quizTitle: 'Վիկտորինայի վերնագիր',
    quizDescription: 'Վիկտորինայի նկարագրություն',
    nextQuestion: 'Հաջորդ հարցը',
    checkAnswer: 'Ստուգել պատասխանը',
    correct: 'Ճիշտ է!',
    incorrect: 'Սխալ է',
    explanation: 'Բացատրություն',
    finalScore: 'Ձեր միավորները',
    restartQuiz: 'Կրկին փորձել',
    
    // API Key
    apiKey: 'API բանալի',
    apiKeyPlaceholder: 'Ձեր Gemini API բանալին',
    saveApiKey: 'Պահպանել API բանալին',
    apiKeyRequired: 'Խնդրում ենք մուտքագրել API բանալին',
    apiKeySaved: 'API բանալին պահպանված է',
    
    // General
    loading: 'Բեռնվում է...',
    error: 'Սխալ',
    success: 'Հաջողություն',
    cancel: 'Չեղարկել',
    close: 'Փակել',
    save: 'Պահպանել'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  GEMINI_API_KEY: 'geminiApiKey',
  USER_PREFERENCES: 'userPreferences'
};

// Difficulty Level Mappings
export const DIFFICULTY_MAPPINGS = {
  'Easy': 'Հեշտ',
  'Medium': 'Միջին', 
  'Hard': 'Բարդ',
  'Հեշտ': 'Հեշտ',
  'Միջին': 'Միջին',
  'Բարդ': 'Բարդ'
};

// Function to get Armenian difficulty
export const getArmenianDifficulty = (difficulty) => {
  return DIFFICULTY_MAPPINGS[difficulty] || difficulty;
};
