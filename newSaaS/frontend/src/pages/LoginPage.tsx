import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setLocalError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2">CODShop</h1>
          <p className="text-center text-gray-600 mb-8">E-commerce SaaS Platform</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error || localError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
