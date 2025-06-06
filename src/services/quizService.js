import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG, getQuizJsonSchema, QUIZ_INSTRUCTIONS_BY_LANGUAGE, DEFAULT_QUIZ_INSTRUCTIONS, EXPLANATION_PROMPTS_BY_LANGUAGE, EXPLANATION_ERROR_MESSAGES } from '../utils/constants';

class QuizService {
  constructor() {
    this.genAI = null;
  }

  initializeAPI(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API Key cannot be empty.');
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      return true;
    } catch (error) {
      console.error('SDK Initialization Error:', error);
      throw new Error('Failed to initialize Gemini API SDK.');
    }
  }

  async generateQuiz(options) {
    const {
      instructions,
      articleContent,
      model = 'gemini-2.5-flash-preview-05-20',
      temperature = 0.7,
      targetLanguage = 'en'
    } = options;

    if (!this.genAI) {
      throw new Error('Gemini API not initialized. Please save a valid API key first.');
    }    if (!instructions || !articleContent) {
      throw new Error('Please ensure all fields (instructions and article content) are filled.');
    }

    // Validate that articleContent is a string
    if (typeof articleContent !== 'string') {
      throw new Error('Article content must be a valid HTML string.');
    }

    // Check for the [object Object] issue
    if (articleContent.includes('[object Object]')) {
      throw new Error('Article content is not properly formatted. Please try selecting a different article.');
    }

    // Get language-specific instructions and schema
    const languageConfig = QUIZ_INSTRUCTIONS_BY_LANGUAGE[targetLanguage] || QUIZ_INSTRUCTIONS_BY_LANGUAGE.hy;
    const quizSchema = getQuizJsonSchema(targetLanguage);
    
    // Use language-specific instructions if available, otherwise use provided instructions
    const finalInstructions = instructions === DEFAULT_QUIZ_INSTRUCTIONS ? 
      languageConfig.instructions : 
      `${instructions}\n\nGenerate the quiz in ${languageConfig.language}.`;

    const fullPrompt = `${finalInstructions}\n\nOpenAPI JSON scheme\n---\n${JSON.stringify(quizSchema, null, 2)}\n\nHTML article\n---\n${articleContent}`;

    try {
      const generativeModel = this.genAI.getGenerativeModel({ model });
        const result = await generativeModel.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: { 
          temperature,
        },
      });      const response = await result.response;
      let rawTextOutput = response.text();

      if (!rawTextOutput) {
        throw new Error('No response generated from Gemini API.');
      }// Clean up the JSON response
      let cleanJsonString = rawTextOutput.trim();
      
      // Check if the response is an error message instead of JSON
      if (cleanJsonString.toLowerCase().includes('i am sorry') || 
          cleanJsonString.toLowerCase().includes('cannot fulfill') ||
          cleanJsonString.includes('[object Object]')) {
        return {
          success: false,
          error: 'Հոդվածի բովանդակությունը կարձում չի մշակվել։ Խնդրում ենք ուրիշ հոդված ընտրել կամ կրկին փորձել։',
          rawResponse: rawTextOutput,
        };
      }
      
      // Remove markdown code blocks if present
      if (cleanJsonString.startsWith("```json\n")) {
        cleanJsonString = cleanJsonString.substring(7);
        if (cleanJsonString.endsWith("\n```")) {
          cleanJsonString = cleanJsonString.substring(0, cleanJsonString.length - 4);
        } else if (cleanJsonString.endsWith("```")) {
          cleanJsonString = cleanJsonString.substring(0, cleanJsonString.length - 3);
        }
      } else if (cleanJsonString.startsWith("```\n")) {
        cleanJsonString = cleanJsonString.substring(4);
        if (cleanJsonString.endsWith("\n```")) {
          cleanJsonString = cleanJsonString.substring(0, cleanJsonString.length - 4);
        } else if (cleanJsonString.endsWith("```")) {
          cleanJsonString = cleanJsonString.substring(0, cleanJsonString.length - 3);
        }
      }

      cleanJsonString = cleanJsonString.trim();

      try {
        const quizData = JSON.parse(cleanJsonString);
        return {
          success: true,
          data: quizData,
          rawResponse: rawTextOutput,
        };
      } catch (jsonError) {
        console.warn('Generated content was not valid JSON:', jsonError, 'Raw content:', cleanJsonString);
        return {
          success: false,
          error: 'Ստացված պատասխանը վավեր JSON չէ։ Խնդրում ենք կրկին փորձել։',
          rawResponse: rawTextOutput,
        };
      }
    } catch (error) {
      console.error('Error during quiz generation:', error);
      
      let errorMessage = 'Չհաջողվեց ստանալ պատասխան։';
      
      if (error.message) {
        if (error.message.toLowerCase().includes('api') || 
            error.message.toLowerCase().includes('quota') ||
            error.message.toLowerCase().includes('limit')) {
          errorMessage = error.message;
        } else {
          errorMessage = `Սխալ: ${error.message}`;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async explainTerm(term, context, apiKey, targetLanguage = 'hy') {
    if (!apiKey) {
      const errorMessages = EXPLANATION_ERROR_MESSAGES[targetLanguage] || EXPLANATION_ERROR_MESSAGES.hy;
      throw new Error(errorMessages.apiKeyRequired);
    }

    if (!this.genAI) {
      this.initializeAPI(apiKey);
    }

    // Get language-specific prompt configuration
    const languageConfig = EXPLANATION_PROMPTS_BY_LANGUAGE[targetLanguage] || EXPLANATION_PROMPTS_BY_LANGUAGE.hy;
    const promptText = languageConfig.promptTemplate(term, context);

    try {
      const generativeModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
        const result = await generativeModel.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: { 
          temperature: 0.4,
        },
      });      const response = await result.response;
      
      let explanation = response.text();

      if (!explanation) {
        throw new Error('No explanation generated.');
      }

      // Clean up markdown artifacts
      explanation = explanation.trim();
      if (explanation.startsWith("```html")) {
        explanation = explanation.substring(7);
      } else if (explanation.startsWith("```")) {
        explanation = explanation.substring(3);
      }
      
      if (explanation.endsWith("```")) {
        explanation = explanation.substring(0, explanation.lastIndexOf("```"));
      }
      
      explanation = explanation.trim();

      // Remove common intro phrases based on target language
      const cleanupPhrases = languageConfig.getCleanupPhrases ? 
        languageConfig.getCleanupPhrases(term) : [];
      
      for (const phrase of cleanupPhrases) {
        if (explanation.toLowerCase().startsWith(phrase.toLowerCase())) {
          explanation = explanation.substring(phrase.length).trim();
          while (explanation.toLowerCase().startsWith("<br>")) {
            explanation = explanation.substring(4).trim();
          }
          break;
        }
      }

      return {
        success: true,
        data: explanation,
      };
    } catch (error) {
      console.error('Error explaining term:', error);
      const errorMessages = EXPLANATION_ERROR_MESSAGES[targetLanguage] || EXPLANATION_ERROR_MESSAGES.hy;
      return {
        success: false,
        error: `${errorMessages.explanationFailed} (${error.message})`,
      };
    }
  }
}

const quizService = new QuizService();
export default quizService;
