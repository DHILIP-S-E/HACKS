import { AIAdapter } from '@/types';

// Fallback adapter using browser APIs and safe no-ops
export const fallbackAdapter: AIAdapter = {
  async summarizeText(
    text: string, 
    options?: { language?: string; complexity?: 'simple' | 'moderate' }
  ): Promise<string> {
    // Simple text summarization using basic heuristics
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= 3) {
      return text.trim();
    }
    
    // Take first and last sentences, and the longest middle sentence
    const firstSentence = sentences[0]?.trim() || '';
    const lastSentence = sentences[sentences.length - 1]?.trim() || '';
    
    const longestMiddle = sentences.slice(1, -1)
      .reduce((longest, current) => 
        current.length > longest.length ? current : longest, ''
      ).trim();
    
    const summary = [firstSentence, longestMiddle, lastSentence]
      .filter(s => s.length > 0)
      .join('. ') + '.';
    
    return summary;
  },

  async generateTTS(
    text: string, 
    options?: { voice?: string; speed?: number; language?: string }
  ): Promise<string> {
    // Use Web Speech API for TTS
    if ('speechSynthesis' in window) {
      return new Promise((resolve, reject) => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Configure voice options
          if (options?.speed) {
            utterance.rate = Math.max(0.1, Math.min(2.0, options.speed));
          }
          
          if (options?.language) {
            utterance.lang = options.language;
          }
          
          // Find preferred voice
          if (options?.voice) {
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => 
              v.name.toLowerCase().includes(options.voice!.toLowerCase())
            );
            if (preferredVoice) {
              utterance.voice = preferredVoice;
            }
          }
          
          // Create a blob URL for the "audio file"
          // Note: Web Speech API doesn't provide audio data directly
          // This is a mock implementation
          const mockAudioBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(mockAudioBlob);
          
          utterance.onend = () => resolve(audioUrl);
          utterance.onerror = (event) => reject(new Error(`TTS error: ${event.error}`));
          
          speechSynthesis.speak(utterance);
        } catch (error) {
          reject(new Error(`TTS not supported: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });
    }
    
    // Fallback: return a mock audio URL
    return Promise.resolve('data:audio/wav;base64,mock-audio-data');
  },

  async transcribeAudio(
    audioUrl: string, 
    options?: { language?: string }
  ): Promise<string> {
    // Use Web Speech API for STT if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      return new Promise((resolve, reject) => {
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;
          
          if (options?.language) {
            recognition.lang = options.language;
          }
          
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
          };
          
          recognition.onerror = (event: any) => {
            const errorType = event?.error || 'unknown';
            reject(new Error(`Speech recognition error: ${errorType}`));
          };
          
          // Mock implementation for audio file transcription
          resolve('Mock transcription: This is placeholder text for audio transcription.');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          reject(new Error(`Speech recognition not supported: ${errorMessage}`));
        }
      });
    }
    
    // Fallback: return mock transcription
    return Promise.resolve('Audio transcription not available. Please enable microphone access for speech-to-text features.');
  },

  async generateImageDescription(
    imageUrl: string, 
    options?: { language?: string }
  ): Promise<string> {
    // Basic image analysis using Canvas API
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            resolve('Image analysis not available in this browser.');
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Basic color analysis
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let totalR = 0, totalG = 0, totalB = 0;
          const pixelCount = data.length / 4;
          
          for (let i = 0; i < data.length; i += 4) {
            totalR += data[i] || 0;
            totalG += data[i + 1] || 0;
            totalB += data[i + 2] || 0;
          }
          
          const avgR = Math.round(totalR / pixelCount);
          const avgG = Math.round(totalG / pixelCount);
          const avgB = Math.round(totalB / pixelCount);
          
          // Generate basic description based on color analysis
          let colorDescription = 'neutral tones';
          if (avgR > avgG && avgR > avgB) {
            colorDescription = 'warm, reddish tones';
          } else if (avgG > avgR && avgG > avgB) {
            colorDescription = 'green tones';
          } else if (avgB > avgR && avgB > avgG) {
            colorDescription = 'cool, bluish tones';
          }
          
          const brightness = (avgR + avgG + avgB) / 3;
          const brightnessDescription = brightness > 128 ? 'bright' : 'dark';
          
          const description = `This image appears to be ${brightnessDescription} with ${colorDescription}. The image dimensions are ${img.width}x${img.height} pixels. For detailed content description, please use AI-powered image analysis.`;
          
          resolve(description);
        } catch {
          resolve('Unable to analyze image. This may be an educational diagram, chart, or illustration.');
        }
      };
      
      img.onerror = () => {
        resolve('Image could not be loaded for analysis.');
      };
      
      img.src = imageUrl;
    });
  },

  async translateText(text: string, targetLanguage: string): Promise<string> {
    // Basic translation fallback - in a real app, you might use a translation service
    // For now, we'll return the original text with a note
    const languageNote = targetLanguage.toLowerCase() === 'english' ? '' : ` (Translation to ${targetLanguage} not available without AI service)`;
    return Promise.resolve(text + languageNote);
  },
};

// Helper function to check if speech synthesis is available
export const isTTSAvailable = (): boolean => {
  return 'speechSynthesis' in window;
};

// Helper function to check if speech recognition is available
export const isSTTAvailable = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Helper function to get available voices
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if ('speechSynthesis' in window) {
    return speechSynthesis.getVoices();
  }
  return [];
};

// Helper function to speak text directly (for immediate TTS)
export const speakText = (
  text: string, 
  options?: { voice?: string; speed?: number; language?: string }
): Promise<void> => {
  if (!isTTSAvailable()) {
    return Promise.reject(new Error('Text-to-speech not available'));
  }
  
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (options?.speed) {
      utterance.rate = Math.max(0.1, Math.min(2.0, options.speed));
    }
    
    if (options?.language) {
      utterance.lang = options.language;
    }
    
    if (options?.voice) {
      const voices = getAvailableVoices();
      const preferredVoice = voices.find(v => 
        v.name.toLowerCase().includes(options.voice!.toLowerCase())
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }
    
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`TTS error: ${event.error}`));
    
    speechSynthesis.speak(utterance);
  });
};