import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const user = await login(email, password);
      const redirectPath = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/lessons';
      navigate(redirectPath);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleDemoLogin = async (demoEmail: string, role: string) => {
    setError('');
    setDemoLoading(role);
    
    try {
      const user = await login(demoEmail, 'password123');
      const redirectPath = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/lessons';
      navigate(redirectPath);
    } catch (err) {
      setError('Demo login failed');
      console.error('Demo login error:', err);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Quick Demo Login:</h3>
          <div className="space-y-3">
            <button 
              onClick={() => handleDemoLogin('student@demo.com', 'student')}
              disabled={demoLoading !== null}
              className="w-full flex justify-between items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors disabled:opacity-50"
            >
              <span className="text-blue-800 font-medium">👨‍🎓 Student Account</span>
              {demoLoading === 'student' ? (
                <span className="text-blue-600">Loading...</span>
              ) : (
                <span className="text-blue-600">→</span>
              )}
            </button>
            
            <button 
              onClick={() => handleDemoLogin('teacher@demo.com', 'teacher')}
              disabled={demoLoading !== null}
              className="w-full flex justify-between items-center px-3 py-2 bg-green-100 hover:bg-green-200 rounded-md transition-colors disabled:opacity-50"
            >
              <span className="text-green-800 font-medium">👩‍🏫 Teacher Account</span>
              {demoLoading === 'teacher' ? (
                <span className="text-green-600">Loading...</span>
              ) : (
                <span className="text-green-600">→</span>
              )}
            </button>
            
            <button 
              onClick={() => handleDemoLogin('admin@demo.com', 'admin')}
              disabled={demoLoading !== null}
              className="w-full flex justify-between items-center px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors disabled:opacity-50"
            >
              <span className="text-purple-800 font-medium">👨‍💼 Admin Account</span>
              {demoLoading === 'admin' ? (
                <span className="text-purple-600">Loading...</span>
              ) : (
                <span className="text-purple-600">→</span>
              )}
            </button>
            
            <p className="text-xs text-blue-600 text-center mt-2">All accounts use password: password123</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <div className="text-center text-gray-500 text-sm">
          <span>Or sign in manually:</span>
        </div>
        
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;