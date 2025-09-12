import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAccessibilityStore } from '@/stores/accessibilityStore';

export const Layout: React.FC = () => {
  const { theme } = useAccessibilityStore();

  return (
    <div className={`min-h-screen bg-neutral-50 dark:bg-neutral-900 ${theme}`}>
      <Header />
      <div className="flex">
        <Sidebar />
        <main 
          id="main-content"
          className="flex-1 p-6 ml-64 mt-16"
          role="main"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};