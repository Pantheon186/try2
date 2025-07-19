// Enhanced Booking Service with comprehensive functionality
import { BaseService } from './baseService';
import { EnhancedBooking, PaymentDetails, TravelDetails, BookingEvent, Review } from '../../types/enhanced';
import { ApiResponse, PaginatedResponse } from '../../types/api';
import { Validator } from '../../utils/validation';
import { AppErrorHandler } from '../../utils/errorHandler';

export class EnhancedBookingService extends BaseService {
  private readonly endpoint = '/api/bookings';

  async createBooking(bookingData: Omit<EnhancedBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<EnhancedBooking>> {
    try {
      // Comprehensive validation
      this.validateBookingData(bookingData);
      
      // Calculate pricing with dynamic rates
      const enhancedData = await this.enhanceBookingData(bookingData);
      
      return await this.post<EnhancedBooking>(this.endpoint, enhancedData);
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.createBooking');
      throw appError;
    }
  }

  async getBookingById(id: string): Promise<ApiResponse<EnhancedBooking>> {
    try {
      return await this.get<EnhancedBooking>(`${this.endpoint}/${id}`);
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.getBookingById');
      throw appError;
    }
  }

  async getUserBookings(
    userId: string, 
    filters?: {
      status?: string;
      type?: string;
      dateRange?: { start: string; end: string };
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<EnhancedBooking>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === 'object') {
              queryParams.append(key, JSON.stringify(value));
            } else {
              queryParams.append(key, String(value));
            }
          }
        });
      }

      const response = await this.get<{
        data: EnhancedBooking[];
        total: number;
        page: number;
        limit: number;
      }>(`${this.endpoint}?${queryParams.toString()}`);

      if (response.success && response.data) {
        return {
          data: response.data.data,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          hasMore: response.data.page * response.data.limit < response.data.total,
          totalPages: Math.ceil(response.data.total / response.data.limit)
        };
      }

      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        hasMore: false,
        totalPages: 0
      };
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.getUserBookings');
      throw appError;
    }
  }

  async updateBookingStatus(
    id: string, 
    status: EnhancedBooking['status'],
    reason?: string
  ): Promise<ApiResponse<EnhancedBooking>> {
    try {
      const updateData = {
        status,
        reason,
        updatedAt: new Date().toISOString()
      };

      return await this.patch<EnhancedBooking>(`${this.endpoint}/${id}/status`, updateData);
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.updateBookingStatus');
      throw appError;
    }
  }

  async cancelBooking(
    id: string, 
    reason: string,
    refundAmount?: number
  ): Promise<ApiResponse<{ booking: EnhancedBooking; refund: PaymentDetails }>> {
    try {
      const cancelData = {
        reason,
        refundAmount,
        cancelledAt: new Date().toISOString()
      };

      return await this.post<{ booking: EnhancedBooking; refund: PaymentDetails }>(
        `${this.endpoint}/${id}/cancel`, 
        cancelData
      );
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.cancelBooking');
      throw appError;
    }
  }

  async processPayment(
    bookingId: string,
    paymentData: Partial<PaymentDetails>
  ): Promise<ApiResponse<PaymentDetails>> {
    try {
      Validator.required(paymentData.method, 'payment method');
      Validator.required(paymentData.amount, 'payment amount');
      
      return await this.post<PaymentDetails>(
        `${this.endpoint}/${bookingId}/payment`,
        paymentData
      );
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.processPayment');
      throw appError;
    }
  }

  async addBookingEvent(
    bookingId: string,
    event: Omit<BookingEvent, 'id' | 'timestamp'>
  ): Promise<ApiResponse<BookingEvent>> {
    try {
      const eventData = {
        ...event,
        timestamp: new Date().toISOString()
      };

      return await this.post<BookingEvent>(
        `${this.endpoint}/${bookingId}/events`,
        eventData
      );
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.addBookingEvent');
      throw appError;
    }
  }

  async addReview(
    bookingId: string,
    review: Omit<Review, 'id' | 'createdAt' | 'verified' | 'helpful'>
  ): Promise<ApiResponse<Review>> {
    try {
      Validator.range(review.rating, 1, 5, 'rating');
      Validator.required(review.title, 'review title');
      Validator.required(review.comment, 'review comment');

      const reviewData = {
        ...review,
        createdAt: new Date().toISOString(),
        verified: false,
        helpful: 0
      };

      return await this.post<Review>(
        `${this.endpoint}/${bookingId}/reviews`,
        reviewData
      );
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.addReview');
      throw appError;
    }
  }

  async getBookingAnalytics(
    filters?: {
      dateRange?: { start: string; end: string };
      agentId?: string;
      region?: string;
      type?: string;
    }
  ): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === 'object') {
              queryParams.append(key, JSON.stringify(value));
            } else {
              queryParams.append(key, String(value));
            }
          }
        });
      }

      return await this.get<any>(`${this.endpoint}/analytics?${queryParams.toString()}`);
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.getBookingAnalytics');
      throw appError;
    }
  }

  async calculateCancellationRefund(
    bookingId: string
  ): Promise<ApiResponse<{ refundAmount: number; fees: number; policy: string }>> {
    try {
      return await this.get<{ refundAmount: number; fees: number; policy: string }>(
        `${this.endpoint}/${bookingId}/cancellation-refund`
      );
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedBookingService.calculateCancellationRefund');
      throw appError;
    }
  }

  private validateBookingData(bookingData: Partial<EnhancedBooking>): void {
    // Basic booking validation
    Validator.validateBooking(bookingData);

    // Enhanced validation for customer details
    if (bookingData.customerDetails) {
      const customer = bookingData.customerDetails;
      Validator.required(customer.name, 'customer name');
      Validator.required(customer.email, 'customer email');
      Validator.required(customer.phone, 'customer phone');
      
      if (!Validator.email(customer.email)) {
        throw new Error('Invalid customer email format');
      }
      
      if (!Validator.phone(customer.phone)) {
        throw new Error('Invalid customer phone format');
      }

      // Address validation
      if (customer.address) {
        Validator.required(customer.address.street, 'street address');
        Validator.required(customer.address.city, 'city');
        Validator.required(customer.address.country, 'country');
      }
    }

    // Travel details validation
    if (bookingData.travelDetails) {
      const travel = bookingData.travelDetails;
      Validator.required(travel.departureDate, 'departure date');
      Validator.futureDate(travel.departureDate, 'departure date');
      
      if (travel.returnDate) {
        Validator.dateRange(travel.departureDate, travel.returnDate);
      }

      if (travel.travelers && travel.travelers.length === 0) {
        throw new Error('At least one traveler is required');
      }

      // Validate each traveler
      travel.travelers?.forEach((traveler, index) => {
        Validator.required(traveler.name, `traveler ${index + 1} name`);
        Validator.required(traveler.documentNumber, `traveler ${index + 1} document number`);
        Validator.futureDate(traveler.documentExpiry, `traveler ${index + 1} document expiry`);
      });
    }
  }

  private async enhanceBookingData(bookingData: Partial<EnhancedBooking>): Promise<Partial<EnhancedBooking>> {
    // Add dynamic pricing calculations
    const enhancedData = { ...bookingData };

    // Calculate seasonal pricing adjustments
    if (enhancedData.travelDetails?.departureDate) {
      const seasonalMultiplier = this.calculateSeasonalMultiplier(enhancedData.travelDetails.departureDate);
      if (enhancedData.totalAmount) {
        enhancedData.totalAmount = Math.round(enhancedData.totalAmount * seasonalMultiplier);
      }
    }

    // Add booking timeline event
    if (!enhancedData.timeline) {
      enhancedData.timeline = [];
    }

    enhancedData.timeline.push({
      id: `event_${Date.now()}`,
      type: 'created',
      description: 'Booking created',
      timestamp: new Date().toISOString(),
      userId: enhancedData.agentId || '',
      userName: enhancedData.agentName || '',
      metadata: {
        source: 'web_app',
        userAgent: navigator.userAgent
      }
    });

    return enhancedData;
  }

  private calculateSeasonalMultiplier(departureDate: string): number {
    const date = new Date(departureDate);
    const month = date.getMonth() + 1; // 1-12

    // Peak season pricing (December, January, April, May)
    if ([12, 1, 4, 5].includes(month)) {
      return 1.2; // 20% increase
    }
    
    // High season (February, March, October, November)
    if ([2, 3, 10, 11].includes(month)) {
      return 1.1; // 10% increase
    }
    
    // Low season (June, July, August, September)
    return 0.9; // 10% discount
  }
}

export const enhancedBookingService = new EnhancedBookingService();