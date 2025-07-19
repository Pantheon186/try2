import { useState, useEffect, useCallback, useMemo } from 'react';
import { enhancedBookingService } from '../services/api/enhancedBookingService';
import { EnhancedBooking, PaymentDetails, BookingEvent, Review } from '../types/enhanced';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';
import { AppErrorHandler } from '../utils/errorHandler';

interface UseEnhancedBookingsReturn {
  bookings: EnhancedBooking[];
  loading: boolean;
  error: string | null;
  analytics: BookingAnalytics | null;
  createBooking: (bookingData: Omit<EnhancedBooking, 'id' | 'createdAt' | 'updatedAt'>) => Promise<EnhancedBooking | null>;
  updateBookingStatus: (id: string, status: EnhancedBooking['status'], reason?: string) => Promise<boolean>;
  cancelBooking: (id: string, reason: string) => Promise<boolean>;
  processPayment: (bookingId: string, paymentData: Partial<PaymentDetails>) => Promise<boolean>;
  addBookingEvent: (bookingId: string, event: Omit<BookingEvent, 'id' | 'timestamp'>) => Promise<boolean>;
  addReview: (bookingId: string, review: Omit<Review, 'id' | 'createdAt' | 'verified' | 'helpful'>) => Promise<boolean>;
  getBookingById: (id: string) => EnhancedBooking | undefined;
  getBookingsByStatus: (status: EnhancedBooking['status']) => EnhancedBooking[];
  calculateCancellationRefund: (bookingId: string) => Promise<{ refundAmount: number; fees: number; policy: string } | null>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface BookingAnalytics {
  totalBookings: number;
  totalRevenue: number;
  totalCommission: number;
  averageBookingValue: number;
  conversionRate: number;
  statusDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  monthlyTrend: { month: string; bookings: number; revenue: number }[];
}

export const useEnhancedBookings = (): UseEnhancedBookingsReturn => {
  const { user } = useAuth();
  const { showBookingSuccess, showBookingError, showError } = useNotifications();
  
  const [bookings, setBookings] = useState<EnhancedBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await enhancedBookingService.getUserBookings(user.id);
      setBookings(response.data);

      // Calculate analytics
      const analyticsData = calculateAnalytics(response.data);
      setAnalytics(analyticsData);

    } catch (err) {
      const appError = AppErrorHandler.handleApiError(err);
      setError(appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.fetchBookings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createBooking = useCallback(async (
    bookingData: Omit<EnhancedBooking, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<EnhancedBooking | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await enhancedBookingService.createBooking(bookingData);
      
      if (response.success && response.data) {
        setBookings(prev => [response.data, ...prev]);
        showBookingSuccess(response.data.id, response.data.itemName);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create booking');
      }
    } catch (err) {
      const appError = AppErrorHandler.handleApiError(err);
      setError(appError.message);
      showBookingError(bookingData.itemName, appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.createBooking');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showBookingSuccess, showBookingError]);

  const updateBookingStatus = useCallback(async (
    id: string, 
    status: EnhancedBooking['status'],
    reason?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await enhancedBookingService.updateBookingStatus(id, status, reason);
      
      if (response.success && response.data) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === id ? response.data : booking
          )
        );
        return true;
      } else {
        throw new Error(response.error || 'Failed to update booking status');
      }
    } catch (err) {
      const appError = AppErrorHandler.handleApiError(err);
      setError(appError.message);
      showError('Update Failed', appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.updateBookingStatus');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const cancelBooking = useCallback(async (id: string, reason: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await enhancedBookingService.cancelBooking(id, reason);
      
      if (response.success && response.data) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === id ? response.data.booking : booking
          )
        );
        return true;
      } else {
        throw new Error(response.error || 'Failed to cancel booking');
      }
    } catch (err) {
      const appError = AppErrorHandler.handleApiError(err);
      setError(appError.message);
      showError('Cancellation Failed', appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.cancelBooking');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const processPayment = useCallback(async (
    bookingId: string,
    paymentData: Partial<PaymentDetails>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await enhancedBookingService.processPayment(bookingId, paymentData);
      
      if (response.success) {
        // Update booking with payment information
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, paymentDetails: response.data }
              : booking
          )
        );
        return true;
      } else {
        throw new Error(response.error || 'Payment processing failed');
      }
    } catch (err) {
      const appError = AppErrorHandler.handleApiError(err);
      setError(appError.message);
      showError('Payment Failed', appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.processPayment');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const addBookingEvent = useCallback(async (
    bookingId: string,
    event: Omit<BookingEvent, 'id' | 'timestamp'>
  ): Promise<boolean> => {
    try {
      const response = await enhancedBookingService.addBookingEvent(bookingId, event);
      
      if (response.success && response.data) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { 
                  ...booking, 
                  timeline: [...(booking.timeline || []), response.data]
                }
              : booking
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      const appError = AppErrorHandler.handleApiError(err);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.addBookingEvent');
      return false;
    }
  }, []);

  const addReview = useCallback(async (
    bookingId: string,
    review: Omit<Review, 'id' | 'createdAt' | 'verified' | 'helpful'>
  ): Promise<boolean> => {
    try {
      const response = await enhancedBookingService.addReview(bookingId, review);
      
      if (response.success && response.data) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { 
                  ...booking, 
                  reviews: [...(booking.reviews || []), response.data]
                }
              : booking
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      const appError = AppErrorHandler.handleApiError(err);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.addReview');
      return false;
    }
  }, []);

  const calculateCancellationRefund = useCallback(async (
    bookingId: string
  ): Promise<{ refundAmount: number; fees: number; policy: string } | null> => {
    try {
      const response = await enhancedBookingService.calculateCancellationRefund(bookingId);
      return response.success ? response.data : null;
    } catch (err) {
      const appError = AppErrorHandler.handleApiError(err);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.calculateCancellationRefund');
      return null;
    }
  }, []);

  const getBookingById = useCallback((id: string): EnhancedBooking | undefined => {
    return bookings.find(booking => booking.id === id);
  }, [bookings]);

  const getBookingsByStatus = useCallback((status: EnhancedBooking['status']): EnhancedBooking[] => {
    return bookings.filter(booking => booking.status === status);
  }, [bookings]);

  const calculateAnalytics = (bookingData: EnhancedBooking[]): BookingAnalytics => {
    const totalBookings = bookingData.length;
    const totalRevenue = bookingData.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const totalCommission = bookingData.reduce((sum, booking) => sum + booking.commissionAmount, 0);
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    
    const confirmedBookings = bookingData.filter(b => b.status === 'Confirmed').length;
    const conversionRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

    const statusDistribution = bookingData.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeDistribution = bookingData.reduce((acc, booking) => {
      acc[booking.type] = (acc[booking.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mock monthly trend - in real app, this would be calculated from actual data
    const monthlyTrend = [
      { month: 'Jan', bookings: 15, revenue: 750000 },
      { month: 'Feb', bookings: 18, revenue: 900000 },
      { month: 'Mar', bookings: 22, revenue: 1100000 }
    ];

    return {
      totalBookings,
      totalRevenue,
      totalCommission,
      averageBookingValue,
      conversionRate,
      statusDistribution,
      typeDistribution,
      monthlyTrend
    };
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setBookings([]);
      setAnalytics(null);
    }
  }, [user, fetchBookings]);

  return useMemo(() => ({
    bookings,
    loading,
    error,
    analytics,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    processPayment,
    addBookingEvent,
    addReview,
    getBookingById,
    getBookingsByStatus,
    calculateCancellationRefund,
    refetch: fetchBookings,
    clearError
  }), [
    bookings,
    loading,
    error,
    analytics,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    processPayment,
    addBookingEvent,
    addReview,
    getBookingById,
    getBookingsByStatus,
    calculateCancellationRefund,
    fetchBookings,
    clearError
  ]);
};