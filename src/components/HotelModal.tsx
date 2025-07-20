import React, { useState } from 'react';
import { X, Calendar, Users, Utensils, Bed, MapPin, Star, CheckCircle } from 'lucide-react';
import { DatePicker } from 'antd';
import { Hotel } from '../data/hotels';
import { useBookings } from '../hooks/useBookings';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import dayjs, { Dayjs } from 'dayjs';

interface HotelModalProps {
  hotel: Hotel;
  onClose: () => void;
  onBookingSuccess?: (hotelId: string) => void;
  onShowReviews?: () => void;
  isBooked?: boolean;
}

interface BookingForm {
  roomType: string;
  mealPlan: string;
  guestCount: number;
  checkInDate: Dayjs | null;
  checkOutDate: Dayjs | null;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const HotelModal: React.FC<HotelModalProps> = ({ hotel, onClose, onBookingSuccess, onShowReviews, isBooked = false }) => {
  const { createBooking } = useBookings();
  const { showBookingSuccess, showBookingError } = useNotifications();
  const { user } = useAuth();
  
  // Booking flow state
  const [currentStep, setCurrentStep] = useState<'selection' | 'details' | 'confirmation'>(isBooked ? 'confirmation' : 'selection');
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    roomType: hotel.availableRoomTypes[0],
    mealPlan: hotel.mealPlans[0],
    guestCount: 2,
    checkInDate: dayjs().add(7, 'day'),
    checkOutDate: dayjs().add(9, 'day'),
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Room type pricing multipliers
  const roomPricing = {
    'Standard Room': 1.0,
    'Deluxe Room': 1.3,
    'Premium Room': 1.4,
    'Executive Room': 1.5,
    'Club Room': 1.6,
    'Executive Suite': 1.8,
    'Luxury Suite': 2.0,
    'Royal Suite': 2.2,
    'Presidential Suite': 2.5,
    'Palace Room': 2.8,
    'Grand Royal Suite': 3.0,
    'Regency Suite': 1.7
  };

  // Meal plan pricing
  const mealPricing = {
    'Room Only': 0,
    'Breakfast Included': 1500,
    'Half Board': 3000,
    'Full Board': 4500
  };

  // Calculate number of nights
  const calculateNights = () => {
    if (bookingForm.checkInDate && bookingForm.checkOutDate) {
      return bookingForm.checkOutDate.diff(bookingForm.checkInDate, 'day');
    }
    return 2;
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = hotel.pricePerNight;
    const roomMultiplier = roomPricing[bookingForm.roomType as keyof typeof roomPricing] || 1.0;
    const mealPrice = mealPricing[bookingForm.mealPlan as keyof typeof mealPricing] || 0;
    const nights = calculateNights();
    
    return (basePrice * roomMultiplier + mealPrice) * nights;
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof BookingForm, value: any) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle next step
  const handleNext = () => {
    setCurrentStep('details');
  };

  // Handle booking submission
  const handleBookNow = async () => {
    if (isBooked) {
      onClose();
      return;
    }
    
    if (!user) {
      showBookingError(hotel.name, 'Please log in to make a booking.');
      return;
    }
    
    // Validate form
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.address) {
      showBookingError(hotel.name, 'Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      showBookingError(hotel.name, 'Please enter a valid email address.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(bookingForm.phone.replace(/\D/g, ''))) {
      showBookingError(hotel.name, 'Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    
    try {
      // Create booking using the booking service
      const bookingData = {
        type: 'Hotel' as const,
        itemId: hotel.id,
        itemName: hotel.name,
        agentId: user.id,
        agentName: user.name,
        customerName: bookingForm.name,
        customerEmail: bookingForm.email,
        customerPhone: bookingForm.phone,
        bookingDate: new Date().toISOString().split('T')[0],
        travelDate: bookingForm.checkInDate?.format('YYYY-MM-DD') || '',
        status: 'Confirmed' as const,
        totalAmount: calculateTotalPrice(),
        commissionAmount: Math.round(calculateTotalPrice() * 0.05), // 5% commission
        paymentStatus: 'Paid' as const,
        guests: bookingForm.guestCount,
        specialRequests: `Room: ${bookingForm.roomType}, Meal: ${bookingForm.mealPlan}, Nights: ${calculateNights()}`,
        region: user.role === 'Travel Agent' ? 'Delhi' : 'Mumbai' // Mock region assignment
      };

      const newBooking = await createBooking(bookingData);
      
      if (newBooking) {
        // Show confirmation step
        setCurrentStep('confirmation');
        
        // Show success notification
        showBookingSuccess(newBooking.id, hotel.name);
        
        // Call success callback
        if (onBookingSuccess) {
          onBookingSuccess(hotel.id);
        }
        
        // Auto close after showing confirmation
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        throw new Error('Failed to create booking');
      }
      
    } catch (error) {
      console.error('Booking error:', error);
      showBookingError(hotel.name, 'Booking failed. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {hotel.name}
            {isBooked && <span className="ml-2 text-green-600 text-lg">(Booked)</span>}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Hotel Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Image and Basic Info */}
            <div>
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={20} />
                  <span><strong>Location:</strong> {hotel.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Star size={20} />
                  <span><strong>Rating:</strong> {hotel.starRating} Stars</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Bed size={20} />
                  <span><strong>Hotel Type:</strong> {hotel.hotelType}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Amenities and Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700 mb-4">{hotel.description}</p>
              
              <h3 className="text-lg font-semibold mb-3">Hotel Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {hotel.amenities.map((amenity, index) => (
                  <span key={index} className="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded border border-blue-200">
                    {amenity}
                  </span>
                ))}
              </div>
              
              {/* Reviews Button */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    onClose();
                    onShowReviews?.();
                  }}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  View Guest Reviews
                </button>
              </div>
            </div>
          </div>

          {/* Booking Confirmation Step */}
          {currentStep === 'confirmation' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {isBooked ? 'Booking Details' : 'Booking Confirmed!'}
              </h3>
              {!isBooked && (
                <p className="text-gray-600 mb-6">
                  Thank you for booking with us! Your hotel reservation has been confirmed.
                </p>
              )}
              
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto text-left">
                <h4 className="font-semibold text-gray-800 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hotel:</span>
                    <span className="font-medium">{hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{bookingForm.checkInDate?.format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{bookingForm.checkOutDate?.format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{bookingForm.guestCount}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Paid:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>
              </div>
              
              {!isBooked && (
                <p className="text-sm text-gray-500 mt-4">
                  A confirmation email has been sent to {bookingForm.email}
                </p>
              )}
            </div>
          )}
          {/* Selection Step */}
          {currentStep === 'selection' && !isBooked && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Selection Options */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Customize Your Booking</h3>
                
                {/* Check-in and Check-out Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Check-in Date
                    </label>
                    <DatePicker
                      value={bookingForm.checkInDate}
                      onChange={(date) => handleFormChange('checkInDate', date)}
                      className="w-full"
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current < dayjs().endOf('day')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Check-out Date
                    </label>
                    <DatePicker
                      value={bookingForm.checkOutDate}
                      onChange={(date) => handleFormChange('checkOutDate', date)}
                      className="w-full"
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current <= (bookingForm.checkInDate || dayjs())}
                    />
                  </div>
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Bed size={16} />
                    Room Type
                  </label>
                  <select
                    value={bookingForm.roomType}
                    onChange={(e) => handleFormChange('roomType', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {hotel.availableRoomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type} - {Math.round((roomPricing[type as keyof typeof roomPricing] || 1) * 100 - 100)}% {(roomPricing[type as keyof typeof roomPricing] || 1) > 1 ? 'premium' : 'standard'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Meal Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Utensils size={16} />
                    Meal Plan
                  </label>
                  <select
                    value={bookingForm.mealPlan}
                    onChange={(e) => handleFormChange('mealPlan', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {hotel.mealPlans.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan} - +{formatPrice(mealPricing[plan as keyof typeof mealPricing] || 0)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Number of Guests
                  </label>
                  <select
                    value={bookingForm.guestCount}
                    onChange={(e) => handleFormChange('guestCount', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={count}>
                        {count} {count === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column - Booking Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Hotel:</span>
                    <span className="font-medium">{hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{bookingForm.checkInDate?.format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{bookingForm.checkOutDate?.format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meal Plan:</span>
                    <span>{bookingForm.mealPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{bookingForm.guestCount}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Price:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Next: Guest Details
                </button>
              </div>
            </div>
          )}

          {/* Details Step */}
          {currentStep === 'details' && !isBooked && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Guest Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setCurrentStep('selection')}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    ← Back to Selection
                  </button>
                  <h3 className="text-xl font-semibold text-gray-800">Guest Details</h3>
                </div>

                {/* Guest Information Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={bookingForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter 10-digit phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      value={bookingForm.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Summary (Repeated) */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Final Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Hotel:</span>
                    <span className="font-medium">{hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{bookingForm.checkInDate?.format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{bookingForm.checkOutDate?.format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meal Plan:</span>
                    <span>{bookingForm.mealPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{bookingForm.guestCount}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Price:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={loading}
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Book Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelModal;