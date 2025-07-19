// Enhanced type definitions with better structure and validation
import { User, Booking, Cruise, Hotel } from './index';

export interface EnhancedUser extends User {
  permissions: Permission[];
  preferences: UserPreferences;
  lastLogin?: string;
  loginCount: number;
  isOnline: boolean;
  region?: string;
  department?: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: Record<string, any>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export interface DashboardPreferences {
  layout: 'grid' | 'list';
  itemsPerPage: number;
  defaultView: string;
  widgets: string[];
}

export interface EnhancedBooking extends Booking {
  customerDetails: CustomerDetails;
  paymentDetails: PaymentDetails;
  travelDetails: TravelDetails;
  documents: BookingDocument[];
  timeline: BookingEvent[];
  reviews?: Review[];
  cancellationPolicy?: CancellationPolicy;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: Address;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  emergencyContact?: EmergencyContact;
  dietaryRequirements?: string[];
  accessibility?: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface PaymentDetails {
  method: 'credit_card' | 'debit_card' | 'bank_transfer' | 'wallet' | 'cash';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partial_refund';
  amount: number;
  currency: string;
  transactionId?: string;
  paymentDate?: string;
  refundAmount?: number;
  refundDate?: string;
  installments?: PaymentInstallment[];
}

export interface PaymentInstallment {
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
}

export interface TravelDetails {
  departureDate: string;
  returnDate?: string;
  duration: number;
  travelers: Traveler[];
  rooms: RoomAssignment[];
  specialRequests: string[];
  insurance?: TravelInsurance;
}

export interface Traveler {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  documentType: 'passport' | 'id_card' | 'driving_license';
  documentNumber: string;
  documentExpiry: string;
  isMainTraveler: boolean;
}

export interface RoomAssignment {
  roomType: string;
  travelers: string[]; // traveler IDs
  preferences: string[];
}

export interface TravelInsurance {
  provider: string;
  policyNumber: string;
  coverage: string[];
  premium: number;
}

export interface BookingDocument {
  id: string;
  type: 'ticket' | 'voucher' | 'invoice' | 'receipt' | 'insurance' | 'visa' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  size: number;
  mimeType: string;
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

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  aspects: ReviewAspect[];
  helpful: number;
  createdAt: string;
  verified: boolean;
  response?: ReviewResponse;
}

export interface ReviewAspect {
  name: string;
  rating: number;
}

export interface ReviewResponse {
  message: string;
  respondedBy: string;
  respondedAt: string;
}

export interface CancellationPolicy {
  type: 'flexible' | 'moderate' | 'strict' | 'super_strict';
  rules: CancellationRule[];
  refundCalculator: (daysBeforeTravel: number, totalAmount: number) => number;
}

export interface CancellationRule {
  daysBeforeTravel: number;
  refundPercentage: number;
  description: string;
}

export interface EnhancedCruise extends Cruise {
  availability: AvailabilityCalendar[];
  pricing: PricingTier[];
  reviews: Review[];
  gallery: MediaItem[];
  itinerary: ItineraryDay[];
  policies: CruisePolicy[];
  sustainability: SustainabilityInfo;
}

export interface AvailabilityCalendar {
  date: string;
  available: boolean;
  price: number;
  roomsLeft: number;
  specialOffers?: string[];
}

export interface PricingTier {
  roomType: string;
  basePrice: number;
  seasonalMultiplier: number;
  occupancyRates: OccupancyRate[];
  inclusions: string[];
  exclusions: string[];
}

export interface OccupancyRate {
  occupancy: number;
  multiplier: number;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | '360_view';
  url: string;
  thumbnail?: string;
  caption?: string;
  category: string;
  order: number;
}

export interface ItineraryDay {
  day: number;
  port: string;
  arrival?: string;
  departure?: string;
  activities: Activity[];
  highlights: string[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number;
  price?: number;
  category: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  ageRestriction?: number;
  bookingRequired: boolean;
}

export interface CruisePolicy {
  type: 'cancellation' | 'baggage' | 'dress_code' | 'age_restriction' | 'health' | 'other';
  title: string;
  description: string;
  details: string[];
}

export interface SustainabilityInfo {
  certifications: string[];
  initiatives: string[];
  carbonFootprint?: number;
  wasteReduction?: string[];
}

export interface EnhancedHotel extends Hotel {
  availability: AvailabilityCalendar[];
  pricing: PricingTier[];
  reviews: Review[];
  gallery: MediaItem[];
  policies: HotelPolicy[];
  location: LocationDetails;
  sustainability: SustainabilityInfo;
}

export interface HotelPolicy {
  type: 'checkin' | 'checkout' | 'cancellation' | 'pet' | 'smoking' | 'age' | 'payment' | 'other';
  title: string;
  description: string;
  details: string[];
}

export interface LocationDetails {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: Address;
  nearbyAttractions: NearbyAttraction[];
  transportation: TransportationOption[];
  walkingScore?: number;
}

export interface NearbyAttraction {
  name: string;
  type: string;
  distance: number;
  walkingTime?: number;
  rating?: number;
}

export interface TransportationOption {
  type: 'airport' | 'train' | 'bus' | 'metro' | 'taxi';
  name: string;
  distance: number;
  estimatedTime: number;
  cost?: number;
}

export interface SearchFilters {
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
  location?: string;
  sortBy?: 'price' | 'rating' | 'distance' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface AnalyticsData {
  bookings: BookingAnalytics;
  revenue: RevenueAnalytics;
  customers: CustomerAnalytics;
  performance: PerformanceAnalytics;
}

export interface BookingAnalytics {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byMonth: MonthlyData[];
  conversionRate: number;
  averageValue: number;
}

export interface RevenueAnalytics {
  total: number;
  commission: number;
  byMonth: MonthlyData[];
  byRegion: RegionalData[];
  growth: number;
}

export interface CustomerAnalytics {
  total: number;
  new: number;
  returning: number;
  satisfaction: number;
  demographics: DemographicData[];
}

export interface PerformanceAnalytics {
  agents: AgentPerformance[];
  regions: RegionalPerformance[];
  trends: TrendData[];
}

export interface MonthlyData {
  month: string;
  value: number;
  change?: number;
}

export interface RegionalData {
  region: string;
  value: number;
  percentage: number;
}

export interface DemographicData {
  category: string;
  segments: { label: string; value: number; percentage: number }[];
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  bookings: number;
  revenue: number;
  commission: number;
  rating: number;
  efficiency: number;
}

export interface RegionalPerformance {
  region: string;
  bookings: number;
  revenue: number;
  agents: number;
  growth: number;
}

export interface TrendData {
  metric: string;
  data: { date: string; value: number }[];
  trend: 'up' | 'down' | 'stable';
  change: number;
}