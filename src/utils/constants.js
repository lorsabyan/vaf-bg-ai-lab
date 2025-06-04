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
    instructions: `Ստեղծէք մէկ ընտրանքով համապարփակ թեստ արեւմտահայերէն, ֆորմատաւորուած որպէս JSON օբյեկտ ստորեւ տրուած OpenAPI սխեմայով: Արտահանեցէք մաքուր JSON տրուած HTML հոդուածէն: Հոդուածը գրուած է արեւմտահայերէն եւ փակված է <article> էթիքի մէջ id ատրիպուտով: Հանեցէք հոդուածի ID-ն article էթիքի id ատրիպուտէն եւ օգտագործեցէք զայն articleIds դաշտում իւրաքանչիւր հարցի համար: Առաջնահերթութիւն տուէք առաւելագոյն թուով համապատասխան եւ բազմազան հարցեր գեներացնելուն: Օգտագործեցէք հայկական բարդութեան մակարդակները: "Հեշտ" - հեշտ հարցերի համար, "Միջին" - միջին հարցերի համար, "Բարդ" - բարդ հարցերի համար:`,
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

// Language-specific explanation prompts
export const EXPLANATION_PROMPTS_BY_LANGUAGE = {
  hy: {
    promptTemplate: (term, context) => `Հոդվածի ամբողջական տեքստը հետևյալն է՝
---
${context}
---
Հաշվի առնելով վերոնշյալ հոդվածի համատեքստը, խնդրում եմ բացատրիր «${term}» տերմինը կամ արտահայտությունը հայերենով։ Տուր հակիրճ և հասկանալի բացատրություն։ Պատասխանը ֆորմատավորիր **միայն որպես HTML**։ **Մի՛ ներառիր որևէ նախաբան կամ վերջաբան, այլ միայն բացատրությունը։ Մի՛ օգտագործիր markdown:** Օգտագործիր <strong> թեգը թավատառի համար, <em> թեգը շեղատառի համար, և <br> թեգը տողադարձերի համար։`,
    language: 'հայերենով',
    getCleanupPhrases: (term) => [
      `Ահա «${term}» տերմինի բացատրությունը HTML ֆորմատով.`,
      `Ահա «${term}» տերմինի բացատրությունը.`,
      `Սա «${term}» տերմինի բացատրությունն է HTML ֆորմատով.`,
      `Սա «${term}» տերմինի բացատրությունն է.`
    ]
  },
  hyw: {
    promptTemplate: (term, context) => `Հոդուածի ամբողջական տեքստը հետեւեալն է՝
---
${context}
---
Հաշուի առնելով վերոնշեալ հոդուածի համատեքստը, խնդրում եմ բացատրիր «${term}» տերմինը կամ արտահայտութիւնը արեւմտահայերէն։ Տուր հակիրճ եւ հասկանալի բացատրութիւն։ Պատասխանը ֆորմատաւորիր **միայն որպէս HTML**։ **Մի՛ ներառիր որեւէ նախապան կամ վերջապան, այլ միայն բացատրութիւնը։ Մի՛ օգտագործիր markdown:** Օգտագործիր <strong> թեգը թաւատառի համար, <em> թեգը շեղատառի համար, եւ <br> թեգը տողադարձերի համար։`,
    language: 'արեւմտահայերէն',
    getCleanupPhrases: (term) => [
      `Ահա «${term}» տերմինի բացատրութիւնը HTML ֆորմատով.`,
      `Ահա «${term}» տերմինի բացատրութիւնը.`,
      `Սա «${term}» տերմինի բացատրութիւնն է HTML ֆորմատով.`,
      `Սա «${term}» տերմինի բացատրութիւնն է.`
    ]
  },
  en: {
    promptTemplate: (term, context) => `The complete article text is as follows:
---
${context}
---
Taking into account the context of the above article, please explain the term or expression "${term}" in English. Provide a concise and understandable explanation. Format the response **only as HTML**. **Do not include any introduction or conclusion, only the explanation. Do not use markdown:** Use <strong> tag for bold, <em> tag for italic, and <br> tag for line breaks.`,
    language: 'in English',
    getCleanupPhrases: (term) => [
      `Here is the explanation of the term "${term}" in HTML format.`,
      `Here is the explanation of the term "${term}".`,
      `This is the explanation of the term "${term}" in HTML format.`,
      `This is the explanation of the term "${term}".`
    ]
  },
  ru: {
    promptTemplate: (term, context) => `Полный текст статьи следующий:
---
${context}
---
Учитывая контекст вышеуказанной статьи, пожалуйста, объясните термин или выражение "${term}" на русском языке. Дайте краткое и понятное объяснение. Отформатируйте ответ **только как HTML**. **Не включайте никакого введения или заключения, только объяснение. Не используйте markdown:** Используйте тег <strong> для жирного шрифта, тег <em> для курсива и тег <br> для переносов строк.`,
    language: 'на русском языке',
    getCleanupPhrases: (term) => [
      `Вот объяснение термина "${term}" в формате HTML.`,
      `Вот объяснение термина "${term}".`,
      `Это объяснение термина "${term}" в формате HTML.`,
      `Это объяснение термина "${term}".`
    ]
  }
};

// Language-specific error messages for explanations
export const EXPLANATION_ERROR_MESSAGES = {
  hy: {
    apiKeyRequired: 'Gemini API բանալին տրամադրված չէ։',
    explanationFailed: 'Բացատրությունը բերելիս սխալ տեղի ունեցավ։'
  },
  hyw: {
    apiKeyRequired: 'Gemini API բանալին տրամադրուած չէ։',
    explanationFailed: 'Բացատրութիւնը բերելիս սխալ տեղի ունեցաւ։'
  },
  en: {
    apiKeyRequired: 'Gemini API key is not provided.',
    explanationFailed: 'An error occurred while fetching the explanation.'
  },
  ru: {
    apiKeyRequired: 'Ключ API Gemini не предоставлен.',
    explanationFailed: 'Произошла ошибка при получении объяснения.'
  }
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
