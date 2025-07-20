import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Validator } from '../utils/validation';

const cities = [
  "All Cities",
  "Mumbai", "New Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Udaipur", "Goa"
];

const hotelChains = [
  "All Chains",
  "Oberoi Hotels", "Taj Hotels", "ITC Hotels", "The Leela", "Marriott", "Clarks Hotels", "Hyatt", "ITDC", "Ritz-Carlton", "Four Seasons", "St. Regis"
];

const months = [
  "All Months", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

interface HotelSearchFilters {
  searchText: string;
  city: string;
  checkInMonth: string;
  numberOfNights: number;
  hotelChain: string;
  maxPrice: number;
  starRating: number;
}

interface HotelSearchSectionProps {
  filters: HotelSearchFilters;
  onFiltersChange: (filters: HotelSearchFilters) => void;
}

const HotelSearchSection: React.FC<HotelSearchSectionProps> = ({ filters, onFiltersChange }) => {
  // Handle input changes with validation
  const handleInputChange = (field: keyof HotelSearchFilters, value: string | number) => {
    const sanitizedValue = field === 'searchText' && typeof value === 'string' 
      ? Validator.sanitizeString(value) 
      : value;
    
    onFiltersChange({
      ...filters,
      [field]: sanitizedValue
    });
  };

  // Clear all filters
  const clearFilters = () => {
    onFiltersChange({
      searchText: '',
      city: 'All Cities',
      checkInMonth: 'All Months',
      numberOfNights: 1,
      hotelChain: 'All Chains',
      maxPrice: 50000,
      starRating: 0
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MapPin size={20} />
          Search & Filter Hotels
        </h2>
        {(filters.searchText || filters.city !== 'All Cities' || filters.hotelChain !== 'All Chains' || filters.starRating > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Text Search */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Hotels</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Hotel name or city..."
              value={filters.searchText}
              onChange={(e) => handleInputChange('searchText', e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <select
            value={filters.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Check-In Month */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-In Month</label>
          <select
            value={filters.checkInMonth}
            onChange={(e) => handleInputChange('checkInMonth', e.target.value)}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Number of Nights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nights</label>
          <select
            value={filters.numberOfNights}
            onChange={(e) => handleInputChange('numberOfNights', Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((nights) => (
              <option key={nights} value={nights}>
                {nights} {nights === 1 ? 'Night' : 'Nights'}
              </option>
            ))}
          </select>
        </div>

        {/* Hotel Chain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Chain</label>
          <select
            value={filters.hotelChain}
            onChange={(e) => handleInputChange('hotelChain', e.target.value)}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {hotelChains.map((chain) => (
              <option key={chain} value={chain}>{chain}</option>
            ))}
          </select>
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Stars</label>
          <select
            value={filters.starRating}
            onChange={(e) => handleInputChange('starRating', Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Any Rating</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={5}>5 Stars Only</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (value && !value.toString().toLowerCase().includes('all') && value !== '' && value !== 0 && value !== 1) {
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {key}: {value}
                <button
                  onClick={() => handleInputChange(key as keyof HotelSearchFilters, key === 'numberOfNights' ? 1 : key === 'maxPrice' || key === 'starRating' ? 0 : key === 'searchText' ? '' : `All ${key.charAt(0).toUpperCase() + key.slice(1)}s`)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default HotelSearchSection;