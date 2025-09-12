import google.generativeai as genai
import os

class LessonGenerator:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_lesson(self, topic):
        prompt = f"""Create a structured lesson on: {topic}

Include:
- Learning objectives
- Key concepts
- Examples
- Practice questions

Keep it concise and educational."""
        
        response = self.model.generate_content(prompt)
        return response.text

def main():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("Set GEMINI_API_KEY environment variable")
        return
    
    generator = LessonGenerator(api_key)
    
    while True:
        topic = input("\nEnter topic (or 'quit'): ")
        if topic.lower() == 'quit':
            break
        
        print("\nGenerating lesson...")
        lesson = generator.generate_lesson(topic)
        print(f"\n{lesson}")

if __name__ == "__main__":
    main()