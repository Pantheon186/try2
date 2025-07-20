import React from 'react';
import { Play, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate?: (page: 'home' | 'login' | 'signup') => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const handleLoginClick = () => {
    if (onNavigate) {
      onNavigate('login');
    } else {
      // Scroll to features section
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleWatchExperience = () => {
    // In a real app, this would open a video modal
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
        {/* Fallback for browsers that don't support video */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900"></div>
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Glassmorphic Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 md:p-12 shadow-2xl">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Luxury
            <span className="block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              at Sea
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Your gateway to unforgettable journeys across oceans, skies, and cities. 
            Experience world-class luxury with personalized service.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleLoginClick}
              className="group bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={20} />
            </button>
            
            <button 
              onClick={handleWatchExperience}
              className="group text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <Play size={20} />
              Watch Experience
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">100K+</div>
              <div className="text-sm">Happy Travelers</div>
            </div>
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">25+</div>
              <div className="text-sm">Awards Won</div>
            </div>
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">4.9★</div>
              <div className="text-sm">Customer Rating</div>
            </div>
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">120+</div>
              <div className="text-sm">Global Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;