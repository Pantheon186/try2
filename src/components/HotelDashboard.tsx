import React, { useState, useEffect } from 'react';
import HotelSidebar from './HotelSidebar';
import TopNavbar from './TopNavbar';
import HotelSearchSection from './HotelSearchSection';
import HotelCard from './HotelCard';
import HotelModal from './HotelModal';
import AgentPortal from './AgentPortal';
import LoadingSpinner from './common/LoadingSpinner';
import { SupabaseService } from '../services/SupabaseService';
import type { Hotel } from '../types';
import { Validator } from '../utils/validation';

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

const cities = ["All Cities", "Mumbai", "New Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Udaipur", "Goa"];
const months = ["All Months", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const hotelChains = ["All Chains", "Oberoi Hotels", "Taj Hotels", "ITC Hotels", "The Leela", "Marriott", "Clarks Hotels", "Hyatt", "ITDC", "Ritz-Carlton", "Four Seasons", "St. Regis"];

const HotelDashboard: React.FC<HotelDashboardProps> = ({ userRole, onLogout, onBackToCruise }) => {
  // State for hotels data
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Active section state
  const [activeSection, setActiveSection] = useState('Hotels');
  
  // Search filters state
  const [searchFilters, setSearchFilters] = useState<HotelSearchFilters>({
    searchText: '',
    city: cities[0],
    checkInMonth: months[0],
    numberOfNights: 2,
    hotelChain: hotelChains[0],
    maxPrice: 50000,
    starRating: 0
  });

  // Modal state
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Profile view state
  const [showProfile, setShowProfile] = useState(false);

  // Load hotels from Supabase
  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const hotelData = await SupabaseService.getAllHotels();
        setHotels(hotelData);
      } catch (error) {
        console.error('Failed to load hotels:', error);
        setError('Failed to load hotels');
        
        // Fallback to mock data
        const mockHotels = [
          {
            id: "1",
            name: "The Oberoi Mumbai",
            location: "Mumbai, Maharashtra",
            image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
            starRating: 5,
            pricePerNight: 25000,
            availableRoomTypes: ["Deluxe Room", "Premier Room", "Luxury Suite", "Presidential Suite"],
            mealPlans: ["Room Only", "Breakfast Included", "Half Board", "Full Board"],
            amenities: ["Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking", "Pet Friendly", "Garden"],
            availableFrom: ["2024-04-15", "2024-04-22", "2024-04-29", "2024-05-06"],
            description: "Experience luxury redefined at The Oberoi Mumbai with panoramic views of the Arabian Sea.",
            hotelType: "Luxury",
            hotelChain: "Oberoi Hotels"
          }
        ];
        setHotels(mockHotels);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  // Filter hotels based on search criteria with validation
  const filteredHotels = hotels.filter(hotel => {
    const searchText = Validator.sanitizeString(searchFilters.searchText);
    
    const matchesSearch = hotel.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchText.toLowerCase()) ||
                         hotel.description.toLowerCase().includes(searchText.toLowerCase());
    
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

  // Handle search filters change with validation
  const handleFiltersChange = (filters: HotelSearchFilters) => {
    const sanitizedFilters = {
      ...filters,
      searchText: Validator.sanitizeString(filters.searchText)
    };
    setSearchFilters(sanitizedFilters);
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

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {/* Search Section */}
          <HotelSearchSection 
            filters={searchFilters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Results Summary */}
          <div className="mb-6">
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="small" />
                <span className="text-gray-600">Loading hotels...</span>
              </div>
            ) : (
              <p className="text-gray-600">
                Showing {filteredHotels.length} of {hotels.length} hotels
              </p>
            )}
          </div>

          {/* Hotel Cards Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" text="Loading hotels..." />
            </div>
          ) : (
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
          )}

          {/* No Results Message */}
          {!loading && filteredHotels.length === 0 && (
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