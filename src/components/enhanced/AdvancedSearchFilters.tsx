import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, DollarSign, MapPin, Clock, Users, Star } from 'lucide-react';
import { Slider, DatePicker, Select, Checkbox, Rate, InputNumber } from 'antd';
import { SearchFilters } from '../../types/enhanced';
import dayjs, { Dayjs } from 'dayjs';

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading?: boolean;
  filterOptions?: {
    destinations: string[];
    cruiseLines: string[];
    amenities: string[];
    roomTypes: string[];
  };
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  loading = false,
  filterOptions
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      handleFilterChange('dateRange', {
        start: dates[0].format('YYYY-MM-DD'),
        end: dates[1].format('YYYY-MM-DD')
      });
    } else {
      handleFilterChange('dateRange', undefined);
    }
  };

  const handlePriceRangeChange = (values: number[]) => {
    handleFilterChange('priceRange', {
      min: values[0],
      max: values[1]
    });
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      sortBy: 'popularity',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.dateRange) count++;
    if (localFilters.priceRange) count++;
    if (localFilters.rating) count++;
    if (localFilters.amenities && localFilters.amenities.length > 0) count++;
    if (localFilters.location) count++;
    return count;
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Search className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Advanced Search & Filters</h2>
          {getActiveFilterCount() > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Filter size={18} />
            <span>{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm"
            >
              <X size={16} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Basic Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Destinations, Cruise Lines, or Keywords
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="e.g., Mediterranean, Royal Caribbean, luxury cruise..."
              value={localFilters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <Select
            value={localFilters.sortBy || 'popularity'}
            onChange={(value) => handleFilterChange('sortBy', value)}
            className="w-full"
            size="large"
          >
            <Select.Option value="popularity">Popularity</Select.Option>
            <Select.Option value="price">Price</Select.Option>
            <Select.Option value="rating">Rating</Select.Option>
            <Select.Option value="duration">Duration</Select.Option>
            <Select.Option value="departure">Departure Date</Select.Option>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Travel Dates
              </label>
              <DatePicker.RangePicker
                value={
                  localFilters.dateRange
                    ? [dayjs(localFilters.dateRange.start), dayjs(localFilters.dateRange.end)]
                    : null
                }
                onChange={handleDateRangeChange}
                className="w-full"
                size="large"
                format="DD/MM/YYYY"
                disabledDate={(current) => current && current < dayjs().endOf('day')}
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign size={16} />
                Price Range (₹)
              </label>
              <div className="px-3">
                <Slider
                  range
                  min={10000}
                  max={500000}
                  step={5000}
                  value={[
                    localFilters.priceRange?.min || 10000,
                    localFilters.priceRange?.max || 500000
                  ]}
                  onChange={handlePriceRangeChange}
                  tooltip={{
                    formatter: (value) => `₹${value?.toLocaleString('en-IN')}`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹{(localFilters.priceRange?.min || 10000).toLocaleString('en-IN')}</span>
                  <span>₹{(localFilters.priceRange?.max || 500000).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Star size={16} />
                Minimum Rating
              </label>
              <Rate
                value={localFilters.rating || 0}
                onChange={(value) => handleFilterChange('rating', value)}
                className="text-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={16} />
                Duration (nights)
              </label>
              <div className="flex gap-2">
                <InputNumber
                  placeholder="Min"
                  min={1}
                  max={30}
                  className="flex-1"
                  size="large"
                />
                <span className="self-center text-gray-500">to</span>
                <InputNumber
                  placeholder="Max"
                  min={1}
                  max={30}
                  className="flex-1"
                  size="large"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          {filterOptions?.amenities && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filterOptions.amenities.map((amenity) => (
                  <Checkbox
                    key={amenity}
                    checked={localFilters.amenities?.includes(amenity) || false}
                    onChange={(e) => {
                      const currentAmenities = localFilters.amenities || [];
                      const updatedAmenities = e.target.checked
                        ? [...currentAmenities, amenity]
                        : currentAmenities.filter(a => a !== amenity);
                      handleFilterChange('amenities', updatedAmenities);
                    }}
                    className="text-sm"
                  >
                    {amenity}
                  </Checkbox>
                ))}
              </div>
            </div>
          )}

          {/* Destinations */}
          {filterOptions?.destinations && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Destinations
              </label>
              <Select
                mode="multiple"
                placeholder="Select destinations"
                className="w-full"
                size="large"
                maxTagCount={3}
              >
                {filterOptions.destinations.map((destination) => (
                  <Select.Option key={destination} value={destination}>
                    {destination}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {/* Cruise Lines */}
          {filterOptions?.cruiseLines && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cruise Lines
              </label>
              <Select
                mode="multiple"
                placeholder="Select cruise lines"
                className="w-full"
                size="large"
                maxTagCount={3}
              >
                {filterOptions.cruiseLines.map((line) => (
                  <Select.Option key={line} value={line}>
                    {line}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={onSearch}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilters;