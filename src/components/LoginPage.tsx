import React, { useState } from 'react';
import { Eye, EyeOff, Mail, ArrowLeft, Anchor } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNotifications } from '../hooks/useNotifications';

interface LoginPageProps {
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
  onLoginSuccess: (role: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const { login } = useAuth();
  const { showLoginSuccess, showLoginError } = useNotifications();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Demo credentials
  const demoCredentials = [
    {
      role: 'Travel Agent',
      email: 'agent_demo@example.com',
      password: 'demo123',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      role: 'Basic Admin',
      email: 'admin_demo@example.com',
      password: 'admin123',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      role: 'Super Admin',
      email: 'superadmin_demo@example.com',
      password: 'super123',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle demo credential click
  const handleDemoCredentialClick = (email: string, password: string) => {
    setFormData({ email, password });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      showLoginError();
      return;
    }
    

    setLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Find the role for the logged-in user
        const matchedCredential = demoCredentials.find(
          cred => cred.email === formData.email
        );
        
        if (matchedCredential) {
          showLoginSuccess(matchedCredential.role);
          onLoginSuccess(matchedCredential.role);
        }
      } else {
        showLoginError();
      }
    } catch (error) {
      console.error('Login error:', error);
      showLoginError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source
          src="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Section - Welcome & Demo Credentials */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
          {/* Header with Logo and Back Button */}
          <div className="mb-12">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            {/* Company Logo and Name */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <Anchor className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-white font-bold text-2xl">Yorker Holidays</h1>
                <p className="text-white/70 text-sm">Services Pvt Ltd</p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Welcome Back to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Paradise
              </span>
            </h2>
            <p className="text-white/90 text-lg leading-relaxed max-w-lg">
              Sign in to access your Yorker Holidays dashboard and discover exclusive cruise deals at unbeatable prices.
            </p>
          </div>

          {/* Demo Credentials Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-md shadow-xl">
            <h3 className="text-white font-bold text-lg mb-4">Demo Credentials</h3>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => (
                <div
                  key={index}
                  onClick={() => handleDemoCredentialClick(cred.email, cred.password)}
                  className={`${cred.bgColor} ${cred.color} p-3 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 border border-white/20`}
                >
                  <div className="font-semibold text-sm mb-1">{cred.role}</div>
                  <div className="text-xs opacity-80">{cred.email}</div>
                  <div className="text-xs opacity-80">{cred.password}</div>
                </div>
              ))}
            </div>
            <p className="text-white/70 text-xs mt-4">
              Click on any credential above to auto-fill the login form
            </p>
          </div>
        </div>

        {/* Right Section - Sign In Form */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 w-full max-w-md shadow-2xl">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Sign In</h3>
              <p className="text-white/70">Access your cruise dashboard</p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-white/70 text-sm">
                New travel agent?{' '}
                <button
                  onClick={() => onNavigate('signup')}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Request Access
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;