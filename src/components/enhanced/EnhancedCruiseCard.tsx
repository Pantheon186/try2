import React, { useState } from 'react';
import { Calendar, Clock, MapPin, IndianRupee, Eye, Heart, Users, Star, CheckCircle, TrendingUp, TrendingDown, Bookmark, Share2, GitCompare as Compare } from 'lucide-react';
import { Rate, Tag, Tooltip, Button } from 'antd';
import { EnhancedCruise } from '../../types/enhanced';
import { Formatters } from '../../utils/formatters';

interface EnhancedCruiseCardProps {
  cruise: EnhancedCruise;
  onViewDetails: (cruise: EnhancedCruise) => void;
  onBookmark?: (cruiseId: string) => void;
  onCompare?: (cruiseId: string) => void;
  onShare?: (cruise: EnhancedCruise) => void;
  isBookmarked?: boolean;
  isInComparison?: boolean;
  showPriceHistory?: boolean;
  className?: string;
}

const EnhancedCruiseCard: React.FC<EnhancedCruiseCardProps> = ({
  cruise,
  onViewDetails,
  onBookmark,
  onCompare,
  onShare,
  isBookmarked = false,
  isInComparison = false,
  showPriceHistory = false,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calculate average rating from reviews
  const averageRating = cruise.reviews && cruise.reviews.length > 0
    ? cruise.reviews.reduce((sum, review) => sum + review.rating, 0) / cruise.reviews.length
    : 0;

  // Get current availability
  const currentAvailability = cruise.availability?.find(
    avail => new Date(avail.date) >= new Date()
  );

  // Calculate price trend (mock implementation)
  const priceChange = Math.random() > 0.5 ? 
    { direction: 'up' as const, percentage: Math.floor(Math.random() * 15) + 1 } :
    { direction: 'down' as const, percentage: Math.floor(Math.random() * 20) + 1 };

  // Get best price from pricing tiers
  const bestPrice = cruise.pricing && cruise.pricing.length > 0
    ? Math.min(...cruise.pricing.map(p => p.basePrice))
    : cruise.pricePerPerson;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(cruise.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompare?.(cruise.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(cruise);
  };

  return (
    <div className={`
      bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg 
      overflow-hidden hover:shadow-2xl transition-all duration-300 hover:transform 
      hover:scale-[1.02] mb-6 ${className}
    `}>
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Cruise Details */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1">
              {/* Cruise Name and Ship Type */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{cruise.name}</h3>
                <div className="flex gap-2">
                  <Tag color="blue">{cruise.shipType}</Tag>
                  {cruise.sustainability?.certifications.length > 0 && (
                    <Tag color="green">Eco-Friendly</Tag>
                  )}
                </div>
              </div>
              
              {/* Route */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={18} />
                <span className="text-lg font-medium">{cruise.from} → {cruise.to}</span>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-3 mb-3">
                <Rate disabled value={averageRating} className="text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({cruise.reviews?.length || 0} reviews)
                </span>
                {cruise.reviews && cruise.reviews.length > 50 && (
                  <Tag color="gold">Popular</Tag>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="text-right mt-4 sm:mt-0">
              <div className="flex items-center justify-end gap-2 mb-1">
                <div className="text-3xl font-bold text-green-600">
                  {Formatters.currency(bestPrice)}
                </div>
                {showPriceHistory && (
                  <div className={`flex items-center gap-1 text-sm ${
                    priceChange.direction === 'up' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {priceChange.direction === 'up' ? 
                      <TrendingUp size={14} /> : 
                      <TrendingDown size={14} />
                    }
                    <span>{priceChange.percentage}%</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">per person</p>
              {currentAvailability && currentAvailability.roomsLeft <= 5 && (
                <p className="text-sm text-red-600 font-medium">
                  Only {currentAvailability.roomsLeft} rooms left!
                </p>
              )}
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

            {/* Availability and Special Offers */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar size={16} />
                <span className="font-medium text-sm">Next Available:</span>
              </div>
              {currentAvailability ? (
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {Formatters.date(currentAvailability.date)}
                  </div>
                  {currentAvailability.specialOffers && currentAvailability.specialOffers.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {currentAvailability.specialOffers.map((offer, index) => (
                        <Tag key={index} color="orange" className="text-xs">
                          {offer}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-sm text-gray-500">Check availability</span>
              )}
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

          {/* Itinerary Preview */}
          {cruise.itinerary && cruise.itinerary.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Itinerary Highlights:</h4>
              <div className="space-y-1">
                {cruise.itinerary.slice(0, 3).map((day, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    <span className="font-medium">Day {day.day}:</span> {day.port}
                    {day.highlights.length > 0 && (
                      <span className="text-gray-500"> • {day.highlights[0]}</span>
                    )}
                  </div>
                ))}
                {cruise.itinerary.length > 3 && (
                  <div className="text-sm text-blue-600 font-medium">
                    +{cruise.itinerary.length - 3} more ports
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {Formatters.truncate(cruise.description, 150)}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onViewDetails(cruise)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
            >
              <Eye size={18} />
              <span>View Details & Book</span>
            </button>
            
            <div className="flex gap-2">
              <Tooltip title={isBookmarked ? 'Remove from favorites' : 'Add to favorites'}>
                <button
                  onClick={handleBookmark}
                  className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 ${
                    isBookmarked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Heart size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
              </Tooltip>

              <Tooltip title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}>
                <button
                  onClick={handleCompare}
                  className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 ${
                    isInComparison 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Compare size={18} />
                </button>
              </Tooltip>

              <Tooltip title="Share cruise">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center p-3 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-lg transition-colors duration-200"
                >
                  <Share2 size={18} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Right Section - Cruise Image */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="relative h-64 lg:h-full overflow-hidden lg:rounded-r-2xl">
            {!imageError ? (
              <img
                src={cruise.image}
                alt={cruise.name}
                className={`w-full h-full object-cover transition-all duration-300 hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-600 font-medium">{cruise.name}</p>
                </div>
              </div>
            )}
            
            {/* Image Overlay with Rating */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span>{averageRating.toFixed(1)}</span>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {cruise.duration} Nights
              </div>
            </div>

            {/* Special Offers Badge */}
            {currentAvailability?.specialOffers && currentAvailability.specialOffers.length > 0 && (
              <div className="absolute top-16 right-4">
                <div className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  Special Offer
                </div>
              </div>
            )}

            {/* Sustainability Badge */}
            {cruise.sustainability?.certifications.length > 0 && (
              <div className="absolute bottom-16 left-4">
                <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle size={14} />
                  <span>Eco-Certified</span>
                </div>
              </div>
            )}

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Next Departure Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white">
                <p className="text-xs opacity-90">Next Departure:</p>
                <p className="font-semibold">
                  {cruise.departureDates && cruise.departureDates.length > 0
                    ? Formatters.date(cruise.departureDates[0])
                    : 'Check availability'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCruiseCard;