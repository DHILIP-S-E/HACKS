import { AIAdapter } from '@/types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

class GeminiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GeminiError';
  }
}

export const geminiAdapter: AIAdapter = {
  async summarizeText(
    text: string, 
    options?: { language?: string; complexity?: 'simple' | 'moderate' }
  ): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new GeminiError('Gemini API key not configured');
    }

    const complexity = options?.complexity || 'simple';
    const language = options?.language || 'English';
    
    const prompt = `Please summarize the following text in ${language} using ${complexity} language suitable for students with learning disabilities. Make it clear, concise, and easy to understand:

${text}`;

    try {
      const response = await fetch(
        `${GEMINI_BASE_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new GeminiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new GeminiError('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      if (error instanceof GeminiError) {
        throw error;
      }
      throw new GeminiError(`Failed to summarize text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async generateTTS(
    text: string, 
    options?: { voice?: string; speed?: number; language?: string }
  ): Promise<string> {
    // Note: Gemini doesn't have direct TTS API, so we'll use a mock implementation
    // In a real implementation, you might use Google Cloud Text-to-Speech API
    
    if (!GEMINI_API_KEY) {
      throw new GeminiError('Gemini API key not configured');
    }

    // Mock TTS generation - in real implementation, integrate with Google Cloud TTS
    const mockAudioData = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`;
    
    return Promise.resolve(mockAudioData);
  },

  async transcribeAudio(
    audioUrl: string, 
    options?: { language?: string }
  ): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new GeminiError('Gemini API key not configured');
    }

    // Note: Gemini doesn't have direct audio transcription
    // In a real implementation, you might use Google Cloud Speech-to-Text API
    
    // Mock transcription
    return Promise.resolve('This is a mock transcription of the audio content.');
  },

  async generateImageDescription(
    imageUrl: string, 
    options?: { language?: string }
  ): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new GeminiError('Gemini API key not configured');
    }

    const language = options?.language || 'English';
    
    try {
      // For Gemini Vision, we need to use gemini-pro-vision model
      const response = await fetch(
        `${GEMINI_BASE_URL}/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { 
                  text: `Please describe this image in ${language} in a way that's accessible for students with visual impairments. Focus on educational content and important details.` 
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: await this.getImageBase64(imageUrl)
                  }
                }
              ]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new GeminiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new GeminiError('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      if (error instanceof GeminiError) {
        throw error;
      }
      throw new GeminiError(`Failed to generate image description: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new GeminiError('Gemini API key not configured');
    }

    const prompt = `Please translate the following text to ${targetLanguage}. Keep the translation simple and accessible for students with learning disabilities:

${text}`;

    try {
      const response = await fetch(
        `${GEMINI_BASE_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new GeminiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new GeminiError('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      if (error instanceof GeminiError) {
        throw error;
      }
      throw new GeminiError(`Failed to translate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async getImageBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new GeminiError(`Failed to fetch image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

export { GeminiError };