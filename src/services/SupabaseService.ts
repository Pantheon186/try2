import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/environment';
import { AppErrorHandler } from '../utils/errorHandler';
import { Validator } from '../utils/validation';
import type { 
  User, 
  Cruise, 
  Hotel, 
  Booking, 
  Complaint, 
  Offer
} from '../types';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

class SupabaseServiceClass {
  private client: SupabaseClient | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️ Supabase credentials not configured - using fallback mode');
      return;
    }

    try {
      this.client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      this.isInitialized = true;
      console.log('✅ Supabase client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error);
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

  // Health check
  async healthCheck(): Promise<boolean> {
    if (!this.isInitialized || !this.client) {
      return false;
    }

    try {
      const { data, error } = await this.client.from('users').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  // Authentication Methods
  async signIn(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
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

      // Update login tracking
      await this.client!
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          login_count: (profile.login_count || 0) + 1
        })
        .eq('id', profile.id);

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
        data: null as any,
        success: false,
        error: appError.message,
      };
    }
  }

  async signOut(): Promise<ApiResponse<void>> {
    this.ensureInitialized();
    
    try {
      const { error } = await this.client!.auth.signOut();
      if (error) throw error;

      return {
        data: undefined as any,
        success: true,
      };
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.signOut');
      
      return {
        data: undefined as any,
        success: false,
        error: appError.message,
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    this.ensureInitialized();
    
    try {
      const { data: { user }, error } = await this.client!.auth.getUser();
      
      if (error) throw error;
      if (!user) {
        return {
          data: null,
          success: true,
        };
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
        data: null,
        success: false,
        error: appError.message,
      };
    }
  }

  // Cruise Methods
  async getAllCruises(filters?: any): Promise<Cruise[]> {
    this.ensureInitialized();
    
    try {
      let query = this.client!.from('cruises').select('*').eq('active', true);

      if (filters?.searchText) {
        query = query.or(`name.ilike.%${filters.searchText}%,description.ilike.%${filters.searchText}%`);
      }

      if (filters?.cruiseLine && filters.cruiseLine !== 'All Cruise Lines') {
        query = query.eq('cruise_line', filters.cruiseLine);
      }

      if (filters?.shipType && filters.shipType !== 'All Ship Types') {
        query = query.eq('ship_type', filters.shipType);
      }

      if (filters?.destination && filters.destination !== 'All Destinations') {
        query = query.or(`from_location.eq.${filters.destination},to_location.eq.${filters.destination}`);
      }

      const { data, error } = await query.order('featured', { ascending: false }).order('created_at', { ascending: false });

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

  async getCruiseById(id: string): Promise<Cruise | null> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('cruises')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        image: data.image,
        from: data.from_location,
        to: data.to_location,
        duration: data.duration,
        departureDates: data.departure_dates,
        amenities: data.amenities,
        pricePerPerson: data.price_per_person,
        roomTypes: data.room_types,
        mealPlans: data.meal_plans,
        description: data.description,
        shipType: data.ship_type,
        cruiseLine: data.cruise_line,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getCruiseById');
      throw appError;
    }
  }

  // Hotel Methods
  async getAllHotels(filters?: any): Promise<Hotel[]> {
    this.ensureInitialized();
    
    try {
      let query = this.client!.from('hotels').select('*').eq('active', true);

      if (filters?.searchText) {
        query = query.or(`name.ilike.%${filters.searchText}%,location.ilike.%${filters.searchText}%`);
      }

      if (filters?.city && filters.city !== 'All Cities') {
        query = query.ilike('location', `%${filters.city}%`);
      }

      if (filters?.hotelChain && filters.hotelChain !== 'All Chains') {
        query = query.eq('hotel_chain', filters.hotelChain);
      }

      if (filters?.starRating && filters.starRating > 0) {
        query = query.gte('star_rating', filters.starRating);
      }

      if (filters?.maxPrice) {
        query = query.lte('price_per_night', filters.maxPrice);
      }

      const { data, error } = await query.order('featured', { ascending: false }).order('created_at', { ascending: false });

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

      // Create booking event
      await this.client!
        .from('booking_events')
        .insert([{
          booking_id: data.id,
          event_type: 'created',
          description: `Booking created for ${bookingData.itemName}`,
          user_id: bookingData.agentId,
          user_name: bookingData.agentName,
          metadata: {
            source: 'web_app',
            booking_type: bookingData.type,
            amount: bookingData.totalAmount
          }
        }]);

      const booking: Booking = {
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

      return booking;
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

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking> {
    this.ensureInitialized();
    
    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.paymentStatus) updateData.payment_status = updates.paymentStatus;
      if (updates.specialRequests) updateData.special_requests = updates.specialRequests;

      const { data, error } = await this.client!
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Create booking event for status change
      if (updates.status) {
        await this.client!
          .from('booking_events')
          .insert([{
            booking_id: bookingId,
            event_type: updates.status === 'Cancelled' ? 'cancelled' : 'modified',
            description: `Booking status changed to ${updates.status}`,
            metadata: {
              previous_status: data.status,
              new_status: updates.status
            }
          }]);
      }

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

  // User Management Methods
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

  // Complaint Methods
  async getAllComplaints(): Promise<Complaint[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        bookingId: item.booking_id,
        agentId: item.agent_id,
        customerName: item.customer_name,
        subject: item.subject,
        description: item.description,
        status: item.status,
        priority: item.priority,
        category: item.category,
        assignedTo: item.assigned_to,
        resolution: item.resolution,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getAllComplaints');
      throw appError;
    }
  }

  // Offer Methods
  async getAllOffers(): Promise<Offer[]> {
    this.ensureInitialized();
    
    try {
      const { data, error } = await this.client!
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        discountType: item.discount_type,
        discountValue: item.discount_value,
        validFrom: item.valid_from,
        validTo: item.valid_to,
        applicableFor: item.applicable_for,
        status: item.status,
        createdBy: item.created_by,
        usageCount: item.usage_count,
        maxUsage: item.max_usage,
        regions: item.regions,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getAllOffers');
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

  // Analytics Methods
  async getBookingAnalytics(filters?: {
    startDate?: string;
    endDate?: string;
    region?: string;
    agentId?: string;
  }) {
    this.ensureInitialized();
    
    try {
      let query = this.client!.from('bookings').select('*');

      if (filters?.startDate) {
        query = query.gte('booking_date', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('booking_date', filters.endDate);
      }

      if (filters?.region) {
        query = query.eq('region', filters.region);
      }

      if (filters?.agentId) {
        query = query.eq('agent_id', filters.agentId);
      }

      const { data, error } = await query.order('booking_date', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error: any) {
      const appError = AppErrorHandler.handleDatabaseError(error);
      AppErrorHandler.logError(appError, 'SupabaseService.getBookingAnalytics');
      throw appError;
    }
  }
}

export const SupabaseService = new SupabaseServiceClass();