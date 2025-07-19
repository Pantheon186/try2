import { config } from '../../config/environment';
import { supabaseService } from './supabaseService';
import { 
  AuthService as MockAuthService,
  CruiseService as MockCruiseService,
  HotelService as MockHotelService,
  BookingService as MockBookingService,
  ComplaintService as MockComplaintService,
  OfferService as MockOfferService,
  UserService as MockUserService,
  AnalyticsService as MockAnalyticsService
} from '../mockDataService';
import { User, Cruise, Hotel, Booking } from '../../types';

// Simplified service interfaces
export interface IAuthService {
  login(email: string, password: string): Promise<{ user: User; token: string } | null>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export interface ICruiseService {
  getAllCruises(): Promise<Cruise[]>;
  getCruiseById(id: string): Promise<Cruise | null>;
  searchCruises(filters: any): Promise<Cruise[]>;
}

export interface IHotelService {
  getAllHotels(): Promise<Hotel[]>;
  getHotelById(id: string): Promise<Hotel | null>;
  searchHotels(filters: any): Promise<Hotel[]>;
}

export interface IBookingService {
  createBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking | null>;
  cancelBooking(bookingId: string): Promise<boolean>;
}

export interface IComplaintService {
  getAllComplaints(): Promise<any[]>;
  createComplaint(complaintData: any): Promise<any>;
  updateComplaint(complaintId: string, updates: any): Promise<any>;
  resolveComplaint(complaintId: string, resolution: string): Promise<boolean>;
}

export interface IOfferService {
  getAllOffers(): Promise<any[]>;
  createOffer(offerData: any): Promise<any>;
  updateOffer(offerId: string, updates: any): Promise<any>;
  assignOfferToAgents(offerId: string, agentIds: string[]): Promise<boolean>;
}

export interface IUserService {
  getAllUsers(): Promise<any[]>;
  getUserById(userId: string): Promise<any>;
  updateUserStatus(userId: string, status: string): Promise<boolean>;
  deleteUser(userId: string): Promise<boolean>;
}

export interface IAnalyticsService {
  getPerformanceMetrics(): Promise<any>;
  getBookingsByMonth(): Promise<any[]>;
  getRegionPerformance(): Promise<any[]>;
}

// Simplified adapter classes
class SupabaseAuthServiceAdapter implements IAuthService {
  async login(email: string, password: string) {
    const response = await supabaseService.signIn(email, password);
    return response.success ? response.data : null;
  }

  async logout() {
    await supabaseService.signOut();
  }

  async getCurrentUser() {
    const response = await supabaseService.getCurrentUser();
    return response.success ? response.data : null;
  }
}

class SupabaseCruiseServiceAdapter implements ICruiseService {
  async getAllCruises() {
    const response = await supabaseService.getCruises();
    return response.success ? response.data : [];
  }

  async getCruiseById(id: string) {
    const response = await supabaseService.getCruiseById(id);
    return response.success ? response.data : null;
  }

  async searchCruises(filters: any) {
    const response = await supabaseService.getCruises(filters);
    return response.success ? response.data : [];
  }
}

class SupabaseHotelServiceAdapter implements IHotelService {
  async getAllHotels() {
    const response = await supabaseService.getHotels();
    return response.success ? response.data : [];
  }

  async getHotelById(id: string) {
    return null; // TODO: Implement
  }

  async searchHotels(filters: any) {
    const response = await supabaseService.getHotels(filters);
    return response.success ? response.data : [];
  }
}

class SupabaseBookingServiceAdapter implements IBookingService {
  async createBooking(bookingData: Omit<Booking, 'id'>) {
    const response = await supabaseService.createBooking(bookingData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create booking');
    }
    return response.data;
  }

  async getUserBookings(userId: string) {
    const response = await supabaseService.getUserBookings(userId);
    return response.success ? response.data : [];
  }

  async getAllBookings() {
    return []; // TODO: Implement
  }

  async updateBookingStatus(bookingId: string, status: Booking['status']) {
    const response = await supabaseService.updateBookingStatus(bookingId, status);
    return response.success ? response.data : null;
  }

  async cancelBooking(bookingId: string) {
    const response = await supabaseService.updateBookingStatus(bookingId, 'Cancelled');
    return response.success;
  }
}

// Simplified Service Factory
class ServiceFactory {
  private static instance: ServiceFactory;
  private useSupabase: boolean;
  private supabaseHealthy: boolean = false;

  private constructor() {
    this.useSupabase = config.database.useSupabase;
    this.checkSupabaseHealth();
  }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  private async checkSupabaseHealth(): Promise<void> {
    if (this.useSupabase) {
      try {
        this.supabaseHealthy = await supabaseService.healthCheck();
        if (!this.supabaseHealthy) {
          console.warn('Supabase health check failed, using mock services');
        }
      } catch (error) {
        console.warn('Supabase health check error, using mock services:', error);
        this.supabaseHealthy = false;
      }
    }
  }

  private shouldUseSupabase(): boolean {
    return this.useSupabase && this.supabaseHealthy;
  }

  getAuthService(): IAuthService {
    return this.shouldUseSupabase() 
      ? new SupabaseAuthServiceAdapter()
      : MockAuthService;
  }

  getCruiseService(): ICruiseService {
    return this.shouldUseSupabase()
      ? new SupabaseCruiseServiceAdapter()
      : MockCruiseService;
  }

  getHotelService(): IHotelService {
    return this.shouldUseSupabase()
      ? new SupabaseHotelServiceAdapter()
      : MockHotelService;
  }

  getBookingService(): IBookingService {
    return this.shouldUseSupabase()
      ? new SupabaseBookingServiceAdapter()
      : MockBookingService;
  }

  getComplaintService(): IComplaintService {
    return MockComplaintService;
  }

  getOfferService(): IOfferService {
    return MockOfferService;
  }

  getUserService(): IUserService {
    return MockUserService;
  }

  getAnalyticsService(): IAnalyticsService {
    return MockAnalyticsService;
  }

  async refreshServices(): Promise<void> {
    await this.checkSupabaseHealth();
  }

  getServiceStatus(): { 
    useSupabase: boolean; 
    supabaseHealthy: boolean; 
    activeService: 'supabase' | 'mock' 
  } {
    return {
      useSupabase: this.useSupabase,
      supabaseHealthy: this.supabaseHealthy,
      activeService: this.shouldUseSupabase() ? 'supabase' : 'mock'
    };
  }
}

// Export singleton instance
export const serviceFactory = ServiceFactory.getInstance();

// Export individual services
export const authService = serviceFactory.getAuthService();
export const cruiseService = serviceFactory.getCruiseService();
export const hotelService = serviceFactory.getHotelService();
export const bookingService = serviceFactory.getBookingService();
export const complaintService = serviceFactory.getComplaintService();
export const offerService = serviceFactory.getOfferService();
export const userService = serviceFactory.getUserService();
export const analyticsService = serviceFactory.getAnalyticsService();