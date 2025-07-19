import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'Travel Agent' | 'Basic Admin' | 'Super Admin';
          status: 'Active' | 'Inactive' | 'Pending';
          avatar?: string;
          region?: string;
          phone?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'Travel Agent' | 'Basic Admin' | 'Super Admin';
          status?: 'Active' | 'Inactive' | 'Pending';
          avatar?: string;
          region?: string;
          phone?: string;
        };
        Update: {
          email?: string;
          name?: string;
          role?: 'Travel Agent' | 'Basic Admin' | 'Super Admin';
          status?: 'Active' | 'Inactive' | 'Pending';
          avatar?: string;
          region?: string;
          phone?: string;
        };
      };
      cruises: {
        Row: {
          id: string;
          name: string;
          image: string;
          from_location: string;
          to_location: string;
          duration: number;
          departure_dates: string[];
          amenities: string[];
          price_per_person: number;
          room_types: string[];
          meal_plans: string[];
          description: string;
          ship_type: string;
          cruise_line: string;
          availability: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          image: string;
          from_location: string;
          to_location: string;
          duration: number;
          departure_dates: string[];
          amenities: string[];
          price_per_person: number;
          room_types: string[];
          meal_plans: string[];
          description: string;
          ship_type: string;
          cruise_line: string;
          availability?: any;
        };
        Update: {
          name?: string;
          image?: string;
          from_location?: string;
          to_location?: string;
          duration?: number;
          departure_dates?: string[];
          amenities?: string[];
          price_per_person?: number;
          room_types?: string[];
          meal_plans?: string[];
          description?: string;
          ship_type?: string;
          cruise_line?: string;
          availability?: any;
        };
      };
      hotels: {
        Row: {
          id: string;
          name: string;
          location: string;
          image: string;
          star_rating: number;
          price_per_night: number;
          available_room_types: string[];
          meal_plans: string[];
          amenities: string[];
          available_from: string[];
          description: string;
          hotel_type: string;
          hotel_chain: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          location: string;
          image: string;
          star_rating: number;
          price_per_night: number;
          available_room_types: string[];
          meal_plans: string[];
          amenities: string[];
          available_from: string[];
          description: string;
          hotel_type: string;
          hotel_chain: string;
        };
        Update: {
          name?: string;
          location?: string;
          image?: string;
          star_rating?: number;
          price_per_night?: number;
          available_room_types?: string[];
          meal_plans?: string[];
          amenities?: string[];
          available_from?: string[];
          description?: string;
          hotel_type?: string;
          hotel_chain?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          type: 'Cruise' | 'Hotel';
          item_id: string;
          item_name: string;
          agent_id: string;
          agent_name: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          booking_date: string;
          travel_date: string;
          status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
          total_amount: number;
          commission_amount: number;
          payment_status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
          guests: number;
          special_requests?: string;
          region: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          type: 'Cruise' | 'Hotel';
          item_id: string;
          item_name: string;
          agent_id: string;
          agent_name: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          booking_date: string;
          travel_date: string;
          status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
          total_amount: number;
          commission_amount: number;
          payment_status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
          guests: number;
          special_requests?: string;
          region: string;
        };
        Update: {
          status?: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
          payment_status?: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
          special_requests?: string;
        };
      };
      complaints: {
        Row: {
          id: string;
          booking_id?: string;
          agent_id: string;
          customer_name: string;
          subject: string;
          description: string;
          status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
          priority: 'Low' | 'Medium' | 'High' | 'Critical';
          category: string;
          assigned_to?: string;
          resolution?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          booking_id?: string;
          agent_id: string;
          customer_name: string;
          subject: string;
          description: string;
          status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
          priority: 'Low' | 'Medium' | 'High' | 'Critical';
          category: string;
          assigned_to?: string;
        };
        Update: {
          status?: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
          assigned_to?: string;
          resolution?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          title: string;
          description: string;
          discount_type: 'Percentage' | 'Fixed Amount';
          discount_value: number;
          valid_from: string;
          valid_to: string;
          applicable_for: 'Cruises' | 'Hotels' | 'Both';
          status: 'Active' | 'Inactive' | 'Expired';
          created_by: string;
          usage_count: number;
          max_usage?: number;
          regions: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          discount_type: 'Percentage' | 'Fixed Amount';
          discount_value: number;
          valid_from: string;
          valid_to: string;
          applicable_for: 'Cruises' | 'Hotels' | 'Both';
          status: 'Active' | 'Inactive' | 'Expired';
          created_by: string;
          usage_count?: number;
          max_usage?: number;
          regions: string[];
        };
        Update: {
          title?: string;
          description?: string;
          status?: 'Active' | 'Inactive' | 'Expired';
          usage_count?: number;
        };
      };
    };
  };
}