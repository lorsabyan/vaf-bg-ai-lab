# Brainograph AI Lab - VAF Educational Platform

> **🎉 Recently migrated from Create React App to Next.js for improved performance and static site generation!**

🚀 **[Live Demo](https://lorsabyan.github.io/vaf-bg-ai-lab)** | 📋 [Documentation](#getting-started) | 🔗 [VAF Website](https://visualarmenia.org/)

An AI-driven Next.js application that combines article exploration and quiz generation functionality. Built for the [VAF (Visual Armenia Development Foundation)](https://visualarmenia.org/) educational platform.

## Features

### 📚 Article Explorer

- **Search & Browse**: Search through educational articles
- **Enhanced Text Selection Tooltips**: Select any text in articles to get comprehensive information:
  - 💡 **AI-Powered Explanations**: Contextual explanations using Gemini AI
  - 🖼️ **Relevant Images**: Visual content from Google Image Search
  - 🔗 **Educational Links**: Curated web resources from educational sites
  - 📚 **Academic Citations**: Scholarly references and academic sources
- **Multi-Strategy Search**: Intelligent fallback mechanisms for optimal results
- **Contextual Search**: Uses article context to improve search relevance
- **Key Points Extraction**: AI-generated summaries of main article points
- **Article Translation**: Translate articles to different languages while preserving formatting
- **Responsive Article Viewer**: Clean, readable article display with mobile optimization

### 🧠 AI-Powered Quiz Generation

- **Smart Quiz Creation**: Generate quizzes from any article using Google's Gemini AI
- **Customizable Instructions**: Specify exactly what type of quiz you want
- **Multiple AI Models**: Choose from different Gemini models (Flash, Pro, etc.)
- **Temperature Control**: Adjust creativity vs accuracy of generated questions
- **Interactive Quiz Taking**: Clean, modern quiz interface with progress tracking

### 📊 Quiz History & Analytics

- **Complete History**: Track all completed quizzes with scores and details
- **Performance Analytics**: View statistics including average scores and progress
- **Detailed Results**: Review individual quiz answers and explanations
- **Export & Persistence**: Quiz history saved locally with backup/restore options

### 🔐 Authentication & Security

- **User Authentication**: Secure login system
- **API Key Management**: Secure storage and management of Gemini API keys
- **Session Management**: Persistent user sessions with token-based auth

### 📱 Modern UI/UX

- **Mobile-First Design**: Fully responsive across all devices
- **TailwindCSS Styling**: Modern, clean, and accessible design
- **Armenian Language Support**: Localized interface in Armenian
- **Dark/Light Theme**: Support for multiple themes
- **Loading States**: Comprehensive loading and error handling

## Technology Stack

- **Frontend**: Next.js 14 with React 18 functional components and hooks
- **Styling**: TailwindCSS 3 for responsive design
- **AI Integration**: Google Generative AI (Gemini) SDK for explanations and quiz generation
- **Search Integration**: Google Custom Search API for images, links, and citations
- **State Management**: React Context API with useReducer
- **Build Tool**: Next.js with static site generation
- **Deployment**: GitHub Pages ready with optimized static export

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- **Gemini AI API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Google Custom Search API key** and **Search Engine ID** (optional, for enhanced tooltips)
  - Get API key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - Create Custom Search Engine at [Google Programmable Search](https://programmablesearchengine.google.com/)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/lorsabyan/vaf-bg-ai-lab.git
   cd vaf-bg-ai-lab
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Open in browser**: Navigate to `http://localhost:3000`

### Deployment

**Deploy to GitHub Pages**:

```bash
npm run deploy
```

## Usage Guide

### 1. Authentication

- Log in with your credentials on the home screen
- The system supports user authentication with persistent sessions

### 2. Article Exploration

- Use the **"Հոդվածների որոնում"** (Article Search) tab
- Search for articles using keywords
- Click on any article to view its content
- **Enhanced Text Selection Features**:
  - Click **"Select and Explain"** to enable selection mode
  - Select any text to open an enhanced tooltip with 4 tabs:
    - 💡 **Explanation**: AI-powered contextual explanations
    - 🖼️ **Images**: Relevant visual content from Google Search
    - 🔗 **Links**: Educational web resources and articles
    - 📚 **Citations**: Academic references and scholarly sources
- **Key Points**: Generate AI-powered summaries of article highlights
- **Translation**: Translate articles while preserving HTML formatting

### 3. Quiz Generation

- Switch to the **"Վիկտորինա"** (Quiz) tab
- First, select an article from the Article Explorer
- Configure your Gemini API key by clicking the 🔑 button in the header
- Customize quiz instructions (e.g., "Create 10 multiple choice questions about the main concepts")
- Choose AI model and creativity level
- Click **"Ստեղծել վիկտորինա"** (Generate Quiz)
- Click **"Սկսել վիկտորինան"** (Start Quiz) when ready

### 4. Taking Quizzes

- Navigate through questions using Previous/Next buttons
- Select answers by clicking on options
- View progress bar at the top
- Complete quiz to see detailed results and score

### 5. Quiz History

- Switch to the **"Պատմություն"** (History) tab
- View all completed quizzes with scores and dates
- Click "View Details" to review individual answers
- See performance statistics and trends
- Delete individual quiz results or clear all history

## Configuration

### API Keys

- **Gemini AI**: Required for quiz generation and text explanations
  - Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)
  - Add the key via the 🔑 button in the app header
- **Google Custom Search** (Optional): Enables enhanced tooltips with images, links, and citations
  - **API Key**: Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - **Search Engine ID**: Create at [Google Programmable Search](https://programmablesearchengine.google.com/)
  - Configure both in the API settings for full tooltip functionality

### Environment Variables

For production deployment, you can set:

- `REACT_APP_GEMINI_API_KEY`: Default Gemini API key
- `REACT_APP_GOOGLE_SEARCH_API_KEY`: Google Custom Search API key
- `REACT_APP_GOOGLE_SEARCH_ENGINE_ID`: Google Custom Search Engine ID

## Development

### Project Structure

```text
src/
├── components/
│   ├── articles/          # Article search and viewing
│   ├── auth/             # Authentication components
│   ├── common/           # Layout and navigation
│   ├── quiz/             # Quiz generation and taking
│   └── ui/               # Reusable UI components
├── context/              # React Context for state management
├── services/             # API and external service calls
│   ├── articleService.js    # Article data management
│   ├── authService.js       # Authentication logic
│   ├── googleSearchService.js # Google Search API integration
│   └── quizService.js       # Gemini AI quiz generation
└── utils/                # Constants and utilities
```

### Key Components

- **AppContext**: Global state management
- **QuizGenerator**: AI-powered quiz creation
- **QuizInterface**: Interactive quiz taking
- **QuizHistory**: Results tracking and analytics
- **ArticleViewer**: Article display with AI explanations and enhanced tooltips
- **EnhancedTooltip**: Multi-tab tooltip with images, links, and citations
- **GoogleSearchService**: Integration with Google Custom Search API

## Features in Detail

### AI Quiz Generation

The app uses Google's Gemini AI to generate contextual quizzes from any article:

- Analyzes article content and structure
- Creates relevant multiple-choice questions
- Ensures questions test comprehension and key concepts
- Supports various difficulty levels and question types

### Enhanced Text Selection Tooltips

Select any text in articles to get comprehensive information through a modern, tabbed interface:

#### 💡 AI Explanations
- **Contextual Definitions**: Understanding terms within their article context
- **Historical Background**: Relevant historical information and context
- **Concept Connections**: How selected terms relate to broader topics
- **Simplified Explanations**: Complex concepts broken down for better understanding

#### 🖼️ Visual Content (Google Images)
- **Relevant Images**: Contextually appropriate visual content
- **Educational Focus**: Prioritizes educational and informative images
- **Multiple Search Strategies**: Fallback mechanisms for optimal results
- **High-Quality Sources**: Curated from reliable image sources

#### 🔗 Educational Resources (Web Links)
- **Curated Sources**: Links from educational institutions (.edu, .org, .gov)
- **Wikipedia Integration**: Reliable encyclopedia entries
- **Academic Publishers**: Links to britannica.com and other educational sites
- **Contextual Relevance**: Links related to the selected text and article context

#### 📚 Academic Citations
- **Scholarly Sources**: Research papers and academic publications
- **Citation Metadata**: Author information and publication years when available
- **Academic Databases**: Sources from ResearchGate, Academia.edu, ArXiv, PubMed
- **Google Scholar Integration**: Academic search results with proper citations

#### 🔧 Technical Features
- **Multi-Strategy Search**: Tries simple, enhanced, and minimal search approaches
- **Contextual Keywords**: Uses surrounding article text to improve search relevance
- **Performance Optimization**: Concurrent API calls with intelligent fallbacks
- **Comprehensive Debugging**: Detailed logging for troubleshooting and optimization

### Mobile-First Design

- Responsive navigation with collapsible sidebar
- Touch-optimized quiz interface
- Readable typography on all screen sizes
- Optimized loading states for slower connections

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue on GitHub
- Contact the VAF development team

## Roadmap

### 🚀 Upcoming Features
- [ ] Advanced quiz types (true/false, short answer)
- [ ] Collaborative quiz sharing
- [ ] Advanced analytics and progress tracking
- [ ] Offline mode support
- [ ] Multiple language support for tooltips
- [ ] Integration with more AI models

### 🔍 Search & Discovery Enhancements
- [ ] Advanced article filtering and categorization
- [ ] Bookmarking and favorites system
- [ ] Full-text search across articles
- [ ] Related articles suggestions

### 🌐 Google Search API Improvements
- [ ] Video content integration from YouTube EDU
- [ ] News articles related to selected topics
- [ ] Interactive maps and geographical context
- [ ] Timeline integration for historical topics
- [ ] Scientific data and charts integration

### 📊 Analytics & Insights
- [ ] Learning progress tracking
- [ ] Topic mastery indicators
- [ ] Personalized content recommendations
- [ ] Usage analytics and insights dashboard

---

Built with ❤️ for the [VAF Educational Platform](https://visualarmenia.org/)
