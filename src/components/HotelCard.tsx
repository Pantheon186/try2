import React from 'react';
import { MapPin, Star, Eye, Bookmark, Wifi, Car, Dumbbell, Waves } from 'lucide-react';
import ModernCard from './enhanced/ModernCard';
import ModernButton from './enhanced/ModernButton';
import { Hotel } from '../data/hotels';

interface HotelCardProps {
  hotel: Hotel;
  onViewDetails: (hotel: Hotel) => void;
  onBookmark?: (hotelId: string) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onViewDetails, onBookmark }) => {
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wi-fi':
        return <Wifi size={14} />;
      case 'parking':
        return <Car size={14} />;
      case 'gym':
        return <Dumbbell size={14} />;
      case 'pool':
        return <Waves size={14} />;
      default:
        return null;
    }
  };

  // Handle bookmark
  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(hotel.id);
    } else {
      alert('Hotel bookmarked!');
    }
  };

  return (
    <ModernCard className="overflow-hidden mb-6" padding="sm">
      {/* Horizontal Layout Container */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Hotel Details */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1">
              {/* Hotel Name and Type */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{hotel.name}</h3>
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium w-fit">
                  {hotel.hotelType}
                </span>
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={18} />
                <span className="text-lg font-medium">{hotel.location}</span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={`${
                        index < hotel.starRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({hotel.starRating} Star Hotel)</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="text-right mt-4 sm:mt-0">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatPrice(hotel.pricePerNight)}
              </div>
              <p className="text-sm text-gray-500">per night</p>
            </div>
          </div>

          {/* Hotel Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Room Types */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <span className="font-medium text-sm">Room Types Available:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {hotel.availableRoomTypes.slice(0, 3).map((room, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {room}
                  </span>
                ))}
                {hotel.availableRoomTypes.length > 3 && (
                  <span className="text-xs text-blue-600 font-medium">
                    +{hotel.availableRoomTypes.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Hotel Chain */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <span className="font-medium text-sm">Hotel Chain:</span>
              </div>
              <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-medium">
                {hotel.hotelChain}
              </span>
            </div>
          </div>

          {/* Amenities Preview */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2 text-sm">Hotel Amenities:</h4>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.slice(0, 6).map((amenity, index) => (
                <span key={index} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                  {getAmenityIcon(amenity)}
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 6 && (
                <span className="text-xs text-blue-600 font-medium">
                  +{hotel.amenities.length - 6} more amenities
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {hotel.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <ModernButton
              variant="primary"
              icon={<Eye size={18} />}
              onClick={() => onViewDetails(hotel)}
              className="flex-1"
            >
              View Details & Book
            </ModernButton>
            <ModernButton
              variant="secondary"
              icon={<Bookmark size={18} />}
              onClick={handleBookmark}
            >
              <span className="hidden sm:inline">Save Hotel</span>
              <span className="sm:hidden">Save</span>
            </ModernButton>
          </div>
        </div>

        {/* Right Section - Hotel Image */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="relative h-64 lg:h-full overflow-hidden lg:rounded-r-2xl">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            
            {/* Image Overlay with Star Rating */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span>{hotel.starRating}</span>
              </div>
            </div>

            {/* Hotel Type Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-purple-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {hotel.hotelType}
              </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Price Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white">
                <p className="text-xs opacity-90">Starting from:</p>
                <p className="font-semibold text-lg">{formatPrice(hotel.pricePerNight)}/night</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernCard>
  );
};

export default HotelCard;