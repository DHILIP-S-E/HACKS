import type { AIAdapter } from '@/types'

class FallbackAdapter implements AIAdapter {
  async generateText(prompt: string, options?: any): Promise<string> {
    // Fallback to a simple template-based response
    console.warn('Using fallback AI adapter - limited functionality')
    
    if (prompt.includes('summary') || prompt.includes('summarize')) {
      return 'Summary: This content covers key educational concepts. Please review the original material for complete information.'
    }
    
    if (prompt.includes('translate')) {
      return 'Translation not available in offline mode. Please check your internet connection.'
    }
    
    return 'AI processing not available. Please check your API configuration or internet connection.'
  }

  async generateSummary(text: string): Promise<string> {
    // Simple extractive summary - take first few sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const summary = sentences.slice(0, 3).join('. ').trim()
    return summary || 'Summary not available for this content.'
  }

  async generateAltText(imageUrl: string): Promise<string> {
    // Extract filename and provide generic description
    const filename = imageUrl.split('/').pop() || 'image'
    return `Educational image: ${filename}. Please refer to surrounding context for details.`
  }

  async transcribeAudio(audioUrl: string): Promise<string> {
    // Check if Web Speech API is available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      return 'Audio transcription requires manual activation. Please use the speech-to-text feature.'
    }
    return 'Audio transcription not available in this browser.'
  }

  async translateText(text: string, targetLang: string): Promise<string> {
    // No translation capability in fallback mode
    return `Translation to ${targetLang} not available offline. Original text: ${text}`
  }
}

export default FallbackAdapter