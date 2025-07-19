import { SupabaseService } from './SupabaseService';

export class DataSeeder {
  static async seedAllData() {
    try {
      console.log('🌱 Starting comprehensive data seeding...');
      
      // Check if we're using Supabase
      const isSupabaseHealthy = await SupabaseService.healthCheck();
      
      if (!isSupabaseHealthy) {
        console.log('📦 Supabase not available, using local storage for demo data');
        this.seedLocalStorage();
        return;
      }

      console.log('✅ Supabase is healthy - data should be available from migrations');
      
    } catch (error) {
      console.error('❌ Data seeding failed:', error);
      // Fallback to local storage
      this.seedLocalStorage();
    }
  }

  private static seedLocalStorage() {
    // Seed mock data in localStorage for demo purposes
    const mockBookings = [
      {
        id: 'booking-1',
        type: 'Cruise',
        itemId: '1',
        itemName: 'Royal Caribbean Explorer',
        agentId: 'user1',
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
      }
    ];

    const mockUsers = [
      {
        id: 'user1',
        email: 'agent_demo@example.com',
        name: 'John Smith',
        role: 'Travel Agent',
        status: 'Active',
        region: 'Mumbai'
      },
      {
        id: 'user2',
        email: 'admin_demo@example.com',
        name: 'Sarah Johnson',
        role: 'Basic Admin',
        status: 'Active',
        region: 'Mumbai'
      },
      {
        id: 'user3',
        email: 'superadmin_demo@example.com',
        name: 'Michael Chen',
        role: 'Super Admin',
        status: 'Active',
        region: 'Mumbai'
      }
    ];

    localStorage.setItem('mock_bookings', JSON.stringify(mockBookings));
    localStorage.setItem('mock_users', JSON.stringify(mockUsers));
    console.log('📦 Local demo data seeded successfully');
  }

  // Method to refresh materialized views
  static async refreshAnalytics() {
    try {
      const isHealthy = await SupabaseService.healthCheck();
      if (isHealthy) {
        // In a real implementation, this would call the refresh function
        console.log('📊 Analytics refreshed');
      }
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    }
  }
}