import React from 'react';
import { Calendar, Clock, MapPin, IndianRupee, Eye, X, Users, Star, CheckCircle } from 'lucide-react';
import ModernCard from './enhanced/ModernCard';
import ModernButton from './enhanced/ModernButton';
import { Cruise } from '../data/cruises';

interface CruiseCardProps {
  cruise: Cruise;
  onViewDetails: (cruise: Cruise) => void;
  onCancel: (cruiseId: string) => void;
  isBooked?: boolean;
  loading?: boolean;
}

const CruiseCard: React.FC<CruiseCardProps> = ({ cruise, onViewDetails, onCancel, isBooked = false, loading = false }) => {
  // Handle cancel with confirmation
  const handleCancel = () => {
    if (isBooked && window.confirm(`Are you sure you want to cancel booking for ${cruise.name}?`)) {
      onCancel(cruise.id);
    }
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format departure date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format short date for available dates
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <ModernCard className={`overflow-hidden mb-6 ${isBooked ? 'ring-2 ring-green-400' : ''}`} padding="sm">
      {/* Booking Status Banner */}
      {isBooked && (
        <div className="bg-green-500 text-white px-4 py-2 text-sm font-medium flex items-center gap-2">
          <CheckCircle size={16} />
          <span>Booking Confirmed</span>
        </div>
      )}
      
      {/* Horizontal Layout Container */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Cruise Details */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1">
              {/* Cruise Name and Ship Type */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{cruise.name}</h3>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium w-fit">
                  {cruise.shipType}
                </span>
              </div>
              
              {/* Route */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={18} />
                <span className="text-lg font-medium">{cruise.from} → {cruise.to}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="text-right mt-4 sm:mt-0">
              <div className="flex items-center justify-end gap-1 text-3xl font-bold text-green-600 mb-1">
                <IndianRupee size={24} />
                <span>{formatPrice(cruise.pricePerPerson)}</span>
              </div>
              <p className="text-sm text-gray-500">per person</p>
            </div>
          </div>

          {/* Cruise Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Duration and Cruise Line */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                <span className="font-medium">{cruise.duration} nights</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-medium">
                  {cruise.cruiseLine}
                </span>
              </div>
            </div>

            {/* Room Types */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Users size={16} />
                <span className="font-medium text-sm">Room Types Available:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {cruise.roomTypes.slice(0, 3).map((room, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {room}
                  </span>
                ))}
                {cruise.roomTypes.length > 3 && (
                  <span className="text-xs text-blue-600 font-medium">
                    +{cruise.roomTypes.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Available Departure Dates */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <Calendar size={16} />
              <span className="font-medium text-sm">Available Departure Dates:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cruise.departureDates.map((date, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  {formatShortDate(date)}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Preview */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2 text-sm">Ship Amenities:</h4>
            <div className="flex flex-wrap gap-2">
              {cruise.amenities.slice(0, 6).map((amenity, index) => (
                <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">
                  {amenity}
                </span>
              ))}
              {cruise.amenities.length > 6 && (
                <span className="text-xs text-purple-600 font-medium">
                  +{cruise.amenities.length - 6} more amenities
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {cruise.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <ModernButton
              variant="primary"
              icon={<Eye size={18} />}
              onClick={() => onViewDetails(cruise)}
              disabled={loading}
              className="flex-1"
            >
              {isBooked ? 'View Booking Details' : 'View Details & Book'}
            </ModernButton>
            {isBooked && (
              <ModernButton
                variant="outline"
                icon={<X size={18} />}
                onClick={handleCancel}
                disabled={loading}
                loading={loading}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <span className="hidden sm:inline">Cancel Booking</span>
                <span className="sm:hidden">Cancel</span>
              </ModernButton>
            )}
          </div>
        </div>

        {/* Right Section - Cruise Image */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="relative h-64 lg:h-full overflow-hidden lg:rounded-r-2xl">
            <img
              src={cruise.image}
              alt={cruise.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            
            {/* Image Overlay with Rating */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span>4.{Math.floor(Math.random() * 3) + 7}</span>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {cruise.duration} Nights
              </div>
            </div>

            {/* Booking Status Badge */}
            {isBooked && (
              <div className="absolute top-16 right-4">
                <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle size={14} />
                  <span>Booked</span>
                </div>
              </div>
            )}
            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Next Departure Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white">
                <p className="text-xs opacity-90">Next Departure:</p>
                <p className="font-semibold">{formatDate(cruise.departureDates[0])}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernCard>
  );
};

export default CruiseCard;