// Enhanced Type Definitions for Advanced Features
export interface EnhancedCruise extends Cruise {
  itinerary?: ItineraryDay[];
  gallery?: MediaItem[];
  sustainability?: SustainabilityInfo;
  pricing?: PricingTier[];
  availability?: AvailabilityInfo[];
  reviews?: Review[];
  offers?: string[];
}

export interface EnhancedHotel extends Hotel {
  coordinates?: Coordinates;
  gallery?: MediaItem[];
  policies?: HotelPolicies;
  nearbyAttractions?: NearbyAttraction[];
  reviews?: Review[];
  offers?: string[];
}

export interface ItineraryDay {
  day: number;
  port: string;
  arrival?: string;
  departure?: string;
  highlights: string[];
  excursions?: Excursion[];
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
  alt?: string;
}

export interface SustainabilityInfo {
  certifications: string[];
  ecoFriendlyPractices: string[];
  carbonFootprint?: number;
}

export interface PricingTier {
  roomType: string;
  basePrice: number;
  seasonalPricing?: SeasonalPrice[];
  occupancyRates?: OccupancyRate[];
}

export interface SeasonalPrice {
  season: string;
  multiplier: number;
  startDate: string;
  endDate: string;
}

export interface OccupancyRate {
  occupancy: number;
  multiplier: number;
}

export interface AvailabilityInfo {
  date: string;
  roomsLeft: number;
  priceAdjustment?: number;
  specialOffers?: string[];
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  customerName: string;
  createdAt: string;
  verified: boolean;
  helpful: number;
  aspects?: ReviewAspect[];
  response?: ManagementResponse;
}

export interface ReviewAspect {
  name: string;
  rating: number;
}

export interface ManagementResponse {
  message: string;
  respondedBy: string;
  respondedAt: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface HotelPolicies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
  petPolicy?: string;
  smokingPolicy?: string;
}

export interface NearbyAttraction {
  name: string;
  distance: number;
  type: string;
  rating?: number;
}

export interface Excursion {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

// Enhanced Booking Types
export interface EnhancedBooking extends Booking {
  timeline?: BookingEvent[];
  documents?: BookingDocument[];
  preferences?: CustomerPreferences;
  insurance?: InsuranceInfo;
  upgrades?: BookingUpgrade[];
}

export interface BookingEvent {
  id: string;
  type: 'created' | 'confirmed' | 'modified' | 'cancelled' | 'completed' | 'payment' | 'refund';
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  metadata?: Record<string, any>;
}

export interface BookingDocument {
  id: string;
  type: 'invoice' | 'voucher' | 'itinerary' | 'ticket' | 'insurance';
  name: string;
  url: string;
  generatedAt: string;
}

export interface CustomerPreferences {
  dietaryRequirements?: string[];
  accessibility?: string[];
  roomPreferences?: string[];
  activityInterests?: string[];
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  coverage: string[];
  premium: number;
}

export interface BookingUpgrade {
  type: string;
  description: string;
  additionalCost: number;
  confirmed: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
  sortBy?: 'popularity' | 'price' | 'rating' | 'duration' | 'departure';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: SearchFilters;
  suggestions?: string[];
}

// Analytics Types
export interface AnalyticsData {
  bookings: {
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    conversionRate: number;
    averageValue: number;
  };
  revenue: {
    total: number;
    growth: number;
    byMonth: MonthlyData[];
    byRegion: RegionalData[];
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    satisfaction: number;
    demographics: DemographicData[];
  };
  performance: {
    agents: AgentPerformance[];
    topDestinations: DestinationStats[];
    popularAmenities: AmenityStats[];
  };
}

export interface MonthlyData {
  month: string;
  value: number;
  growth?: number;
}

export interface RegionalData {
  region: string;
  value: number;
  percentage: number;
}

export interface DemographicData {
  category: string;
  segments: {
    label: string;
    percentage: number;
    count: number;
  }[];
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  bookings: number;
  revenue: number;
  efficiency: number;
  customerSatisfaction: number;
}

export interface DestinationStats {
  destination: string;
  bookings: number;
  revenue: number;
  averageRating: number;
}

export interface AmenityStats {
  amenity: string;
  popularity: number;
  satisfaction: number;
}

// Notification Types
export interface EnhancedNotification {
  id: string;
  type: 'booking' | 'payment' | 'complaint' | 'system' | 'promotion' | 'review';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  actions?: NotificationAction[];
  expiresAt?: string;
  createdAt: string;
}

export interface NotificationAction {
  label: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Real-time Types
export interface RealtimeEvent {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
}

// Security Types
export interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'suspicious_activity' | 'rate_limit' | 'data_breach';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
}