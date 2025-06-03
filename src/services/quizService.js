import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG, QUIZ_JSON_SCHEMA } from '../utils/constants';

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

    const fullPrompt = `${instructions}\n\nOpenAPI JSON scheme\n---\n${JSON.stringify(QUIZ_JSON_SCHEMA, null, 2)}\n\nHTML article\n---\n${articleContent}`;

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

  async explainTerm(term, context, apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API բանալին տրամադրված չէ։');
    }

    if (!this.genAI) {
      this.initializeAPI(apiKey);
    }

    const promptText = `Հոդվածի ամբողջական տեքստը հետևյալն է՝
---
${context}
---
Հաշվի առնելով վերոնշյալ հոդվածի համատեքստը, խնդրում եմ բացատրիր «${term}» տերմինը կամ արտահայտությունը հայերենով։ Տուր հակիրճ և հասկանալի բացատրություն։ Պատասխանը ֆորմատավորիր **միայն որպես HTML**։ **Մի՛ ներառիր որևէ նախաբան կամ վերջաբան, այլ միայն բացատրությունը։ Մի՛ օգտագործիր markdown:** Օգտագործիր <strong> թեգը թավատառի համար, <em> թեգը շեղատառի համար, և <br> թեգը տողադարձերի համար։`;

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

      // Remove common intro phrases
      const introPhrasesToRemove = [
        `Ահա «${term}» տերմինի բացատրությունը HTML ֆորմատով.`,
        `Ահա «${term}» տերմինի բացատրությունը.`,
        `Սա «${term}» տերմինի բացատրությունն է HTML ֆորմատով.`,
        `Սա «${term}» տերմինի բացատրությունն է.`
      ];
      
      for (const phrase of introPhrasesToRemove) {
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
      return {
        success: false,
        error: `Բացատրությունը բերելիս սխալ տեղի ունեցավ։ (${error.message})`,
      };
    }
  }
}

const quizService = new QuizService();
export default quizService;
