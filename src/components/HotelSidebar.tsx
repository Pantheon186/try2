import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, History, MessageCircle, LogOut, Settings } from 'lucide-react';
import { Slider, Checkbox, Rate } from 'antd';
import { indoorAmenities, outdoorAmenities, hotelTypes } from '../data/hotels';

interface HotelSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userRole: string;
  onLogout: () => void;
  onViewProfile: () => void;
}

interface FilterState {
  city: string;
  hotelType: string;
  numberOfGuests: number;
  priceRange: [number, number];
  starRating: number;
  selectedIndoorAmenities: string[];
  selectedOutdoorAmenities: string[];
  availableNow: boolean;
}

const HotelSidebar: React.FC<HotelSidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  userRole, 
  onLogout, 
  onViewProfile 
}) => {
  // State for expandable filters section
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  // State for filter values
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    hotelType: hotelTypes[0],
    numberOfGuests: 2,
    priceRange: [3000, 40000],
    starRating: 0,
    selectedIndoorAmenities: [],
    selectedOutdoorAmenities: [],
    availableNow: false
  });

  // Handle amenity selection
  const handleIndoorAmenityChange = (checkedValues: string[]) => {
    setFilters(prev => ({ ...prev, selectedIndoorAmenities: checkedValues }));
  };

  const handleOutdoorAmenityChange = (checkedValues: string[]) => {
    setFilters(prev => ({ ...prev, selectedOutdoorAmenities: checkedValues }));
  };

  // Handle support contact
  const handleContactSupport = () => {
    alert('Contact Support feature would open a chat modal here!');
  };

  return (
    <div
      className={`
        fixed left-0 top-0 h-full bg-white/20 backdrop-blur-md border-r border-white/30 
        shadow-lg transition-all duration-300 z-50
        ${isCollapsed ? 'w-16' : 'w-80'}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-blue-500 text-white rounded-full p-1 shadow-md hover:bg-blue-600 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="p-4 h-full flex flex-col">
        {/* Top Section - User Profile */}
        <div className={`mb-6 ${isCollapsed ? 'text-center' : ''}`}>
          <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center gap-3'} mb-4`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            {!isCollapsed && (
              <div>
                <h3 className="font-semibold text-gray-800">{userRole}</h3>
                <p className="text-sm text-gray-600">Yorker Holidays</p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <button className="w-full flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <History size={18} />
              <span>My Hotel Bookings</span>
            </button>
          )}
        </div>

        {/* Middle Section - Expandable Filters */}
        <div className="flex-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="mb-6">
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-800 hover:bg-white/30 rounded-lg transition-colors mb-3"
              >
                <span className="font-medium flex items-center gap-2">
                  <Settings size={18} />
                  Hotel Filters
                </span>
                <ChevronRight className={`transition-transform ${filtersExpanded ? 'rotate-90' : ''}`} size={16} />
              </button>

              {filtersExpanded && (
                <div className="space-y-4 pl-2">
                  {/* City / Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City / Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Mumbai, Delhi"
                      value={filters.city}
                      onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Hotel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Type</label>
                    <select
                      value={filters.hotelType}
                      onChange={(e) => setFilters(prev => ({ ...prev, hotelType: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {hotelTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <select
                      value={filters.numberOfGuests}
                      onChange={(e) => setFilters(prev => ({ ...prev, numberOfGuests: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: ₹{filters.priceRange[0].toLocaleString('en-IN')} - ₹{filters.priceRange[1].toLocaleString('en-IN')}
                    </label>
                    <Slider
                      range
                      min={1000}
                      max={50000}
                      step={1000}
                      value={filters.priceRange}
                      onChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                      trackStyle={[{ backgroundColor: '#3B82F6' }]}
                      handleStyle={[{ borderColor: '#3B82F6' }, { borderColor: '#3B82F6' }]}
                    />
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Star Rating</label>
                    <Rate
                      value={filters.starRating}
                      onChange={(value) => setFilters(prev => ({ ...prev, starRating: value }))}
                      className="text-yellow-400"
                    />
                  </div>

                  {/* Indoor Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Indoor Amenities</label>
                    <Checkbox.Group
                      options={indoorAmenities}
                      value={filters.selectedIndoorAmenities}
                      onChange={handleIndoorAmenityChange}
                      className="grid grid-cols-1 gap-1"
                    />
                  </div>

                  {/* Outdoor Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Outdoor Amenities</label>
                    <Checkbox.Group
                      options={outdoorAmenities}
                      value={filters.selectedOutdoorAmenities}
                      onChange={handleOutdoorAmenityChange}
                      className="grid grid-cols-1 gap-1"
                    />
                  </div>

                  {/* Available Now Toggle */}
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.availableNow}
                        onChange={(e) => setFilters(prev => ({ ...prev, availableNow: e.target.checked }))}
                        className="w-4 h-4 text-blue-500 bg-white/50 border-white/30 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Available Now</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Section - Actions */}
        <div className="mt-auto space-y-2">
          <button 
            onClick={onViewProfile}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors`}
          >
            <User size={18} />
            {!isCollapsed && <span>View Profile</span>}
          </button>
          
          <button
            onClick={handleContactSupport}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors`}
          >
            <MessageCircle size={18} />
            {!isCollapsed && <span>Contact Support</span>}
          </button>
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelSidebar;