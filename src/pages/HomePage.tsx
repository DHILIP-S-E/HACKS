import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Users, Award, Accessibility } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const features = [
    {
      icon: BookOpen,
      title: 'Adaptive Learning',
      description: 'Personalized content that adapts to different learning styles and disabilities.',
    },
    {
      icon: Accessibility,
      title: 'Accessibility First',
      description: 'Built-in TTS, STT, high contrast, dyslexic fonts, and more accessibility features.',
    },
    {
      icon: Users,
      title: 'Collaborative',
      description: 'Teachers, students, and parents working together for better learning outcomes.',
    },
    {
      icon: Award,
      title: 'Gamified Progress',
      description: 'Badges, achievements, and progress tracking to motivate and engage learners.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AL</span>
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Assistive Learning
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-outline">
                    {t('auth.login')}
                  </Link>
                  <Link to="/register" className="btn-primary">
                    {t('auth.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Learning Made
              <span className="text-primary-500"> Accessible</span>
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto">
              An inclusive educational platform designed specifically for students with learning disabilities.
              Adaptive content, accessibility tools, and collaborative features for better learning outcomes.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-outline text-lg px-8 py-3">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Powerful Features for Inclusive Learning
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Everything you need to create an accessible and engaging learning environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Ready to Transform Learning?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
            Join thousands of students, teachers, and families creating inclusive learning experiences.
          </p>
          
          {!user && (
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Start Your Journey Today
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AL</span>
              </div>
              <span className="text-xl font-bold">Assistive Learning</span>
            </div>
            
            <div className="text-neutral-400">
              <p>&copy; 2024 Assistive Learning Platform. Built with accessibility in mind.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;