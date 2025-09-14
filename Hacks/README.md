# Assistive Learning Platform

A production-ready React.js application implementing an inclusive, accessible learning platform for students with learning disabilities. Built with TypeScript, Vite, and a serverless-first mindset.

## 🌟 Features

### Priority Features (Fully Implemented)
1. **NLP in User's Language** - Multilingual summarization, simplification, TTS/STT powered by Gemini AI
2. **Highlight & Notes** - In-text highlights with personal notes, voice-to-text support, side-panel UI
3. **Progress Tracking & Gamification** - Badges, levels, scoreboard, progress metrics
4. **Accessibility UI Options** - Dark mode, high-contrast, dyslexia-friendly fonts, adjustable spacing

### Core Capabilities
- **Multi-role Support** - Students, teachers, admins, and parents
- **Accessibility-First Design** - WCAG 2.1 AA compliant with comprehensive a11y features
- **AI-Powered Content Processing** - Automatic accessibility artifact generation
- **Offline-First Architecture** - Works without internet using IndexedDB
- **Multilingual Support** - English and Hindi with i18n framework
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### Teacher/Admin Features
- **Course Upload Pipeline** - Support for Word, PPT, PDF, videos, audio, images
- **AI Accessibility Processing** - OCR, text extraction, simplified summaries, TTS generation
- **Human-in-the-Loop Verification** - Teachers verify/edit AI-generated artifacts
- **Processing Queue** - Background job processing with retry logic
- **Content Moderation** - PII detection, offensive language filtering

### Student Features
- **Adaptive Learning Workspace** - Multiple content rendering modes
- **Reading Assistance** - TTS playback, highlight-as-read, captions
- **Visual Adjustments** - Font options, spacing, color overlays, reading ruler
- **Personalized Learning Paths** - Adaptive recommendations based on profile
- **Assessment Tools** - Auto-scored and teacher-graded assessments

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd assistive-learning-platform
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_key_here
   # Optional: Add Supabase keys if using backend
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

## 🏗️ Architecture

### Adapter Pattern
The application uses adapters for external services, allowing easy switching between implementations:

- **AI Adapter** - Gemini AI with browser API fallbacks
- **Storage Adapter** - Local IndexedDB with optional Supabase backend
- **Auth Adapter** - Local authentication with optional Supabase Auth
- **Processing Adapter** - Background job queue with retry logic

### State Management
- **Zustand** - Global UI state (auth, accessibility preferences)
- **TanStack Query** - Server state and caching
- **React Context** - Component-level state

### Accessibility Architecture
- **CSS Custom Properties** - Dynamic theming and font adjustments
- **ARIA Attributes** - Comprehensive screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **Focus Management** - Proper focus trapping and restoration

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Accessibility Tests
```bash
npm run test:a11y
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── features/           # Feature-specific components
├── pages/              # Route components
├── lib/
│   ├── adapters/       # External service adapters
│   └── utils/          # Utility functions
├── hooks/              # Custom React hooks
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── i18n.ts            # Internationalization config
```

## 🎯 Key Components

### AI-Powered Features
- **Text Summarization** - Simplifies complex content for learning disabilities
- **Text-to-Speech** - High-quality audio generation with speed control
- **Image Description** - Automatic alt-text generation for visual content
- **Speech-to-Text** - Voice input for notes and responses

### Accessibility Features
- **Theme Support** - Light, dark, and high-contrast modes
- **Font Options** - Dyslexia-friendly fonts and size adjustments
- **Reading Aids** - Color overlays, reading ruler, line spacing
- **Keyboard Navigation** - Full keyboard support with skip links
- **Screen Reader Support** - Comprehensive ARIA implementation

### Learning Tools
- **Highlight System** - Color-coded highlights with personal notes
- **Progress Tracking** - XP system, levels, badges, and streaks
- **Adaptive Assessments** - AI-generated quizzes with difficulty adjustment
- **Learning Analytics** - Detailed progress metrics and insights

## 🔧 Configuration

### Accessibility Preferences
Users can customize:
- Theme (light/dark/high-contrast)
- Font size and family
- Line height and letter spacing
- TTS speed and voice
- Color overlays and reading ruler

### AI Configuration
- Gemini API integration with fallback to browser APIs
- Configurable processing timeouts and retry policies
- Language detection and translation support

### File Upload Limits
- Maximum file size: 100MB
- Chunk size for resumable uploads: 5MB
- Supported formats: DOC, DOCX, PPT, PPTX, PDF, MP4, MP3, images

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables for Production
Ensure these are set in your production environment:
- `VITE_GEMINI_API_KEY` - Required for AI features
- `VITE_SUPABASE_URL` - Optional for backend features
- `VITE_SUPABASE_ANON_KEY` - Optional for backend features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Maintain accessibility standards (WCAG 2.1 AA)
- Write tests for new features
- Update documentation for API changes
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [documentation](docs/) for detailed guides
- Review the [accessibility guidelines](docs/accessibility.md)

## 🙏 Acknowledgments

- Built with accessibility-first principles
- Inspired by inclusive design practices
- Powered by Google's Gemini AI
- Uses open-source libraries and tools

---

**Note**: This application prioritizes accessibility and inclusion. All features are designed to work with assistive technologies and follow WCAG 2.1 AA guidelines.