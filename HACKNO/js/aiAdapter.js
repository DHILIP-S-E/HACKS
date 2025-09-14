// AI/NLP adapter for language processing and accessibility features
class AIAdapter {
    constructor() {
        this.supportedLanguages = {
            'en': 'English',
            'es': 'Español'
        };
        this.currentLanguage = 'en';
        this.translations = {
            'en': {
                'login': 'Login',
                'register': 'Register',
                'dashboard': 'Dashboard',
                'progress': 'Your Progress',
                'badges': 'Badges Earned',
                'highlights': 'Your Highlights & Notes',
                'scoreboard': 'Scoreboard',
                'level': 'Level',
                'points': 'Points',
                'rank': 'Rank',
                'user': 'User',
                'export_data': 'Export Data',
                'view_all_users': 'View All Users',
                'admin_panel': 'Admin Panel'
            },
            'es': {
                'login': 'Iniciar Sesión',
                'register': 'Registrarse',
                'dashboard': 'Panel de Control',
                'progress': 'Tu Progreso',
                'badges': 'Insignias Obtenidas',
                'highlights': 'Tus Resaltados y Notas',
                'scoreboard': 'Tabla de Puntuaciones',
                'level': 'Nivel',
                'points': 'Puntos',
                'rank': 'Rango',
                'user': 'Usuario',
                'export_data': 'Exportar Datos',
                'view_all_users': 'Ver Todos los Usuarios',
                'admin_panel': 'Panel de Administración'
            }
        };
    }

    // Language detection (simplified)
    detectLanguage(text) {
        const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al'];
        const englishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'];
        
        const words = text.toLowerCase().split(/\s+/);
        let spanishScore = 0;
        let englishScore = 0;

        words.forEach(word => {
            if (spanishWords.includes(word)) spanishScore++;
            if (englishWords.includes(word)) englishScore++;
        });

        return spanishScore > englishScore ? 'es' : 'en';
    }

    // Text processing for highlights
    processText(text) {
        return {
            language: this.detectLanguage(text),
            wordCount: text.split(/\s+/).length,
            readingTime: Math.ceil(text.split(/\s+/).length / 200), // Assuming 200 WPM
            complexity: this.calculateComplexity(text),
            keywords: this.extractKeywords(text)
        };
    }

    // Calculate text complexity (simplified)
    calculateComplexity(text) {
        const sentences = text.split(/[.!?]+/).length;
        const words = text.split(/\s+/).length;
        const avgWordsPerSentence = words / sentences;
        
        if (avgWordsPerSentence > 20) return 'high';
        if (avgWordsPerSentence > 15) return 'medium';
        return 'low';
    }

    // Extract keywords (simplified)
    extractKeywords(text) {
        const stopWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'];
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordFreq = {};
        
        words.forEach(word => {
            if (!stopWords.includes(word) && word.length > 3) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        
        return Object.entries(wordFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([word]) => word);
    }

    // Translation function
    translate(key, language = this.currentLanguage) {
        return this.translations[language]?.[key] || key;
    }

    // Set language
    setLanguage(language) {
        if (this.supportedLanguages[language]) {
            this.currentLanguage = language;
            this.updatePageLanguage();
        }
    }

    // Update page text based on current language
    updatePageLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = this.translate(key);
        });
        
        document.documentElement.lang = this.currentLanguage;
    }

    // Text-to-Speech (Web Speech API)
    speak(text, language = this.currentLanguage) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    // Speech-to-Text (Web Speech API)
    startListening(callback) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = this.currentLanguage === 'es' ? 'es-ES' : 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                callback(transcript);
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
            
            recognition.start();
            return recognition;
        }
        return null;
    }

    // Accessibility helpers
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        
        document.body.appendChild(announcement);
        announcement.textContent = message;
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Generate summary for highlights
    generateSummary(highlights) {
        if (highlights.length === 0) return 'No highlights yet.';
        
        const totalWords = highlights.reduce((sum, h) => sum + h.content.split(/\s+/).length, 0);
        const avgComplexity = highlights.reduce((sum, h) => {
            const complexity = this.calculateComplexity(h.content);
            return sum + (complexity === 'high' ? 3 : complexity === 'medium' ? 2 : 1);
        }, 0) / highlights.length;
        
        const complexityLevel = avgComplexity > 2.5 ? 'high' : avgComplexity > 1.5 ? 'medium' : 'low';
        
        return `You have ${highlights.length} highlights with ${totalWords} total words. Average complexity: ${complexityLevel}.`;
    }

    // Readability suggestions
    getReadabilitySuggestions(text) {
        const analysis = this.processText(text);
        const suggestions = [];
        
        if (analysis.complexity === 'high') {
            suggestions.push('Consider breaking long sentences into shorter ones');
            suggestions.push('Use simpler vocabulary where possible');
        }
        
        if (analysis.wordCount > 500) {
            suggestions.push('Consider adding subheadings to break up the text');
        }
        
        return suggestions;
    }
}

// Global instance
window.aiAdapter = new AIAdapter();