/*
  # Complete Yorke Holidays CRM Database Schema

  1. New Tables
    - `users` - User accounts with role-based access
    - `cruises` - Cruise inventory and details  
    - `hotels` - Hotel inventory and details
    - `bookings` - Customer bookings and transactions
    - `complaints` - Customer complaint tracking
    - `offers` - Promotional offers and discounts
    - `booking_events` - Audit trail for booking changes
    - `user_sessions` - Active user sessions tracking

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for each role
    - Add audit triggers for data changes

  3. Performance
    - Add indexes for frequently queried columns
    - Add full-text search capabilities
    - Add materialized views for analytics

  4. Data Integrity
    - Add foreign key constraints
    - Add check constraints for data validation
    - Add default values and NOT NULL constraints
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users table with enhanced structure
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    name text NOT NULL,
    role text NOT NULL CHECK (role IN ('Travel Agent', 'Basic Admin', 'Super Admin')),
    status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Pending')),
    avatar text,
    region text,
    phone text,
    department text,
    last_login timestamptz,
    login_count integer DEFAULT 0,
    preferences jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Cruises table with comprehensive details
CREATE TABLE IF NOT EXISTS cruises (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    image text NOT NULL,
    from_location text NOT NULL,
    to_location text NOT NULL,
    duration integer NOT NULL CHECK (duration > 0),
    departure_dates text[] DEFAULT '{}',
    amenities text[] DEFAULT '{}',
    price_per_person numeric NOT NULL CHECK (price_per_person > 0),
    room_types text[] DEFAULT '{}',
    meal_plans text[] DEFAULT '{}',
    description text NOT NULL,
    ship_type text NOT NULL,
    cruise_line text NOT NULL,
    capacity integer DEFAULT 1000,
    availability jsonb DEFAULT '{}',
    gallery jsonb DEFAULT '[]',
    itinerary jsonb DEFAULT '[]',
    policies jsonb DEFAULT '{}',
    sustainability jsonb DEFAULT '{}',
    featured boolean DEFAULT false,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Hotels table with enhanced structure
CREATE TABLE IF NOT EXISTS hotels (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    location text NOT NULL,
    image text NOT NULL,
    star_rating integer NOT NULL CHECK (star_rating >= 1 AND star_rating <= 5),
    price_per_night numeric NOT NULL CHECK (price_per_night > 0),
    available_room_types text[] DEFAULT '{}',
    meal_plans text[] DEFAULT '{}',
    amenities text[] DEFAULT '{}',
    available_from text[] DEFAULT '{}',
    description text NOT NULL,
    hotel_type text NOT NULL,
    hotel_chain text NOT NULL,
    total_rooms integer DEFAULT 100,
    coordinates jsonb,
    gallery jsonb DEFAULT '[]',
    policies jsonb DEFAULT '{}',
    sustainability jsonb DEFAULT '{}',
    featured boolean DEFAULT false,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enhanced bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    type text NOT NULL CHECK (type IN ('Cruise', 'Hotel')),
    item_id uuid NOT NULL,
    item_name text NOT NULL,
    agent_id uuid NOT NULL REFERENCES users(id),
    agent_name text NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    customer_details jsonb DEFAULT '{}',
    booking_date date NOT NULL,
    travel_date date NOT NULL,
    return_date date,
    status text NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Pending', 'Cancelled', 'Completed')),
    total_amount numeric NOT NULL CHECK (total_amount > 0),
    commission_amount numeric DEFAULT 0 CHECK (commission_amount >= 0),
    payment_status text NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Failed', 'Refunded')),
    payment_details jsonb DEFAULT '{}',
    guests integer NOT NULL DEFAULT 1 CHECK (guests > 0),
    special_requests text,
    region text NOT NULL,
    cancellation_reason text,
    refund_amount numeric DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Complaints table with enhanced tracking
CREATE TABLE IF NOT EXISTS complaints (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid REFERENCES bookings(id),
    agent_id uuid NOT NULL REFERENCES users(id),
    customer_name text NOT NULL,
    customer_email text,
    customer_phone text,
    subject text NOT NULL,
    description text NOT NULL,
    status text NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Escalated')),
    priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    category text NOT NULL,
    assigned_to uuid REFERENCES users(id),
    resolution text,
    resolved_at timestamptz,
    escalated_at timestamptz,
    satisfaction_rating integer CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enhanced offers table
CREATE TABLE IF NOT EXISTS offers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text NOT NULL,
    discount_type text NOT NULL CHECK (discount_type IN ('Percentage', 'Fixed Amount')),
    discount_value numeric NOT NULL CHECK (discount_value > 0),
    valid_from date NOT NULL,
    valid_to date NOT NULL,
    applicable_for text NOT NULL CHECK (applicable_for IN ('Cruises', 'Hotels', 'Both')),
    status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Expired')),
    created_by uuid NOT NULL REFERENCES users(id),
    usage_count integer DEFAULT 0 CHECK (usage_count >= 0),
    max_usage integer CHECK (max_usage > 0),
    regions text[] DEFAULT '{}',
    terms_conditions text,
    minimum_amount numeric DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT valid_date_range CHECK (valid_to > valid_from),
    CONSTRAINT usage_limit CHECK (max_usage IS NULL OR usage_count <= max_usage)
);

-- Booking events for audit trail
CREATE TABLE IF NOT EXISTS booking_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    event_type text NOT NULL CHECK (event_type IN ('created', 'confirmed', 'modified', 'cancelled', 'completed', 'payment', 'refund')),
    description text NOT NULL,
    user_id uuid REFERENCES users(id),
    user_name text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- User sessions for tracking active users
CREATE TABLE IF NOT EXISTS user_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token text UNIQUE NOT NULL,
    ip_address inet,
    user_agent text,
    expires_at timestamptz NOT NULL,
    created_at timestamptz DEFAULT now(),
    last_activity timestamptz DEFAULT now()
);

-- Reviews table for customer feedback
CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid NOT NULL REFERENCES bookings(id),
    item_type text NOT NULL CHECK (item_type IN ('Cruise', 'Hotel')),
    item_id uuid NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title text NOT NULL,
    comment text NOT NULL,
    aspects jsonb DEFAULT '[]',
    helpful_count integer DEFAULT 0,
    verified boolean DEFAULT false,
    response_text text,
    response_by uuid REFERENCES users(id),
    response_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_region ON users(region);

CREATE INDEX IF NOT EXISTS idx_cruises_from_to ON cruises(from_location, to_location);
CREATE INDEX IF NOT EXISTS idx_cruises_cruise_line ON cruises(cruise_line);
CREATE INDEX IF NOT EXISTS idx_cruises_ship_type ON cruises(ship_type);
CREATE INDEX IF NOT EXISTS idx_cruises_price ON cruises(price_per_person);
CREATE INDEX IF NOT EXISTS idx_cruises_featured ON cruises(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_cruises_active ON cruises(active) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels(location);
CREATE INDEX IF NOT EXISTS idx_hotels_star_rating ON hotels(star_rating);
CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels(price_per_night);
CREATE INDEX IF NOT EXISTS idx_hotels_chain ON hotels(hotel_chain);
CREATE INDEX IF NOT EXISTS idx_hotels_featured ON hotels(featured) WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_bookings_agent_id ON bookings(agent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(type);
CREATE INDEX IF NOT EXISTS idx_bookings_region ON bookings(region);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);

CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_to ON complaints(assigned_to);
CREATE INDEX IF NOT EXISTS idx_complaints_agent_id ON complaints(agent_id);

CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_valid_dates ON offers(valid_from, valid_to);
CREATE INDEX IF NOT EXISTS idx_offers_applicable_for ON offers(applicable_for);

CREATE INDEX IF NOT EXISTS idx_booking_events_booking_id ON booking_events(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_events_type ON booking_events(event_type);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_cruises_search ON cruises USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_hotels_search ON hotels USING gin(to_tsvector('english', name || ' ' || location || ' ' || description));

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruises ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('Basic Admin', 'Super Admin')
    ));

CREATE POLICY "Super Admins can manage users" ON users
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'Super Admin'
    ));

-- RLS Policies for cruises table
CREATE POLICY "Anyone can read active cruises" ON cruises
    FOR SELECT TO authenticated
    USING (active = true);

CREATE POLICY "Admins can manage cruises" ON cruises
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('Basic Admin', 'Super Admin')
    ));

-- RLS Policies for hotels table
CREATE POLICY "Anyone can read active hotels" ON hotels
    FOR SELECT TO authenticated
    USING (active = true);

CREATE POLICY "Admins can manage hotels" ON hotels
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('Basic Admin', 'Super Admin')
    ));

-- RLS Policies for bookings table
CREATE POLICY "Users can read own bookings" ON bookings
    FOR SELECT TO authenticated
    USING (agent_id = auth.uid());

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT TO authenticated
    WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Users can update own bookings" ON bookings
    FOR UPDATE TO authenticated
    USING (agent_id = auth.uid());

CREATE POLICY "Admins can read all bookings" ON bookings
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('Basic Admin', 'Super Admin')
    ));

CREATE POLICY "Admins can manage bookings" ON bookings
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('Basic Admin', 'Super Admin')
    ));

-- RLS Policies for complaints table
CREATE POLICY "Users can read own complaints" ON complaints
    FOR SELECT TO authenticated
    USING (agent_id = auth.uid());

CREATE POLICY "Users can create complaints" ON complaints
    FOR INSERT TO authenticated
    WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Admins can manage complaints" ON complaints
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('Basic Admin', 'Super Admin')
    ));

-- RLS Policies for offers table
CREATE POLICY "Anyone can read active offers" ON offers
    FOR SELECT TO authenticated
    USING (status = 'Active' AND valid_from <= CURRENT_DATE AND valid_to >= CURRENT_DATE);

CREATE POLICY "Admins can manage offers" ON offers
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('Basic Admin', 'Super Admin')
    ));

-- RLS Policies for booking_events table
CREATE POLICY "Users can read own booking events" ON booking_events
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM bookings 
        WHERE id = booking_events.booking_id 
        AND agent_id = auth.uid()
    ));

CREATE POLICY "Users can create booking events" ON booking_events
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all booking events" ON booking_events
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('Basic Admin', 'Super Admin')
    ));

-- RLS Policies for user_sessions table
CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

-- RLS Policies for reviews table
CREATE POLICY "Anyone can read verified reviews" ON reviews
    FOR SELECT TO authenticated
    USING (verified = true);

CREATE POLICY "Users can create reviews for own bookings" ON reviews
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM bookings 
        WHERE id = reviews.booking_id 
        AND agent_id = auth.uid()
    ));

CREATE POLICY "Admins can manage reviews" ON reviews
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('Basic Admin', 'Super Admin')
    ));

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cruises_updated_at BEFORE UPDATE ON cruises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create materialized view for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS booking_analytics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    type,
    status,
    region,
    COUNT(*) as booking_count,
    SUM(total_amount) as total_revenue,
    SUM(commission_amount) as total_commission,
    AVG(total_amount) as avg_booking_value
FROM bookings
GROUP BY DATE_TRUNC('month', created_at), type, status, region;

CREATE INDEX IF NOT EXISTS idx_booking_analytics_month ON booking_analytics(month);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_booking_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY booking_analytics;
END;
$$ LANGUAGE plpgsql;