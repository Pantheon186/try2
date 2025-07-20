// Mock Data Service - Replaces Supabase with local mock data
import { User, Cruise, Hotel, Booking, Complaint, Offer } from '../types';
import { cruises } from '../data/cruises';
import { hotels } from '../data/hotels';
import { mockData, Review, MockNotification } from '../data/mockData';
import { AppErrorHandler } from '../utils/errorHandler';
import { Validator } from '../utils/validation';

class MockDataServiceClass {
  private isInitialized = true;

  constructor() {
    console.log('🎭 MockDataService initialized - Using comprehensive mock data');
    this.initializeLocalStorage();
  }

  private initializeLocalStorage(): void {
    // Initialize localStorage with mock data if not present
    if (!localStorage.getItem('mock_users')) {
      localStorage.setItem('mock_users', JSON.stringify(mockData.users));
    }
    if (!localStorage.getItem('mock_bookings')) {
      localStorage.setItem('mock_bookings', JSON.stringify(mockData.bookings));
    }
    if (!localStorage.getItem('mock_complaints')) {
      localStorage.setItem('mock_complaints', JSON.stringify(mockData.complaints));
    }
    if (!localStorage.getItem('mock_offers')) {
      localStorage.setItem('mock_offers', JSON.stringify(mockData.offers));
    }
    if (!localStorage.getItem('mock_reviews')) {
      localStorage.setItem('mock_reviews', JSON.stringify(mockData.reviews));
    }
    if (!localStorage.getItem('mock_notifications')) {
      localStorage.setItem('mock_notifications', JSON.stringify(mockData.notifications));
    }
  }

  // Authentication Methods
  async signIn(email: string, password: string): Promise<{ success: boolean; data?: { user: User; token: string }; error?: string }> {
    try {
      Validator.required(email, 'email');
      Validator.required(password, 'password');
      
      if (!Validator.email(email)) {
        throw new Error('Invalid email format');
      }

      // Demo credentials
      const demoCredentials = {
        'agent_demo@example.com': { 
          password: 'demo123', 
          userId: '550e8400-e29b-41d4-a716-446655440001'
        },
        'admin_demo@example.com': { 
          password: 'admin123', 
          userId: '550e8400-e29b-41d4-a716-446655440002'
        },
        'superadmin_demo@example.com': { 
          password: 'super123', 
          userId: '550e8400-e29b-41d4-a716-446655440003'
        }
      };

      // Check demo credentials first
      const credential = demoCredentials[email as keyof typeof demoCredentials];
      if (credential && credential.password === password) {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const user = users.find((u: User) => u.id === credential.userId);
        
        if (user) {
          return {
            success: true,
            data: {
              user,
              token: `mock_token_${Date.now()}`
            }
          };
        }
      }

      // Check against mock users
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const user = users.find((u: User) => u.email === email);
      
      if (user && password === 'password123') { // Simple password for all mock users
        return {
          success: true,
          data: {
            user,
            token: `mock_token_${Date.now()}`
          }
        };
      }
      
      return {
        success: false,
        error: 'Invalid email or password'
      };
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      return {
        success: false,
        error: appError.message
      };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async getCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
    // Check localStorage for current session
    const userData = localStorage.getItem('user_data');
    const authToken = localStorage.getItem('auth_token');
    
    if (userData && authToken) {
      try {
        const user = JSON.parse(userData);
        return { success: true, data: user };
      } catch {
        return { success: true, data: undefined };
      }
    }
    
    return { success: true, data: undefined };
  }

  // Cruise Methods
  async getAllCruises(): Promise<Cruise[]> {
    try {
      // Return static cruise data from cruises.ts
      return cruises;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getAllCruises');
      throw appError;
    }
  }

  // Hotel Methods
  async getAllHotels(): Promise<Hotel[]> {
    try {
      // Return static hotel data from hotels.ts
      return hotels;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getAllHotels');
      throw appError;
    }
  }

  // User Methods
  async getAllUsers(): Promise<User[]> {
    try {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      return users;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getAllUsers');
      throw appError;
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      Validator.validateUser(userData);

      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      users.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(users));

      return newUser;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.createUser');
      throw appError;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      users[userIndex] = updatedUser;
      localStorage.setItem('mock_users', JSON.stringify(users));

      return updatedUser;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.updateUser');
      throw appError;
    }
  }

  // Booking Methods
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    try {
      Validator.validateBooking(bookingData);

      const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      bookings.unshift(newBooking); // Add to beginning
      localStorage.setItem('mock_bookings', JSON.stringify(bookings));

      return newBooking;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.createBooking');
      throw appError;
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      return bookings.filter((b: Booking) => b.agentId === userId);
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getUserBookings');
      throw appError;
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      return bookings;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getAllBookings');
      throw appError;
    }
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking> {
    try {
      const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const bookingIndex = bookings.findIndex((b: Booking) => b.id === bookingId);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }

      const updatedBooking = {
        ...bookings[bookingIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      bookings[bookingIndex] = updatedBooking;
      localStorage.setItem('mock_bookings', JSON.stringify(bookings));

      return updatedBooking;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.updateBooking');
      throw appError;
    }
  }

  // Complaint Methods
  async getAllComplaints(): Promise<Complaint[]> {
    try {
      const complaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
      return complaints;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getAllComplaints');
      throw appError;
    }
  }

  async createComplaint(complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>): Promise<Complaint> {
    try {
      Validator.validateComplaint(complaintData);

      const newComplaint: Complaint = {
        ...complaintData,
        id: `complaint-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const complaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
      complaints.unshift(newComplaint);
      localStorage.setItem('mock_complaints', JSON.stringify(complaints));

      return newComplaint;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.createComplaint');
      throw appError;
    }
  }

  async updateComplaint(complaintId: string, updates: Partial<Complaint>): Promise<Complaint> {
    try {
      const complaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
      const complaintIndex = complaints.findIndex((c: Complaint) => c.id === complaintId);
      
      if (complaintIndex === -1) {
        throw new Error('Complaint not found');
      }

      const updatedComplaint = {
        ...complaints[complaintIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      complaints[complaintIndex] = updatedComplaint;
      localStorage.setItem('mock_complaints', JSON.stringify(complaints));

      return updatedComplaint;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.updateComplaint');
      throw appError;
    }
  }

  // Offer Methods
  async getAllOffers(): Promise<Offer[]> {
    try {
      const offers = JSON.parse(localStorage.getItem('mock_offers') || '[]');
      return offers;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getAllOffers');
      throw appError;
    }
  }

  async createOffer(offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Offer> {
    try {
      Validator.validateOffer(offerData);

      const newOffer: Offer = {
        ...offerData,
        id: `offer-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const offers = JSON.parse(localStorage.getItem('mock_offers') || '[]');
      offers.unshift(newOffer);
      localStorage.setItem('mock_offers', JSON.stringify(offers));

      return newOffer;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.createOffer');
      throw appError;
    }
  }

  async updateOffer(offerId: string, updates: Partial<Offer>): Promise<Offer> {
    try {
      const offers = JSON.parse(localStorage.getItem('mock_offers') || '[]');
      const offerIndex = offers.findIndex((o: Offer) => o.id === offerId);
      
      if (offerIndex === -1) {
        throw new Error('Offer not found');
      }

      const updatedOffer = {
        ...offers[offerIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      offers[offerIndex] = updatedOffer;
      localStorage.setItem('mock_offers', JSON.stringify(offers));

      return updatedOffer;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.updateOffer');
      throw appError;
    }
  }

  // Review Methods
  async getAllReviews(): Promise<Review[]> {
    try {
      const reviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
      return reviews;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getAllReviews');
      throw appError;
    }
  }

  async getItemReviews(itemType: 'Cruise' | 'Hotel', itemId: string): Promise<Review[]> {
    try {
      const reviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
      return reviews.filter((r: Review) => r.itemType === itemType && r.itemId === itemId);
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getItemReviews');
      throw appError;
    }
  }

  async createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    try {
      const newReview: Review = {
        ...reviewData,
        id: `review-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const reviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
      reviews.unshift(newReview);
      localStorage.setItem('mock_reviews', JSON.stringify(reviews));

      return newReview;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.createReview');
      throw appError;
    }
  }

  async updateReviewHelpful(reviewId: string): Promise<Review> {
    try {
      const reviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
      const reviewIndex = reviews.findIndex((r: Review) => r.id === reviewId);
      
      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }

      reviews[reviewIndex].helpful += 1;
      reviews[reviewIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('mock_reviews', JSON.stringify(reviews));

      return reviews[reviewIndex];
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.updateReviewHelpful');
      throw appError;
    }
  }

  // Notification Methods
  async getUserNotifications(userId: string): Promise<MockNotification[]> {
    try {
      const notifications = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
      return notifications.filter((n: MockNotification) => n.userId === userId);
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.getUserNotifications');
      throw appError;
    }
  }

  async createNotification(notificationData: Omit<MockNotification, 'id' | 'createdAt'>): Promise<MockNotification> {
    try {
      const newNotification: MockNotification = {
        ...notificationData,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      const notifications = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
      notifications.unshift(newNotification);
      localStorage.setItem('mock_notifications', JSON.stringify(notifications));

      return newNotification;
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.createNotification');
      throw appError;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<MockNotification> {
    try {
      const notifications = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
      const notificationIndex = notifications.findIndex((n: MockNotification) => n.id === notificationId);
      
      if (notificationIndex === -1) {
        throw new Error('Notification not found');
      }

      notifications[notificationIndex].read = true;
      localStorage.setItem('mock_notifications', JSON.stringify(notifications));

      return notifications[notificationIndex];
    } catch (error: any) {
      const appError = AppErrorHandler.handleApiError(error);
      AppErrorHandler.logError(appError, 'MockDataService.markNotificationAsRead');
      throw appError;
    }
  }

  // Real-time subscriptions (mock)
  subscribeToBookings(userId: string, callback: (payload: any) => void) {
    console.log(`📡 Mock subscription created for user ${userId}`);
    return {
      unsubscribe: () => console.log('📡 Mock subscription unsubscribed')
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return true; // Always healthy for mock service
  }

  // Search functionality
  async searchCruises(query: string): Promise<Cruise[]> {
    const allCruises = await this.getAllCruises();
    if (!query.trim()) return allCruises;

    const searchTerm = query.toLowerCase();
    return allCruises.filter(cruise => 
      cruise.name.toLowerCase().includes(searchTerm) ||
      cruise.description.toLowerCase().includes(searchTerm) ||
      cruise.from.toLowerCase().includes(searchTerm) ||
      cruise.to.toLowerCase().includes(searchTerm) ||
      cruise.cruiseLine.toLowerCase().includes(searchTerm)
    );
  }

  async searchHotels(query: string): Promise<Hotel[]> {
    const allHotels = await this.getAllHotels();
    if (!query.trim()) return allHotels;

    const searchTerm = query.toLowerCase();
    return allHotels.filter(hotel => 
      hotel.name.toLowerCase().includes(searchTerm) ||
      hotel.description.toLowerCase().includes(searchTerm) ||
      hotel.location.toLowerCase().includes(searchTerm) ||
      hotel.hotelChain.toLowerCase().includes(searchTerm)
    );
  }

  // Analytics data
  async getAnalyticsData(userId?: string): Promise<any> {
    const bookings = await this.getAllBookings();
    const users = await this.getAllUsers();
    const complaints = await this.getAllComplaints();

    // Filter by user if specified
    const userBookings = userId ? bookings.filter(b => b.agentId === userId) : bookings;

    const totalRevenue = userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const totalCommission = userBookings.reduce((sum, booking) => sum + booking.commissionAmount, 0);

    return {
      totalBookings: userBookings.length,
      totalRevenue,
      totalCommission,
      totalUsers: users.length,
      totalComplaints: complaints.length,
      conversionRate: 85.5,
      averageBookingValue: userBookings.length > 0 ? totalRevenue / userBookings.length : 0,
      bookingsByStatus: userBookings.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      revenueByRegion: userBookings.reduce((acc, booking) => {
        acc[booking.region] = (acc[booking.region] || 0) + booking.totalAmount;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const MockDataService = new MockDataServiceClass();