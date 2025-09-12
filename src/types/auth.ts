export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';

export interface User {
  id: string;
  email: string;
  password?: string; // Only stored locally, never sent to server in real app
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  preferences: UserPreferences;
  profile?: UserProfile;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  weeklyReports?: boolean;
}

export interface UserProfile {
  bio?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: string;
  learningDisabilities?: LearningDisability[];
  accommodations?: string[];
  parentGuardian?: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
  };
}

export type LearningDisability = 
  | 'dyslexia'
  | 'adhd'
  | 'autism'
  | 'visual_impairment'
  | 'hearing_impairment'
  | 'motor_disability'
  | 'cognitive_disability'
  | 'other';

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  preferences?: Partial<UserPreferences>;
}