// Bookings Hook - Manages booking-related state and operations
import { useState, useEffect } from 'react';
import { BookingService, type Booking } from '../services/mockDataService';
import { useAuth } from './useAuth';

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's bookings
  const fetchUserBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const userBookings = await BookingService.getUserBookings(user.id);
      setBookings(userBookings);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new booking
  const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<Booking | null> => {
    try {
      setLoading(true);
      setError(null);
      const newBooking = await BookingService.createBooking(bookingData);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      setError('Failed to create booking');
      console.error('Error creating booking:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await BookingService.cancelBooking(bookingId);
      
      if (success) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'Cancelled', paymentStatus: 'Refunded' }
              : booking
          )
        );
      }
      return success;
    } catch (err) {
      setError('Failed to cancel booking');
      console.error('Error cancelling booking:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await BookingService.updateBookingStatus(bookingId, status);
      
      if (updatedBooking) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId ? updatedBooking : booking
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating booking status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get booking by ID
  const getBookingById = (bookingId: string): Booking | undefined => {
    return bookings.find(booking => booking.id === bookingId);
  };

  // Get bookings by status
  const getBookingsByStatus = (status: Booking['status']): Booking[] => {
    return bookings.filter(booking => booking.status === status);
  };

  // Calculate total booking value
  const getTotalBookingValue = (): number => {
    return bookings.reduce((total, booking) => total + booking.totalAmount, 0);
  };

  // Calculate total commission earned
  const getTotalCommissionEarned = (): number => {
    return bookings.reduce((total, booking) => total + booking.commissionAmount, 0);
  };

  // Fetch bookings when user changes
  useEffect(() => {
    if (user) {
      fetchUserBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    updateBookingStatus,
    getBookingById,
    getBookingsByStatus,
    getTotalBookingValue,
    getTotalCommissionEarned,
    refetch: fetchUserBookings
  };
};