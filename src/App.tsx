import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAccessibilityStore } from '@/stores/accessibilityStore';
import { useProgressStore } from '@/stores/progressStore';
import { Layout } from '@/components/layout/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkipLink } from '@/components/accessibility/SkipLink';
import { ReadingRuler } from '@/components/accessibility/ReadingRuler';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const LessonsPage = lazy(() => import('@/pages/student/LessonsPage'));
const LessonPage = lazy(() => import('@/pages/student/LessonPage'));
const TeacherDashboard = lazy(() => import('@/pages/teacher/TeacherDashboard'));
const CreateLessonPage = lazy(() => import('@/pages/teacher/CreateLessonPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

function App() {
  const { initialize: initAuth, isLoading: authLoading } = useAuthStore();
  const { 
    theme, 
    highContrast, 
    dyslexicFont, 
    fontSize, 
    textSpacing,
    reducedMotion,
    initialize: initAccessibility 
  } = useAccessibilityStore();
  const { initialize: initProgress } = useProgressStore();

  useEffect(() => {
    // Initialize all stores
    const initializeApp = async () => {
      try {
        await Promise.all([
          initAuth(),
          initAccessibility(),
          initProgress()
        ]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [initAuth, initAccessibility, initProgress]);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    root.classList.toggle('dark', theme === 'dark');
    
    // High contrast
    root.classList.toggle('high-contrast', highContrast);
    
    // Dyslexic font
    root.classList.toggle('dyslexic-font', dyslexicFont);
    
    // Font size
    root.style.fontSize = `${fontSize}px`;
    
    // Text spacing
    root.setAttribute('data-text-spacing', textSpacing);
    
    // Reduced motion
    if (reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
    }
  }, [theme, highContrast, dyslexicFont, fontSize, textSpacing, reducedMotion]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
        <SkipLink />
        <ReadingRuler />
        
        <Suspense 
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route element={<AuthGuard><Layout /></AuthGuard>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Student routes */}
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/lessons/:id" element={<LessonPage />} />
              
              {/* Teacher routes */}
              <Route 
                path="/teacher" 
                element={
                  <AuthGuard requiredRole="teacher">
                    <TeacherDashboard />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/teacher/lessons/create" 
                element={
                  <AuthGuard requiredRole="teacher">
                    <CreateLessonPage />
                  </AuthGuard>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin" 
                element={
                  <AuthGuard requiredRole="admin">
                    <AdminDashboard />
                  </AuthGuard>
                } 
              />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;