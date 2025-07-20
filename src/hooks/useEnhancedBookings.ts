import { useState, useEffect, useCallback } from 'react';
import { EnhancedBooking, BookingEvent, AnalyticsData } from '../types/enhanced';
import { enhancedBookingService } from '../services/api/enhancedBookingService';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';
import { AppErrorHandler } from '../utils/errorHandler';

interface UseEnhancedBookingsReturn {
  bookings: EnhancedBooking[];
  loading: boolean;
  error: string | null;
  analytics: AnalyticsData | null;
  createBooking: (bookingData: any) => Promise<EnhancedBooking | null>;
  updateBookingStatus: (bookingId: string, status: string) => Promise<boolean>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<boolean>;
  addBookingEvent: (bookingId: string, event: Omit<BookingEvent, 'id' | 'timestamp'>) => Promise<boolean>;
  generateDocument: (bookingId: string, type: string) => Promise<string | null>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useEnhancedBookings = (): UseEnhancedBookingsReturn => {
  const { user } = useAuth();
  const { showBookingSuccess, showBookingError, showError } = useNotifications();
  
  const [bookings, setBookings] = useState<EnhancedBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

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
      
    } catch (err: any) {
      const appError = AppErrorHandler.handleApiError(err);
      setError(appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.fetchBookings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createBooking = useCallback(async (bookingData: any): Promise<EnhancedBooking | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await enhancedBookingService.createBooking(bookingData);
      
      if (response.success) {
        setBookings(prev => [response.data, ...prev]);
        showBookingSuccess(response.data.id, response.data.itemName);
        
        // Refresh analytics
        await fetchBookings();
        
        return response.data;
      }
      
      throw new Error('Failed to create booking');
    } catch (err: any) {
      const appError = AppErrorHandler.handleApiError(err);
      setError(appError.message);
      showBookingError(bookingData.itemName, appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.createBooking');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showBookingSuccess, showBookingError, fetchBookings]);

  const updateBookingStatus = useCallback(async (bookingId: string, status: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await enhancedBookingService.updateBookingStatus(bookingId, status);
      
      if (response.success) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: status as any }
              : booking
          )
        );
        return true;
      }
      
      throw new Error('Failed to update booking status');
    } catch (err: any) {
      const appError = AppErrorHandler.handleApiError(err);
      setError(appError.message);
      showError('Update Failed', appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.updateBookingStatus');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const cancelBooking = useCallback(async (bookingId: string, reason?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await enhancedBookingService.cancelBooking(bookingId, reason);
      
      if (response.success) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { 
                  ...booking, 
                  status: 'Cancelled',
                  paymentStatus: 'Refunded',
                  cancellationReason: reason
                }
              : booking
          )
        );
        return true;
      }
      
      throw new Error('Failed to cancel booking');
    } catch (err: any) {
      const appError = AppErrorHandler.handleApiError(err);
      setError(appError.message);
      showError('Cancellation Failed', appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.cancelBooking');
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
      
      if (response.success) {
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
      
      throw new Error('Failed to add booking event');
    } catch (err: any) {
      const appError = AppErrorHandler.handleApiError(err);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.addBookingEvent');
      return false;
    }
  }, []);

  const generateDocument = useCallback(async (bookingId: string, type: string): Promise<string | null> => {
    try {
      const response = await enhancedBookingService.generateDocument(bookingId, type);
      
      if (response.success) {
        return response.data.url;
      }
      
      throw new Error('Failed to generate document');
    } catch (err: any) {
      const appError = AppErrorHandler.handleApiError(err);
      showError('Document Generation Failed', appError.message);
      AppErrorHandler.logError(appError, 'useEnhancedBookings.generateDocument');
      return null;
    }
  }, [showError]);

  const calculateAnalytics = (bookingsData: EnhancedBooking[]): AnalyticsData => {
    const totalBookings = bookingsData.length;
    const confirmedBookings = bookingsData.filter(b => b.status === 'Confirmed').length;
    const totalRevenue = bookingsData.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalCommission = bookingsData.reduce((sum, b) => sum + b.commissionAmount, 0);

    const statusDistribution = bookingsData.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeDistribution = bookingsData.reduce((acc, booking) => {
      acc[booking.type] = (acc[booking.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate monthly trend (mock data for now)
    const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      value: Math.floor(Math.random() * 100000) + 50000,
      growth: Math.floor(Math.random() * 20) - 10
    }));

    return {
      bookings: {
        total: totalBookings,
        byStatus: statusDistribution,
        byType: typeDistribution,
        conversionRate: totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0,
        averageValue: totalBookings > 0 ? totalRevenue / totalBookings : 0
      },
      revenue: {
        total: totalRevenue,
        growth: 15.5, // Mock growth percentage
        byMonth: monthlyTrend,
        byRegion: [
          { region: 'Mumbai', value: totalRevenue * 0.4, percentage: 40 },
          { region: 'Delhi', value: totalRevenue * 0.3, percentage: 30 },
          { region: 'Bangalore', value: totalRevenue * 0.2, percentage: 20 },
          { region: 'Others', value: totalRevenue * 0.1, percentage: 10 }
        ]
      },
      customers: {
        total: totalBookings,
        new: Math.floor(totalBookings * 0.6),
        returning: Math.floor(totalBookings * 0.4),
        satisfaction: 4.5,
        demographics: [
          {
            category: 'Age Group',
            segments: [
              { label: '25-35', percentage: 35, count: Math.floor(totalBookings * 0.35) },
              { label: '36-45', percentage: 30, count: Math.floor(totalBookings * 0.30) },
              { label: '46-55', percentage: 25, count: Math.floor(totalBookings * 0.25) },
              { label: '55+', percentage: 10, count: Math.floor(totalBookings * 0.10) }
            ]
          }
        ]
      },
      performance: {
        agents: [], // Will be populated by admin views
        topDestinations: [
          { destination: 'Goa', bookings: 15, revenue: 450000, averageRating: 4.5 },
          { destination: 'Mumbai', bookings: 12, revenue: 380000, averageRating: 4.3 },
          { destination: 'Dubai', bookings: 8, revenue: 520000, averageRating: 4.7 }
        ],
        popularAmenities: [
          { amenity: 'Spa', popularity: 85, satisfaction: 4.6 },
          { amenity: 'Pool', popularity: 92, satisfaction: 4.4 },
          { amenity: 'Gym', popularity: 67, satisfaction: 4.2 }
        ]
      }
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

  return {
    bookings,
    loading,
    error,
    analytics,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    addBookingEvent,
    generateDocument,
    refetch: fetchBookings,
    clearError
  };
};