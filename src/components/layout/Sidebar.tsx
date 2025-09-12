import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  BookOpen, 
  User, 
  Settings, 
  Users, 
  PlusCircle,
  BarChart3,
  Award,
  FileText
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const getNavItems = () => {
    const commonItems = [
      { to: '/dashboard', icon: Home, label: t('nav.dashboard') },
      { to: '/profile', icon: User, label: t('nav.profile') },
      { to: '/settings', icon: Settings, label: t('nav.settings') },
    ];

    const studentItems = [
      { to: '/lessons', icon: BookOpen, label: t('nav.lessons') },
      { to: '/progress', icon: BarChart3, label: 'Progress' },
      { to: '/achievements', icon: Award, label: 'Achievements' },
    ];

    const teacherItems = [
      { to: '/teacher', icon: FileText, label: 'Teacher Dashboard' },
      { to: '/teacher/lessons/create', icon: PlusCircle, label: 'Create Lesson' },
      { to: '/teacher/students', icon: Users, label: 'Students' },
    ];

    const adminItems = [
      { to: '/admin', icon: Settings, label: 'Admin Dashboard' },
      { to: '/admin/users', icon: Users, label: 'Manage Users' },
    ];

    let items = [...commonItems];

    if (user?.role === 'student') {
      items = [...studentItems, ...items];
    } else if (user?.role === 'teacher') {
      items = [...teacherItems, ...items];
    } else if (user?.role === 'admin') {
      items = [...adminItems, ...items];
    }

    return items;
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto">
      <nav className="p-4 space-y-2" role="navigation" aria-label="Main navigation">
        {getNavItems().map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};