import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from 'antd';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import SearchSection from './SearchSection';
import CruiseCard from './CruiseCard';
import CruiseModal from './CruiseModal';
import LoadingSpinner from './common/LoadingSpinner';
import ReviewSystem from './ReviewSystem';
import AgentPortal from './AgentPortal';
import HotelDashboard from './HotelDashboard';
import BasicAdminDashboard from './BasicAdminDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import { MockDataService } from '../services/MockDataService';
import { config } from '../config/environment';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { useNotifications } from '../hooks/useNotifications';
import { Cruise } from '../types';
import { DashboardProps } from '../types';
import { Validator } from '../utils/validation';

const Dashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  const { bookings, cancelBooking, loading: bookingsLoading, error: bookingsError } = useBookings();
  const { showCancellationSuccess, showError } = useNotifications();
  const { user } = useAuth();
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('Cruises');
  const [loading, setLoading] = useState(false);
  const [cruisesLoading, setCruisesLoading] = useState(true);
  
  // Data State
  const [cruiseData, setCruiseData] = useState<Cruise[]>([]);
  
  // Search State
  const [searchFilters, setSearchFilters] = useState({
    searchText: '',
    destination: 'All Destinations',
    cruiseLine: 'All Cruise Lines',
    shipType: 'All Ship Types',
    month: 'All Months'
  });

  // Modal State
  const [selectedCruise, setSelectedCruise] = useState<Cruise | null>(null);
  const [showReviews, setShowReviews] = useState(false);

  // Navigation State
  const [showProfile, setShowProfile] = useState(false);
  const [showHotelDashboard, setShowHotelDashboard] = useState(false);
  const [showBasicAdminDashboard, setShowBasicAdminDashboard] = useState(false);
  const [showSuperAdminDashboard, setShowSuperAdminDashboard] = useState(false);

  // Load cruises
  const loadCruises = useCallback(async () => {
    try {
      setCruisesLoading(true);
      
      // Use MockDataService for cruises
      const cruises = await MockDataService.getAllCruises();
      setCruiseData(cruises);
      
    } catch (error) {
      console.error('Failed to load cruises:', error);
      showError('Loading Error', 'Failed to load cruise data. Please refresh the page.');
      setCruiseData([]);
    } finally {
      setCruisesLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadCruises();
  }, [loadCruises]);

  // Filter cruises with validation
  const filteredCruises = useMemo(() => {
    return cruiseData.filter(cruise => {
      const searchText = Validator.sanitizeString(searchFilters.searchText);
      
      const matchesSearch = !searchText || 
                           cruise.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           cruise.description.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesDestination = searchFilters.destination === 'All Destinations' ||
                                 cruise.from === searchFilters.destination ||
                                 cruise.to === searchFilters.destination;
      
      const matchesCruiseLine = searchFilters.cruiseLine === 'All Cruise Lines' ||
                               cruise.cruiseLine === searchFilters.cruiseLine;
      
      const matchesShipType = searchFilters.shipType === 'All Ship Types' ||
                             cruise.shipType === searchFilters.shipType;

      return matchesSearch && matchesDestination && matchesCruiseLine && matchesShipType;
    });
  }, [cruiseData, searchFilters]);

  // Event Handlers
  const handleViewDetails = useCallback((cruise: Cruise) => {
    setSelectedCruise(cruise);
  }, []);

  const handleCancelBooking = useCallback(async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setLoading(true);
    try {
      const success = await cancelBooking(bookingId);
      
      if (success) {
        showCancellationSuccess(bookingId);
      } else {
        showError('Cancellation Failed', 'Unable to cancel booking. Please try again.');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      showError('Cancellation Failed', 'Unable to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [cancelBooking, showCancellationSuccess, showError]);

  const handleBookingSuccess = useCallback(() => {
    // Booking success is handled by the modal component and notifications hook
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCruise(null);
    setShowReviews(false);
  }, []);

  // Navigation Handlers
  const handleViewProfile = useCallback(() => {
    setShowProfile(true);
  }, []);

  const handleBackFromProfile = useCallback(() => {
    setShowProfile(false);
  }, []);

  const handleShowHotelDashboard = useCallback(() => {
    setShowHotelDashboard(true);
  }, []);

  const handleBackFromHotelDashboard = useCallback(() => {
    setShowHotelDashboard(false);
  }, []);

  const handleShowBasicAdminDashboard = useCallback(() => {
    setShowBasicAdminDashboard(true);
  }, []);

  const handleBackFromBasicAdminDashboard = useCallback(() => {
    setShowBasicAdminDashboard(false);
  }, []);

  const handleShowSuperAdminDashboard = useCallback(() => {
    setShowSuperAdminDashboard(true);
  }, []);

  const handleBackFromSuperAdminDashboard = useCallback(() => {
    setShowSuperAdminDashboard(false);
  }, []);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    if (section === 'Hotels') {
      setShowHotelDashboard(true);
    } else {
      setShowHotelDashboard(false);
    }
  }, []);

  // Handle search filters change with validation
  const handleFiltersChange = useCallback((filters: typeof searchFilters) => {
    const sanitizedFilters = {
      ...filters,
      searchText: Validator.sanitizeString(filters.searchText)
    };
    setSearchFilters(sanitizedFilters);
  }, []);

  // Conditional Rendering
  if (showProfile) {
    return (
      <AgentPortal 
        userRole={userRole}
        onLogout={onLogout}
        onBack={handleBackFromProfile}
      />
    );
  }

  if (showHotelDashboard) {
    return (
      <HotelDashboard 
        userRole={userRole}
        onLogout={onLogout}
        onBackToCruise={handleBackFromHotelDashboard}
      />
    );
  }

  if (showBasicAdminDashboard) {
    return (
      <BasicAdminDashboard 
        userRole={userRole}
        onLogout={onLogout}
        onBack={handleBackFromBasicAdminDashboard}
      />
    );
  }

  if (showSuperAdminDashboard) {
    return (
      <SuperAdminDashboard 
        userRole={userRole}
        onLogout={onLogout}
        onBack={handleBackFromSuperAdminDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
        onLogout={onLogout}
        onViewProfile={handleViewProfile}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
        <TopNavbar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        <main className="p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name || userRole}!
            </h1>
            <p className="text-gray-600">
              {userRole === 'Travel Agent' 
                ? 'Manage your bookings and discover new destinations'
                : userRole === 'Basic Admin'
                ? 'Oversee your team and manage regional operations'
                : 'Control the entire CRM system and monitor performance'
              }
            </p>
            
            {/* Role-specific quick actions */}
            {userRole === 'Basic Admin' && (
              <div className="mt-4">
                <Button 
                  type="primary" 
                  onClick={handleShowBasicAdminDashboard}
                  className="mr-4"
                >
                  Open Admin Dashboard
                </Button>
              </div>
            )}
            
            {userRole === 'Super Admin' && (
              <div className="mt-4">
                <Button 
                  type="primary" 
                  onClick={handleShowSuperAdminDashboard}
                  className="mr-4"
                >
                  Open Super Admin Dashboard
                </Button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {bookingsError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">Error loading bookings: {bookingsError}</p>
            </div>
          )}

          <SearchSection 
            filters={searchFilters}
            onFiltersChange={handleFiltersChange}
            loading={cruisesLoading}
          />

          {/* Results Summary */}
          <div className="mb-6">
            {cruisesLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="small" />
                <span className="text-gray-600">Loading cruises...</span>
              </div>
            ) : (
              <p className="text-gray-600">
                Showing {filteredCruises.length} of {cruiseData.length} cruises
                {bookings.length > 0 && (
                  <span className="ml-4 text-blue-600">
                    • {bookings.length} active booking{bookings.length !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Content */}
          {cruisesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" text="Loading cruise data..." />
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {filteredCruises.map((cruise) => {
                  const userBooking = bookings.find(booking => 
                    booking.itemId === cruise.id && booking.status !== 'Cancelled'
                  );
                  
                  return (
                    <CruiseCard
                      key={cruise.id}
                      cruise={cruise}
                      onViewDetails={handleViewDetails}
                      onCancel={handleCancelBooking}
                      isBooked={!!userBooking}
                      loading={loading || bookingsLoading}
                    />
                  );
                })}
              </div>

              {filteredCruises.length === 0 && cruiseData.length > 0 && (
                <div className="text-center py-12">
                  <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No cruises found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search filters to find more results.
                    </p>
                  </div>
                </div>
              )}

              {cruiseData.length === 0 && !cruisesLoading && (
                <div className="text-center py-12">
                  <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to load cruises</h3>
                    <p className="text-gray-600 mb-4">
                      There was an error loading cruise data. Please try again.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Refresh Page
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Reviews Section */}
          {selectedCruise && showReviews && (
            <div className="mt-8">
              <ReviewSystem
                itemType="Cruise"
                itemId={selectedCruise.id}
                itemName={selectedCruise.name}
                canAddReview={true}
              />
            </div>
          )}

          {(loading || bookingsLoading) && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/30 p-6 shadow-2xl">
                <LoadingSpinner size="medium" text="Processing..." />
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedCruise && (
        <CruiseModal
          cruise={selectedCruise}
          onClose={handleCloseModal}
          onBookingSuccess={handleBookingSuccess}
          onShowReviews={() => setShowReviews(true)}
          isBooked={!!bookings.find(booking => 
            booking.itemId === selectedCruise.id && booking.status !== 'Cancelled'
          )}
        />
      )}
    </div>
  );
};

export default React.memo(Dashboard);