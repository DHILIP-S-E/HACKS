import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import type { User, UserRole } from '@/types/auth';
import type { Lesson, LessonProgress } from '@/types/lesson';
import type { Progress, Badge, Achievement } from '@/types/progress';
import type { Highlight, Note } from '@/types/content';

// Configure localforage instances
const authStore = localforage.createInstance({
  name: 'assistive-learning-auth'
});

const lessonsStore = localforage.createInstance({
  name: 'assistive-learning-lessons'
});

const progressStore = localforage.createInstance({
  name: 'assistive-learning-progress'
});

const contentStore = localforage.createInstance({
  name: 'assistive-learning-content'
});

// Default users for testing
const DEFAULT_USERS: User[] = [
  {
    id: 'student-1',
    email: 'student@demo.com',
    password: 'password123',
    name: 'Demo Student',
    role: 'student',
    createdAt: new Date().toISOString(),
    preferences: {
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: true,
    },
  },
  {
    id: 'teacher-1',
    email: 'teacher@demo.com',
    password: 'password123',
    name: 'Demo Teacher',
    role: 'teacher',
    createdAt: new Date().toISOString(),
    preferences: {
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: true,
    },
  },
  {
    id: 'admin-1',
    email: 'admin@demo.com',
    password: 'password123',
    name: 'Demo Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
    preferences: {
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: true,
    },
  },
];

export const localAdapter = {
  // Initialize default users if none exist
  async initializeDefaultUsers(): Promise<void> {
    const existingUsers = await authStore.getItem<User[]>('users');
    if (!existingUsers || existingUsers.length === 0) {
      await authStore.setItem('users', DEFAULT_USERS);
      console.log('Default users initialized:', DEFAULT_USERS.map(u => ({ email: u.email, role: u.role })));
    }
    
    // Initialize sample lessons
    await this.initializeSampleLessons();
  },

  // Initialize sample lessons
  async initializeSampleLessons(): Promise<void> {
    const existingLessons = await lessonsStore.getItem<Lesson[]>('lessons');
    if (!existingLessons || existingLessons.length === 0) {
      const sampleLessons: Lesson[] = [
        {
          id: 'lesson-1',
          title: 'Introduction to Web Accessibility',
          description: 'Learn the basics of making websites accessible to everyone.',
          content: `# Introduction to Web Accessibility

Web accessibility ensures that websites and applications are usable by people with disabilities. This includes:

## Key Principles (WCAG)

1. **Perceivable** - Information must be presentable in ways users can perceive
2. **Operable** - Interface components must be operable
3. **Understandable** - Information and UI operation must be understandable
4. **Robust** - Content must be robust enough for various assistive technologies

## Common Disabilities

- Visual impairments (blindness, low vision, color blindness)
- Hearing impairments (deafness, hard of hearing)
- Motor impairments (limited fine motor control, paralysis)
- Cognitive impairments (dyslexia, ADHD, autism)

## Benefits

- Improved user experience for everyone
- Legal compliance
- Larger audience reach
- Better SEO
- Enhanced usability`,
          authorId: 'teacher-1',
          difficulty: 'beginner',
          estimatedDuration: 30,
          tags: ['accessibility', 'web', 'basics'],
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lesson-2',
          title: 'Screen Reader Navigation',
          description: 'Understanding how screen readers work and how to optimize content for them.',
          content: `# Screen Reader Navigation

Screen readers are assistive technologies that convert text and interface elements into speech or braille.

## How Screen Readers Work

- Parse HTML structure
- Create accessibility tree
- Navigate using keyboard shortcuts
- Announce content based on semantic markup

## Best Practices

### Headings
- Use proper heading hierarchy (h1, h2, h3...)
- Don't skip heading levels
- Make headings descriptive

### Links
- Use descriptive link text
- Avoid "click here" or "read more"
- Indicate if link opens in new window

### Images
- Provide meaningful alt text
- Use empty alt="" for decorative images
- Consider context when writing alt text

### Forms
- Label all form controls
- Group related fields with fieldset/legend
- Provide clear error messages

## Testing with Screen Readers

- NVDA (Windows, free)
- JAWS (Windows, commercial)
- VoiceOver (macOS/iOS, built-in)
- TalkBack (Android, built-in)`,
          authorId: 'teacher-1',
          difficulty: 'intermediate',
          estimatedDuration: 45,
          tags: ['screen-reader', 'navigation', 'testing'],
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lesson-3',
          title: 'Color and Contrast Guidelines',
          description: 'Learn about color accessibility and contrast requirements.',
          content: `# Color and Contrast Guidelines

Color accessibility ensures that content is perceivable by users with various visual abilities.

## WCAG Contrast Requirements

### Normal Text
- **AA Level**: 4.5:1 contrast ratio
- **AAA Level**: 7:1 contrast ratio

### Large Text (18pt+ or 14pt+ bold)
- **AA Level**: 3:1 contrast ratio
- **AAA Level**: 4.5:1 contrast ratio

## Color Blindness Considerations

### Types of Color Blindness
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Monochromacy (complete color blindness)

### Design Guidelines
- Don't rely solely on color to convey information
- Use patterns, shapes, or text labels
- Test with color blindness simulators
- Provide high contrast mode options

## Tools for Testing

- WebAIM Contrast Checker
- Colour Contrast Analyser
- Browser developer tools
- Automated accessibility scanners

## Implementation Tips

- Use CSS custom properties for consistent colors
- Implement dark mode support
- Test in different lighting conditions
- Consider user preferences`,
          authorId: 'teacher-1',
          difficulty: 'intermediate',
          estimatedDuration: 35,
          tags: ['color', 'contrast', 'visual', 'design'],
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      await lessonsStore.setItem('lessons', sampleLessons);
      console.log('Sample lessons initialized:', sampleLessons.length, 'lessons');
    }
  },

  // Auth methods
  async getCurrentUser(): Promise<User | null> {
    return await authStore.getItem('currentUser');
  },

  async login(email: string, password: string): Promise<User> {
    console.log('Login attempt:', { email, password });
    
    // Ensure default users are initialized
    await this.initializeDefaultUsers();
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = await authStore.getItem<User[]>('users') || [];
    console.log('Available users:', users.map(u => ({ email: u.email, role: u.role })));
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      console.error('User not found or invalid password');
      throw new Error('Invalid credentials');
    }

    console.log('Login successful for user:', { email: user.email, role: user.role });
    await authStore.setItem('currentUser', user);
    return user;
  },

  async register(userData: { email: string; password: string; name: string; role: UserRole }): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = await authStore.getItem<User[]>('users') || [];
    
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }

    const user: User = {
      id: uuidv4(),
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      name: userData.name,
      role: userData.role,
      createdAt: new Date().toISOString(),
      preferences: {
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications: true,
      },
    };

    users.push(user);
    await authStore.setItem('users', users);
    await authStore.setItem('currentUser', user);

    // Initialize user progress
    const initialProgress: Progress = {
      id: uuidv4(),
      userId: user.id,
      level: 1,
      totalXP: 0,
      streak: 0,
      lastActivity: new Date().toISOString(),
      completedLessons: [],
      achievements: [],
    };
    
    await progressStore.setItem(`progress_${user.id}`, initialProgress);

    return user;
  },

  async logout(): Promise<void> {
    await authStore.removeItem('currentUser');
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const users = await authStore.getItem<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    await authStore.setItem('users', users);
    
    if (updates.email || updates.name || updates.preferences) {
      await authStore.setItem('currentUser', users[userIndex]);
    }

    return users[userIndex];
  },

  // Progress methods
  async getUserProgress(): Promise<Progress | null> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    return await progressStore.getItem(`progress_${currentUser.id}`);
  },

  async updateProgress(progress: Progress): Promise<Progress> {
    await progressStore.setItem(`progress_${progress.userId}`, progress);
    return progress;
  },

  async getUserBadges(): Promise<Badge[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];

    return await progressStore.getItem(`badges_${currentUser.id}`) || [];
  },

  async awardBadge(badgeId: string): Promise<Badge> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    const badge: Badge = {
      id: badgeId,
      name: this.getBadgeName(badgeId),
      description: this.getBadgeDescription(badgeId),
      icon: this.getBadgeIcon(badgeId),
      awardedAt: new Date().toISOString(),
    };

    const badges = await this.getUserBadges();
    badges.push(badge);
    await progressStore.setItem(`badges_${currentUser.id}`, badges);

    return badge;
  },

  async getUserAchievements(): Promise<Achievement[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];

    return await progressStore.getItem(`achievements_${currentUser.id}`) || [];
  },

  async unlockAchievement(achievementId: string): Promise<Achievement> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    const achievement: Achievement = {
      id: achievementId,
      name: this.getAchievementName(achievementId),
      description: this.getAchievementDescription(achievementId),
      xpReward: this.getAchievementXP(achievementId),
      unlockedAt: new Date().toISOString(),
    };

    const achievements = await this.getUserAchievements();
    achievements.push(achievement);
    await progressStore.setItem(`achievements_${currentUser.id}`, achievements);

    return achievement;
  },

  // Lesson methods
  async getLessons(): Promise<Lesson[]> {
    return await lessonsStore.getItem('lessons') || [];
  },

  async getLesson(id: string): Promise<Lesson | null> {
    const lessons = await this.getLessons();
    return lessons.find(l => l.id === id) || null;
  },

  async createLesson(lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lesson> {
    const newLesson: Lesson = {
      ...lesson,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const lessons = await this.getLessons();
    lessons.push(newLesson);
    await lessonsStore.setItem('lessons', lessons);

    return newLesson;
  },

  async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson> {
    const lessons = await this.getLessons();
    const lessonIndex = lessons.findIndex(l => l.id === id);
    
    if (lessonIndex === -1) {
      throw new Error('Lesson not found');
    }

    lessons[lessonIndex] = {
      ...lessons[lessonIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await lessonsStore.setItem('lessons', lessons);
    return lessons[lessonIndex];
  },

  async deleteLesson(id: string): Promise<void> {
    const lessons = await this.getLessons();
    const filteredLessons = lessons.filter(l => l.id !== id);
    await lessonsStore.setItem('lessons', filteredLessons);
  },

  async getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    return await progressStore.getItem(`lesson_progress_${currentUser.id}_${lessonId}`);
  },

  async updateLessonProgress(lessonId: string, progress: LessonProgress): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    await progressStore.setItem(`lesson_progress_${currentUser.id}_${lessonId}`, progress);
  },

  // Content methods (highlights, notes)
  async getHighlights(lessonId: string): Promise<Highlight[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];

    return await contentStore.getItem(`highlights_${currentUser.id}_${lessonId}`) || [];
  },

  async createHighlight(highlight: Omit<Highlight, 'id' | 'createdAt'>): Promise<Highlight> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    const newHighlight: Highlight = {
      ...highlight,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    const highlights = await this.getHighlights(highlight.lessonId);
    highlights.push(newHighlight);
    await contentStore.setItem(`highlights_${currentUser.id}_${highlight.lessonId}`, highlights);

    return newHighlight;
  },

  async updateHighlight(id: string, updates: Partial<Highlight>): Promise<Highlight> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    // Find highlight across all lessons (simplified for demo)
    const allLessons = await this.getLessons();
    
    for (const lesson of allLessons) {
      const highlights = await this.getHighlights(lesson.id);
      const highlightIndex = highlights.findIndex(h => h.id === id);
      
      if (highlightIndex !== -1) {
        highlights[highlightIndex] = { ...highlights[highlightIndex], ...updates };
        await contentStore.setItem(`highlights_${currentUser.id}_${lesson.id}`, highlights);
        return highlights[highlightIndex];
      }
    }

    throw new Error('Highlight not found');
  },

  async deleteHighlight(id: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    // Find and delete highlight across all lessons
    const allLessons = await this.getLessons();
    
    for (const lesson of allLessons) {
      const highlights = await this.getHighlights(lesson.id);
      const filteredHighlights = highlights.filter(h => h.id !== id);
      
      if (filteredHighlights.length !== highlights.length) {
        await contentStore.setItem(`highlights_${currentUser.id}_${lesson.id}`, filteredHighlights);
        return;
      }
    }

    throw new Error('Highlight not found');
  },

  // Utility methods for badges and achievements
  getBadgeName(badgeId: string): string {
    const badgeNames: Record<string, string> = {
      'first_lesson': 'First Steps',
      'streak_7': 'Week Warrior',
      'streak_30': 'Monthly Master',
      'level_up': 'Level Up!',
      'highlight_master': 'Highlight Hero',
      'note_taker': 'Note Ninja',
    };
    return badgeNames[badgeId] || 'Unknown Badge';
  },

  getBadgeDescription(badgeId: string): string {
    const descriptions: Record<string, string> = {
      'first_lesson': 'Completed your first lesson',
      'streak_7': 'Maintained a 7-day learning streak',
      'streak_30': 'Maintained a 30-day learning streak',
      'level_up': 'Advanced to a new level',
      'highlight_master': 'Made 50 highlights',
      'note_taker': 'Created 20 notes',
    };
    return descriptions[badgeId] || 'Achievement unlocked!';
  },

  getBadgeIcon(badgeId: string): string {
    const icons: Record<string, string> = {
      'first_lesson': '🎯',
      'streak_7': '🔥',
      'streak_30': '🏆',
      'level_up': '⭐',
      'highlight_master': '✨',
      'note_taker': '📝',
    };
    return icons[badgeId] || '🏅';
  },

  getAchievementName(achievementId: string): string {
    const names: Record<string, string> = {
      'perfectionist': 'Perfectionist',
      'speed_reader': 'Speed Reader',
      'scholar': 'Scholar',
      'mentor': 'Mentor',
    };
    return names[achievementId] || 'Achievement';
  },

  getAchievementDescription(achievementId: string): string {
    const descriptions: Record<string, string> = {
      'perfectionist': 'Scored 100% on 10 assessments',
      'speed_reader': 'Completed 5 lessons in one day',
      'scholar': 'Completed 100 lessons',
      'mentor': 'Helped 5 other students',
    };
    return descriptions[achievementId] || 'Special achievement unlocked!';
  },

  getAchievementXP(achievementId: string): number {
    const xpRewards: Record<string, number> = {
      'perfectionist': 500,
      'speed_reader': 300,
      'scholar': 1000,
      'mentor': 750,
    };
    return xpRewards[achievementId] || 100;
  },
};