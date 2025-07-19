// Mock data for Basic Admins
export interface BasicAdmin {
  id: string;
  name: string;
  email: string;
  team: string;
  region: string;
  joinedDate: string;
  status: 'Active' | 'Inactive';
  permissions: string[];
  avatar?: string;
}

export const basicAdmins: BasicAdmin[] = [
  {
    id: "ba1",
    name: "Sarah Johnson",
    email: "sarah.johnson@yorkeholidays.com",
    team: "North India Operations",
    region: "Delhi, Punjab, Haryana",
    joinedDate: "2023-08-15",
    status: "Active",
    permissions: ["view_bookings", "manage_agents", "create_offers", "resolve_complaints"]
  },
  {
    id: "ba2",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@yorkeholidays.com",
    team: "South India Operations",
    region: "Chennai, Bangalore, Hyderabad",
    joinedDate: "2023-06-20",
    status: "Active",
    permissions: ["view_bookings", "manage_agents", "resolve_complaints"]
  },
  {
    id: "ba3",
    name: "Priya Sharma",
    email: "priya.sharma@yorkeholidays.com",
    team: "West India Operations",
    region: "Mumbai, Pune, Goa",
    joinedDate: "2023-09-10",
    status: "Inactive",
    permissions: ["view_bookings", "manage_agents"]
  }
];

// Mock data for Agents under Basic Admins
export interface Agent {
  id: string;
  name: string;
  email: string;
  adminId: string;
  region: string;
  joinedDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
  performance: {
    totalBookings: number;
    totalSales: number;
    commissionEarned: number;
    successRate: number;
    grade: 'A' | 'B' | 'C';
  };
  contactInfo: {
    phone: string;
    address: string;
  };
}

export const agents: Agent[] = [
  {
    id: "ag1",
    name: "John Smith",
    email: "john.smith@yorkeholidays.com",
    adminId: "ba1",
    region: "Delhi",
    joinedDate: "2024-01-15",
    status: "Active",
    performance: {
      totalBookings: 45,
      totalSales: 2250000,
      commissionEarned: 112500,
      successRate: 89,
      grade: "A"
    },
    contactInfo: {
      phone: "+91 9876543210",
      address: "123 Connaught Place, New Delhi"
    }
  },
  {
    id: "ag2",
    name: "Amit Patel",
    email: "amit.patel@yorkeholidays.com",
    adminId: "ba1",
    region: "Punjab",
    joinedDate: "2024-02-20",
    status: "Active",
    performance: {
      totalBookings: 32,
      totalSales: 1600000,
      commissionEarned: 80000,
      successRate: 78,
      grade: "B"
    },
    contactInfo: {
      phone: "+91 9876543211",
      address: "456 Mall Road, Chandigarh"
    }
  },
  {
    id: "ag3",
    name: "Sneha Reddy",
    email: "sneha.reddy@yorkeholidays.com",
    adminId: "ba2",
    region: "Chennai",
    joinedDate: "2024-01-10",
    status: "Active",
    performance: {
      totalBookings: 38,
      totalSales: 1900000,
      commissionEarned: 95000,
      successRate: 85,
      grade: "A"
    },
    contactInfo: {
      phone: "+91 9876543212",
      address: "789 T. Nagar, Chennai"
    }
  },
  {
    id: "ag4",
    name: "Vikram Singh",
    email: "vikram.singh@yorkeholidays.com",
    adminId: "ba2",
    region: "Bangalore",
    joinedDate: "2024-03-05",
    status: "Pending",
    performance: {
      totalBookings: 0,
      totalSales: 0,
      commissionEarned: 0,
      successRate: 0,
      grade: "C"
    },
    contactInfo: {
      phone: "+91 9876543213",
      address: "321 MG Road, Bangalore"
    }
  }
];

// Mock data for Complaints
export interface Complaint {
  id: string;
  bookingId: string;
  agentId: string;
  customerName: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdDate: string;
  assignedTo?: string;
  resolution?: string;
  category: 'Booking Issue' | 'Payment Problem' | 'Service Quality' | 'Cancellation' | 'Other';
}

export const complaints: Complaint[] = [
  {
    id: "comp1",
    bookingId: "BK001",
    agentId: "ag1",
    customerName: "Rahul Gupta",
    subject: "Cruise cabin not as promised",
    description: "The ocean view cabin was actually an interior cabin. Very disappointed with the service.",
    status: "Open",
    priority: "High",
    createdDate: "2024-03-10",
    category: "Service Quality"
  },
  {
    id: "comp2",
    bookingId: "BK002",
    agentId: "ag2",
    customerName: "Priya Mehta",
    subject: "Payment deducted twice",
    description: "My credit card was charged twice for the same hotel booking. Need immediate refund.",
    status: "In Progress",
    priority: "Critical",
    createdDate: "2024-03-08",
    assignedTo: "ba1",
    category: "Payment Problem"
  },
  {
    id: "comp3",
    bookingId: "BK003",
    agentId: "ag3",
    customerName: "Arjun Sharma",
    subject: "Cancellation refund pending",
    description: "Cancelled my cruise booking 15 days ago but refund is still pending.",
    status: "Resolved",
    priority: "Medium",
    createdDate: "2024-02-25",
    assignedTo: "ba2",
    resolution: "Refund processed successfully. Customer notified via email.",
    category: "Cancellation"
  }
];

// Mock data for Offers
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
  assignedAgents: string[];
  usageCount: number;
  maxUsage?: number;
  regions: string[];
}

export const offers: Offer[] = [
  {
    id: "off1",
    title: "Early Bird Cruise Special",
    description: "Book your cruise 30 days in advance and save 15%",
    discountType: "Percentage",
    discountValue: 15,
    validFrom: "2024-03-01",
    validTo: "2024-06-30",
    applicableFor: "Cruises",
    status: "Active",
    createdBy: "Super Admin",
    assignedAgents: ["ag1", "ag2", "ag3"],
    usageCount: 23,
    maxUsage: 100,
    regions: ["Delhi", "Mumbai", "Chennai"]
  },
  {
    id: "off2",
    title: "Luxury Hotel Weekend Deal",
    description: "Stay 2 nights, get 1 night free at premium hotels",
    discountType: "Percentage",
    discountValue: 33,
    validFrom: "2024-03-15",
    validTo: "2024-04-15",
    applicableFor: "Hotels",
    status: "Active",
    createdBy: "ba1",
    assignedAgents: ["ag1", "ag2"],
    usageCount: 12,
    maxUsage: 50,
    regions: ["Delhi", "Punjab"]
  },
  {
    id: "off3",
    title: "Family Package Discount",
    description: "Special discount for families booking together",
    discountType: "Fixed Amount",
    discountValue: 10000,
    validFrom: "2024-02-01",
    validTo: "2024-03-31",
    applicableFor: "Both",
    status: "Expired",
    createdBy: "Super Admin",
    assignedAgents: ["ag1", "ag2", "ag3"],
    usageCount: 45,
    maxUsage: 75,
    regions: ["All"]
  }
];