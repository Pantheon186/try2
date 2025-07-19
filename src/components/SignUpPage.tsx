import React, { useState } from 'react';
import { Eye, EyeOff, Mail, User, Phone, Building, ArrowLeft, Anchor, CheckCircle } from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'success'>('form');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    role: 'Travel Agent',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // Handle form input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation
    if (!formData.fullName.trim()) {
      alert('Please enter your full name.');
      return;
    }
    
    if (!formData.email.trim()) {
      alert('Please enter your email address.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    if (!formData.phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }
    
    if (!formData.company.trim()) {
      alert('Please enter your company name.');
      return;
    }
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    // Show success message
    setCurrentStep('success');
  };

  // Success screen
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 relative overflow-hidden flex items-center justify-center">
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

        {/* Success Content */}
        <div className="relative z-10 text-center px-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-12 max-w-md mx-auto shadow-2xl">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-white" size={40} />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Request Submitted!</h2>
            <p className="text-white/90 mb-6 leading-relaxed">
              Thank you for your interest in joining Yorker Holidays! Your access request has been submitted successfully.
            </p>
            <p className="text-white/70 text-sm mb-8">
              Our team will review your application and contact you within 24-48 hours with further instructions.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('login')}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg"
              >
                Go to Login
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="w-full text-white border border-white/30 py-3 px-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Left Section - Welcome Message */}
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
              Join Our{' '}
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Travel Family
              </span>
            </h2>
            <p className="text-white/90 text-lg leading-relaxed max-w-lg">
              Request access to become a travel agent with Yorker Holidays and start offering exclusive cruise deals to your clients.
            </p>
          </div>

          {/* Benefits List */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-md shadow-xl">
            <h3 className="text-white font-bold text-lg mb-4">Why Join Us?</h3>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Exclusive cruise deals and packages</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                <span className="text-sm">Competitive commission structure</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">24/7 support and training</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm">Advanced booking management tools</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 w-full max-w-md shadow-2xl">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Request Access</h3>
              <p className="text-white/70">Join our travel agent network</p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Phone */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Company/Agency
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your company name"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Requested Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="Travel Agent" className="bg-gray-800">Travel Agent</option>
                  <option value="Basic Admin" className="bg-gray-800">Basic Admin</option>
                </select>
              </div>

              {/* Password */}
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
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-500 bg-white/20 border-white/30 rounded focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-white/90 text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Submit Request
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-white/70 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;