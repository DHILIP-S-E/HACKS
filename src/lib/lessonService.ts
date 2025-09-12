import { createGeminiAIAdapter } from './adapters/geminiAdapter';

export interface GeneratedLesson {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  content: string;
  objectives: string[];
  estimatedDuration: number;
}

export class LessonService {
  private adapter;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.adapter = createGeminiAIAdapter(apiKey);
  }

  async generateLessons(topic: string): Promise<GeneratedLesson[]> {
    const difficulties: Array<'beginner' | 'intermediate' | 'advanced'> = 
      ['beginner', 'intermediate', 'advanced'];
    
    const lessons: GeneratedLesson[] = [];

    for (const difficulty of difficulties) {
      const prompt = this.createPrompt(topic, difficulty);
      console.log(`Generating ${difficulty} lesson for ${topic}`);
      // Use direct API call instead of generateSummary
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
        })
      });
      
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Content generation failed';
      
      lessons.push({
        difficulty,
        title: `${topic} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
        content,
        objectives: this.extractObjectives(content),
        estimatedDuration: this.estimateDuration(difficulty)
      });
    }

    return lessons;
  }

  private createPrompt(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
    return `Write a complete ${difficulty} level lesson about ${topic}.

# ${topic} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level

## Learning Objectives
By the end of this lesson, you will be able to:
- [Write 3-4 specific learning goals here]

## Introduction
[Write a brief introduction to ${topic}]

## Main Content
[Explain the key concepts of ${topic} at ${difficulty} level with examples]

## Practice Questions
1. [Question 1]
2. [Question 2]
3. [Question 3]

## Summary
[Summarize the key points]

Write the actual lesson content, not instructions. Fill in all the bracketed sections with real educational content about ${topic}.`;
  }

  private extractObjectives(content: string): string[] {
    const objectiveMatch = content.match(/Learning Objectives?:?\s*([\s\S]*?)(?:\n\n|\n[A-Z])/i);
    if (!objectiveMatch) return [];
    
    return objectiveMatch[1]
      .split(/\n/)
      .filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
      .map(line => line.replace(/^[-\d.]\s*/, '').trim())
      .filter(Boolean);
  }

  private estimateDuration(difficulty: 'beginner' | 'intermediate' | 'advanced'): number {
    const durations = { beginner: 30, intermediate: 45, advanced: 60 };
    return durations[difficulty];
  }
}