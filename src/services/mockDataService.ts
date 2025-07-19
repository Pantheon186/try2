// Mock Data Service - Simulates backend behavior for prototype
// This will be replaced with actual Supabase calls later

import { cruises } from '../data/cruises';
import { hotels } from '../data/hotels';
import { basicAdmins, agents, complaints, offers } from '../data/admins';
import { bookings } from '../data/bookings';
import type { Cruise } from '../data/cruises';
import type { Hotel } from '../data/hotels';
import type { BasicAdmin, Agent, Complaint, Offer } from '../data/admins';
import type { Booking } from '../data/bookings';

// Simulate network delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// User Authentication Mock
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Travel Agent' | 'Basic Admin' | 'Super Admin';
  status: 'Active' | 'Inactive' | 'Pending';
}

// Mock user database
const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'agent_demo@example.com',
    name: 'John Smith',
    role: 'Travel Agent',
    status: 'Active'
  },
  {
    id: 'user2',
    email: 'admin_demo@example.com',
    name: 'Sarah Johnson',
    role: 'Basic Admin',
    status: 'Active'
  },
  {
    id: 'user3',
    email: 'superadmin_demo@example.com',
    name: 'Michael Chen',
    role: 'Super Admin',
    status: 'Active'
  }
];

// Mock bookings storage (simulates database)
let mockBookingsStorage: Booking[] = [...bookings];
let mockComplaintsStorage: Complaint[] = [...complaints];
let mockOffersStorage: Offer[] = [...offers];

// Authentication Service
export class AuthService {
  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await simulateDelay();
    
    const user = mockUsers.find(u => u.email === email);
    if (user && this.validatePassword(email, password)) {
      return {
        user,
        token: `mock_token_${user.id}_${Date.now()}`
      };
    }
    return null;
  }

  static async logout(): Promise<void> {
    await simulateDelay(200);
    // Clear any stored tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  static async getCurrentUser(): Promise<User | null> {
    await simulateDelay(200);
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  private static validatePassword(email: string, password: string): boolean {
    // Mock password validation
    const validCredentials = {
      'agent_demo@example.com': 'demo123',
      'admin_demo@example.com': 'admin123',
      'superadmin_demo@example.com': 'super123'
    };
    return validCredentials[email as keyof typeof validCredentials] === password;
  }
}

// Cruise Service
export class CruiseService {
  static async getAllCruises(): Promise<Cruise[]> {
    await simulateDelay();
    return cruises;
  }

  static async getCruiseById(id: string): Promise<Cruise | null> {
    await simulateDelay();
    return cruises.find(cruise => cruise.id === id) || null;
  }

  static async searchCruises(filters: {
    searchText?: string;
    destination?: string;
    cruiseLine?: string;
    shipType?: string;
  }): Promise<Cruise[]> {
    await simulateDelay();
    
    return cruises.filter(cruise => {
      const matchesSearch = !filters.searchText || 
        cruise.name.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        cruise.description.toLowerCase().includes(filters.searchText.toLowerCase());
      
      const matchesDestination = !filters.destination || 
        filters.destination === 'All Destinations' ||
        cruise.to === filters.destination || 
        cruise.from === filters.destination;
      
      const matchesCruiseLine = !filters.cruiseLine || 
        filters.cruiseLine === 'All Cruise Lines' ||
        cruise.cruiseLine === filters.cruiseLine;
      
      const matchesShipType = !filters.shipType || 
        filters.shipType === 'All Ship Types' ||
        cruise.shipType === filters.shipType;

      return matchesSearch && matchesDestination && matchesCruiseLine && matchesShipType;
    });
  }
}

// Hotel Service
export class HotelService {
  static async getAllHotels(): Promise<Hotel[]> {
    await simulateDelay();
    return hotels;
  }

  static async getHotelById(id: string): Promise<Hotel | null> {
    await simulateDelay();
    return hotels.find(hotel => hotel.id === id) || null;
  }

  static async searchHotels(filters: {
    searchText?: string;
    city?: string;
    hotelChain?: string;
    maxPrice?: number;
    starRating?: number;
  }): Promise<Hotel[]> {
    await simulateDelay();
    
    return hotels.filter(hotel => {
      const matchesSearch = !filters.searchText || 
        hotel.name.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        hotel.location.toLowerCase().includes(filters.searchText.toLowerCase());
      
      const matchesCity = !filters.city || 
        filters.city === 'All Cities' ||
        hotel.location.toLowerCase().includes(filters.city.toLowerCase());
      
      const matchesChain = !filters.hotelChain || 
        filters.hotelChain === 'All Chains' ||
        hotel.hotelChain === filters.hotelChain;
      
      const matchesPrice = !filters.maxPrice || hotel.pricePerNight <= filters.maxPrice;
      const matchesStarRating = !filters.starRating || hotel.starRating >= filters.starRating;

      return matchesSearch && matchesCity && matchesChain && matchesPrice && matchesStarRating;
    });
  }
}

// Booking Service
export class BookingService {
  static async createBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
    await simulateDelay(1000); // Simulate longer processing time
    
    const newBooking: Booking = {
      ...bookingData,
      id: `BK${String(mockBookingsStorage.length + 1).padStart(3, '0')}`
    };
    
    mockBookingsStorage.push(newBooking);
    return newBooking;
  }

  static async getUserBookings(userId: string): Promise<Booking[]> {
    await simulateDelay();
    return mockBookingsStorage.filter(booking => booking.agentId === userId);
  }

  static async getAllBookings(): Promise<Booking[]> {
    await simulateDelay();
    return mockBookingsStorage;
  }

  static async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking | null> {
    await simulateDelay();
    
    const bookingIndex = mockBookingsStorage.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      mockBookingsStorage[bookingIndex].status = status;
      return mockBookingsStorage[bookingIndex];
    }
    return null;
  }

  static async cancelBooking(bookingId: string): Promise<boolean> {
    await simulateDelay(800);
    
    const bookingIndex = mockBookingsStorage.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      mockBookingsStorage[bookingIndex].status = 'Cancelled';
      mockBookingsStorage[bookingIndex].paymentStatus = 'Refunded';
      return true;
    }
    return false;
  }
}

// Complaint Service
export class ComplaintService {
  static async getAllComplaints(): Promise<Complaint[]> {
    await simulateDelay();
    return mockComplaintsStorage;
  }

  static async createComplaint(complaintData: Omit<Complaint, 'id'>): Promise<Complaint> {
    await simulateDelay();
    
    const newComplaint: Complaint = {
      ...complaintData,
      id: `comp${mockComplaintsStorage.length + 1}`
    };
    
    mockComplaintsStorage.push(newComplaint);
    return newComplaint;
  }

  static async updateComplaint(complaintId: string, updates: Partial<Complaint>): Promise<Complaint | null> {
    await simulateDelay();
    
    const complaintIndex = mockComplaintsStorage.findIndex(c => c.id === complaintId);
    if (complaintIndex !== -1) {
      mockComplaintsStorage[complaintIndex] = {
        ...mockComplaintsStorage[complaintIndex],
        ...updates
      };
      return mockComplaintsStorage[complaintIndex];
    }
    return null;
  }

  static async resolveComplaint(complaintId: string, resolution: string): Promise<boolean> {
    await simulateDelay();
    
    const complaint = await this.updateComplaint(complaintId, {
      status: 'Resolved',
      resolution
    });
    return !!complaint;
  }
}

// Offer Service
export class OfferService {
  static async getAllOffers(): Promise<Offer[]> {
    await simulateDelay();
    return mockOffersStorage;
  }

  static async createOffer(offerData: Omit<Offer, 'id' | 'usageCount'>): Promise<Offer> {
    await simulateDelay();
    
    const newOffer: Offer = {
      ...offerData,
      id: `off${mockOffersStorage.length + 1}`,
      usageCount: 0
    };
    
    mockOffersStorage.push(newOffer);
    return newOffer;
  }

  static async updateOffer(offerId: string, updates: Partial<Offer>): Promise<Offer | null> {
    await simulateDelay();
    
    const offerIndex = mockOffersStorage.findIndex(o => o.id === offerId);
    if (offerIndex !== -1) {
      mockOffersStorage[offerIndex] = {
        ...mockOffersStorage[offerIndex],
        ...updates
      };
      return mockOffersStorage[offerIndex];
    }
    return null;
  }

  static async assignOfferToAgents(offerId: string, agentIds: string[]): Promise<boolean> {
    await simulateDelay();
    
    const offer = await this.updateOffer(offerId, {
      assignedAgents: agentIds
    });
    return !!offer;
  }
}

// User Management Service
export class UserService {
  static async getAllUsers(): Promise<(BasicAdmin | Agent)[]> {
    await simulateDelay();
    return [...basicAdmins, ...agents];
  }

  static async getUserById(userId: string): Promise<BasicAdmin | Agent | null> {
    await simulateDelay();
    return [...basicAdmins, ...agents].find(user => user.id === userId) || null;
  }

  static async updateUserStatus(userId: string, status: 'Active' | 'Inactive' | 'Pending'): Promise<boolean> {
    await simulateDelay();
    // In a real implementation, this would update the database
    console.log(`Updated user ${userId} status to ${status}`);
    return true;
  }

  static async deleteUser(userId: string): Promise<boolean> {
    await simulateDelay();
    // In a real implementation, this would delete from database
    console.log(`Deleted user ${userId}`);
    return true;
  }
}

// Analytics Service
export class AnalyticsService {
  static async getPerformanceMetrics(): Promise<{
    totalBookings: number;
    totalRevenue: number;
    totalCommission: number;
    conversionRate: number;
    averageBookingValue: number;
  }> {
    await simulateDelay();
    
    const totalBookings = mockBookingsStorage.length;
    const totalRevenue = mockBookingsStorage.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const totalCommission = mockBookingsStorage.reduce((sum, booking) => sum + booking.commissionAmount, 0);
    const confirmedBookings = mockBookingsStorage.filter(b => b.status === 'Confirmed').length;
    
    return {
      totalBookings,
      totalRevenue,
      totalCommission,
      conversionRate: totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0,
      averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0
    };
  }

  static async getBookingsByMonth(): Promise<{ month: string; bookings: number; revenue: number }[]> {
    await simulateDelay();
    
    // Mock monthly data
    return [
      { month: 'January', bookings: 15, revenue: 750000 },
      { month: 'February', bookings: 18, revenue: 900000 },
      { month: 'March', bookings: 22, revenue: 1100000 }
    ];
  }

  static async getRegionPerformance(): Promise<{ region: string; bookings: number; revenue: number }[]> {
    await simulateDelay();
    
    // Mock regional data
    return [
      { region: 'North India', bookings: 25, revenue: 1250000 },
      { region: 'South India', bookings: 20, revenue: 1000000 },
      { region: 'West India', bookings: 18, revenue: 900000 }
    ];
  }
}