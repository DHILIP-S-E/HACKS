// Accessibility-focused NLP for disability students
export interface AccessibilityAnalysis {
  readabilityLevel: 'very-easy' | 'easy' | 'medium' | 'hard';
  complexWords: string[];
  longSentences: string[];
  suggestions: string[];
  simplifiedText: string;
  keyPoints: string[];
  translatedText?: string;
}

export type SupportedLanguage = 'english' | 'tamil' | 'malayalam' | 'kannada';

export class AccessibilityNLP {
  static analyzeForAccessibility(text: string, language: SupportedLanguage = 'english'): AccessibilityAnalysis {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Find complex words (>7 letters)
    const complexWords = words.filter(word => word.length > 7);
    
    // Find long sentences (>15 words)
    const longSentences = sentences.filter(s => s.split(' ').length > 15);
    
    // Calculate readability
    const avgWordsPerSentence = words.length / sentences.length;
    const readabilityLevel = avgWordsPerSentence > 20 ? 'hard' : 
                           avgWordsPerSentence > 15 ? 'medium' :
                           avgWordsPerSentence > 10 ? 'easy' : 'very-easy';
    
    // Generate suggestions
    const suggestions = [];
    if (complexWords.length > 5) suggestions.push('Use simpler words');
    if (longSentences.length > 2) suggestions.push('Break long sentences');
    if (avgWordsPerSentence > 15) suggestions.push('Shorter paragraphs needed');
    
    // Simplify text
    const simplifiedText = this.simplifyText(text, language);
    
    // Extract key points (first sentence of each paragraph)
    const keyPoints = text.split('\n\n').map(p => p.split('.')[0]).filter(p => p.trim());
    
    // Translate if needed
    const translatedText = language !== 'english' ? this.translateText(text, language) : undefined;
    
    return {
      readabilityLevel,
      complexWords: [...new Set(complexWords)].slice(0, 10),
      longSentences: longSentences.slice(0, 3),
      suggestions: this.getSuggestions(language, complexWords.length, longSentences.length, avgWordsPerSentence),
      simplifiedText,
      keyPoints: keyPoints.slice(0, 5),
      translatedText
    };
  }
  
  private static simplifyText(text: string, language: SupportedLanguage): string {
    const replacements = {
      'utilize': 'use',
      'demonstrate': 'show',
      'approximately': 'about',
      'consequently': 'so',
      'furthermore': 'also',
      'nevertheless': 'but',
      'significant': 'important',
      'comprehend': 'understand',
      'facilitate': 'help',
      'implement': 'do'
    };
    
    let simplified = text;
    Object.entries(replacements).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      simplified = simplified.replace(regex, simple);
    });
    
    return simplified;
  }
  
  private static translateText(text: string, language: SupportedLanguage): string {
    const translations = {
      tamil: {
        'learn': 'கற்று',
        'study': 'படிப்பு', 
        'read': 'படி',
        'write': 'எழுது',
        'understand': 'புரிந்து',
        'lesson': 'பாடம்',
        'student': 'மாணவர்',
        'teacher': 'ஆசிரியர்',
        'book': 'புத்தகம்',
        'knowledge': 'அறிவு',
        'education': 'கல்வி',
        'school': 'பள்ளி',
        'class': 'வகுப்பு',
        'homework': 'வீட்டுப்பாடம்',
        'exam': 'தேர்வு',
        'question': 'கேள்வி',
        'answer': 'பதில்',
        'practice': 'பயிற்சி'
      },
      malayalam: {
        'learn': 'പഠിക്കുക',
        'study': 'പഠനം',
        'read': 'വായിക്കുക', 
        'write': 'എഴുതുക',
        'understand': 'മനസ്സിലാക്കുക',
        'lesson': 'പാഠം',
        'student': 'വിദ്യാർത്ഥി',
        'teacher': 'അധ്യാപകൻ',
        'book': 'പുസ്തകം',
        'knowledge': 'അറിവ്',
        'education': 'വിദ്യാഭ്യാസം',
        'school': 'സ്കൂൾ',
        'class': 'ക്ലാസ്',
        'homework': 'ഗൃഹപാഠം',
        'exam': 'പരീക്ഷ',
        'question': 'ചോദ്യം',
        'answer': 'ഉത്തരം',
        'practice': 'അഭ്യാസം'
      },
      kannada: {
        'learn': 'ಕಲಿಯಿರಿ',
        'study': 'ಅಧ್ಯಯನ',
        'read': 'ಓದು',
        'write': 'ಬರೆಯಿರಿ', 
        'understand': 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',
        'lesson': 'ಪಾಠ',
        'student': 'ವಿದ್ಯಾರ್ಥಿ',
        'teacher': 'ಶಿಕ್ಷಕ',
        'book': 'ಪುಸ್ತಕ',
        'knowledge': 'ಜ್ಞಾನ',
        'education': 'ಶಿಕ್ಷಣ',
        'school': 'ಶಾಲೆ',
        'class': 'ತರಗತಿ',
        'homework': 'ಮನೆಕೆಲಸ',
        'exam': 'ಪರೀಕ್ಷೆ',
        'question': 'ಪ್ರಶ್ನೆ',
        'answer': 'ಉತ್ತರ',
        'practice': 'ಅಭ್ಯಾಸ'
      }
    };
    
    let translated = text;
    const langTranslations = translations[language];
    if (langTranslations) {
      Object.entries(langTranslations).forEach(([english, local]) => {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        translated = translated.replace(regex, local);
      });
    }
    
    return translated;
  }
  
  private static getSuggestions(language: SupportedLanguage, complexWords: number, longSentences: number, avgWords: number): string[] {
    const suggestions = {
      english: {
        complex: 'Use simpler words',
        long: 'Break long sentences',
        avg: 'Shorter paragraphs needed'
      },
      tamil: {
        complex: 'எளிய வார்த்தைகளைப் பயன்படுத்துங்கள்',
        long: 'நீண்ட வாக்கியங்களை உடைக்கவும்',
        avg: 'குறுகிய பத்திகள் தேவை'
      },
      malayalam: {
        complex: 'ലളിതമായ വാക്കുകൾ ഉപയോഗിക്കുക',
        long: 'നീണ്ട വാക്യങ്ങൾ വിഭജിക്കുക',
        avg: 'ചെറിയ ഖണ്ഡികകൾ ആവശ്യം'
      },
      kannada: {
        complex: 'ಸರಳ ಪದಗಳನ್ನು ಬಳಸಿ',
        long: 'ದೀರ್ಘ ವಾಕ್ಯಗಳನ್ನು ಒಡೆಯಿರಿ',
        avg: 'ಚಿಕ್ಕ ಪ್ಯಾರಾಗಳು ಅಗತ್ಯ'
      }
    };
    
    const langSuggestions = suggestions[language];
    const result = [];
    
    if (complexWords > 5) result.push(langSuggestions.complex);
    if (longSentences > 2) result.push(langSuggestions.long);
    if (avgWords > 15) result.push(langSuggestions.avg);
    
    return result;
  }
}