// Mock data for cruise listings
export interface Cruise {
  id: string;
  name: string;
  image: string;
  from: string;
  to: string;
  duration: number; // in nights
  departureDates: string[];
  amenities: string[];
  pricePerPerson: number;
  roomTypes: string[];
  mealPlans: string[];
  description: string;
  shipType: string;
  cruiseLine: string;
}

export const cruises: Cruise[] = [
  {
    id: "1",
    name: "Royal Caribbean Explorer",
    image: "https://images.pexels.com/photos/804463/pexels-photo-804463.jpeg",
    from: "Mumbai",
    to: "Goa",
    duration: 7,
    departureDates: ["2024-03-15", "2024-03-22", "2024-03-29", "2024-04-05"],
    amenities: ["Swimming Pool", "Spa", "Casino", "Theater", "Rock Climbing", "Mini Golf"],
    pricePerPerson: 45000,
    roomTypes: ["Interior", "Ocean View", "Balcony", "Suite"],
    mealPlans: ["All Inclusive", "Premium Plus", "Basic Plus"],
    description: "Experience luxury on the Arabian Sea with world-class amenities and entertainment.",
    shipType: "Mega Ship",
    cruiseLine: "Royal Caribbean"
  },
  {
    id: "2",
    name: "Celebrity Infinity",
    image: "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg",
    from: "Chennai",
    to: "Kochi",
    duration: 5,
    departureDates: ["2024-03-20", "2024-03-27", "2024-04-03", "2024-04-10"],
    amenities: ["Fine Dining", "Spa", "Library", "Art Gallery", "Fitness Center"],
    pricePerPerson: 38000,
    roomTypes: ["Interior", "Ocean View", "Balcony", "Suite"],
    mealPlans: ["All Inclusive", "Premium Plus", "Basic Plus"],
    description: "Elegant cruising along India's western coast with premium dining and cultural experiences.",
    shipType: "Premium Ship",
    cruiseLine: "Celebrity Cruises"
  },
  {
    id: "3",
    name: "Norwegian Gem",
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    from: "Goa",
    to: "Mangalore",
    duration: 4,
    departureDates: ["2024-03-18", "2024-03-25", "2024-04-01", "2024-04-08"],
    amenities: ["Water Slides", "Kids Club", "Shows", "Casino", "Multiple Restaurants"],
    pricePerPerson: 32000,
    roomTypes: ["Interior", "Ocean View", "Balcony"],
    mealPlans: ["All Inclusive", "Basic Plus"],
    description: "Family-friendly adventure with exciting activities and entertainment for all ages.",
    shipType: "Family Ship",
    cruiseLine: "Norwegian Cruise Line"
  },
  {
    id: "4",
    name: "Princess Sapphire",
    image: "https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg",
    from: "Kochi",
    to: "Lakshadweep",
    duration: 6,
    departureDates: ["2024-03-16", "2024-03-23", "2024-03-30", "2024-04-06"],
    amenities: ["Spa", "Fine Dining", "Cultural Shows", "Yoga Classes", "Photography Classes"],
    pricePerPerson: 52000,
    roomTypes: ["Ocean View", "Balcony", "Suite", "Penthouse"],
    mealPlans: ["All Inclusive", "Premium Plus"],
    description: "Discover pristine coral islands with luxury accommodations and cultural immersion.",
    shipType: "Luxury Ship",
    cruiseLine: "Princess Cruises"
  },
  {
    id: "5",
    name: "MSC Bellissima",
    image: "https://images.pexels.com/photos/2144326/pexels-photo-2144326.jpeg",
    from: "Mumbai",
    to: "Daman",
    duration: 3,
    departureDates: ["2024-03-21", "2024-03-28", "2024-04-04", "2024-04-11"],
    amenities: ["Promenade", "Shopping", "Multiple Pools", "Sports Bar", "Live Music"],
    pricePerPerson: 28000,
    roomTypes: ["Interior", "Ocean View", "Balcony"],
    mealPlans: ["All Inclusive", "Basic Plus"],
    description: "Short getaway with modern amenities and Mediterranean-style elegance.",
    shipType: "Modern Ship",
    cruiseLine: "MSC Cruises"
  },
  {
    id: "6",
    name: "Costa Deliciosa",
    image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
    from: "Chennai",
    to: "Puducherry",
    duration: 2,
    departureDates: ["2024-03-19", "2024-03-26", "2024-04-02", "2024-04-09"],
    amenities: ["Italian Cuisine", "Pool Deck", "Entertainment", "Wellness Center"],
    pricePerPerson: 22000,
    roomTypes: ["Interior", "Ocean View"],
    mealPlans: ["All Inclusive"],
    description: "Quick coastal escape with authentic Italian hospitality and cuisine.",
    shipType: "Classic Ship",
    cruiseLine: "Costa Cruises"
  },
  {
    id: "7",
    name: "Disney Wonder",
    image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
    from: "Goa",
    to: "Karwar",
    duration: 4,
    departureDates: ["2024-03-17", "2024-03-24", "2024-03-31", "2024-04-07"],
    amenities: ["Character Meet & Greet", "Kids Activities", "Family Shows", "Pool Complex"],
    pricePerPerson: 48000,
    roomTypes: ["Interior", "Ocean View", "Balcony", "Suite"],
    mealPlans: ["All Inclusive", "Premium Plus"],
    description: "Magical family cruise with Disney characters and world-class entertainment.",
    shipType: "Family Ship",
    cruiseLine: "Disney Cruise Line"
  },
  {
    id: "8",
    name: "Holland America Nieuw",
    image: "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg",
    from: "Kochi",
    to: "Beypore",
    duration: 5,
    departureDates: ["2024-03-14", "2024-03-21", "2024-03-28", "2024-04-04"],
    amenities: ["Culinary Arts Center", "Observatory", "Library", "Spa", "Classical Music"],
    pricePerPerson: 42000,
    roomTypes: ["Interior", "Ocean View", "Balcony", "Suite"],
    mealPlans: ["All Inclusive", "Premium Plus"],
    description: "Sophisticated cruising with enrichment programs and culinary excellence.",
    shipType: "Premium Ship",
    cruiseLine: "Holland America Line"
  },
  {
    id: "9",
    name: "Anthem of the Seas",
    image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
    from: "Mumbai",
    to: "Dubai",
    duration: 8,
    departureDates: ["2024-04-12", "2024-04-19", "2024-04-26", "2024-05-03"],
    amenities: ["Sky Diving Simulator", "Robot Bartenders", "Bumper Cars", "Surf Simulator", "Rock Climbing"],
    pricePerPerson: 65000,
    roomTypes: ["Interior", "Ocean View", "Balcony", "Suite", "Penthouse"],
    mealPlans: ["All Inclusive", "Premium Plus", "Basic Plus"],
    description: "Revolutionary cruise ship with cutting-edge technology and thrilling activities.",
    shipType: "Quantum Class",
    cruiseLine: "Royal Caribbean"
  },
  {
    id: "10",
    name: "Seabourn Encore",
    image: "https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg",
    from: "Chennai",
    to: "Colombo",
    duration: 6,
    departureDates: ["2024-04-15", "2024-04-22", "2024-04-29", "2024-05-06"],
    amenities: ["Ultra-Luxury Suites", "Personal Butler", "Michelin-Star Dining", "Marina Platform", "Spa Terrace"],
    pricePerPerson: 95000,
    roomTypes: ["Ocean View", "Balcony", "Suite", "Penthouse"],
    mealPlans: ["All Inclusive", "Premium Plus"],
    description: "Ultra-luxury small ship cruising with personalized service and exclusive experiences.",
    shipType: "Ultra-Luxury",
    cruiseLine: "Seabourn"
  }
];

// Mock filter data
export const destinations = [
  "All Destinations",
  "Goa", "Kochi", "Mumbai", "Chennai", "Lakshadweep", "Mangalore", "Daman", "Puducherry", "Karwar", "Beypore"
];

export const cruiseLines = [
  "All Cruise Lines",
  "Royal Caribbean", "Celebrity Cruises", "Norwegian Cruise Line", "Princess Cruises", 
  "MSC Cruises", "Costa Cruises", "Disney Cruise Line", "Holland America Line"
];

export const shipTypes = [
  "All Ship Types",
  "Mega Ship", "Premium Ship", "Family Ship", "Luxury Ship", "Modern Ship", "Classic Ship"
];

export const months = [
  "All Months", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

export const outdoorAmenities = [
  "Swimming Pool", "Water Slides", "Rock Climbing", "Mini Golf", "Pool Deck", "Observatory"
];

export const indoorAmenities = [
  "Spa", "Casino", "Theater", "Fine Dining", "Library", "Art Gallery", "Fitness Center", 
  "Kids Club", "Shopping", "Wellness Center", "Culinary Arts Center"
];