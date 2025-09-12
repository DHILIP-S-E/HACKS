import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.dashboard': 'Dashboard',
      'nav.lessons': 'Lessons',
      'nav.profile': 'Profile',
      'nav.settings': 'Settings',
      'nav.logout': 'Logout',
      
      // Authentication
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.forgotPassword': 'Forgot Password?',
      'auth.loginSuccess': 'Login successful',
      'auth.loginError': 'Login failed',
      'auth.registerSuccess': 'Registration successful',
      'auth.registerError': 'Registration failed',
      
      // Lessons
      'lessons.title': 'Lessons',
      'lessons.search': 'Search lessons...',
      'lessons.filter': 'Filter',
      'lessons.noResults': 'No lessons found',
      'lessons.createNew': 'Create New Lesson',
      
      // Accessibility
      'a11y.skipToMain': 'Skip to main content',
      'a11y.toggleTheme': 'Toggle theme',
      'a11y.toggleHighContrast': 'Toggle high contrast',
      'a11y.toggleDyslexicFont': 'Toggle dyslexic-friendly font',
      'a11y.increaseFontSize': 'Increase font size',
      'a11y.decreaseFontSize': 'Decrease font size',
      'a11y.playTTS': 'Play text-to-speech',
      'a11y.pauseTTS': 'Pause text-to-speech',
      'a11y.startSTT': 'Start speech-to-text',
      'a11y.stopSTT': 'Stop speech-to-text',
      
      // Progress & Gamification
      'progress.level': 'Level {{level}}',
      'progress.xp': '{{current}}/{{total}} XP',
      'progress.badges': 'Badges',
      'progress.achievements': 'Achievements',
      'progress.streak': '{{days}} day streak',
      
      // Highlights & Notes
      'highlights.addNote': 'Add note',
      'highlights.editNote': 'Edit note',
      'highlights.deleteNote': 'Delete note',
      'highlights.saveNote': 'Save note',
      'highlights.noteText': 'Note text...',
      'highlights.voiceNote': 'Record voice note',
      
      // Common
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.confirm': 'Confirm',
      'common.close': 'Close',
    },
  },
  hi: {
    translation: {
      // Navigation
      'nav.home': 'होम',
      'nav.dashboard': 'डैशबोर्ड',
      'nav.lessons': 'पाठ',
      'nav.profile': 'प्रोफाइल',
      'nav.settings': 'सेटिंग्स',
      'nav.logout': 'लॉगआउट',
      
      // Authentication
      'auth.login': 'लॉगिन',
      'auth.register': 'रजिस्टर',
      'auth.email': 'ईमेल',
      'auth.password': 'पासवर्ड',
      'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
      'auth.forgotPassword': 'पासवर्ड भूल गए?',
      'auth.loginSuccess': 'लॉगिन सफल',
      'auth.loginError': 'लॉगिन असफल',
      'auth.registerSuccess': 'रजिस्ट्रेशन सफल',
      'auth.registerError': 'रजिस्ट्रेशन असफल',
      
      // Lessons
      'lessons.title': 'पाठ',
      'lessons.search': 'पाठ खोजें...',
      'lessons.filter': 'फ़िल्टर',
      'lessons.noResults': 'कोई पाठ नहीं मिला',
      'lessons.createNew': 'नया पाठ बनाएं',
      
      // Accessibility
      'a11y.skipToMain': 'मुख्य सामग्री पर जाएं',
      'a11y.toggleTheme': 'थीम बदलें',
      'a11y.toggleHighContrast': 'उच्च कंट्रास्ट टॉगल करें',
      'a11y.toggleDyslexicFont': 'डिस्लेक्सिक-फ्रेंडली फॉन्ट टॉगल करें',
      'a11y.increaseFontSize': 'फॉन्ट साइज़ बढ़ाएं',
      'a11y.decreaseFontSize': 'फॉन्ट साइज़ घटाएं',
      'a11y.playTTS': 'टेक्स्ट-टू-स्पीच चलाएं',
      'a11y.pauseTTS': 'टेक्स्ट-टू-स्पीच रोकें',
      'a11y.startSTT': 'स्पीच-टू-टेक्स्ट शुरू करें',
      'a11y.stopSTT': 'स्पीच-टू-टेक्स्ट बंद करें',
      
      // Progress & Gamification
      'progress.level': 'स्तर {{level}}',
      'progress.xp': '{{current}}/{{total}} XP',
      'progress.badges': 'बैज',
      'progress.achievements': 'उपलब्धियां',
      'progress.streak': '{{days}} दिन की लकीर',
      
      // Highlights & Notes
      'highlights.addNote': 'नोट जोड़ें',
      'highlights.editNote': 'नोट संपादित करें',
      'highlights.deleteNote': 'नोट हटाएं',
      'highlights.saveNote': 'नोट सेव करें',
      'highlights.noteText': 'नोट टेक्स्ट...',
      'highlights.voiceNote': 'वॉयस नोट रिकॉर्ड करें',
      
      // Common
      'common.save': 'सेव करें',
      'common.cancel': 'रद्द करें',
      'common.delete': 'हटाएं',
      'common.edit': 'संपादित करें',
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता',
      'common.confirm': 'पुष्टि करें',
      'common.close': 'बंद करें',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;