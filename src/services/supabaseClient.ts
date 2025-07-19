// Supabase Client Configuration
// This file will be used for actual Supabase integration

import { createClient } from '@supabase/supabase-js';

// Environment variables (to be set up later)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client (will be activated when environment variables are set)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Tables Interface (for TypeScript support)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'Travel Agent' | 'Basic Admin' | 'Super Admin';
          name: string;
          created_at: string;
          status: 'Active' | 'Inactive' | 'Pending';
        };
        Insert: {
          email: string;
          role: 'Travel Agent' | 'Basic Admin' | 'Super Admin';
          name: string;
          status?: 'Active' | 'Inactive' | 'Pending';
        };
        Update: {
          email?: string;
          role?: 'Travel Agent' | 'Basic Admin' | 'Super Admin';
          name?: string;
          status?: 'Active' | 'Inactive' | 'Pending';
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          type: 'Cruise' | 'Hotel';
          item_id: string;
          item_name: string;
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
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: 'Cruise' | 'Hotel';
          item_id: string;
          item_name: string;
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
          booking_id: string;
          user_id: string;
          customer_name: string;
          subject: string;
          description: string;
          status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
          priority: 'Low' | 'Medium' | 'High' | 'Critical';
          category: string;
          created_at: string;
          assigned_to?: string;
          resolution?: string;
        };
        Insert: {
          booking_id: string;
          user_id: string;
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
          created_at: string;
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
          max_usage?: number;
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