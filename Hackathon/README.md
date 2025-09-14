# Assistive Learning Platform

A production-ready React.js application implementing an Assistive Learning Tools platform for students with learning disabilities. Built with accessibility-first principles and modern web technologies.

## 🌟 Features

### Core Functionality
- **Multi-role Support**: Student, Teacher, and Admin roles with appropriate permissions
- **Accessibility-First Design**: WCAG 2.1 AA compliant with comprehensive accessibility features
- **AI-Powered Content Processing**: Automatic generation of accessible content using Gemini AI
- **Offline-First Architecture**: Works without internet connection using local storage
- **Internationalization**: Support for English and Hindi languages

### Accessibility Features
- **Visual Adjustments**: Font size, dyslexia-friendly fonts, high contrast, dark mode
- **Reading Assistance**: Text-to-speech, reading ruler, adjustable line spacing
- **Input Assistance**: Speech-to-text for notes and answers
- **Navigation**: Keyboard-first navigation, skip links, focus management
- **Screen Reader Support**: Semantic HTML, ARIA attributes, live regions

### Content Management
- **Lesson Authoring**: Rich text editor with media attachments
- **File Upload**: Drag-and-drop with resumable uploads for large files
- **AI Processing**: Automatic generation of summaries, captions, alt text
- **Verification Workflow**: Teacher review and approval of AI-generated content
- **Version Control**: Draft/publish workflow with content versioning

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with ES2020 support

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd assistive-learning-platform
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   
   Get your API key from: https://makersuite.google.com/app/apikey

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:3000`

### Demo Accounts

The application includes pre-configured demo accounts:

- **Student**: `student@demo.com` (any password)
- **Teacher**: `teacher@demo.com` (any password)  
- **Admin**: `admin@demo.com` (any password)

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with accessibility-focused design tokens
- **State Management**: Zustand for global state, TanStack Query for server state
- **Storage**: LocalForage (IndexedDB) for offline-first data persistence
- **AI Integration**: Gemini API with fallback to browser APIs
- **Internationalization**: react-i18next with English and Hindi support
- **Testing**: Vitest + React Testing Library + Playwright

### Project Structure
```
src/
├── adapters/          # External service adapters (AI, storage, etc.)
├── components/        # Reusable UI components
├── features/          # Feature-based modules (auth, lessons, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Utilities, stores, and configurations
├── locales/          # Translation files
└── types/            # TypeScript type definitions
```

### Key Adapters
- **AI Adapter**: Gemini API with browser fallbacks
- **Storage Adapter**: LocalForage for offline data persistence
- **TTS Adapter**: Browser Speech Synthesis API
- **STT Adapter**: Browser Speech Recognition API
- **Upload Adapter**: Chunked uploads with resume capability

## 🎯 Accessibility Features

### Visual Accessibility
- **Font Options**: Standard and dyslexia-friendly fonts
- **Size Controls**: Adjustable font size (small to extra-large)
- **Contrast**: High contrast mode and dark theme
- **Spacing**: Customizable line and letter spacing
- **Color Overlays**: Reading assistance overlays

### Audio Accessibility
- **Text-to-Speech**: Browser-native with speed/pitch controls
- **Speech-to-Text**: Voice input for notes and answers
- **Audio Descriptions**: Generated for visual content

### Navigation Accessibility
- **Keyboard Navigation**: Full keyboard support with visible focus
- **Skip Links**: Jump to main content and navigation
- **Screen Reader**: Semantic HTML with ARIA labels
- **Focus Management**: Proper focus handling in dynamic content

### Content Accessibility
- **Simplified Text**: AI-generated easy-to-read versions
- **Captions**: Auto-generated for video content
- **Alt Text**: AI-generated image descriptions
- **Semantic Structure**: Proper heading hierarchy and landmarks

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### Code Quality
- **ESLint**: React, TypeScript, and accessibility rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks
- **TypeScript**: Strict type checking

### Testing Strategy
- **Unit Tests**: Component and utility testing with Vitest
- **Integration Tests**: Feature testing with React Testing Library
- **E2E Tests**: User flow testing with Playwright
- **Accessibility Tests**: Automated a11y testing with axe-core

## 🌐 Internationalization

The application supports multiple languages:
- **English** (default)
- **Hindi** (हिन्दी)

Add new languages by:
1. Creating translation files in `src/locales/`
2. Updating the language selector in `src/lib/i18n.ts`
3. Adding language-specific fonts if needed

## 🔒 Security

### Content Security
- **Input Sanitization**: DOMPurify for HTML content
- **XSS Protection**: Sanitized user inputs and outputs
- **File Upload Security**: Type validation and size limits

### Data Privacy
- **Local Storage**: All data stored locally by default
- **No Tracking**: Privacy-first approach with optional analytics
- **GDPR Compliance**: Data export and deletion capabilities

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Accessibility APIs**: Speech Synthesis, Speech Recognition, File System Access
- **Progressive Enhancement**: Graceful degradation for unsupported features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow accessibility best practices (WCAG 2.1 AA)
- Write tests for new features
- Update documentation for API changes
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Accessibility Guidelines**: WCAG 2.1, ARIA Authoring Practices
- **Design System**: Tailwind CSS accessibility utilities
- **AI Services**: Google Gemini API for content processing
- **Icons**: Lucide React icon library
- **Fonts**: OpenDyslexic for dyslexia-friendly typography

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review accessibility guidelines in `ACCESSIBILITY.md`

---

Built with ❤️ for inclusive education