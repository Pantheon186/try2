import { useState, useEffect, useCallback } from 'react';
import { SupabaseService } from '../services/SupabaseService';
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
      
      // Try Supabase first if configured
      if (config.database.useSupabase) {
        try {
          const userBookings = await SupabaseService.getUserBookings(user.id);
          setBookings(userBookings);
          return;
        } catch (supabaseError) {
          console.warn('Supabase fetch failed, using localStorage:', supabaseError);
        }
      }
      
      // Fallback to localStorage
      const mockBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const userBookings = mockBookings.filter((b: any) => b.agentId === user.id);
      setBookings(userBookings);
    } catch (err: any) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createBooking = useCallback(async (bookingData: Omit<Booking, 'id'>): Promise<Booking | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Try Supabase first if configured
      if (config.database.useSupabase) {
        try {
          const newBooking = await SupabaseService.createBooking(bookingData);
          setBookings(prev => [newBooking, ...prev]);
          return newBooking;
        } catch (supabaseError) {
          console.warn('Supabase create failed, using localStorage:', supabaseError);
        }
      }
      
      // Fallback to localStorage
      const mockBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      existingBookings.push(mockBooking);
      localStorage.setItem('mock_bookings', JSON.stringify(existingBookings));
      
      setBookings(prev => [mockBooking, ...prev]);
      return mockBooking;
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
      
      // Try Supabase first if configured
      if (config.database.useSupabase) {
        try {
          const updatedBooking = await SupabaseService.updateBooking(bookingId, {
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
        } catch (supabaseError) {
          console.warn('Supabase cancel failed, using localStorage:', supabaseError);
        }
      }
      
      // Fallback to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const updatedBookings = existingBookings.map((b: any) => 
        b.id === bookingId 
          ? { ...b, status: 'Cancelled', paymentStatus: 'Refunded' }
          : b
      );
      localStorage.setItem('mock_bookings', JSON.stringify(updatedBookings));
      
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'Cancelled', paymentStatus: 'Refunded' }
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
      
      // Try Supabase first if configured
      if (config.database.useSupabase) {
        try {
          const updatedBooking = await SupabaseService.updateBooking(bookingId, { status });
          
          setBookings(prev => 
            prev.map(booking => 
              booking.id === bookingId 
                ? updatedBooking
                : booking
            )
          );
          return true;
        } catch (supabaseError) {
          console.warn('Supabase update failed, using localStorage:', supabaseError);
        }
      }
      
      // Fallback to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const updatedBookings = existingBookings.map((b: any) => 
        b.id === bookingId 
          ? { ...b, status }
          : b
      );
      localStorage.setItem('mock_bookings', JSON.stringify(updatedBookings));
      
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status }
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
      
      // Set up real-time subscription if Supabase is available and configured
      if (config.database.useSupabase && config.features.enableRealTimeUpdates) {
        try {
          const subscription = SupabaseService.subscribeToBookings(user.id, (payload) => {
            console.log('Real-time booking update:', payload);
            fetchUserBookings(); // Refetch on changes
          });

          return () => {
            if (subscription && subscription.unsubscribe) {
              subscription.unsubscribe();
            }
          };
        } catch (error) {
          console.log('Real-time subscription not available');
        }
      }
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