import React from 'react';
import { Anchor } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const handleAboutClick = () => {
    // Scroll to performance section
    const performanceSection = document.querySelector('[data-section="performance"]');
    if (performanceSection) {
      performanceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Company Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
            <Anchor className="text-white" size={24} />
          </div>
          <span className="text-white font-bold text-xl hidden sm:block">Yorker Holidays</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <button 
            onClick={handleAboutClick}
            className="text-white/90 hover:text-white transition-colors duration-200 font-medium hidden md:block"
          >
            About Us
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="text-white/90 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10"
          >
            Login
          </button>
          <button 
            onClick={() => onNavigate('signup')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg"
          >
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;