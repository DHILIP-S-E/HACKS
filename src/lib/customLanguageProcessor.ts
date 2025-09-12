// Custom Language NLP Processor
export interface CustomLanguageConfig {
  name: string;
  vocabulary: Record<string, string>; // custom -> english
  grammar: {
    wordOrder: string;
    markers: Record<string, string>; // grammar markers
  };
  keyPhrases: Record<string, string>; // important phrases
}

export class CustomLanguageProcessor {
  private config: CustomLanguageConfig;

  constructor(config: CustomLanguageConfig) {
    this.config = config;
  }

  // Process text in custom language
  processText(text: string): {
    originalText: string;
    translatedText: string;
    keyPoints: string[];
    vocabulary: Record<string, string>;
    complexity: 'easy' | 'medium' | 'hard';
  } {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Translate to English
    let translatedText = text;
    const usedVocabulary: Record<string, string> = {};
    
    Object.entries(this.config.vocabulary).forEach(([custom, english]) => {
      const regex = new RegExp(`\\b${custom}\\b`, 'gi');
      if (text.match(regex)) {
        translatedText = translatedText.replace(regex, english);
        usedVocabulary[custom] = english;
      }
    });

    // Extract key points (sentences with important words)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const keyPoints = sentences
      .filter(sentence => 
        Object.keys(this.config.keyPhrases).some(phrase => 
          sentence.toLowerCase().includes(phrase)
        )
      )
      .map(sentence => {
        let translated = sentence;
        Object.entries(this.config.vocabulary).forEach(([custom, english]) => {
          const regex = new RegExp(`\\b${custom}\\b`, 'gi');
          translated = translated.replace(regex, english);
        });
        return translated.trim();
      })
      .slice(0, 5);

    // Calculate complexity
    const knownWords = words.filter(word => this.config.vocabulary[word]).length;
    const complexity = knownWords / words.length > 0.8 ? 'easy' : 
                      knownWords / words.length > 0.5 ? 'medium' : 'hard';

    return {
      originalText: text,
      translatedText,
      keyPoints,
      vocabulary: usedVocabulary,
      complexity
    };
  }
}

// Tamil Learning Language
export const TAMIL_LEARNING_CONFIG: CustomLanguageConfig = {
  name: 'Tamil Learning',
  vocabulary: {
    'கற்று': 'learn',
    'படிப்பு': 'study', 
    'புத்தகம்': 'book',
    'மாணவர்': 'student',
    'ஆசிரியர்': 'teacher',
    'பள்ளி': 'school',
    'வகுப்பு': 'class',
    'பாடம்': 'lesson',
    'அறிவு': 'knowledge',
    'கல்வி': 'education',
    'எழுது': 'write',
    'படி': 'read',
    'புரிந்து': 'understand',
    'கேள்வி': 'question',
    'பதில்': 'answer'
  },
  grammar: {
    wordOrder: 'SOV',
    markers: {
      'ஐ': 'object marker',
      'இல்': 'location marker'
    }
  },
  keyPhrases: {
    'கற்று': 'learning concept',
    'படிப்பு': 'study concept',
    'அறிவு': 'knowledge concept'
  }
};

// Malayalam Learning Language  
export const MALAYALAM_LEARNING_CONFIG: CustomLanguageConfig = {
  name: 'Malayalam Learning',
  vocabulary: {
    'പഠിക്കുക': 'learn',
    'പഠനം': 'study',
    'പുസ്തകം': 'book', 
    'വിദ്യാർത്ഥി': 'student',
    'അധ്യാപകൻ': 'teacher',
    'സ്കൂൾ': 'school',
    'ക്ലാസ്': 'class',
    'പാഠം': 'lesson',
    'അറിവ്': 'knowledge',
    'വിദ്യാഭ്യാസം': 'education',
    'എഴുതുക': 'write',
    'വായിക്കുക': 'read',
    'മനസ്സിലാക്കുക': 'understand',
    'ചോദ്യം': 'question',
    'ഉത്തരം': 'answer'
  },
  grammar: {
    wordOrder: 'SOV',
    markers: {
      'നെ': 'object marker',
      'ൽ': 'location marker'
    }
  },
  keyPhrases: {
    'പഠിക്കുക': 'learning concept',
    'അറിവ്': 'knowledge concept'
  }
};

// Kannada Learning Language
export const KANNADA_LEARNING_CONFIG: CustomLanguageConfig = {
  name: 'Kannada Learning', 
  vocabulary: {
    'ಕಲಿಯಿರಿ': 'learn',
    'ಅಧ್ಯಯನ': 'study',
    'ಪುಸ್ತಕ': 'book',
    'ವಿದ್ಯಾರ್ಥಿ': 'student', 
    'ಶಿಕ್ಷಕ': 'teacher',
    'ಶಾಲೆ': 'school',
    'ತರಗತಿ': 'class',
    'ಪಾಠ': 'lesson',
    'ಜ್ಞಾನ': 'knowledge',
    'ಶಿಕ್ಷಣ': 'education',
    'ಬರೆಯಿರಿ': 'write',
    'ಓದು': 'read',
    'ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ': 'understand',
    'ಪ್ರಶ್ನೆ': 'question',
    'ಉತ್ತರ': 'answer'
  },
  grammar: {
    wordOrder: 'SOV',
    markers: {
      'ಅನ್ನು': 'object marker',
      'ಅಲ್ಲಿ': 'location marker'
    }
  },
  keyPhrases: {
    'ಕಲಿಯಿರಿ': 'learning concept',
    'ಜ್ಞಾನ': 'knowledge concept'
  }
};