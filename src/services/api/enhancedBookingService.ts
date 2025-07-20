import { EnhancedBooking, BookingEvent, ApiResponse, PaginatedResponse } from '../../types/enhanced';
import { SupabaseService } from '../SupabaseService';
import { AppErrorHandler, RetryHandler } from '../../utils/errorHandler';
import { Validator } from '../../utils/validation';

class EnhancedBookingService {
  async getUserBookings(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedResponse<EnhancedBooking>> {
    try {
      Validator.required(userId, 'userId');
      
      return await RetryHandler.withRetry(async () => {
        // Try Supabase first
        try {
          const bookings = await SupabaseService.getUserBookings(userId);
          
          // Enhance bookings with additional data
          const enhancedBookings = await Promise.all(
            bookings.map(booking => this.enhanceBooking(booking))
          );

          // Apply pagination
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedBookings = enhancedBookings.slice(startIndex, endIndex);

          return {
            data: paginatedBookings,
            total: enhancedBookings.length,
            page,
            limit,
            hasMore: endIndex < enhancedBookings.length,
            totalPages: Math.ceil(enhancedBookings.length / limit)
          };
        } catch (supabaseError) {
          console.warn('Supabase booking fetch failed, using fallback:', supabaseError);
          
          // Fallback to localStorage
          const mockBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
          const userBookings = mockBookings.filter((b: any) => b.agentId === userId);
          
          const enhancedBookings = userBookings.map((booking: any) => ({
            ...booking,
            timeline: this.generateMockTimeline(booking),
            documents: this.generateMockDocuments(booking),
            preferences: {},
            upgrades: []
          }));

          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedBookings = enhancedBookings.slice(startIndex, endIndex);

          return {
            data: paginatedBookings,
            total: enhancedBookings.length,
            page,
            limit,
            hasMore: endIndex < enhancedBookings.length,
            totalPages: Math.ceil(enhancedBookings.length / limit)
          };
        }
      });
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.getUserBookings');
      throw appError;
    }
  }

  async createBooking(bookingData: any): Promise<ApiResponse<EnhancedBooking>> {
    try {
      Validator.validateBooking(bookingData);
      
      return await RetryHandler.withRetry(async () => {
        try {
          // Try Supabase first
          const booking = await SupabaseService.createBooking(bookingData);
          const enhancedBooking = await this.enhanceBooking(booking);
          
          // Add initial timeline event
          await this.addBookingEvent(enhancedBooking.id, {
            type: 'created',
            description: `Booking created for ${bookingData.itemName}`,
            userId: bookingData.agentId,
            userName: bookingData.agentName
          });

          return {
            data: enhancedBooking,
            success: true,
            timestamp: new Date().toISOString()
          };
        } catch (supabaseError) {
          console.warn('Supabase booking creation failed, using fallback:', supabaseError);
          
          // Fallback to localStorage
          const mockBooking = {
            ...bookingData,
            id: `booking-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timeline: this.generateMockTimeline(bookingData),
            documents: [],
            preferences: {},
            upgrades: []
          };
          
          const existingBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
          existingBookings.push(mockBooking);
          localStorage.setItem('mock_bookings', JSON.stringify(existingBookings));
          
          return {
            data: mockBooking,
            success: true,
            timestamp: new Date().toISOString()
          };
        }
      });
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.createBooking');
      throw appError;
    }
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<ApiResponse<EnhancedBooking>> {
    try {
      Validator.required(bookingId, 'bookingId');
      Validator.required(status, 'status');
      
      return await RetryHandler.withRetry(async () => {
        try {
          // Try Supabase first
          const booking = await SupabaseService.updateBooking(bookingId, { status: status as any });
          const enhancedBooking = await this.enhanceBooking(booking);
          
          // Add timeline event
          await this.addBookingEvent(bookingId, {
            type: 'modified',
            description: `Booking status updated to ${status}`,
            userId: booking.agentId,
            userName: booking.agentName
          });

          return {
            data: enhancedBooking,
            success: true,
            timestamp: new Date().toISOString()
          };
        } catch (supabaseError) {
          console.warn('Supabase booking update failed, using fallback:', supabaseError);
          
          // Fallback to localStorage
          const existingBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
          const updatedBookings = existingBookings.map((b: any) => 
            b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b
          );
          localStorage.setItem('mock_bookings', JSON.stringify(updatedBookings));
          
          const updatedBooking = updatedBookings.find((b: any) => b.id === bookingId);
          
          return {
            data: updatedBooking,
            success: true,
            timestamp: new Date().toISOString()
          };
        }
      });
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.updateBookingStatus');
      throw appError;
    }
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<{ booking: EnhancedBooking; refund: any }>> {
    try {
      Validator.required(bookingId, 'bookingId');
      
      return await RetryHandler.withRetry(async () => {
        try {
          // Try Supabase first
          const booking = await SupabaseService.updateBooking(bookingId, { 
            status: 'Cancelled',
            paymentStatus: 'Refunded',
            specialRequests: reason ? `Cancellation reason: ${reason}` : undefined
          });
          
          const enhancedBooking = await this.enhanceBooking(booking);
          
          // Add timeline event
          await this.addBookingEvent(bookingId, {
            type: 'cancelled',
            description: `Booking cancelled${reason ? `: ${reason}` : ''}`,
            userId: booking.agentId,
            userName: booking.agentName
          });

          // Mock refund processing
          const refund = {
            refundId: `ref_${Date.now()}`,
            amount: booking.totalAmount,
            status: 'Processing',
            estimatedDays: 5
          };

          return {
            data: { booking: enhancedBooking, refund },
            success: true,
            timestamp: new Date().toISOString()
          };
        } catch (supabaseError) {
          console.warn('Supabase booking cancellation failed, using fallback:', supabaseError);
          
          // Fallback to localStorage
          const existingBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
          const updatedBookings = existingBookings.map((b: any) => 
            b.id === bookingId 
              ? { 
                  ...b, 
                  status: 'Cancelled', 
                  paymentStatus: 'Refunded',
                  cancellationReason: reason,
                  updatedAt: new Date().toISOString() 
                } 
              : b
          );
          localStorage.setItem('mock_bookings', JSON.stringify(updatedBookings));
          
          const cancelledBooking = updatedBookings.find((b: any) => b.id === bookingId);
          
          return {
            data: { 
              booking: cancelledBooking, 
              refund: { refundId: `ref_${Date.now()}`, amount: cancelledBooking.totalAmount }
            },
            success: true,
            timestamp: new Date().toISOString()
          };
        }
      });
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.cancelBooking');
      throw appError;
    }
  }

  async addBookingEvent(bookingId: string, event: Omit<BookingEvent, 'id' | 'timestamp'>): Promise<ApiResponse<BookingEvent>> {
    try {
      const bookingEvent: BookingEvent = {
        ...event,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };

      // In a real implementation, this would be stored in the database
      // For now, we'll just return the event
      return {
        data: bookingEvent,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.addBookingEvent');
      throw appError;
    }
  }

  async generateDocument(bookingId: string, type: string): Promise<ApiResponse<{ url: string }>> {
    try {
      Validator.required(bookingId, 'bookingId');
      Validator.required(type, 'type');
      
      // Mock document generation
      const documentUrl = `https://documents.yorkeholidays.com/${bookingId}/${type}.pdf`;
      
      return {
        data: { url: documentUrl },
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.generateDocument');
      throw appError;
    }
  }

  private async enhanceBooking(booking: any): Promise<EnhancedBooking> {
    return {
      ...booking,
      timeline: this.generateMockTimeline(booking),
      documents: this.generateMockDocuments(booking),
      preferences: {
        dietaryRequirements: ['Vegetarian'],
        accessibility: [],
        roomPreferences: ['Non-smoking', 'High floor'],
        activityInterests: ['Cultural tours', 'Spa treatments']
      },
      upgrades: []
    };
  }

  private generateMockTimeline(booking: any): BookingEvent[] {
    const events: BookingEvent[] = [
      {
        id: 'event_1',
        type: 'created',
        description: `Booking created for ${booking.itemName}`,
        timestamp: booking.createdAt || new Date().toISOString(),
        userId: booking.agentId,
        userName: booking.agentName
      }
    ];

    if (booking.status === 'Confirmed') {
      events.push({
        id: 'event_2',
        type: 'confirmed',
        description: 'Booking confirmed and payment processed',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        userId: booking.agentId,
        userName: booking.agentName
      });
    }

    if (booking.status === 'Cancelled') {
      events.push({
        id: 'event_3',
        type: 'cancelled',
        description: 'Booking cancelled by customer request',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        userId: booking.agentId,
        userName: booking.agentName
      });
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private generateMockDocuments(booking: any) {
    const documents = [
      {
        id: 'doc_1',
        type: 'invoice',
        name: `Invoice_${booking.id}.pdf`,
        url: `https://documents.yorkeholidays.com/${booking.id}/invoice.pdf`,
        generatedAt: booking.createdAt || new Date().toISOString()
      }
    ];

    if (booking.status === 'Confirmed') {
      documents.push({
        id: 'doc_2',
        type: 'voucher',
        name: `Voucher_${booking.id}.pdf`,
        url: `https://documents.yorkeholidays.com/${booking.id}/voucher.pdf`,
        generatedAt: new Date().toISOString()
      });
    }

    return documents;
  }
}

export const enhancedBookingService = new EnhancedBookingService();