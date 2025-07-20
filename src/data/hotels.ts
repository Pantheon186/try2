// Mock data for hotel listings
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
}

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "The Oberoi Mumbai",
    location: "Mumbai, Maharashtra",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    starRating: 5,
    pricePerNight: 25000,
    availableRoomTypes: ["Deluxe Room", "Premier Room", "Luxury Suite", "Presidential Suite"],
    mealPlans: ["Room Only", "Breakfast Included", "Half Board", "Full Board"],
    amenities: ["Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking", "Pet Friendly", "Garden"],
    availableFrom: ["2024-03-15", "2024-03-22", "2024-03-29", "2024-04-05"],
    description: "Experience luxury redefined at The Oberoi Mumbai with panoramic views of the Arabian Sea.",
    hotelType: "Luxury",
    hotelChain: "Oberoi Hotels"
  },
  {
    id: "2",
    name: "Taj Lake Palace Udaipur",
    location: "Udaipur, Rajasthan",
    image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg",
    starRating: 5,
    pricePerNight: 35000,
    availableRoomTypes: ["Palace Room", "Grand Royal Suite", "Presidential Suite"],
    mealPlans: ["Breakfast Included", "Half Board", "Full Board"],
    amenities: ["Spa", "Pool", "Wi-Fi", "AC", "Garden", "Pet Friendly"],
    availableFrom: ["2024-03-18", "2024-03-25", "2024-04-01", "2024-04-08"],
    description: "A floating palace on Lake Pichola offering royal luxury and heritage charm.",
    hotelType: "Luxury",
    hotelChain: "Taj Hotels"
  },
  {
    id: "3",
    name: "ITC Grand Chola Chennai",
    location: "Chennai, Tamil Nadu",
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    starRating: 5,
    pricePerNight: 18000,
    availableRoomTypes: ["Executive Room", "Club Room", "Royal Suite"],
    mealPlans: ["Room Only", "Breakfast Included", "Half Board"],
    amenities: ["Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking"],
    availableFrom: ["2024-03-20", "2024-03-27", "2024-04-03", "2024-04-10"],
    description: "South India's largest luxury hotel inspired by the grandeur of the Chola dynasty.",
    hotelType: "Business",
    hotelChain: "ITC Hotels"
  },
  {
    id: "4",
    name: "The Leela Palace New Delhi",
    location: "New Delhi, Delhi",
    image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    starRating: 5,
    pricePerNight: 22000,
    availableRoomTypes: ["Deluxe Room", "Club Room", "Royal Suite", "Presidential Suite"],
    mealPlans: ["Room Only", "Breakfast Included", "Half Board", "Full Board"],
    amenities: ["Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking", "Garden"],
    availableFrom: ["2024-03-16", "2024-03-23", "2024-03-30", "2024-04-06"],
    description: "Luxury hotel in the heart of New Delhi with world-class amenities and service.",
    hotelType: "Luxury",
    hotelChain: "The Leela"
  },
  {
    id: "5",
    name: "Goa Marriott Resort",
    location: "Panaji, Goa",
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    starRating: 4,
    pricePerNight: 12000,
    availableRoomTypes: ["Standard Room", "Deluxe Room", "Suite"],
    mealPlans: ["Room Only", "Breakfast Included", "Half Board"],
    amenities: ["Pool", "Gym", "Wi-Fi", "AC", "Parking", "Pet Friendly", "Garden"],
    availableFrom: ["2024-03-21", "2024-03-28", "2024-04-04", "2024-04-11"],
    description: "Beachfront resort offering tropical luxury with stunning views of the Arabian Sea.",
    hotelType: "Luxury",
    hotelChain: "Marriott"
  },
  {
    id: "6",
    name: "Hotel Clarks Amer Jaipur",
    location: "Jaipur, Rajasthan",
    image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg",
    starRating: 4,
    pricePerNight: 8000,
    availableRoomTypes: ["Standard Room", "Deluxe Room", "Executive Suite"],
    mealPlans: ["Room Only", "Breakfast Included"],
    amenities: ["Pool", "Gym", "Wi-Fi", "AC", "Parking"],
    availableFrom: ["2024-03-19", "2024-03-26", "2024-04-02", "2024-04-09"],
    description: "Heritage hotel in the Pink City offering traditional Rajasthani hospitality.",
    hotelType: "Boutique",
    hotelChain: "Clarks Hotels"
  },
  {
    id: "7",
    name: "Hyatt Regency Kolkata",
    location: "Kolkata, West Bengal",
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    starRating: 4,
    pricePerNight: 10000,
    availableRoomTypes: ["Standard Room", "Club Room", "Regency Suite"],
    mealPlans: ["Room Only", "Breakfast Included", "Half Board"],
    amenities: ["Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking"],
    availableFrom: ["2024-03-17", "2024-03-24", "2024-03-31", "2024-04-07"],
    description: "Modern luxury hotel in the cultural capital of India with excellent business facilities.",
    hotelType: "Business",
    hotelChain: "Hyatt"
  },
  {
    id: "8",
    name: "The Ashok New Delhi",
    location: "New Delhi, Delhi",
    image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    starRating: 4,
    pricePerNight: 7500,
    availableRoomTypes: ["Standard Room", "Deluxe Room", "Suite"],
    mealPlans: ["Room Only", "Breakfast Included"],
    amenities: ["Pool", "Gym", "Wi-Fi", "AC", "Parking", "Garden"],
    availableFrom: ["2024-03-14", "2024-03-21", "2024-03-28", "2024-04-04"],
    description: "Government-owned luxury hotel with spacious rooms and extensive facilities.",
    hotelType: "Business",
    hotelChain: "ITDC"
  },
  {
    id: "9",
    name: "Treebo Trend Amber",
    location: "Bangalore, Karnataka",
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    starRating: 3,
    pricePerNight: 4500,
    availableRoomTypes: ["Standard Room", "Deluxe Room"],
    mealPlans: ["Room Only", "Breakfast Included"],
    amenities: ["Wi-Fi", "AC", "Parking"],
    availableFrom: ["2024-03-22", "2024-03-29", "2024-04-05", "2024-04-12"],
    description: "Budget-friendly hotel with modern amenities in the heart of Silicon Valley of India.",
    hotelType: "Budget",
    hotelChain: "Treebo"
  },
  {
    id: "10",
    name: "FabHotel Prime Seasons",
    location: "Pune, Maharashtra",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    starRating: 3,
    pricePerNight: 3500,
    availableRoomTypes: ["Standard Room", "Premium Room"],
    mealPlans: ["Room Only", "Breakfast Included"],
    amenities: ["Wi-Fi", "AC", "Parking"],
    availableFrom: ["2024-03-15", "2024-03-22", "2024-03-29", "2024-04-05"],
    description: "Comfortable and affordable accommodation with essential amenities for business travelers.",
    hotelType: "Budget",
    hotelChain: "FabHotels"
  },
  {
    id: "11",
    name: "Ritz-Carlton Mumbai",
    location: "Mumbai, Maharashtra",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    starRating: 5,
    pricePerNight: 45000,
    availableRoomTypes: ["Deluxe Room", "Club Level", "Executive Suite", "Presidential Suite"],
    mealPlans: ["Room Only", "Breakfast Included", "Half Board", "Full Board"],
    amenities: ["Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking", "Pet Friendly", "Garden"],
    availableFrom: ["2024-04-12", "2024-04-19", "2024-04-26", "2024-05-03"],
    description: "Legendary luxury hotel with impeccable service and stunning city views.",
    hotelType: "Luxury",
    hotelChain: "Ritz-Carlton"
  },
  {
    id: "12",
    name: "Four Seasons Bengaluru",
    location: "Bangalore, Karnataka",
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    starRating: 5,
    pricePerNight: 28000,
    availableRoomTypes: ["Premier Room", "Executive Suite", "Four Seasons Suite"],
    mealPlans: ["Room Only", "Breakfast Included", "Half Board"],
    amenities: ["Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking", "Garden"],
    availableFrom: ["2024-04-15", "2024-04-22", "2024-04-29", "2024-05-06"],
    description: "Contemporary luxury in India's Silicon Valley with world-class amenities.",
    hotelType: "Luxury",
    hotelChain: "Four Seasons"
  }
];

// Mock filter data
export const cities = [
  "All Cities",
  "Mumbai", "New Delhi", "Bangalore", "Chennai", "Kolkata", "Hyatt", "Pune", "Jaipur", "Udaipur", "Goa"
];

export const hotelTypes = [
  "All Types",
  "Budget", "Luxury", "Boutique", "Business"
];

export const hotelChains = [
  "All Chains",
  "Oberoi Hotels", "Taj Hotels", "ITC Hotels", "The Leela", "Marriott", "Clarks Hotels", "Hyatt", "ITDC", "Treebo", "FabHotels"
];

export const months = [
  "All Months", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

export const indoorAmenities = [
  "Gym", "Spa", "Pool", "Wi-Fi", "AC"
];

export const outdoorAmenities = [
  "Parking", "Pet Friendly", "Garden"
];