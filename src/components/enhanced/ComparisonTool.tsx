import React, { useState } from 'react';
import { X, Star, Calendar, Clock, MapPin, DollarSign, Check, Minus } from 'lucide-react';
import { Button, Rate, Tag } from 'antd';
import { EnhancedCruise } from '../../types/enhanced';
import { Formatters } from '../../utils/formatters';

interface ComparisonToolProps {
  cruises: EnhancedCruise[];
  onRemoveCruise: (cruiseId: string) => void;
  onBookCruise: (cruise: EnhancedCruise) => void;
  onClose: () => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({
  cruises,
  onRemoveCruise,
  onBookCruise,
  onClose
}) => {
  const [selectedAspect, setSelectedAspect] = useState<string>('overview');

  if (cruises.length === 0) {
    return null;
  }

  const comparisonAspects = [
    { key: 'overview', label: 'Overview' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'amenities', label: 'Amenities' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'reviews', label: 'Reviews' }
  ];

  const getAverageRating = (cruise: EnhancedCruise) => {
    if (!cruise.reviews || cruise.reviews.length === 0) return 0;
    return cruise.reviews.reduce((sum, review) => sum + review.rating, 0) / cruise.reviews.length;
  };

  const getBestPrice = (cruise: EnhancedCruise) => {
    if (!cruise.pricing || cruise.pricing.length === 0) return cruise.pricePerPerson;
    return Math.min(...cruise.pricing.map(p => p.basePrice));
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Cruise Line</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cruises.map(cruise => (
              <div key={cruise.id} className="text-center">
                <Tag color="blue">{cruise.cruiseLine}</Tag>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Route</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cruises.map(cruise => (
              <div key={cruise.id} className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={14} />
                  <span className="text-sm">{cruise.from} → {cruise.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Duration</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cruises.map(cruise => (
              <div key={cruise.id} className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock size={14} />
                  <span className="text-sm">{cruise.duration} nights</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Ship Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cruises.map(cruise => (
              <div key={cruise.id} className="text-center">
                <Tag color="purple">{cruise.shipType}</Tag>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Starting Price</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cruises.map(cruise => {
            const price = getBestPrice(cruise);
            const isLowest = price === Math.min(...cruises.map(c => getBestPrice(c)));
            return (
              <div key={cruise.id} className="text-center">
                <div className={`text-2xl font-bold ${isLowest ? 'text-green-600' : 'text-gray-800'}`}>
                  {Formatters.currency(price)}
                </div>
                {isLowest && <Tag color="green">Best Price</Tag>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Room Types Available</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cruises.map(cruise => (
            <div key={cruise.id}>
              <div className="space-y-1">
                {cruise.roomTypes.map((room, index) => (
                  <div key={index} className="text-sm bg-white px-2 py-1 rounded">
                    {room}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAmenities = () => {
    // Get all unique amenities
    const allAmenities = Array.from(
      new Set(cruises.flatMap(cruise => cruise.amenities))
    ).sort();

    return (
      <div className="space-y-2">
        {allAmenities.map(amenity => (
          <div key={amenity} className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="font-medium text-gray-700">{amenity}</div>
              {cruises.map(cruise => (
                <div key={cruise.id} className="text-center">
                  {cruise.amenities.includes(amenity) ? (
                    <Check size={20} className="text-green-600 mx-auto" />
                  ) : (
                    <Minus size={20} className="text-gray-400 mx-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderItinerary = () => (
    <div className="space-y-4">
      {cruises.map(cruise => (
        <div key={cruise.id} className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3">{cruise.name}</h4>
          {cruise.itinerary && cruise.itinerary.length > 0 ? (
            <div className="space-y-2">
              {cruise.itinerary.slice(0, 5).map(day => (
                <div key={day.day} className="flex items-center gap-3 text-sm">
                  <span className="font-medium w-12">Day {day.day}:</span>
                  <span className="flex-1">{day.port}</span>
                  {day.highlights.length > 0 && (
                    <span className="text-gray-500">• {day.highlights[0]}</span>
                  )}
                </div>
              ))}
              {cruise.itinerary.length > 5 && (
                <div className="text-sm text-blue-600">
                  +{cruise.itinerary.length - 5} more ports
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Itinerary not available</p>
          )}
        </div>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Customer Rating</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cruises.map(cruise => {
            const rating = getAverageRating(cruise);
            const reviewCount = cruise.reviews?.length || 0;
            const isHighest = rating === Math.max(...cruises.map(c => getAverageRating(c)));
            
            return (
              <div key={cruise.id} className="text-center">
                <div className={`text-2xl font-bold mb-1 ${isHighest ? 'text-green-600' : 'text-gray-800'}`}>
                  {rating.toFixed(1)}
                </div>
                <Rate disabled value={rating} className="text-yellow-400 mb-1" />
                <div className="text-sm text-gray-600">
                  {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                </div>
                {isHighest && reviewCount > 0 && <Tag color="green">Highest Rated</Tag>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Recent Reviews</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cruises.map(cruise => (
            <div key={cruise.id}>
              {cruise.reviews && cruise.reviews.length > 0 ? (
                <div className="space-y-2">
                  {cruise.reviews.slice(0, 2).map(review => (
                    <div key={review.id} className="bg-white p-2 rounded text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Rate disabled value={review.rating} className="text-yellow-400 text-xs" />
                      </div>
                      <p className="text-gray-700">{Formatters.truncate(review.comment, 80)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedAspect) {
      case 'overview':
        return renderOverview();
      case 'pricing':
        return renderPricing();
      case 'amenities':
        return renderAmenities();
      case 'itinerary':
        return renderItinerary();
      case 'reviews':
        return renderReviews();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Compare Cruises ({cruises.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cruise Headers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {cruises.map(cruise => (
              <div key={cruise.id} className="bg-gray-50 p-4 rounded-lg relative">
                <button
                  onClick={() => onRemoveCruise(cruise.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
                <img
                  src={cruise.image}
                  alt={cruise.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-800 mb-2">{cruise.name}</h3>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {Formatters.currency(getBestPrice(cruise))}
                </div>
                <Button
                  type="primary"
                  block
                  onClick={() => onBookCruise(cruise)}
                >
                  Book Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 border-b border-gray-200 px-6">
          <div className="flex gap-1 overflow-x-auto">
            {comparisonAspects.map(aspect => (
              <button
                key={aspect.key}
                onClick={() => setSelectedAspect(aspect.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedAspect === aspect.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {aspect.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTool;