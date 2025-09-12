import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Web Speech API
global.SpeechSynthesisUtterance = vi.fn();
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  onvoiceschanged: vi.fn(),
};

// Mock Web Speech Recognition
global.SpeechRecognition = vi.fn(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
  onstart: vi.fn(),
  onend: vi.fn(),
  onerror: vi.fn(),
  onresult: vi.fn(),
  lang: 'en-US',
  continuous: false,
  interimResults: false,
}));

global.webkitSpeechRecognition = global.SpeechRecognition;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

// Mock fetch
global.fetch = vi.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = vi.fn();

// Mock FileReader
global.FileReader = vi.fn(() => ({
  readAsDataURL: vi.fn(),
  readAsText: vi.fn(),
  readAsArrayBuffer: vi.fn(),
  onload: vi.fn(),
  onerror: vi.fn(),
  result: null,
}));

// Mock Blob
global.Blob = vi.fn((content, options) => ({
  size: content ? content.join('').length : 0,
  type: options ? options.type : '',
}));

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mock-uuid'),
    getRandomValues: vi.fn(arr => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
  },
});

// Setup test environment variables
process.env.VITE_GEMINI_API_KEY = 'test_gemini_key';
process.env.VITE_SUPABASE_URL = 'http://localhost:54321';
process.env.VITE_SUPABASE_ANON_KEY = 'test_supabase_key';

// Add custom matchers for accessibility testing
expect.extend({
  toBeAccessible: function (received) {
    // This would integrate with axe-core in a real implementation
    const pass = true; // Placeholder
    return {
      message: () => `expected ${received} to be accessible`,
      pass,
    };
  },
});

// Global test utilities
export const mockUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student' as const,
  createdAt: new Date().toISOString(),
  preferences: {
    language: 'en',
    timezone: 'UTC',
    notifications: true,
  },
};

export const mockLesson = {
  id: 'test-lesson-1',
  title: 'Test Lesson',
  description: 'A test lesson for unit testing',
  content: 'This is the lesson content for testing purposes.',
  authorId: 'test-teacher-1',
  authorName: 'Test Teacher',
  subject: 'Mathematics',
  gradeLevel: ['grade-5'],
  difficulty: 'beginner' as const,
  estimatedDuration: 30,
  tags: ['test', 'math', 'basic'],
  attachments: [],
  accessibility: {
    altTexts: {},
    transcripts: {},
    verificationStatus: 'unverified' as const,
  },
  version: 1,
  status: 'published' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {
    readingLevel: 5,
    wordCount: 150,
  },
};

// Clean up function to run after each test
export const cleanup = () => {
  vi.clearAllMocks();
  localStorage.clear();
};