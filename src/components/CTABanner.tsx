import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

const CTABanner: React.FC = () => {
  const handleStartExploring = () => {
    // Scroll to top to access login
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDestinations = () => {
    // Scroll to carousel section
    const carouselSection = document.querySelector('[data-section="carousel"]');
    if (carouselSection) {
      carouselSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg"
          alt="Luxury cruise at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-teal-900/90"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-teal-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Decorative Icons */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-blue-300 animate-bounce">
            <Compass size={32} />
          </div>
          <div className="text-teal-300 animate-bounce delay-200">
            <Sparkles size={32} />
          </div>
          <div className="text-purple-300 animate-bounce delay-400">
            <Compass size={32} />
          </div>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Let's Start Your
          <span className="block bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 bg-clip-text text-transparent">
            Dream Journey
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Ready to embark on an unforgettable adventure? Discover luxury cruises, premium flights, 
          and exclusive destinations tailored just for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button
            onClick={handleStartExploring}
            className="group bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-blue-600 hover:via-teal-600 hover:to-purple-600 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 flex items-center gap-3"
          >
            Start Exploring
            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
          </button>
          
          <button 
            onClick={handleViewDestinations}
            className="group text-white border-2 border-white/40 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
          >
            View Destinations
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1">Instant</div>
            <div className="text-white/80 text-sm">Booking Confirmation</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1">24/7</div>
            <div className="text-white/80 text-sm">Customer Support</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1">Best Price</div>
            <div className="text-white/80 text-sm">Guarantee</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl font-bold text-white mb-1">Secure</div>
            <div className="text-white/80 text-sm">Payment Gateway</div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 fill-white"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
        </svg>
      </div>
    </section>
  );
};

export default CTABanner;