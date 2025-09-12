import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import './lib/i18n';

// Initialize axe-core for accessibility testing in development
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  }).catch(() => {
    // Silently fail if axe-core is not available
  });
}

// Create a client with accessibility-focused defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 409, 429
        if (error?.status >= 400 && error?.status < 500) {
          return [408, 409, 429].includes(error.status) && failureCount < 3;
        }
        return failureCount < 3;
      },
    },
  },
});

// Global error boundary for query errors
queryClient.getQueryCache().config.onError = (error, query) => {
  console.error('Query error:', error, query);
  // Could send to error reporting service here
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 6000,
          style: {
            background: 'var(--toast-bg, #363636)',
            color: 'var(--toast-color, #fff)',
            fontSize: '16px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
        containerStyle={{
          top: 80,
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);