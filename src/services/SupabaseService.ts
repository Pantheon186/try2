import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/environment';
import { AppErrorHandler } from '../utils/errorHandler';
import { Validator } from '../utils/validation';
import type { User, Cruise, Hotel, Booking } from '../types';

class SupabaseServiceClass {
  private client: SupabaseClient | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    if (!config.database.useSupabase) {
      console.log('Supabase disabled - using mock data service');
      return;
    }

    if (!config.database.supabaseUrl || !config.database.supabaseAnonKey) {
      console.warn('Supabase credentials not configured');
      return;
    }

    try {
      this.client = createClient(
        config.database.supabaseUrl,
        config.database.supabaseAnonKey
      );
      this.isInitialized = true;
      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      AppErrorHandler.logError(
        AppErrorHandler.createError('SUPABASE_INIT_ERROR', 'Failed to initialize Supabase client'),
        'SupabaseService.initializeClient'
      );
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized || !this.client) {
      throw new Error('Supabase client not initialized. Check configuration.');
    }
  }

  // Authentication Methods
  async signIn(email: string, password: string): Promise<{ success: boolean; data?: { user: User; token: string }; error?: string }> {
    this.ensureInitialized();
    
    try {
      Validator.required(email, 'email');
      Validator.required(password, 'password');
      
      if (!Validator.email(email)) {
        throw new Error('Invalid email format');
      }

      const { data, error } = await this.client!.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user || !data.session) {
        throw new Error('Authentication failed');
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await this.client!
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      const user: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        status: profile.status,
        avatar: profile.avatar,
        region: profile.region,
        phone: profile.phone,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };

      return {
        data: {
          user,
          token: data.session.access_token,
        },
        success: true,
      };
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.signIn');
      
      return {
        success: false,
        error: appError.message,
      };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    this.ensureInitialized();
    
    try {
      const { error } = await this.client!.auth.signOut();
      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.signOut');
      
      return {
        success: false,
        error: appError.message,
      };
    }
  }

  async getCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
    this.ensureInitialized();
    
    try {
      const { data: { user }, error } = await this.client!.auth.getUser();
      
      if (error) throw error;
      if (!user) {
        return { success: true, data: undefined };
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await this.client!
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const userData: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        status: profile.status,
        avatar: profile.avatar,
        region: profile.region,
        phone: profile.phone,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };

      return {
        data: userData,
        success: true,
      };
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getCurrentUser');
      
      return {
        success: false,
        error: appError.message,
      };
    }
  }

  // Cruise Methods
  async getAllCruises(): Promise<Cruise[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('cruises')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        from: item.from_location,
        to: item.to_location,
        duration: item.duration,
        departureDates: item.departure_dates,
        amenities: item.amenities,
        pricePerPerson: item.price_per_person,
        roomTypes: item.room_types,
        mealPlans: item.meal_plans,
        description: item.description,
        shipType: item.ship_type,
        cruiseLine: item.cruise_line,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getAllCruises');
      throw appError;
    }
  }

  // Hotel Methods
  async getAllHotels(): Promise<Hotel[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        name: item.name,
        location: item.location,
        image: item.image,
        starRating: item.star_rating,
        pricePerNight: item.price_per_night,
        availableRoomTypes: item.available_room_types,
        mealPlans: item.meal_plans,
        amenities: item.amenities,
        availableFrom: item.available_from,
        description: item.description,
        hotelType: item.hotel_type,
        hotelChain: item.hotel_chain,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getAllHotels');
      throw appError;
    }
  }

  // Booking Methods
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    this.ensureInitialized();
    
    try {
      Validator.validateBooking(bookingData);

      const { data, error } = await this.client!
        .from('bookings')
        .insert([{
          type: bookingData.type,
          item_id: bookingData.itemId,
          item_name: bookingData.itemName,
          agent_id: bookingData.agentId,
          agent_name: bookingData.agentName,
          customer_name: bookingData.customerName,
          customer_email: bookingData.customerEmail,
          customer_phone: bookingData.customerPhone,
          booking_date: bookingData.bookingDate,
          travel_date: bookingData.travelDate,
          status: bookingData.status,
          total_amount: bookingData.totalAmount,
          commission_amount: bookingData.commissionAmount,
          payment_status: bookingData.paymentStatus,
          guests: bookingData.guests,
          special_requests: bookingData.specialRequests,
          region: bookingData.region,
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        type: data.type,
        itemId: data.item_id,
        itemName: data.item_name,
        agentId: data.agent_id,
        agentName: data.agent_name,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        bookingDate: data.booking_date,
        travelDate: data.travel_date,
        status: data.status,
        totalAmount: data.total_amount,
        commissionAmount: data.commission_amount,
        paymentStatus: data.payment_status,
        guests: data.guests,
        specialRequests: data.special_requests,
        region: data.region,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.createBooking');
      throw appError;
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('bookings')
        .select('*')
        .eq('agent_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        type: item.type,
        itemId: item.item_id,
        itemName: item.item_name,
        agentId: item.agent_id,
        agentName: item.agent_name,
        customerName: item.customer_name,
        customerEmail: item.customer_email,
        customerPhone: item.customer_phone,
        bookingDate: item.booking_date,
        travelDate: item.travel_date,
        status: item.status,
        totalAmount: item.total_amount,
        commissionAmount: item.commission_amount,
        paymentStatus: item.payment_status,
        guests: item.guests,
        specialRequests: item.special_requests,
        region: item.region,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getUserBookings');
      throw appError;
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        type: item.type,
        itemId: item.item_id,
        itemName: item.item_name,
        agentId: item.agent_id,
        agentName: item.agent_name,
        customerName: item.customer_name,
        customerEmail: item.customer_email,
        customerPhone: item.customer_phone,
        bookingDate: item.booking_date,
        travelDate: item.travel_date,
        status: item.status,
        totalAmount: item.total_amount,
        commissionAmount: item.commission_amount,
        paymentStatus: item.payment_status,
        guests: item.guests,
        specialRequests: item.special_requests,
        region: item.region,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getAllBookings');
      throw appError;
    }
  }

  async getAllUsers(): Promise<User[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        email: item.email,
        name: item.name,
        role: item.role,
        status: item.status,
        avatar: item.avatar,
        region: item.region,
        phone: item.phone,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getAllUsers');
      throw appError;
    }
  }

  async getAllComplaints(): Promise<any[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getAllComplaints');
      throw appError;
    }
  }

  async getAllOffers(): Promise<any[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getAllOffers');
      throw appError;
    }
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking> {
    this.ensureInitialized();
    
    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.paymentStatus) updateData.payment_status = updates.paymentStatus;
      if (updates.specialRequests) updateData.special_requests = updates.specialRequests;
      
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await this.client!
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        type: data.type,
        itemId: data.item_id,
        itemName: data.item_name,
        agentId: data.agent_id,
        agentName: data.agent_name,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        bookingDate: data.booking_date,
        travelDate: data.travel_date,
        status: data.status,
        totalAmount: data.total_amount,
        commissionAmount: data.commission_amount,
        paymentStatus: data.payment_status,
        guests: data.guests,
        specialRequests: data.special_requests,
        region: data.region,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.updateBooking');
      throw appError;
    }
  }

  // Real-time subscriptions
  subscribeToBookings(userId: string, callback: (payload: any) => void) {
    this.ensureInitialized();
    
    return this.client!
      .channel('bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `agent_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    if (!this.isInitialized || !this.client) {
      return false;
    }

    try {
      const { error } = await this.client.from('users').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

export const SupabaseService = new SupabaseServiceClass();