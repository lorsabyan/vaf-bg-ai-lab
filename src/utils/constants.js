// API Configuration
export const API_CONFIG = {
  IDENTITY_BASE_URL: 'https://identity.api.bg.cluster.vecto.digital/api',
  INDEXING_BASE_URL: 'https://indexing.api.bg.cluster.vecto.digital/api',
  GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/'
};

// Difficulty Level Mappings (must be defined before getQuizJsonSchema)
export const DIFFICULTY_MAPPINGS = {
  hy: {
    easy: 'Հեշտ',
    medium: 'Միջին', 
    hard: 'Բարդ'
  },
  hyw: {
    easy: 'Հեշտ',
    medium: 'Միջին', 
    hard: 'Բարդ'
  },
  en: {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  },
  ru: {
    easy: 'Легкий',
    medium: 'Средний',
    hard: 'Сложный'
  }
};

// Language-specific quiz instructions (must be defined before DEFAULT_QUIZ_INSTRUCTIONS)
export const QUIZ_INSTRUCTIONS_BY_LANGUAGE = {
  hy: {
    instructions: `Ստեղծեք մեկ ընտրանքով համապարփակ թեստ հայերեն, ֆորմատավորված որպես JSON օբյեկտ ստորև տրված OpenAPI սխեմայով: Արտահանեք մաքուր JSON տրված HTML հոդվածից: Հոդվածը գրված է հայերեն և փակված է <article> էթիքի մեջ id ատրիբուտով: Հանեք հոդվածի ID-ն article էթիքի id ատրիբուտից և օգտագործեք այն articleIds դաշտում յուրաքանչյուր հարցի համար: Առաջնահերթություն տվեք առավելագույն թվով համապատասխան և բազմազան հարցեր գեներացնելուն: Օգտագործեք հայկական բարդության մակարդակները: "Հեշտ" - հեշտ հարցերի համար, "Միջին" - միջին հարցերի համար, "Բարդ" - բարդ հարցերի համար:`,
    language: 'հայերեն'
  },
  hyw: {
    instructions: `Ստեղծէք մէկ ընտրանքով համապարփակ թեստ արեւմտահայերէն, ֆորմատաւորուած որպէս JSON օբյեկտ ստորեւ տրուած OpenAPI սխեմայով: Արտահանեցէք մաքուր JSON տրուած HTML հոդուածէն: Հոդուածը գրուած է արեւմտահայերէն եւ փակուած է <article> էթիքի մէջ id ատրիպուտով: Հանեցէք հոդուածի ID-ն article էթիքի id ատրիպուտէն եւ օգտագործեցէք զայն articleIds դաշտում իւրաքանչիւր հարցի համար: Առաջնահերթութիւն տուէք առաւելագոյն թուով համապատասխան եւ բազմազան հարցեր գեներացնելուն: Օգտագործեցէք հայկական բարդութեան մակարդակները: "Հեշտ" - հեշտ հարցերի համար, "Միջին" - միջին հարցերի համար, "Բարդ" - բարդ հարցերի համար:`,
    language: 'արեւմտահայերէն'
  },
  en: {
    instructions: `Generate a comprehensive single-choice quiz in English, formatted as a JSON object with the OpenAPI schema provided below. Output clean JSON from the provided HTML article. The article is enclosed within an <article> tag with an id attribute. Extract the article ID from the article tag's id attribute and use it in the articleIds field for each question. Prioritize generating a large number of relevant and diverse questions. Use English difficulty levels: "Easy" for easy questions, "Medium" for medium questions, and "Hard" for hard questions.`,
    language: 'English'
  },
  ru: {
    instructions: `Создайте комплексный тест с одним вариантом ответа на русском языке, отформатированный как JSON-объект с предоставленной ниже схемой OpenAPI. Выведите чистый JSON из предоставленной HTML-статьи. Статья заключена в тег <article> с атрибутом id. Извлеките ID статьи из атрибута id тега article и используйте его в поле articleIds для каждого вопроса. Приоритет отдавайте генерации максимального количества релевантных и разнообразных вопросов. Используйте русские уровни сложности: "Легкий" для легких вопросов, "Средний" для средних вопросов и "Сложный" для сложных вопросов.`,
    language: 'русском языке'
  }
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

// Default quiz instructions (now QUIZ_INSTRUCTIONS_BY_LANGUAGE is defined)
export const DEFAULT_QUIZ_INSTRUCTIONS = QUIZ_INSTRUCTIONS_BY_LANGUAGE.hy.instructions;

// JSON Schema for Quiz Generation (now DIFFICULTY_MAPPINGS is defined)
export const getQuizJsonSchema = (language = 'hy') => {
  const difficultyLevels = Object.values(DIFFICULTY_MAPPINGS[language] || DIFFICULTY_MAPPINGS.hy);
  
  return {
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
            },
            explanation: { type: "string" },
            difficulty: { type: "string", enum: difficultyLevels }
          },
          required: ["question", "options", "answer", "articleIds", "explanation", "difficulty"]
        }
      }
    },
    required: ["quizTitle", "quizDescription", "questions"]
  };
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
