# Brainograph AI Lab - VAF Educational Platform

🚀 **[Live Demo](https://lorsabyan.github.io/vaf-bg-ai-lab)** | 📋 [Documentation](#getting-started) | 🔗 [VAF Website](https://visualarmenia.org/)

An AI-driven React.js application that combines article exploration and quiz generation functionality. Built for the [VAF (Visual Armenia Development Foundation)](https://visualarmenia.org/) educational platform.

## Features

### 📚 Article Explorer

- **Search & Browse**: Search through educational articles
- **Text Selection Explanations**: Select any text in articles to get AI-powered explanations
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

- **Frontend**: React.js 19 with functional components and hooks
- **Styling**: TailwindCSS 3 for responsive design
- **AI Integration**: Google Generative AI (Gemini) SDK
- **State Management**: React Context API with useReducer
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages ready

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Gemini AI API key from Google AI Studio

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
   npm start
   ```

4. **Open in browser**: Navigate to `http://localhost:3000/vaf-bg-ai-lab`

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
- Select any text to get AI explanations (requires Gemini API key)

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

### Environment Variables

For production deployment, you can set:

- `REACT_APP_GEMINI_API_KEY`: Default Gemini API key

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
└── utils/                # Constants and utilities
```

### Key Components

- **AppContext**: Global state management
- **QuizGenerator**: AI-powered quiz creation
- **QuizInterface**: Interactive quiz taking
- **QuizHistory**: Results tracking and analytics
- **ArticleViewer**: Article display with AI explanations

## Features in Detail

### AI Quiz Generation

The app uses Google's Gemini AI to generate contextual quizzes from any article:

- Analyzes article content and structure
- Creates relevant multiple-choice questions
- Ensures questions test comprehension and key concepts
- Supports various difficulty levels and question types

### Text Selection Explanations

Select any text in articles to get instant AI explanations:

- Contextual definitions and explanations
- Historical background where relevant
- Connection to broader topics
- Simplified explanations for complex concepts

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

- [ ] Advanced quiz types (true/false, short answer)
- [ ] Collaborative quiz sharing
- [ ] Advanced analytics and progress tracking
- [ ] Offline mode support
- [ ] Multiple language support
- [ ] Integration with more AI models
- [ ] Advanced article formatting and media support

---

Built with ❤️ for the [VAF Educational Platform](https://visualarmenia.org/)
