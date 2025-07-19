// Mock data for Bookings
export interface Booking {
  id: string;
  type: 'Cruise' | 'Hotel';
  itemId: string; // cruise or hotel ID
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
}

export const bookings: Booking[] = [
  {
    id: "BK001",
    type: "Cruise",
    itemId: "1",
    itemName: "Royal Caribbean Explorer",
    agentId: "ag1",
    agentName: "John Smith",
    customerName: "Rahul Gupta",
    customerEmail: "rahul.gupta@email.com",
    customerPhone: "+91 9876543210",
    bookingDate: "2024-03-01",
    travelDate: "2024-04-15",
    status: "Confirmed",
    totalAmount: 90000,
    commissionAmount: 4500,
    paymentStatus: "Paid",
    guests: 2,
    specialRequests: "Ocean view cabin preferred",
    region: "Delhi"
  },
  {
    id: "BK002",
    type: "Hotel",
    itemId: "1",
    itemName: "The Oberoi Mumbai",
    agentId: "ag2",
    agentName: "Amit Patel",
    customerName: "Priya Mehta",
    customerEmail: "priya.mehta@email.com",
    customerPhone: "+91 9876543211",
    bookingDate: "2024-03-05",
    travelDate: "2024-03-20",
    status: "Confirmed",
    totalAmount: 75000,
    commissionAmount: 3750,
    paymentStatus: "Paid",
    guests: 2,
    specialRequests: "Late checkout requested",
    region: "Punjab"
  },
  {
    id: "BK003",
    type: "Cruise",
    itemId: "2",
    itemName: "Celebrity Infinity",
    agentId: "ag3",
    agentName: "Sneha Reddy",
    customerName: "Arjun Sharma",
    customerEmail: "arjun.sharma@email.com",
    customerPhone: "+91 9876543212",
    bookingDate: "2024-02-28",
    travelDate: "2024-04-10",
    status: "Cancelled",
    totalAmount: 76000,
    commissionAmount: 0,
    paymentStatus: "Refunded",
    guests: 2,
    region: "Chennai"
  },
  {
    id: "BK004",
    type: "Hotel",
    itemId: "2",
    itemName: "Taj Lake Palace Udaipur",
    agentId: "ag1",
    agentName: "John Smith",
    customerName: "Kavya Nair",
    customerEmail: "kavya.nair@email.com",
    customerPhone: "+91 9876543213",
    bookingDate: "2024-03-08",
    travelDate: "2024-04-25",
    status: "Pending",
    totalAmount: 105000,
    commissionAmount: 5250,
    paymentStatus: "Pending",
    guests: 2,
    specialRequests: "Honeymoon package",
    region: "Delhi"
  },
  {
    id: "BK005",
    type: "Cruise",
    itemId: "3",
    itemName: "Norwegian Gem",
    agentId: "ag2",
    agentName: "Amit Patel",
    customerName: "Ravi Kumar",
    customerEmail: "ravi.kumar@email.com",
    customerPhone: "+91 9876543214",
    bookingDate: "2024-03-10",
    travelDate: "2024-05-01",
    status: "Confirmed",
    totalAmount: 64000,
    commissionAmount: 3200,
    paymentStatus: "Paid",
    guests: 2,
    region: "Punjab"
  },
  {
    id: "BK006",
    type: "Hotel",
    itemId: "3",
    itemName: "ITC Grand Chola Chennai",
    agentId: "ag3",
    agentName: "Sneha Reddy",
    customerName: "Deepika Rao",
    customerEmail: "deepika.rao@email.com",
    customerPhone: "+91 9876543215",
    bookingDate: "2024-03-12",
    travelDate: "2024-04-05",
    status: "Completed",
    totalAmount: 54000,
    commissionAmount: 2700,
    paymentStatus: "Paid",
    guests: 1,
    specialRequests: "Business center access needed",
    region: "Chennai"
  },
  {
    id: "BK007",
    type: "Cruise",
    itemId: "9",
    itemName: "Anthem of the Seas",
    agentId: "ag1",
    agentName: "John Smith",
    customerName: "Neha Patel",
    customerEmail: "neha.patel@email.com",
    customerPhone: "+91 9876543216",
    bookingDate: "2024-03-15",
    travelDate: "2024-04-12",
    status: "Confirmed",
    totalAmount: 130000,
    commissionAmount: 6500,
    paymentStatus: "Paid",
    guests: 2,
    specialRequests: "Anniversary celebration",
    region: "Delhi"
  },
  {
    id: "BK008",
    type: "Hotel",
    itemId: "11",
    itemName: "Ritz-Carlton Mumbai",
    agentId: "ag3",
    agentName: "Sneha Reddy",
    customerName: "Vikram Singh",
    customerEmail: "vikram.singh@email.com",
    customerPhone: "+91 9876543217",
    bookingDate: "2024-03-18",
    travelDate: "2024-04-15",
    status: "Pending",
    totalAmount: 180000,
    commissionAmount: 9000,
    paymentStatus: "Pending",
    guests: 2,
    specialRequests: "Executive floor preferred",
    region: "Chennai"
  }
];

// Performance Analytics Data
export interface PerformanceMetrics {
  totalBookings: number;
  totalRevenue: number;
  totalCommission: number;
  conversionRate: number;
  averageBookingValue: number;
  topPerformingAgent: string;
  bookingsByMonth: { month: string; bookings: number; revenue: number }[];
  bookingsByType: { type: string; count: number; percentage: number }[];
  regionPerformance: { region: string; bookings: number; revenue: number }[];
}

export const performanceMetrics: PerformanceMetrics = {
  totalBookings: 6,
  totalRevenue: 464000,
  totalCommission: 19400,
  conversionRate: 83.3,
  averageBookingValue: 77333,
  topPerformingAgent: "John Smith",
  bookingsByMonth: [
    { month: "January", bookings: 0, revenue: 0 },
    { month: "February", bookings: 1, revenue: 76000 },
    { month: "March", bookings: 5, revenue: 388000 }
  ],
  bookingsByType: [
    { type: "Cruises", count: 3, percentage: 50 },
    { type: "Hotels", count: 3, percentage: 50 }
  ],
  regionPerformance: [
    { region: "Delhi", bookings: 2, revenue: 195000 },
    { region: "Punjab", bookings: 2, revenue: 139000 },
    { region: "Chennai", bookings: 2, revenue: 130000 }
  ]
};