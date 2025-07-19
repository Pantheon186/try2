import React, { useState } from 'react';
import { Button } from 'antd';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import SearchSection from './SearchSection';
import CruiseCard from './CruiseCard';
import CruiseModal from './CruiseModal';
import AgentPortal from './AgentPortal';
import HotelDashboard from './HotelDashboard';
import BasicAdminDashboard from './BasicAdminDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import { cruises, destinations, cruiseLines, shipTypes, months } from '../data/cruises';
import type { Cruise } from '../data/cruises';
import { useBookings } from '../hooks/useBookings';
import { useNotifications } from '../hooks/useNotifications';
import { CruiseService } from '../services/mockDataService';

interface DashboardProps {
  userRole: string;
  onLogout: () => void;
}

interface SearchFilters {
  searchText: string;
  destination: string;
  cruiseLine: string;
  shipType: string;
  month: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  const { bookings, cancelBooking } = useBookings();
  const { showCancellationSuccess, showError } = useNotifications();
  
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Active section state
  const [activeSection, setActiveSection] = useState('Cruises');
  
  // Loading states
  const [loading, setLoading] = useState(false);
  
  // Cruise data state
  const [cruiseData, setCruiseData] = useState(cruises);
  
  // Search filters state
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchText: '',
    destination: destinations[0],
    cruiseLine: cruiseLines[0],
    shipType: shipTypes[0],
    month: months[0]
  });

  // Modal state
  const [selectedCruise, setSelectedCruise] = useState<Cruise | null>(null);

  // Profile view state
  const [showProfile, setShowProfile] = useState(false);

  // Hotel dashboard state
  const [showHotelDashboard, setShowHotelDashboard] = useState(false);

  // Admin dashboard states
  const [showBasicAdminDashboard, setShowBasicAdminDashboard] = useState(false);
  const [showSuperAdminDashboard, setShowSuperAdminDashboard] = useState(false);

  // Filter cruises based on search criteria
  const filteredCruises = cruiseData.filter(cruise => {
    const matchesSearch = cruise.name.toLowerCase().includes(searchFilters.searchText.toLowerCase()) ||
                         cruise.description.toLowerCase().includes(searchFilters.searchText.toLowerCase());
    
    const matchesDestination = searchFilters.destination === 'All Destinations' || 
                              cruise.to === searchFilters.destination || 
                              cruise.from === searchFilters.destination;
    
    const matchesCruiseLine = searchFilters.cruiseLine === 'All Cruise Lines' || 
                             cruise.cruiseLine === searchFilters.cruiseLine;
    
    const matchesShipType = searchFilters.shipType === 'All Ship Types' || 
                           cruise.shipType === searchFilters.shipType;

    return matchesSearch && matchesDestination && matchesCruiseLine && matchesShipType;
  });

  // Handle cruise card actions
  const handleViewDetails = (cruise: Cruise) => {
    setSelectedCruise(cruise);
  };

  const handleCancelBooking = async (bookingId: string) => {
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
  };

  // Handle successful booking
  const handleBookingSuccess = () => {
    // Booking success is handled by the modal component and notifications hook
    // No additional action needed here
  };

  const handleCloseModal = () => {
    setSelectedCruise(null);
  };

  // Handle profile view
  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleBackFromProfile = () => {
    setShowProfile(false);
  };

  // Handle hotel dashboard navigation
  const handleShowHotelDashboard = () => {
    setShowHotelDashboard(true);
  };

  const handleBackFromHotelDashboard = () => {
    setShowHotelDashboard(false);
  };

  // Handle admin dashboard navigation
  const handleShowBasicAdminDashboard = () => {
    setShowBasicAdminDashboard(true);
  };

  const handleBackFromBasicAdminDashboard = () => {
    setShowBasicAdminDashboard(false);
  };

  const handleShowSuperAdminDashboard = () => {
    setShowSuperAdminDashboard(true);
  };

  const handleBackFromSuperAdminDashboard = () => {
    setShowSuperAdminDashboard(false);
  };

  // Handle section navigation
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === 'Hotels') {
      setShowHotelDashboard(true);
    } else {
      setShowHotelDashboard(false);
    }
  };

  // If showing profile, render AgentPortal
  if (showProfile) {
    return (
      <AgentPortal 
        userRole={userRole}
        onLogout={onLogout}
        onBack={handleBackFromProfile}
      />
    );
  }

  // If showing hotel dashboard, render HotelDashboard
  if (showHotelDashboard) {
    return (
      <HotelDashboard 
        userRole={userRole}
        onLogout={onLogout}
        onBackToCruise={handleBackFromHotelDashboard}
      />
    );
  }

  // If showing basic admin dashboard, render BasicAdminDashboard
  if (showBasicAdminDashboard) {
    return (
      <BasicAdminDashboard 
        userRole={userRole}
        onLogout={onLogout}
        onBack={handleBackFromBasicAdminDashboard}
      />
    );
  }

  // If showing super admin dashboard, render SuperAdminDashboard
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
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
        onLogout={onLogout}
        onViewProfile={handleViewProfile}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
        {/* Top Navigation */}
        <TopNavbar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {userRole === 'Travel Agent' ? 'Agent' : userRole}!
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

          {/* Search Section */}
          <SearchSection 
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
          />

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCruises.length} of {cruiseData.length} cruises
              {bookings.length > 0 && (
                <span className="ml-4 text-blue-600">
                  • {bookings.length} active booking{bookings.length !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>

          {/* Cruise Cards Grid */}
          <div className="space-y-6">
            {filteredCruises.map((cruise) => (
              const userBooking = bookings.find(booking => 
                booking.itemId === cruise.id && booking.status !== 'Cancelled'
              );
              
              <CruiseCard
                key={cruise.id}
                cruise={cruise}
                onViewDetails={handleViewDetails}
                onCancel={() => userBooking && handleCancelBooking(userBooking.id)}
                isBooked={!!userBooking}
                loading={loading}
              />
            ))}
          </div>

          {/* No Results Message */}
          {filteredCruises.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No cruises found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters to find more results.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Cruise Details Modal */}
      {selectedCruise && (
        <CruiseModal
          cruise={selectedCruise}
          onClose={handleCloseModal}
          onBookingSuccess={handleBookingSuccess}
          isBooked={!!bookings.find(booking => 
            booking.itemId === selectedCruise.id && booking.status !== 'Cancelled'
          )}
        />
      )}
    </div>
  );
};

export default Dashboard;