import React, { useState } from 'react';
import { X, Calendar, Users, Utensils, Bed, Ship, Star, CreditCard, FileText, CheckCircle } from 'lucide-react';
import { Cruise } from '../types';
import { useBookings } from '../hooks/useBookings';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';

interface CruiseModalProps {
  cruise: Cruise;
  onClose: () => void;
  onBookingSuccess?: (cruiseId: string) => void;
  onShowReviews?: () => void;
  isBooked?: boolean;
}

interface BookingForm {
  departureDate: string;
  roomType: string;
  mealPlan: string;
  passengerCount: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CruiseModal: React.FC<CruiseModalProps> = ({ cruise, onClose, onBookingSuccess, onShowReviews, isBooked = false }) => {
  const { createBooking } = useBookings();
  const { showBookingSuccess, showBookingError } = useNotifications();
  const { user } = useAuth();
  
  // Booking flow state
  const [currentStep, setCurrentStep] = useState<'details' | 'selection' | 'payment' | 'confirmation'>(
    isBooked ? 'confirmation' : 'details'
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews' | 'booking'>('overview');
  
  // Loading state
  const [loading, setLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(cruise.pricePerPerson);
  
  // Form state
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    departureDate: cruise.departureDates[0],
    roomType: cruise.roomTypes[0],
    mealPlan: cruise.mealPlans[0],
    passengerCount: 2,
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Room type pricing multipliers
  const roomPricing = {
    'Interior': 1.0,
    'Ocean View': 1.3,
    'Balcony': 1.6,
    'Suite': 2.2,
    'Penthouse': 3.0
  };

  // Meal plan pricing
  const mealPricing = {
    'All Inclusive': 5000,
    'Premium Plus': 3000,
    'Basic Plus': 1500
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = cruise.pricePerPerson;
    const roomMultiplier = roomPricing[bookingForm.roomType as keyof typeof roomPricing] || 1.0;
    const mealPrice = mealPricing[bookingForm.mealPlan as keyof typeof mealPricing] || 0;
    
    return (basePrice * roomMultiplier + mealPrice) * bookingForm.passengerCount;
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
  const handleFormChange = (field: keyof BookingForm, value: string | number) => {
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
      showBookingError(cruise.name, 'Please log in to make a booking.');
      return;
    }
    
    // Validate form
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.address) {
      showBookingError(cruise.name, 'Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      showBookingError(cruise.name, 'Please enter a valid email address.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(bookingForm.phone.replace(/\D/g, ''))) {
      showBookingError(cruise.name, 'Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    
    try {
      // Create booking using the booking service
      const newBooking = await createBooking({
        type: 'Cruise',
        itemId: cruise.id,
        itemName: cruise.name,
        agentId: user.id,
        agentName: user.name,
        customerName: bookingForm.name,
        customerEmail: bookingForm.email,
        customerPhone: bookingForm.phone,
        bookingDate: new Date().toISOString().split('T')[0],
        travelDate: bookingForm.departureDate,
        status: 'Confirmed',
        totalAmount: calculateTotalPrice(),
        commissionAmount: Math.round(calculateTotalPrice() * 0.05),
        paymentStatus: 'Paid',
        guests: bookingForm.passengerCount,
        specialRequests: `Room: ${bookingForm.roomType}, Meal: ${bookingForm.mealPlan}`,
        region: user.role === 'Travel Agent' ? 'Delhi' : 'Mumbai'
      });
      
      if (newBooking) {
        // Show confirmation step
        setCurrentStep('confirmation');
        
        // Show success notification
        showBookingSuccess(newBooking.id, cruise.name);
        
        // Call success callback
        if (onBookingSuccess) {
          onBookingSuccess(cruise.id);
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
      showBookingError(cruise.name, 'Booking failed. Please try again or contact support.');
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
            {cruise.name}
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
          {/* Cruise Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Image and Basic Info */}
            <div>
              {/* Image Gallery */}
              <div className="mb-4">
                <img
                  src={cruise.image}
                  alt={cruise.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {cruise.gallery && cruise.gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {cruise.gallery.slice(0, 4).map((media, index) => (
                      <img
                        key={index}
                        src={media.thumbnail || media.url}
                        alt={media.caption || `Gallery ${index + 1}`}
                        className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Ship size={20} />
                  <span><strong>Route:</strong> {cruise.from} → {cruise.to}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar size={20} />
                  <span><strong>Duration:</strong> {cruise.duration} nights</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Star size={20} />
                  <span><strong>Ship Type:</strong> {cruise.shipType}</span>
                </div>
                {cruise.sustainability?.certifications.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={20} className="text-green-600" />
                    <span><strong>Eco-Certified:</strong> {cruise.sustainability.certifications.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Amenities and Description */}
            <div>
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-4">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'itinerary', label: 'Itinerary' },
                  { key: 'reviews', label: 'Reviews' },
                  { key: 'booking', label: 'Book Now' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 mb-4">{cruise.description}</p>
                  
                  <h3 className="text-lg font-semibold mb-3">Ship Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cruise.amenities.map((amenity, index) => (
                      <span key={index} className="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Cruise Itinerary</h3>
                  {cruise.itinerary && cruise.itinerary.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cruise.itinerary.map(day => (
                        <div key={day.day} className="border-l-2 border-blue-200 pl-4">
                          <div className="font-medium text-gray-800">
                            Day {day.day}: {day.port}
                          </div>
                          {day.arrival && day.departure && (
                            <div className="text-sm text-gray-600">
                              {day.arrival} - {day.departure}
                            </div>
                          )}
                          {day.highlights.length > 0 && (
                            <div className="text-sm text-gray-700 mt-1">
                              • {day.highlights.join(' • ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Detailed itinerary will be provided upon booking.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="max-h-64 overflow-y-auto">
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        onClose();
                        onShowReviews?.();
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                    >
                      View All Reviews
                    </button>
                    <p className="text-sm text-gray-600 text-center">
                      See what other travelers are saying about {cruise.name}
                    </p>
                  </div>
                </div>
              )}
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
                  Thank you for booking with us! Your cruise reservation has been confirmed.
                </p>
              )}
              
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto text-left">
                <h4 className="font-semibold text-gray-800 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cruise:</span>
                    <span className="font-medium">{cruise.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(bookingForm.departureDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{bookingForm.passengerCount}</span>
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
          {currentStep === 'selection' && !isBooked && activeTab === 'booking' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Selection Options */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Customize Your Booking</h3>
                
                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Departure Date
                  </label>
                  <select
                    value={bookingForm.departureDate}
                    onChange={(e) => handleFormChange('departureDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cruise.departureDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
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
                    {cruise.roomTypes.map((type) => (
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
                    {cruise.mealPlans.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan} - +{formatPrice(mealPricing[plan as keyof typeof mealPricing] || 0)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Passenger Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Number of Passengers
                  </label>
                  <select
                    value={bookingForm.passengerCount}
                    onChange={(e) => handleFormChange('passengerCount', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={count}>
                        {count} {count === 1 ? 'Passenger' : 'Passengers'}
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
                    <span>Cruise:</span>
                    <span className="font-medium">{cruise.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(bookingForm.departureDate).toLocaleDateString('en-IN')}</span>
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
                    <span>Passengers:</span>
                    <span>{bookingForm.passengerCount}</span>
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
                  Next: Passenger Details
                </button>
              </div>
            </div>
          )}

          {/* Details Step */}
          {currentStep === 'details' && !isBooked && activeTab === 'booking' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Passenger Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setCurrentStep('selection')}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    ← Back to Selection
                  </button>
                  <h3 className="text-xl font-semibold text-gray-800">Passenger Details</h3>
                </div>

                {/* Passenger Information Form */}
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
                    <span>Cruise:</span>
                    <span className="font-medium">{cruise.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(bookingForm.departureDate).toLocaleDateString('en-IN')}</span>
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
                    <span>Passengers:</span>
                    <span>{bookingForm.passengerCount}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Price:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={handleBookNow}
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Book Now (Pay Later)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && !isBooked && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setCurrentStep('details')}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    ← Back to Details
                  </button>
                  <h3 className="text-xl font-semibold text-gray-800">Payment Information</h3>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <CreditCard size={20} />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Your payment information is encrypted and secure. We accept all major credit cards and digital wallets.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="wallet">Digital Wallet</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Cruise:</span>
                    <span className="font-medium">{cruise.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(bookingForm.departureDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{bookingForm.passengerCount}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Amount:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={loading}
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing Payment...' : 'Complete Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CruiseModal;