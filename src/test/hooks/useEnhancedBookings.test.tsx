import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEnhancedBookings } from '../../hooks/useEnhancedBookings';
import { AuthProvider } from '../../hooks/useAuth';
import { enhancedBookingService } from '../../services/api/enhancedBookingService';

// Mock the enhanced booking service
vi.mock('../../services/api/enhancedBookingService', () => ({
  enhancedBookingService: {
    getUserBookings: vi.fn(),
    createBooking: vi.fn(),
    updateBookingStatus: vi.fn(),
    cancelBooking: vi.fn(),
  }
}));

// Mock the auth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user1', name: 'Test User', role: 'Travel Agent' }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock notifications hook
vi.mock('../../hooks/useNotifications', () => ({
  useNotifications: () => ({
    showBookingSuccess: vi.fn(),
    showBookingError: vi.fn(),
    showError: vi.fn()
  })
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useEnhancedBookings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch bookings on mount', async () => {
    const mockBookings = [
      {
        id: '1',
        type: 'Cruise',
        itemName: 'Test Cruise',
        totalAmount: 50000,
        status: 'Confirmed'
      }
    ];

    vi.mocked(enhancedBookingService.getUserBookings).mockResolvedValue({
      data: mockBookings,
      total: 1,
      page: 1,
      limit: 10,
      hasMore: false,
      totalPages: 1
    });

    const { result } = renderHook(() => useEnhancedBookings(), { wrapper });

    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(enhancedBookingService.getUserBookings).toHaveBeenCalledWith('user1');
    expect(result.current.bookings).toEqual(mockBookings);
  });

  it('should create booking successfully', async () => {
    const newBooking = {
      id: '2',
      type: 'Hotel' as const,
      itemName: 'Test Hotel',
      totalAmount: 30000,
      status: 'Confirmed' as const
    };

    vi.mocked(enhancedBookingService.createBooking).mockResolvedValue({
      data: newBooking,
      success: true,
      timestamp: new Date().toISOString()
    });

    const { result } = renderHook(() => useEnhancedBookings(), { wrapper });

    await act(async () => {
      const bookingData = {
        type: 'Hotel' as const,
        itemName: 'Test Hotel',
        totalAmount: 30000,
        agentId: 'user1',
        agentName: 'Test User',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+91 9876543210',
        bookingDate: '2024-01-01',
        travelDate: '2024-06-01',
        status: 'Confirmed' as const,
        commissionAmount: 1500,
        paymentStatus: 'Paid' as const,
        guests: 2,
        region: 'Mumbai'
      };

      const result_booking = await result.current.createBooking(bookingData);
      expect(result_booking).toEqual(newBooking);
    });

    expect(enhancedBookingService.createBooking).toHaveBeenCalled();
  });

  it('should calculate analytics correctly', async () => {
    const mockBookings = [
      {
        id: '1',
        type: 'Cruise',
        status: 'Confirmed',
        totalAmount: 50000,
        commissionAmount: 2500
      },
      {
        id: '2',
        type: 'Hotel',
        status: 'Pending',
        totalAmount: 30000,
        commissionAmount: 1500
      }
    ];

    vi.mocked(enhancedBookingService.getUserBookings).mockResolvedValue({
      data: mockBookings,
      total: 2,
      page: 1,
      limit: 10,
      hasMore: false,
      totalPages: 1
    });

    const { result } = renderHook(() => useEnhancedBookings(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.analytics).toEqual({
      totalBookings: 2,
      totalRevenue: 80000,
      totalCommission: 4000,
      averageBookingValue: 40000,
      conversionRate: 50, // 1 confirmed out of 2 total
      statusDistribution: { 'Confirmed': 1, 'Pending': 1 },
      typeDistribution: { 'Cruise': 1, 'Hotel': 1 },
      monthlyTrend: expect.any(Array)
    });
  });

  it('should handle booking cancellation', async () => {
    const cancelledBooking = {
      id: '1',
      status: 'Cancelled',
      paymentStatus: 'Refunded'
    };

    vi.mocked(enhancedBookingService.cancelBooking).mockResolvedValue({
      data: { booking: cancelledBooking, refund: {} },
      success: true,
      timestamp: new Date().toISOString()
    });

    const { result } = renderHook(() => useEnhancedBookings(), { wrapper });

    await act(async () => {
      const success = await result.current.cancelBooking('1', 'Customer request');
      expect(success).toBe(true);
    });

    expect(enhancedBookingService.cancelBooking).toHaveBeenCalledWith('1', 'Customer request');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(enhancedBookingService.getUserBookings).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useEnhancedBookings(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.bookings).toEqual([]);
  });
});