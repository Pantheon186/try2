import React, { useState } from 'react';
import HotelSidebar from './HotelSidebar';
import TopNavbar from '../common/TopNavbar';
import HotelSearchSection from '../listings/hotels/HotelSearchSection';
import HotelCard from '../listings/hotels/HotelCard';
import HotelModal from '../listings/hotels/HotelModal';
import AgentPortal from './AgentPortal';
import { hotels, cities, hotelChains, months } from '../data/hotels';
import type { Hotel } from '../data/hotels';

interface HotelDashboardProps {
  userRole: string;
  onLogout: () => void;
  onBackToCruise: () => void;
}

interface HotelSearchFilters {
  searchText: string;
  city: string;
  checkInMonth: string;
  numberOfNights: number;
  hotelChain: string;
  maxPrice: number;
  starRating: number;
}

const HotelDashboard: React.FC<HotelDashboardProps> = ({ userRole, onLogout, onBackToCruise }) => {
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Active section state
  const [activeSection, setActiveSection] = useState('Hotels');
  
  // Search filters state
  const [searchFilters, setSearchFilters] = useState<HotelSearchFilters>({
    searchText: '',
    city: cities,
    checkInMonth: months,
    numberOfNights: 2,
    hotelChain: hotelChains,
    maxPrice: 50000,
    starRating: 0
  });

  // Modal state
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Profile view state
  const [showProfile, setShowProfile] = useState(false);

  // Filter hotels based on search criteria
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchFilters.searchText.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchFilters.searchText.toLowerCase()) ||
                         hotel.description.toLowerCase().includes(searchFilters.searchText.toLowerCase());
    
    const matchesCity = searchFilters.city === 'All Cities' || 
                       hotel.location.toLowerCase().includes(searchFilters.city.toLowerCase());
    
    const matchesChain = searchFilters.hotelChain === 'All Chains' || 
                        hotel.hotelChain === searchFilters.hotelChain;
    
    const matchesPrice = hotel.pricePerNight <= searchFilters.maxPrice;
    
    const matchesStarRating = searchFilters.starRating === 0 || hotel.starRating >= searchFilters.starRating;

    return matchesSearch && matchesCity && matchesChain && matchesPrice && matchesStarRating;
  });

  // Handle hotel card actions
  const handleViewDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel);
  };

  const handleBookmarkHotel = async (hotelId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Hotel bookmarked successfully!');
    } catch (error) {
      alert('Failed to bookmark hotel. Please try again.');
    }
  };

  // Handle successful booking
  const handleBookingSuccess = (hotelId: string) => {
    alert('Hotel booking confirmed successfully!');
  };

  const handleCloseModal = () => {
    setSelectedHotel(null);
  };

  // Handle profile view
  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleBackFromProfile = () => {
    setShowProfile(false);
  };

  // Handle section navigation
  const handleSectionChange = (section: string) => {
    if (section === 'Dashboard') {
      onBackToCruise();
    } else {
      setActiveSection(section);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Sidebar */}
      <HotelSidebar 
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
              Hotel Booking Dashboard
            </h1>
            <p className="text-gray-600">
              Discover and book luxury hotels worldwide with exclusive deals
            </p>
          </div>

          {/* Search Section */}
          <HotelSearchSection 
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
          />

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredHotels.length} of {hotels.length} hotels
            </p>
          </div>

          {/* Hotel Cards Grid */}
          <div className="space-y-6">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onViewDetails={handleViewDetails}
                onBookmark={handleBookmarkHotel}
              />
            ))}
          </div>

          {/* No Results Message */}
          {filteredHotels.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No hotels found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters to find more results.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Hotel Details Modal */}
      {selectedHotel && (
        <HotelModal
          hotel={selectedHotel}
          onClose={handleCloseModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default HotelDashboard;