import type { AIAdapter } from '@/types'

class GeminiAdapter implements AIAdapter {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: options?.temperature || 0.7,
            maxOutputTokens: options?.maxTokens || 1000,
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    } catch (error) {
      console.error('Gemini API error:', error)
      throw error
    }
  }

  async generateSummary(text: string): Promise<string> {
    const prompt = `Please provide a clear, concise summary of the following text that would be helpful for students with learning disabilities. Use simple language and bullet points where appropriate:\n\n${text}`
    return this.generateText(prompt)
  }

  async generateAltText(imageUrl: string): Promise<string> {
    // Note: Gemini Vision API would be used here in a real implementation
    const prompt = `Generate descriptive alt text for an educational image. The description should be clear and helpful for students using screen readers.`
    return this.generateText(prompt)
  }

  async transcribeAudio(audioUrl: string): Promise<string> {
    // Note: This would integrate with Gemini's audio processing capabilities
    throw new Error('Audio transcription not implemented in Gemini adapter')
  }

  async translateText(text: string, targetLang: string): Promise<string> {
    const prompt = `Translate the following text to ${targetLang}. Maintain the educational context and use simple, clear language:\n\n${text}`
    return this.generateText(prompt)
  }
}

export default GeminiAdapter