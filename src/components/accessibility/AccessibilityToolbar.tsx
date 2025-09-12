import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sun, 
  Moon, 
  Type, 
  ZoomIn, 
  ZoomOut, 
  Contrast,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Settings
} from 'lucide-react';
import { useAccessibilityStore } from '@/stores/accessibilityStore';
import { aiAdapter } from '@/lib/adapters/aiAdapter';

export const AccessibilityToolbar: React.FC = () => {
  const { t } = useTranslation();
  const {
    theme,
    highContrast,
    dyslexicFont,
    fontSize,
    ttsEnabled,
    setTheme,
    toggleHighContrast,
    toggleDyslexicFont,
    setFontSize,
  } = useAccessibilityStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const toggleThemeHandler = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const increaseFontSize = () => {
    const sizes = [14, 16, 18, 20, 24] as const;
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes = [14, 16, 18, 20, 24] as const;
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  const toggleTTS = async () => {
    if (isSpeaking) {
      await aiAdapter.stopTTS();
      setIsSpeaking(false);
    } else {
      // Read selected text or page title
      const selectedText = window.getSelection()?.toString();
      const textToRead = selectedText || document.title;
      
      if (textToRead) {
        setIsSpeaking(true);
        try {
          await aiAdapter.speak(textToRead);
        } catch (error) {
          console.error('TTS error:', error);
        } finally {
          setIsSpeaking(false);
        }
      }
    }
  };

  const toggleSTT = async () => {
    if (isListening) {
      try {
        const transcript = await aiAdapter.stopSTT();
        console.log('Transcript:', transcript);
        setIsListening(false);
      } catch (error) {
        console.error('STT error:', error);
        setIsListening(false);
      }
    } else {
      try {
        await aiAdapter.startSTT({ language: 'en-US' });
        setIsListening(true);
        
        // Set up result handler
        aiAdapter.onSTTResult((text, isFinal) => {
          console.log('STT Result:', text, 'Final:', isFinal);
          if (isFinal) {
            setIsListening(false);
          }
        });
      } catch (error) {
        console.error('STT error:', error);
        setIsListening(false);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 z-50">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              Accessibility Options
            </h3>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Theme toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {t('a11y.toggleTheme')}
              </span>
              <button
                onClick={toggleThemeHandler}
                className="btn-ghost p-2"
                aria-label={t('a11y.toggleTheme')}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* High contrast */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {t('a11y.toggleHighContrast')}
              </span>
              <button
                onClick={toggleHighContrast}
                className={`p-2 rounded ${
                  highContrast ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                aria-label={t('a11y.toggleHighContrast')}
                aria-pressed={highContrast}
              >
                <Contrast className="w-4 h-4" />
              </button>
            </div>

            {/* Dyslexic font */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {t('a11y.toggleDyslexicFont')}
              </span>
              <button
                onClick={toggleDyslexicFont}
                className={`p-2 rounded ${
                  dyslexicFont ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                aria-label={t('a11y.toggleDyslexicFont')}
                aria-pressed={dyslexicFont}
              >
                <Type className="w-4 h-4" />
              </button>
            </div>

            {/* Font size controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Font Size ({fontSize}px)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={decreaseFontSize}
                  className="btn-ghost p-2"
                  aria-label={t('a11y.decreaseFontSize')}
                  disabled={fontSize <= 14}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={increaseFontSize}
                  className="btn-ghost p-2"
                  aria-label={t('a11y.increaseFontSize')}
                  disabled={fontSize >= 24}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TTS controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Text-to-Speech
              </span>
              <button
                onClick={toggleTTS}
                className={`p-2 rounded ${
                  isSpeaking ? 'bg-primary-100 text-primary-700 animate-pulse' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                aria-label={isSpeaking ? t('a11y.pauseTTS') : t('a11y.playTTS')}
              >
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* STT controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Speech-to-Text
              </span>
              <button
                onClick={toggleSTT}
                className={`p-2 rounded ${
                  isListening ? 'bg-red-100 text-red-700 animate-pulse' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                aria-label={isListening ? t('a11y.stopSTT') : t('a11y.startSTT')}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};