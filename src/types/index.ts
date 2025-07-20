// Centralized Type Definitions
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Travel Agent' | 'Basic Admin' | 'Super Admin';
  status: 'Active' | 'Inactive' | 'Pending';
  avatar?: string;
  region?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cruise {
  id: string;
  name: string;
  image: string;
  from: string;
  to: string;
  duration: number;
  departureDates: string[];
  amenities: string[];
  pricePerPerson: number;
  roomTypes: string[];
  mealPlans: string[];
  description: string;
  shipType: string;
  cruiseLine: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  starRating: number;
  pricePerNight: number;
  availableRoomTypes: string[];
  mealPlans: string[];
  amenities: string[];
  availableFrom: string[];
  description: string;
  hotelType: string;
  hotelChain: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  type: 'Cruise' | 'Hotel';
  itemId: string;
  itemName: string;
  agentId: string;
  agentName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  travelDate: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  totalAmount: number;
  commissionAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  guests: number;
  specialRequests?: string;
  region: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Complaint {
  id: string;
  bookingId?: string;
  agentId: string;
  customerName: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  assignedTo?: string;
  resolution?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'Percentage' | 'Fixed Amount';
  discountValue: number;
  validFrom: string;
  validTo: string;
  applicableFor: 'Cruises' | 'Hotels' | 'Both';
  status: 'Active' | 'Inactive' | 'Expired';
  createdBy: string;
  usageCount: number;
  maxUsage?: number;
  regions: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Component Props Types
export interface DashboardProps {
  userRole: string;
  onLogout: () => void;
}

export interface CruiseCardProps {
  cruise: Cruise;
  onViewDetails: (cruise: Cruise) => void;
  onCancel: (cruiseId: string) => void;
  isBooked?: boolean;
  loading?: boolean;
}

export interface SearchSectionProps {
  filters: {
    searchText: string;
    destination: string;
    cruiseLine: string;
    shipType: string;
    month: string;
  };
  onFiltersChange: (filters: any) => void;
  loading?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}