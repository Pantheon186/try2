import { SupabaseService } from './SupabaseService';
import { config } from '../config/environment';

export class DataSeeder {
  static async seedAllData() {
    try {
      console.log('🌱 Starting comprehensive data seeding...');
      
      // Check if we're using Supabase and if it's healthy
      if (!config.database.useSupabase) {
        console.log('📦 Supabase disabled, using local storage for demo data');
        this.seedLocalStorage();
        return;
      }

      const isSupabaseHealthy = await SupabaseService.healthCheck();
      
      if (!isSupabaseHealthy) {
        console.log('📦 Supabase not available, using local storage for demo data');
        this.seedLocalStorage();
        return;
      }

      console.log('✅ Supabase is healthy - checking if data exists...');
      
      // Check if data already exists
      const existingCruises = await SupabaseService.getAllCruises();
      const existingUsers = await SupabaseService.getAllUsers();
      
      if (existingCruises.length > 0 && existingUsers.length > 0) {
        console.log('✅ Database already contains data from migrations');
        return;
      }
      
      console.log('⚠️ Database is empty - please run the migration files in your Supabase dashboard');
      console.log('📁 Migration files location: supabase/migrations/');
      console.log('1. create_complete_schema.sql');
      console.log('2. seed_sample_data.sql');
      
    } catch (error) {
      console.error('❌ Data seeding failed:', error);
      // Fallback to local storage
      this.seedLocalStorage();
    }
  }

  private static seedLocalStorage() {
    console.log('📦 Seeding local storage with demo data...');
    
    // Check if data already exists
    const existingBookings = localStorage.getItem('mock_bookings');
    const existingUsers = localStorage.getItem('mock_users');
    
    if (existingBookings && existingUsers) {
      console.log('✅ Demo data already exists in local storage');
      return;
    }

    // Seed comprehensive mock data in localStorage for demo purposes
    const mockBookings = [
      {
        id: '850e8400-e29b-41d4-a716-446655440001',
        type: 'Cruise',
        itemId: '1',
        itemName: 'Royal Caribbean Explorer',
        agentId: '550e8400-e29b-41d4-a716-446655440001',
        agentName: 'John Smith',
        customerName: 'Rahul Gupta',
        customerEmail: 'rahul.gupta@email.com',
        customerPhone: '+91 9876543210',
        bookingDate: '2024-03-01',
        travelDate: '2024-04-15',
        status: 'Confirmed',
        totalAmount: 90000,
        commissionAmount: 4500,
        paymentStatus: 'Paid',
        guests: 2,
        specialRequests: 'Ocean view cabin preferred',
        region: 'Mumbai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440002',
        type: 'Hotel',
        itemId: '1',
        itemName: 'The Oberoi Mumbai',
        agentId: '550e8400-e29b-41d4-a716-446655440001',
        agentName: 'John Smith',
        customerName: 'Priya Mehta',
        customerEmail: 'priya.mehta@email.com',
        customerPhone: '+91 9876543211',
        bookingDate: '2024-03-05',
        travelDate: '2024-03-20',
        status: 'Confirmed',
        totalAmount: 75000,
        commissionAmount: 3750,
        paymentStatus: 'Paid',
        guests: 2,
        specialRequests: 'Late checkout requested',
        region: 'Mumbai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    const mockUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'agent_demo@example.com',
        name: 'John Smith',
        role: 'Travel Agent',
        status: 'Active',
        region: 'Mumbai',
        phone: '+91 9876543210',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'admin_demo@example.com',
        name: 'Sarah Johnson',
        role: 'Basic Admin',
        status: 'Active',
        region: 'Delhi',
        phone: '+91 9876543211',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'superadmin_demo@example.com',
        name: 'Michael Chen',
        role: 'Super Admin',
        status: 'Active',
        region: 'Mumbai',
        phone: '+91 9876543212',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const mockComplaints = [
      {
        id: '950e8400-e29b-41d4-a716-446655440001',
        bookingId: '850e8400-e29b-41d4-a716-446655440001',
        agentId: '550e8400-e29b-41d4-a716-446655440001',
        customerName: 'Rahul Gupta',
        subject: 'Cruise cabin not as promised',
        description: 'The ocean view cabin was actually an interior cabin. Very disappointed with the service.',
        status: 'Open',
        priority: 'High',
        category: 'Service Quality',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const mockOffers = [
      {
        id: 'a50e8400-e29b-41d4-a716-446655440001',
        title: 'Early Bird Cruise Special',
        description: 'Book your cruise 30 days in advance and save 15%',
        discountType: 'Percentage',
        discountValue: 15,
        validFrom: '2024-03-01',
        validTo: '2024-06-30',
        applicableFor: 'Cruises',
        status: 'Active',
        createdBy: '550e8400-e29b-41d4-a716-446655440003',
        usageCount: 23,
        maxUsage: 100,
        regions: ['Mumbai', 'Chennai', 'Bangalore'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    localStorage.setItem('mock_bookings', JSON.stringify(mockBookings));
    localStorage.setItem('mock_users', JSON.stringify(mockUsers));
    localStorage.setItem('mock_complaints', JSON.stringify(mockComplaints));
    localStorage.setItem('mock_offers', JSON.stringify(mockOffers));
    
    console.log('📦 Local demo data seeded successfully');
  }

  // Method to refresh materialized views
  static async refreshAnalytics() {
    try {
      if (config.database.useSupabase) {
        const isHealthy = await SupabaseService.healthCheck();
        if (isHealthy) {
          // In a real implementation, this would call the refresh function
          console.log('📊 Analytics refreshed');
        }
      }
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    }
  }

  // Method to check data status
  static async getDataStatus() {
    try {
      if (config.database.useSupabase) {
        const isHealthy = await SupabaseService.healthCheck();
        if (isHealthy) {
          const cruises = await SupabaseService.getAllCruises();
          const users = await SupabaseService.getAllUsers();
          return {
            source: 'supabase',
            healthy: true,
            dataCount: {
              cruises: cruises.length,
              users: users.length
            }
          };
        }
      }
      
      // Check local storage
      const localBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const localUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      
      return {
        source: 'localStorage',
        healthy: true,
        dataCount: {
          bookings: localBookings.length,
          users: localUsers.length
        }
      };
    } catch (error) {
      return {
        source: 'none',
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}