// Enhanced Cruise Service with advanced features
import { BaseService } from './baseService';
import { EnhancedCruise, AvailabilityCalendar, PricingTier, SearchFilters } from '../../types/enhanced';
import { ApiResponse, PaginatedResponse, SearchParams } from '../../types/api';
import { AppErrorHandler } from '../../utils/errorHandler';

export class EnhancedCruiseService extends BaseService {
  private readonly endpoint = '/api/cruises';

  async getAllCruises(params?: SearchParams): Promise<PaginatedResponse<EnhancedCruise>> {
    try {
      return await this.getPaginated<EnhancedCruise>(this.endpoint, params?.page, params?.limit);
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.getAllCruises');
      throw appError;
    }
  }

  async getCruiseById(id: string): Promise<ApiResponse<EnhancedCruise>> {
    try {
      return await this.get<EnhancedCruise>(`${this.endpoint}/${id}`);
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.getCruiseById');
      throw appError;
    }
  }

  async searchCruises(filters: SearchFilters): Promise<PaginatedResponse<EnhancedCruise>> {
    try {
      const response = await this.search<EnhancedCruise>(`${this.endpoint}/search`, filters);
      
      if (response.success && response.data) {
        // Transform to paginated response
        return {
          data: response.data,
          total: response.data.length,
          page: 1,
          limit: response.data.length,
          hasMore: false,
          totalPages: 1
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
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.searchCruises');
      throw appError;
    }
  }

  async getAvailability(
    cruiseId: string,
    dateRange: { start: string; end: string }
  ): Promise<ApiResponse<AvailabilityCalendar[]>> {
    try {
      const queryParams = new URLSearchParams({
        start: dateRange.start,
        end: dateRange.end
      });

      return await this.get<AvailabilityCalendar[]>(
        `${this.endpoint}/${cruiseId}/availability?${queryParams.toString()}`
      );
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.getAvailability');
      throw appError;
    }
  }

  async getPricing(
    cruiseId: string,
    options: {
      departureDate: string;
      roomType: string;
      occupancy: number;
    }
  ): Promise<ApiResponse<PricingTier>> {
    try {
      return await this.post<PricingTier>(
        `${this.endpoint}/${cruiseId}/pricing`,
        options
      );
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.getPricing');
      throw appError;
    }
  }

  async getRecommendations(
    userId: string,
    preferences?: {
      budget?: { min: number; max: number };
      duration?: { min: number; max: number };
      destinations?: string[];
      amenities?: string[];
    }
  ): Promise<ApiResponse<EnhancedCruise[]>> {
    try {
      const requestData = {
        userId,
        preferences: preferences || {}
      };

      return await this.post<EnhancedCruise[]>(
        `${this.endpoint}/recommendations`,
        requestData
      );
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.getRecommendations');
      throw appError;
    }
  }

  async getPopularCruises(
    region?: string,
    limit: number = 10
  ): Promise<ApiResponse<EnhancedCruise[]>> {
    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString()
      });

      if (region) {
        queryParams.append('region', region);
      }

      return await this.get<EnhancedCruise[]>(
        `${this.endpoint}/popular?${queryParams.toString()}`
      );
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.getPopularCruises');
      throw appError;
    }
  }

  async getFilterOptions(): Promise<ApiResponse<{
    destinations: string[];
    cruiseLines: string[];
    shipTypes: string[];
    amenities: string[];
    priceRanges: { min: number; max: number }[];
    durations: number[];
  }>> {
    try {
      return await this.get<{
        destinations: string[];
        cruiseLines: string[];
        shipTypes: string[];
        amenities: string[];
        priceRanges: { min: number; max: number }[];
        durations: number[];
      }>(`${this.endpoint}/filter-options`);
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.getFilterOptions');
      throw appError;
    }
  }

  async compareCruises(cruiseIds: string[]): Promise<ApiResponse<{
    cruises: EnhancedCruise[];
    comparison: Record<string, any>;
  }>> {
    try {
      return await this.post<{
        cruises: EnhancedCruise[];
        comparison: Record<string, any>;
      }>(`${this.endpoint}/compare`, { cruiseIds });
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.compareCruises');
      throw appError;
    }
  }

  async getFeaturedCruises(): Promise<ApiResponse<EnhancedCruise[]>> {
    try {
      return await this.get<EnhancedCruise[]>(`${this.endpoint}/featured`);
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.getFeaturedCruises');
      throw appError;
    }
  }

  async getLastMinuteDeals(): Promise<ApiResponse<EnhancedCruise[]>> {
    try {
      return await this.get<EnhancedCruise[]>(`${this.endpoint}/last-minute-deals`);
    } catch (error) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'EnhancedCruiseService.getLastMinuteDeals');
      throw appError;
    }
  }
}

export const enhancedCruiseService = new EnhancedCruiseService();