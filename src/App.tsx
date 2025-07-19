import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './hooks/useAuth';
import NotificationCenter from './components/NotificationCenter';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CarouselSection from './components/CarouselSection';
import PerformanceSection from './components/PerformanceSection';
import CTABanner from './components/CTABanner';
import FloatingHelp from './components/FloatingHelp';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ServiceStatus from './components/common/ServiceStatus';
import { DataSeeder } from './services/dataSeeder';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'dashboard'>('home');
  const [userRole, setUserRole] = useState<string>('');
  const [dataSeeded, setDataSeeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Seed data on first load
  useEffect(() => {
    const seedData = async () => {
      if (!dataSeeded) {
        try {
          setIsLoading(true);
          console.log('🌱 Initializing application data...');
          await DataSeeder.seedAllData();
          setDataSeeded(true);
          console.log('✅ Application data initialized successfully!');
        } catch (error) {
          console.error('❌ Failed to initialize data:', error);
          // Continue without seeding - app should still work
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    seedData();
  }, [dataSeeded]);

  // Handle navigation
  const handleNavigation = (page: 'home' | 'login' | 'signup' | 'dashboard') => {
    setCurrentPage(page);
  };

  // Handle successful login
  const handleLoginSuccess = (role: string) => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setUserRole('');
      setCurrentPage('home');
    }
  };

  // Show loading screen during initialization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Initializing Yorke Holidays CRM</h2>
          <p className="text-gray-600">Setting up your travel management system...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        {/* Notification Center */}
        <NotificationCenter />
        
        {/* Service Status Indicator */}
        <ServiceStatus />
        
        {/* Render current page */}
        {currentPage === 'login' && (
          <LoginPage onNavigate={handleNavigation} onLoginSuccess={handleLoginSuccess} />
        )}

        {currentPage === 'signup' && (
          <SignUpPage onNavigate={handleNavigation} />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard userRole={userRole} onLogout={handleLogout} />
        )}

        {currentPage === 'home' && (
          <div className="min-h-screen">
            {/* Fixed Header */}
            <Header onNavigate={handleNavigation} />

            {/* Main Content */}
            <main>
              {/* Hero Section with Background Video */}
              <HeroSection onNavigate={handleNavigation} />

              {/* Services Carousel */}
              <CarouselSection />

              {/* Performance & Awards Section */}
              <PerformanceSection />

              {/* CTA Banner */}
              <CTABanner />
            </main>

            {/* Floating Help Widget */}
            <FloatingHelp />

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Company Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold">Yorke Holidays</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Your gateway to unforgettable luxury travel experiences across the globe. 
                      Discover the world in comfort and style.
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">About Us</button></li>
                      <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Destinations</button></li>
                      <li><button onClick={() => handleNavigation('login')} className="hover:text-white transition-colors">Cruise Lines</button></li>
                      <li><button onClick={() => handleNavigation('login')} className="hover:text-white transition-colors">Special Offers</button></li>
                    </ul>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="font-semibold mb-4">Services</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><button onClick={() => handleNavigation('login')} className="hover:text-white transition-colors">Luxury Cruises</button></li>
                      <li><button onClick={() => handleNavigation('login')} className="hover:text-white transition-colors">Premium Flights</button></li>
                      <li><button onClick={() => handleNavigation('login')} className="hover:text-white transition-colors">5-Star Hotels</button></li>
                      <li><button onClick={() => handleNavigation('login')} className="hover:text-white transition-colors">Holiday Packages</button></li>
                    </ul>
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="font-semibold mb-4">Contact</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="mailto:support@yorkeholidays.com" className="hover:text-white transition-colors">📧 support@yorkeholidays.com</a></li>
                      <li><a href="tel:+919876543210" className="hover:text-white transition-colors">📞 +91 98765 43210</a></li>
                      <li>📍 123 Holiday Street, Mumbai, India</li>
                      <li>🕒 24/7 Customer Support</li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400 text-sm">© 2024 Yorke Holidays. All rights reserved.</p>
                  <div className="flex gap-4 mt-4 md:mt-0">
                    <button onClick={() => alert('Privacy Policy would be displayed here')} className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</button>
                    <button onClick={() => alert('Terms of Service would be displayed here')} className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</button>
                    <button onClick={() => alert('Cookie Policy would be displayed here')} className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        )}
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;