import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Shield, Crown, User } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

const LoginRouter: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Determine user type from URL
  const getUserType = () => {
    if (location.pathname.includes('super-admin')) return 'super_admin';
    if (location.pathname.includes('admin')) return 'admin';
    return 'user';
  };

  const userType = getUserType();

  const getLoginConfig = () => {
    switch (userType) {
      case 'super_admin':
        return {
          title: 'Super Admin Login',
          subtitle: 'Full system access and management',
          icon: Crown,
          loginUrl: '/api/users/super-admin-login',
          redirectUrl: '/super-admin',
          color: 'purple'
        };
      case 'admin':
        return {
          title: 'Admin Login',
          subtitle: 'Company management and quote access',
          icon: Shield,
          loginUrl: '/api/users/admin-login',
          redirectUrl: '/admin/dashboard',
          color: 'blue'
        };
      default:
        return {
          title: 'User Login',
          subtitle: 'Access your quotations',
          icon: User,
          loginUrl: '/api/users/login',
          redirectUrl: '/',
          color: 'gray'
        };
    }
  };

  const config = getLoginConfig();
  const Icon = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(config.loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data and token
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('userType', userType);

      // Redirect based on user type
      navigate(config.redirectUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`mx-auto h-12 w-12 rounded-full bg-${config.color}-100 flex items-center justify-center`}>
            <Icon className={`h-6 w-6 text-${config.color}-600`} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {config.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {config.subtitle}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-${config.color}-600 hover:bg-${config.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${config.color}-500 disabled:bg-gray-400`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <a href="/" className="text-sm text-blue-600 hover:text-blue-500">
              Back to main page
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRouter;
