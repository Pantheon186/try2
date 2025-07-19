/*
  # Seed Sample Data for Yorke Holidays CRM

  1. Sample Users
    - Demo accounts for different roles
    - Travel agents, admins, and super admin

  2. Sample Cruises
    - Comprehensive cruise inventory
    - Various cruise lines and ship types

  3. Sample Hotels
    - Hotel inventory across different cities
    - Various star ratings and amenities

  4. Sample Bookings
    - Realistic booking data
    - Different statuses and payment states

  5. Sample Offers
    - Active promotional offers
    - Different discount types and regions
*/

-- Insert sample users
INSERT INTO users (id, email, name, role, status, region, phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'agent_demo@example.com', 'John Smith', 'Travel Agent', 'Active', 'Mumbai', '+91 9876543210'),
('550e8400-e29b-41d4-a716-446655440002', 'admin_demo@example.com', 'Sarah Johnson', 'Basic Admin', 'Active', 'Delhi', '+91 9876543211'),
('550e8400-e29b-41d4-a716-446655440003', 'superadmin_demo@example.com', 'Michael Chen', 'Super Admin', 'Active', 'Mumbai', '+91 9876543212'),
('550e8400-e29b-41d4-a716-446655440004', 'agent2@example.com', 'Priya Sharma', 'Travel Agent', 'Active', 'Chennai', '+91 9876543213'),
('550e8400-e29b-41d4-a716-446655440005', 'agent3@example.com', 'Rajesh Kumar', 'Travel Agent', 'Active', 'Bangalore', '+91 9876543214')
ON CONFLICT (email) DO NOTHING;

-- Insert sample cruises
INSERT INTO cruises (id, name, image, from_location, to_location, duration, departure_dates, amenities, price_per_person, room_types, meal_plans, description, ship_type, cruise_line, active, featured) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Royal Caribbean Explorer', 'https://images.pexels.com/photos/804463/pexels-photo-804463.jpeg', 'Mumbai', 'Goa', 7, '{"2024-04-15", "2024-04-22", "2024-04-29", "2024-05-06"}', '{"Swimming Pool", "Spa", "Casino", "Theater", "Rock Climbing", "Mini Golf"}', 45000, '{"Interior", "Ocean View", "Balcony", "Suite"}', '{"All Inclusive", "Premium Plus", "Basic Plus"}', 'Experience luxury on the Arabian Sea with world-class amenities and entertainment.', 'Mega Ship', 'Royal Caribbean', true, true),
('650e8400-e29b-41d4-a716-446655440002', 'Celebrity Infinity', 'https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg', 'Chennai', 'Kochi', 5, '{"2024-04-20", "2024-04-27", "2024-05-04", "2024-05-11"}', '{"Fine Dining", "Spa", "Library", "Art Gallery", "Fitness Center"}', 38000, '{"Interior", "Ocean View", "Balcony", "Suite"}', '{"All Inclusive", "Premium Plus", "Basic Plus"}', 'Elegant cruising along India''s western coast with premium dining and cultural experiences.', 'Premium Ship', 'Celebrity Cruises', true, true),
('650e8400-e29b-41d4-a716-446655440003', 'Norwegian Gem', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', 'Goa', 'Mangalore', 4, '{"2024-04-18", "2024-04-25", "2024-05-02", "2024-05-09"}', '{"Water Slides", "Kids Club", "Shows", "Casino", "Multiple Restaurants"}', 32000, '{"Interior", "Ocean View", "Balcony"}', '{"All Inclusive", "Basic Plus"}', 'Family-friendly adventure with exciting activities and entertainment for all ages.', 'Family Ship', 'Norwegian Cruise Line', true, false),
('650e8400-e29b-41d4-a716-446655440004', 'Princess Sapphire', 'https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg', 'Kochi', 'Lakshadweep', 6, '{"2024-04-16", "2024-04-23", "2024-04-30", "2024-05-07"}', '{"Spa", "Fine Dining", "Cultural Shows", "Yoga Classes", "Photography Classes"}', 52000, '{"Ocean View", "Balcony", "Suite", "Penthouse"}', '{"All Inclusive", "Premium Plus"}', 'Discover pristine coral islands with luxury accommodations and cultural immersion.', 'Luxury Ship', 'Princess Cruises', true, true),
('650e8400-e29b-41d4-a716-446655440005', 'MSC Bellissima', 'https://images.pexels.com/photos/2144326/pexels-photo-2144326.jpeg', 'Mumbai', 'Daman', 3, '{"2024-04-21", "2024-04-28", "2024-05-05", "2024-05-12"}', '{"Promenade", "Shopping", "Multiple Pools", "Sports Bar", "Live Music"}', 28000, '{"Interior", "Ocean View", "Balcony"}', '{"All Inclusive", "Basic Plus"}', 'Short getaway with modern amenities and Mediterranean-style elegance.', 'Modern Ship', 'MSC Cruises', true, false),
('650e8400-e29b-41d4-a716-446655440006', 'Costa Deliciosa', 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg', 'Chennai', 'Puducherry', 2, '{"2024-04-19", "2024-04-26", "2024-05-03", "2024-05-10"}', '{"Italian Cuisine", "Pool Deck", "Entertainment", "Wellness Center"}', 22000, '{"Interior", "Ocean View"}', '{"All Inclusive"}', 'Quick coastal escape with authentic Italian hospitality and cuisine.', 'Classic Ship', 'Costa Cruises', true, false),
('650e8400-e29b-41d4-a716-446655440007', 'Disney Wonder', 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg', 'Goa', 'Karwar', 4, '{"2024-04-17", "2024-04-24", "2024-05-01", "2024-05-08"}', '{"Character Meet & Greet", "Kids Activities", "Family Shows", "Pool Complex"}', 48000, '{"Interior", "Ocean View", "Balcony", "Suite"}', '{"All Inclusive", "Premium Plus"}', 'Magical family cruise with Disney characters and world-class entertainment.', 'Family Ship', 'Disney Cruise Line', true, true),
('650e8400-e29b-41d4-a716-446655440008', 'Holland America Nieuw', 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg', 'Kochi', 'Beypore', 5, '{"2024-04-14", "2024-04-21", "2024-04-28", "2024-05-05"}', '{"Culinary Arts Center", "Observatory", "Library", "Spa", "Classical Music"}', 42000, '{"Interior", "Ocean View", "Balcony", "Suite"}', '{"All Inclusive", "Premium Plus"}', 'Sophisticated cruising with enrichment programs and culinary excellence.', 'Premium Ship', 'Holland America Line', true, false),
('650e8400-e29b-41d4-a716-446655440009', 'Anthem of the Seas', 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg', 'Mumbai', 'Dubai', 8, '{"2024-05-12", "2024-05-19", "2024-05-26", "2024-06-02"}', '{"Sky Diving Simulator", "Robot Bartenders", "Bumper Cars", "Surf Simulator", "Rock Climbing"}', 65000, '{"Interior", "Ocean View", "Balcony", "Suite", "Penthouse"}', '{"All Inclusive", "Premium Plus", "Basic Plus"}', 'Revolutionary cruise ship with cutting-edge technology and thrilling activities.', 'Quantum Class', 'Royal Caribbean', true, true),
('650e8400-e29b-41d4-a716-446655440010', 'Seabourn Encore', 'https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg', 'Chennai', 'Colombo', 6, '{"2024-05-15", "2024-05-22", "2024-05-29", "2024-06-05"}', '{"Ultra-Luxury Suites", "Personal Butler", "Michelin-Star Dining", "Marina Platform", "Spa Terrace"}', 95000, '{"Ocean View", "Balcony", "Suite", "Penthouse"}', '{"All Inclusive", "Premium Plus"}', 'Ultra-luxury small ship cruising with personalized service and exclusive experiences.', 'Ultra-Luxury', 'Seabourn', true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample hotels
INSERT INTO hotels (id, name, location, image, star_rating, price_per_night, available_room_types, meal_plans, amenities, available_from, description, hotel_type, hotel_chain, active, featured) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'The Oberoi Mumbai', 'Mumbai, Maharashtra', 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', 5, 25000, '{"Deluxe Room", "Premier Room", "Luxury Suite", "Presidential Suite"}', '{"Room Only", "Breakfast Included", "Half Board", "Full Board"}', '{"Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking", "Pet Friendly", "Garden"}', '{"2024-04-15", "2024-04-22", "2024-04-29", "2024-05-06"}', 'Experience luxury redefined at The Oberoi Mumbai with panoramic views of the Arabian Sea.', 'Luxury', 'Oberoi Hotels', true, true),
('750e8400-e29b-41d4-a716-446655440002', 'Taj Lake Palace Udaipur', 'Udaipur, Rajasthan', 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg', 5, 35000, '{"Palace Room", "Grand Royal Suite", "Presidential Suite"}', '{"Breakfast Included", "Half Board", "Full Board"}', '{"Spa", "Pool", "Wi-Fi", "AC", "Garden", "Pet Friendly"}', '{"2024-04-18", "2024-04-25", "2024-05-02", "2024-05-09"}', 'A floating palace on Lake Pichola offering royal luxury and heritage charm.', 'Luxury', 'Taj Hotels', true, true),
('750e8400-e29b-41d4-a716-446655440003', 'ITC Grand Chola Chennai', 'Chennai, Tamil Nadu', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 5, 18000, '{"Executive Room", "Club Room", "Royal Suite"}', '{"Room Only", "Breakfast Included", "Half Board"}', '{"Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking"}', '{"2024-04-20", "2024-04-27", "2024-05-04", "2024-05-11"}', 'South India''s largest luxury hotel inspired by the grandeur of the Chola dynasty.', 'Business', 'ITC Hotels', true, false),
('750e8400-e29b-41d4-a716-446655440004', 'The Leela Palace New Delhi', 'New Delhi, Delhi', 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg', 5, 22000, '{"Deluxe Room", "Club Room", "Royal Suite", "Presidential Suite"}', '{"Room Only", "Breakfast Included", "Half Board", "Full Board"}', '{"Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking", "Garden"}', '{"2024-04-16", "2024-04-23", "2024-04-30", "2024-05-07"}', 'Luxury hotel in the heart of New Delhi with world-class amenities and service.', 'Luxury', 'The Leela', true, true),
('750e8400-e29b-41d4-a716-446655440005', 'Goa Marriott Resort', 'Panaji, Goa', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', 4, 12000, '{"Standard Room", "Deluxe Room", "Suite"}', '{"Room Only", "Breakfast Included", "Half Board"}', '{"Pool", "Gym", "Wi-Fi", "AC", "Parking", "Pet Friendly", "Garden"}', '{"2024-04-21", "2024-04-28", "2024-05-05", "2024-05-12"}', 'Beachfront resort offering tropical luxury with stunning views of the Arabian Sea.', 'Luxury', 'Marriott', true, false),
('750e8400-e29b-41d4-a716-446655440006', 'Hotel Clarks Amer Jaipur', 'Jaipur, Rajasthan', 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg', 4, 8000, '{"Standard Room", "Deluxe Room", "Executive Suite"}', '{"Room Only", "Breakfast Included"}', '{"Pool", "Gym", "Wi-Fi", "AC", "Parking"}', '{"2024-04-19", "2024-04-26", "2024-05-03", "2024-05-10"}', 'Heritage hotel in the Pink City offering traditional Rajasthani hospitality.', 'Boutique', 'Clarks Hotels', true, false),
('750e8400-e29b-41d4-a716-446655440007', 'Hyatt Regency Kolkata', 'Kolkata, West Bengal', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 4, 10000, '{"Standard Room", "Club Room", "Regency Suite"}', '{"Room Only", "Breakfast Included", "Half Board"}', '{"Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking"}', '{"2024-04-17", "2024-04-24", "2024-05-01", "2024-05-08"}', 'Modern luxury hotel in the cultural capital of India with excellent business facilities.', 'Business', 'Hyatt', true, false),
('750e8400-e29b-41d4-a716-446655440008', 'The Ashok New Delhi', 'New Delhi, Delhi', 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg', 4, 7500, '{"Standard Room", "Deluxe Room", "Suite"}', '{"Room Only", "Breakfast Included"}', '{"Pool", "Gym", "Wi-Fi", "AC", "Parking", "Garden"}', '{"2024-04-14", "2024-04-21", "2024-04-28", "2024-05-05"}', 'Government-owned luxury hotel with spacious rooms and extensive facilities.', 'Business', 'ITDC', true, false),
('750e8400-e29b-41d4-a716-446655440009', 'Ritz-Carlton Mumbai', 'Mumbai, Maharashtra', 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', 5, 45000, '{"Deluxe Room", "Club Level", "Executive Suite", "Presidential Suite"}', '{"Room Only", "Breakfast Included", "Half Board", "Full Board"}', '{"Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking", "Pet Friendly", "Garden"}', '{"2024-05-12", "2024-05-19", "2024-05-26", "2024-06-02"}', 'Legendary luxury hotel with impeccable service and stunning city views.', 'Luxury', 'Ritz-Carlton', true, true),
('750e8400-e29b-41d4-a716-446655440010', 'Four Seasons Bengaluru', 'Bangalore, Karnataka', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 5, 28000, '{"Premier Room", "Executive Suite", "Four Seasons Suite"}', '{"Room Only", "Breakfast Included", "Half Board"}', '{"Spa", "Pool", "Gym", "Wi-Fi", "AC", "Parking", "Garden"}', '{"2024-05-15", "2024-05-22", "2024-05-29", "2024-06-05"}', 'Contemporary luxury in India''s Silicon Valley with world-class amenities.', 'Luxury', 'Four Seasons', true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (id, type, item_id, item_name, agent_id, agent_name, customer_name, customer_email, customer_phone, booking_date, travel_date, status, total_amount, commission_amount, payment_status, guests, special_requests, region) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Cruise', '650e8400-e29b-41d4-a716-446655440001', 'Royal Caribbean Explorer', '550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'Rahul Gupta', 'rahul.gupta@email.com', '+91 9876543210', '2024-03-01', '2024-04-15', 'Confirmed', 90000, 4500, 'Paid', 2, 'Ocean view cabin preferred', 'Mumbai'),
('850e8400-e29b-41d4-a716-446655440002', 'Hotel', '750e8400-e29b-41d4-a716-446655440001', 'The Oberoi Mumbai', '550e8400-e29b-41d4-a716-446655440004', 'Priya Sharma', 'Priya Mehta', 'priya.mehta@email.com', '+91 9876543211', '2024-03-05', '2024-03-20', 'Confirmed', 75000, 3750, 'Paid', 2, 'Late checkout requested', 'Chennai'),
('850e8400-e29b-41d4-a716-446655440003', 'Cruise', '650e8400-e29b-41d4-a716-446655440002', 'Celebrity Infinity', '550e8400-e29b-41d4-a716-446655440005', 'Rajesh Kumar', 'Arjun Sharma', 'arjun.sharma@email.com', '+91 9876543212', '2024-02-28', '2024-04-10', 'Cancelled', 76000, 0, 'Refunded', 2, '', 'Bangalore'),
('850e8400-e29b-41d4-a716-446655440004', 'Hotel', '750e8400-e29b-41d4-a716-446655440002', 'Taj Lake Palace Udaipur', '550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'Kavya Nair', 'kavya.nair@email.com', '+91 9876543213', '2024-03-08', '2024-04-25', 'Pending', 105000, 5250, 'Pending', 2, 'Honeymoon package', 'Mumbai'),
('850e8400-e29b-41d4-a716-446655440005', 'Cruise', '650e8400-e29b-41d4-a716-446655440003', 'Norwegian Gem', '550e8400-e29b-41d4-a716-446655440004', 'Priya Sharma', 'Ravi Kumar', 'ravi.kumar@email.com', '+91 9876543214', '2024-03-10', '2024-05-01', 'Confirmed', 64000, 3200, 'Paid', 2, '', 'Chennai'),
('850e8400-e29b-41d4-a716-446655440006', 'Hotel', '750e8400-e29b-41d4-a716-446655440003', 'ITC Grand Chola Chennai', '550e8400-e29b-41d4-a716-446655440005', 'Rajesh Kumar', 'Deepika Rao', 'deepika.rao@email.com', '+91 9876543215', '2024-03-12', '2024-04-05', 'Completed', 54000, 2700, 'Paid', 1, 'Business center access needed', 'Bangalore'),
('850e8400-e29b-41d4-a716-446655440007', 'Cruise', '650e8400-e29b-41d4-a716-446655440009', 'Anthem of the Seas', '550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'Neha Patel', 'neha.patel@email.com', '+91 9876543216', '2024-03-15', '2024-05-12', 'Confirmed', 130000, 6500, 'Paid', 2, 'Anniversary celebration', 'Mumbai'),
('850e8400-e29b-41d4-a716-446655440008', 'Hotel', '750e8400-e29b-41d4-a716-446655440009', 'Ritz-Carlton Mumbai', '550e8400-e29b-41d4-a716-446655440005', 'Rajesh Kumar', 'Vikram Singh', 'vikram.singh@email.com', '+91 9876543217', '2024-03-18', '2024-05-15', 'Pending', 180000, 9000, 'Pending', 2, 'Executive floor preferred', 'Bangalore')
ON CONFLICT (id) DO NOTHING;

-- Insert sample complaints
INSERT INTO complaints (id, booking_id, agent_id, customer_name, subject, description, status, priority, category, assigned_to) VALUES
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Rahul Gupta', 'Cruise cabin not as promised', 'The ocean view cabin was actually an interior cabin. Very disappointed with the service.', 'Open', 'High', 'Service Quality', '550e8400-e29b-41d4-a716-446655440002'),
('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Priya Mehta', 'Payment deducted twice', 'My credit card was charged twice for the same hotel booking. Need immediate refund.', 'In Progress', 'Critical', 'Payment Problem', '550e8400-e29b-41d4-a716-446655440002'),
('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'Arjun Sharma', 'Cancellation refund pending', 'Cancelled my cruise booking 15 days ago but refund is still pending.', 'Resolved', 'Medium', 'Cancellation', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample offers
INSERT INTO offers (id, title, description, discount_type, discount_value, valid_from, valid_to, applicable_for, status, created_by, usage_count, max_usage, regions) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'Early Bird Cruise Special', 'Book your cruise 30 days in advance and save 15%', 'Percentage', 15, '2024-03-01', '2024-06-30', 'Cruises', 'Active', '550e8400-e29b-41d4-a716-446655440003', 23, 100, '{"Mumbai", "Chennai", "Bangalore"}'),
('a50e8400-e29b-41d4-a716-446655440002', 'Luxury Hotel Weekend Deal', 'Stay 2 nights, get 1 night free at premium hotels', 'Percentage', 33, '2024-03-15', '2024-04-15', 'Hotels', 'Active', '550e8400-e29b-41d4-a716-446655440002', 12, 50, '{"Mumbai", "Delhi"}'),
('a50e8400-e29b-41d4-a716-446655440003', 'Family Package Discount', 'Special discount for families booking together', 'Fixed Amount', 10000, '2024-02-01', '2024-03-31', 'Both', 'Expired', '550e8400-e29b-41d4-a716-446655440003', 45, 75, '{"Mumbai", "Chennai", "Bangalore", "Delhi"}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample booking events
INSERT INTO booking_events (booking_id, event_type, description, user_id, user_name, metadata) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'created', 'Booking created for Royal Caribbean Explorer', '550e8400-e29b-41d4-a716-446655440001', 'John Smith', '{"source": "web_app", "booking_type": "Cruise", "amount": 90000}'),
('850e8400-e29b-41d4-a716-446655440001', 'confirmed', 'Booking confirmed and payment processed', '550e8400-e29b-41d4-a716-446655440001', 'John Smith', '{"payment_method": "credit_card", "transaction_id": "TXN123456"}'),
('850e8400-e29b-41d4-a716-446655440003', 'created', 'Booking created for Celebrity Infinity', '550e8400-e29b-41d4-a716-446655440005', 'Rajesh Kumar', '{"source": "web_app", "booking_type": "Cruise", "amount": 76000}'),
('850e8400-e29b-41d4-a716-446655440003', 'cancelled', 'Booking cancelled by customer request', '550e8400-e29b-41d4-a716-446655440005', 'Rajesh Kumar', '{"cancellation_reason": "Change of plans", "refund_amount": 76000}')
ON CONFLICT (id) DO NOTHING;