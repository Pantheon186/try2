import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import ServiceStatus from './components/common/ServiceStatus';
import NotificationCenter from './components/NotificationCenter';
import FloatingHelp from './components/FloatingHelp';
import { ThemeProvider } from './components/enhanced/ThemeProvider';
import { SecurityProvider } from './components/enhanced/SecurityProvider';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CarouselSection from './components/CarouselSection';
import PerformanceSection from './components/PerformanceSection';
import CTABanner from './components/CTABanner';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import AdvancedDashboard from './components/enhanced/AdvancedDashboard';
import { AuthProvider } from './hooks/useAuth';
import { config } from './config/environment';

type Page = 'home' | 'login' | 'signup';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [useAdvancedDashboard, setUseAdvancedDashboard] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    const authToken = localStorage.getItem('auth_token');
    
    if (userData && authToken) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserRole(user.role);
        // Enable advanced dashboard for Super Admins by default
        setUseAdvancedDashboard(user.role === 'Super Admin');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentPage('home');
    // Enable advanced dashboard for Super Admins
    setUseAdvancedDashboard(role === 'Super Admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setCurrentPage('home');
    setUseAdvancedDashboard(false);
    
    // Clear stored data
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
  };

  const toggleDashboardMode = () => {
    setUseAdvancedDashboard(!useAdvancedDashboard);
  };

  // If user is logged in, show dashboard
  if (isLoggedIn) {
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <SecurityProvider>
              <div className="min-h-screen">
                {useAdvancedDashboard ? (
                  <AdvancedDashboard userRole={userRole} onLogout={handleLogout} />
                ) : (
                  <Dashboard userRole={userRole} onLogout={handleLogout} />
                )}
                
                {/* Global Components */}
                <NotificationCenter />
                <FloatingHelp />
                <ServiceStatus />
                
                {/* Dashboard Mode Toggle (for Super Admins) */}
                {userRole === 'Super Admin' && (
                  <button
                    onClick={toggleDashboardMode}
                    className="fixed bottom-20 right-20 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium z-40"
                  >
                    {useAdvancedDashboard ? 'Standard View' : 'Advanced View'}
                  </button>
                )}
              </div>
            </SecurityProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  // Landing page and authentication flows
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SecurityProvider>
            <div className="min-h-screen">
              {currentPage === 'home' && (
                <>
                  <Header onNavigate={handleNavigate} />
                  <HeroSection onNavigate={handleNavigate} />
                  <CarouselSection />
                  <PerformanceSection />
                  <CTABanner />
                  <FloatingHelp />
                </>
              )}
              
              {currentPage === 'login' && (
                <LoginPage 
                  onNavigate={handleNavigate} 
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
              
              {currentPage === 'signup' && (
                <SignUpPage onNavigate={handleNavigate} />
              )}
              
              <ServiceStatus />
            </div>
          </SecurityProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;