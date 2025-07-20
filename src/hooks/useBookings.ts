import { useState, useEffect, useCallback } from 'react';
import { MockDataService } from '../services/MockDataService';
import { Booking } from '../types';
import { useAuth } from './useAuth';
import { config } from '../config/environment';

interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  createBooking: (bookingData: Omit<Booking, 'id'>) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<boolean>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useBookings = (): UseBookingsReturn => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUserBookings = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Use MockDataService for bookings
      const userBookings = await MockDataService.getUserBookings(user.id);
      setBookings(userBookings);
      
    } catch (err: any) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings');
      setError(null);
      
      // Use MockDataService for booking creation
      const newBooking = await MockDataService.createBooking(bookingData);
      setBookings(prev => [newBooking, ...prev]);
      return newBooking;
      
    } catch (err: any) {
      console.error('Failed to create booking:', err);
      setError('Failed to create booking');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Use MockDataService for booking cancellation
      const updatedBooking = await MockDataService.updateBooking(bookingId, {
        status: 'Cancelled',
        paymentStatus: 'Refunded'
      });
      
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? updatedBooking
            : booking
        )
      );
      return true;
    } catch (err: any) {
      console.error('Failed to cancel booking:', err);
      setError('Failed to cancel booking');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBookingStatus = useCallback(async (bookingId: string, status: Booking['status']): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Use MockDataService for booking status update
      const updatedBooking = await MockDataService.updateBooking(bookingId, { status });
      
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? updatedBooking
            : booking
        )
      );
      return true;
    } catch (err: any) {
      console.error('Failed to update booking status:', err);
      setError('Failed to update booking status');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    } else {
      setBookings([]);
    }
  }, [user, fetchUserBookings]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    updateBookingStatus,
    refetch: fetchUserBookings,
    clearError
  };
};