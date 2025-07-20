import React from 'react';
import { Search } from 'lucide-react';
import { Validator } from '../utils/validation';

const destinations = [
  "All Destinations",
  "Goa", "Kochi", "Mumbai", "Chennai", "Lakshadweep", "Mangalore", "Daman", "Puducherry", "Karwar", "Beypore", "Dubai", "Colombo", "Maldives", "Singapore"
];

const cruiseLines = [
  "All Cruise Lines",
  "Royal Caribbean", "Celebrity Cruises", "Norwegian Cruise Line", "Princess Cruises", 
  "MSC Cruises", "Costa Cruises", "Disney Cruise Line", "Holland America Line", "Seabourn"
];

const shipTypes = [
  "All Ship Types",
  "Mega Ship", "Premium Ship", "Family Ship", "Luxury Ship", "Modern Ship", "Classic Ship", "Quantum Class", "Ultra-Luxury", "Voyager Class", "Oasis Class"
];

const months = [
  "All Months", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

interface SearchFilters {
  searchText: string;
  destination: string;
  cruiseLine: string;
  shipType: string;
  month: string;
}

interface SearchSectionProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  loading?: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({ filters, onFiltersChange, loading = false }) => {
  // Handle input changes with validation
  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    const sanitizedValue = field === 'searchText' ? Validator.sanitizeString(value) : value;
    
    onFiltersChange({
      ...filters,
      [field]: sanitizedValue
    });
  };

  // Clear all filters
  const clearFilters = () => {
    onFiltersChange({
      searchText: '',
      destination: 'All Destinations',
      cruiseLine: 'All Cruise Lines',
      shipType: 'All Ship Types',
      month: 'All Months'
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Search & Filter Cruises</h2>
        {(filters.searchText || filters.destination !== 'All Destinations' || filters.cruiseLine !== 'All Cruise Lines' || filters.shipType !== 'All Ship Types' || filters.month !== 'All Months') && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Text Search */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Cruises</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.searchText}
              onChange={(e) => handleInputChange('searchText', e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              maxLength={100}
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
          <select
            value={filters.destination}
            onChange={(e) => handleInputChange('destination', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {destinations.map((dest) => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
        </div>

        {/* Cruise Line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cruise Line</label>
          <select
            value={filters.cruiseLine}
            onChange={(e) => handleInputChange('cruiseLine', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {cruiseLines.map((line) => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>
        </div>

        {/* Ship Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ship Type</label>
          <select
            value={filters.shipType}
            onChange={(e) => handleInputChange('shipType', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {shipTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Month / Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <select
            value={filters.month}
            onChange={(e) => handleInputChange('month', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (value && !value.toString().toLowerCase().includes('all') && value !== '') {
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {key}: {value}
                <button
                  onClick={() => handleInputChange(key as keyof SearchFilters, key === 'searchText' ? '' : `All ${key.charAt(0).toUpperCase() + key.slice(1)}s`)}
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

export default SearchSection;