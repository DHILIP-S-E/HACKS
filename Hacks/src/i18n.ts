import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.lessons': 'Lessons',
      'nav.profile': 'Profile',
      'nav.settings': 'Settings',
      'nav.admin': 'Admin',
      'nav.logout': 'Logout',
      
      // Authentication
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.name': 'Full Name',
      'auth.role': 'Role',
      'auth.forgotPassword': 'Forgot Password?',
      'auth.signIn': 'Sign In',
      'auth.signUp': 'Sign Up',
      'auth.signOut': 'Sign Out',
      
      // Roles
      'role.student': 'Student',
      'role.teacher': 'Teacher',
      'role.admin': 'Administrator',
      'role.parent': 'Parent/Guardian',
      
      // Dashboard
      'dashboard.welcome': 'Welcome back, {{name}}!',
      'dashboard.recentLessons': 'Recent Lessons',
      'dashboard.progress': 'Your Progress',
      'dashboard.achievements': 'Achievements',
      'dashboard.quickActions': 'Quick Actions',
      
      // Lessons
      'lesson.title': 'Title',
      'lesson.subject': 'Subject',
      'lesson.grade': 'Grade',
      'lesson.status': 'Status',
      'lesson.draft': 'Draft',
      'lesson.published': 'Published',
      'lesson.archived': 'Archived',
      'lesson.createNew': 'Create New Lesson',
      'lesson.edit': 'Edit Lesson',
      'lesson.delete': 'Delete Lesson',
      'lesson.publish': 'Publish',
      'lesson.unpublish': 'Unpublish',
      
      // Accessibility
      'accessibility.preferences': 'Accessibility Preferences',
      'accessibility.theme': 'Theme',
      'accessibility.fontSize': 'Font Size',
      'accessibility.fontFamily': 'Font Family',
      'accessibility.lineHeight': 'Line Height',
      'accessibility.letterSpacing': 'Letter Spacing',
      'accessibility.ttsSpeed': 'Text-to-Speech Speed',
      'accessibility.colorOverlay': 'Color Overlay',
      'accessibility.readingRuler': 'Reading Ruler',
      'accessibility.highContrast': 'High Contrast',
      'accessibility.dyslexiaFriendly': 'Dyslexia-Friendly Font',
      
      // Themes
      'theme.light': 'Light',
      'theme.dark': 'Dark',
      'theme.highContrast': 'High Contrast',
      
      // Font Sizes
      'fontSize.small': 'Small',
      'fontSize.medium': 'Medium',
      'fontSize.large': 'Large',
      'fontSize.extraLarge': 'Extra Large',
      
      // TTS Controls
      'tts.play': 'Play Audio',
      'tts.pause': 'Pause Audio',
      'tts.stop': 'Stop Audio',
      'tts.speed': 'Speed',
      'tts.voice': 'Voice',
      
      // Highlights & Notes
      'highlight.add': 'Add Highlight',
      'highlight.edit': 'Edit Highlight',
      'highlight.delete': 'Delete Highlight',
      'highlight.note': 'Note',
      'highlight.voiceNote': 'Voice Note',
      'highlight.color': 'Highlight Color',
      
      // Progress & Gamification
      'progress.level': 'Level {{level}}',
      'progress.xp': '{{current}}/{{total}} XP',
      'progress.streak': '{{days}} day streak',
      'progress.lessonsCompleted': 'Lessons Completed',
      'progress.timeSpent': 'Time Spent Learning',
      'progress.badges': 'Badges Earned',
      
      // File Upload
      'upload.dragDrop': 'Drag and drop files here, or click to select',
      'upload.processing': 'Processing...',
      'upload.completed': 'Upload completed',
      'upload.failed': 'Upload failed',
      'upload.retry': 'Retry',
      
      // Common Actions
      'action.save': 'Save',
      'action.cancel': 'Cancel',
      'action.delete': 'Delete',
      'action.edit': 'Edit',
      'action.view': 'View',
      'action.download': 'Download',
      'action.upload': 'Upload',
      'action.search': 'Search',
      'action.filter': 'Filter',
      'action.sort': 'Sort',
      'action.refresh': 'Refresh',
      
      // Status Messages
      'status.loading': 'Loading...',
      'status.saving': 'Saving...',
      'status.saved': 'Saved successfully',
      'status.error': 'An error occurred',
      'status.noResults': 'No results found',
      'status.offline': 'You are offline',
      
      // Errors
      'error.required': 'This field is required',
      'error.email': 'Please enter a valid email address',
      'error.password': 'Password must be at least 8 characters',
      'error.passwordMatch': 'Passwords do not match',
      'error.network': 'Network error. Please check your connection.',
      'error.unauthorized': 'You are not authorized to perform this action',
      'error.notFound': 'The requested resource was not found',
    }
  },
  hi: {
    translation: {
      // Navigation
      'nav.dashboard': 'डैशबोर्ड',
      'nav.lessons': 'पाठ',
      'nav.profile': 'प्रोफ़ाइल',
      'nav.settings': 'सेटिंग्स',
      'nav.admin': 'एडमिन',
      'nav.logout': 'लॉगआउट',
      
      // Authentication
      'auth.login': 'लॉगिन',
      'auth.register': 'रजिस्टर',
      'auth.email': 'ईमेल',
      'auth.password': 'पासवर्ड',
      'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
      'auth.name': 'पूरा नाम',
      'auth.role': 'भूमिका',
      'auth.forgotPassword': 'पासवर्ड भूल गए?',
      'auth.signIn': 'साइन इन',
      'auth.signUp': 'साइन अप',
      'auth.signOut': 'साइन आउट',
      
      // Roles
      'role.student': 'छात्र',
      'role.teacher': 'शिक्षक',
      'role.admin': 'प्रशासक',
      'role.parent': 'अभिभावक',
      
      // Dashboard
      'dashboard.welcome': 'वापसी पर स्वागत है, {{name}}!',
      'dashboard.recentLessons': 'हाल के पाठ',
      'dashboard.progress': 'आपकी प्रगति',
      'dashboard.achievements': 'उपलब्धियां',
      'dashboard.quickActions': 'त्वरित कार्य',
      
      // Accessibility
      'accessibility.preferences': 'पहुंच प्राथमिकताएं',
      'accessibility.theme': 'थीम',
      'accessibility.fontSize': 'फ़ॉन्ट आकार',
      'accessibility.fontFamily': 'फ़ॉन्ट परिवार',
      'accessibility.ttsSpeed': 'टेक्स्ट-टू-स्पीच गति',
      'accessibility.readingRuler': 'पढ़ने का रूलर',
      'accessibility.highContrast': 'उच्च कंट्रास्ट',
      'accessibility.dyslexiaFriendly': 'डिस्लेक्सिया-फ्रेंडली फ़ॉन्ट',
      
      // Common Actions
      'action.save': 'सेव करें',
      'action.cancel': 'रद्द करें',
      'action.delete': 'हटाएं',
      'action.edit': 'संपादित करें',
      'action.view': 'देखें',
      'action.search': 'खोजें',
      
      // Status Messages
      'status.loading': 'लोड हो रहा है...',
      'status.saving': 'सेव हो रहा है...',
      'status.saved': 'सफलतापूर्वक सेव किया गया',
      'status.error': 'एक त्रुटि हुई',
      'status.noResults': 'कोई परिणाम नहीं मिला',
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n