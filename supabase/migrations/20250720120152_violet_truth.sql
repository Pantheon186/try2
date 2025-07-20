/*
  # Complete CRM Database Schema

  1. New Tables
    - `users` - User management with roles and regions
    - `cruises` - Cruise inventory with detailed information
    - `hotels` - Hotel inventory with amenities and pricing
    - `bookings` - Booking management with status tracking
    - `complaints` - Customer complaint management system
    - `offers` - Promotional offers and discounts
    - `reviews` - Customer reviews and ratings
    - `notifications` - In-app notification system
    - `audit_logs` - System audit trail
    - `analytics` - Performance analytics data

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for role-based access
    - Implement data validation triggers

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize foreign key relationships
    - Include full-text search capabilities
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table with enhanced profile management
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('Travel Agent', 'Basic Admin', 'Super Admin')),
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Pending')),
  avatar text,
  region text,
  phone text,
  commission_rate decimal(5,2) DEFAULT 5.00,
  total_bookings integer DEFAULT 0,
  total_revenue decimal(12,2) DEFAULT 0,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cruises table with comprehensive details
CREATE TABLE IF NOT EXISTS cruises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image text NOT NULL,
  from_location text NOT NULL,
  to_location text NOT NULL,
  duration integer NOT NULL CHECK (duration > 0),
  departure_dates jsonb NOT NULL DEFAULT '[]',
  amenities jsonb NOT NULL DEFAULT '[]',
  price_per_person decimal(10,2) NOT NULL CHECK (price_per_person > 0),
  room_types jsonb NOT NULL DEFAULT '[]',
  meal_plans jsonb NOT NULL DEFAULT '[]',
  description text NOT NULL,
  ship_type text NOT NULL,
  cruise_line text NOT NULL,
  capacity integer DEFAULT 2000,
  availability jsonb DEFAULT '{}',
  itinerary jsonb DEFAULT '[]',
  gallery jsonb DEFAULT '[]',
  sustainability jsonb DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hotels table with detailed amenities
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  image text NOT NULL,
  star_rating integer NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
  price_per_night decimal(10,2) NOT NULL CHECK (price_per_night > 0),
  available_room_types jsonb NOT NULL DEFAULT '[]',
  meal_plans jsonb NOT NULL DEFAULT '[]',
  amenities jsonb NOT NULL DEFAULT '[]',
  available_from jsonb NOT NULL DEFAULT '[]',
  description text NOT NULL,
  hotel_type text NOT NULL,
  hotel_chain text NOT NULL,
  total_rooms integer DEFAULT 100,
  coordinates jsonb,
  gallery jsonb DEFAULT '[]',
  policies jsonb DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('Cruise', 'Hotel')),
  item_id uuid NOT NULL,
  item_name text NOT NULL,
  agent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_name text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  booking_date date NOT NULL,
  travel_date date NOT NULL,
  return_date date,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Confirmed', 'Pending', 'Cancelled', 'Completed')),
  total_amount decimal(12,2) NOT NULL CHECK (total_amount > 0),
  commission_amount decimal(12,2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Failed', 'Refunded', 'Partial')),
  payment_method text,
  guests integer NOT NULL DEFAULT 1 CHECK (guests > 0),
  special_requests text,
  region text NOT NULL,
  booking_details jsonb DEFAULT '{}',
  cancellation_reason text,
  refund_amount decimal(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer complaints management
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id text UNIQUE NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  agent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Escalated', 'Closed')),
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  category text NOT NULL DEFAULT 'General',
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  resolution text,
  satisfaction_rating integer CHECK (satisfaction_rating BETWEEN 1 AND 5),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Promotional offers system
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('Percentage', 'Fixed Amount')),
  discount_value decimal(10,2) NOT NULL CHECK (discount_value > 0),
  valid_from date NOT NULL,
  valid_to date NOT NULL,
  applicable_for text NOT NULL CHECK (applicable_for IN ('Cruises', 'Hotels', 'Both')),
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Expired')),
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  usage_count integer DEFAULT 0,
  max_usage integer,
  min_booking_amount decimal(10,2) DEFAULT 0,
  regions jsonb DEFAULT '[]',
  terms_conditions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer reviews and ratings
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('Cruise', 'Hotel')),
  item_id uuid NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text NOT NULL,
  comment text NOT NULL,
  aspects jsonb DEFAULT '{}',
  helpful_count integer DEFAULT 0,
  verified boolean DEFAULT false,
  response jsonb,
  status text DEFAULT 'Published' CHECK (status IN ('Published', 'Pending', 'Hidden')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notification system
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('booking', 'payment', 'complaint', 'system', 'promotion')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- System audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Analytics data
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  metric_type text NOT NULL,
  metric_name text NOT NULL,
  value decimal(15,2) NOT NULL,
  dimensions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, metric_type, metric_name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_region ON users(region);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

CREATE INDEX IF NOT EXISTS idx_cruises_from_to ON cruises(from_location, to_location);
CREATE INDEX IF NOT EXISTS idx_cruises_cruise_line ON cruises(cruise_line);
CREATE INDEX IF NOT EXISTS idx_cruises_ship_type ON cruises(ship_type);
CREATE INDEX IF NOT EXISTS idx_cruises_price ON cruises(price_per_person);
CREATE INDEX IF NOT EXISTS idx_cruises_rating ON cruises(rating);
CREATE INDEX IF NOT EXISTS idx_cruises_status ON cruises(status);

CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels(location);
CREATE INDEX IF NOT EXISTS idx_hotels_star_rating ON hotels(star_rating);
CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels(price_per_night);
CREATE INDEX IF NOT EXISTS idx_hotels_hotel_chain ON hotels(hotel_chain);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels(rating);
CREATE INDEX IF NOT EXISTS idx_hotels_status ON hotels(status);

CREATE INDEX IF NOT EXISTS idx_bookings_agent_id ON bookings(agent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(type);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_region ON bookings(region);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);

CREATE INDEX IF NOT EXISTS idx_complaints_agent_id ON complaints(agent_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);

CREATE INDEX IF NOT EXISTS idx_offers_code ON offers(offer_code);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_valid_dates ON offers(valid_from, valid_to);

CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_metric ON analytics(metric_type, metric_name);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_cruises_search ON cruises USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_hotels_search ON hotels USING gin(to_tsvector('english', name || ' ' || description));

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruises ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- RLS Policies for Cruises (Public read, admin write)
CREATE POLICY "Anyone can read active cruises" ON cruises
  FOR SELECT TO authenticated
  USING (status = 'Active');

CREATE POLICY "Admins can manage cruises" ON cruises
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- RLS Policies for Hotels (Public read, admin write)
CREATE POLICY "Anyone can read active hotels" ON hotels
  FOR SELECT TO authenticated
  USING (status = 'Active');

CREATE POLICY "Admins can manage hotels" ON hotels
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- RLS Policies for Bookings
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
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- RLS Policies for Complaints
CREATE POLICY "Users can read own complaints" ON complaints
  FOR SELECT TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Users can create complaints" ON complaints
  FOR INSERT TO authenticated
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Admins can manage all complaints" ON complaints
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- RLS Policies for Offers
CREATE POLICY "Anyone can read active offers" ON offers
  FOR SELECT TO authenticated
  USING (status = 'Active' AND valid_from <= CURRENT_DATE AND valid_to >= CURRENT_DATE);

CREATE POLICY "Admins can manage offers" ON offers
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- RLS Policies for Reviews
CREATE POLICY "Anyone can read published reviews" ON reviews
  FOR SELECT TO authenticated
  USING (status = 'Published');

CREATE POLICY "Users can create reviews for their bookings" ON reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND agent_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- RLS Policies for Notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- RLS Policies for Audit Logs
CREATE POLICY "Admins can read audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- RLS Policies for Analytics
CREATE POLICY "Admins can read analytics" ON analytics
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
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

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference = CASE 
    WHEN NEW.type = 'Cruise' THEN 'CR'
    WHEN NEW.type = 'Hotel' THEN 'HT'
    ELSE 'BK'
  END || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::text, 6, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for booking reference generation
CREATE TRIGGER generate_booking_reference_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_booking_reference();

-- Function to generate complaint ID
CREATE OR REPLACE FUNCTION generate_complaint_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.complaint_id = 'CMP' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::text, 6, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for complaint ID generation
CREATE TRIGGER generate_complaint_id_trigger
  BEFORE INSERT ON complaints
  FOR EACH ROW EXECUTE FUNCTION generate_complaint_id();

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users 
    SET 
      total_bookings = total_bookings + 1,
      total_revenue = total_revenue + NEW.total_amount
    WHERE id = NEW.agent_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    -- Handle status changes
    IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
      UPDATE users 
      SET 
        total_bookings = total_bookings - 1,
        total_revenue = total_revenue - NEW.total_amount
      WHERE id = NEW.agent_id;
    ELSIF OLD.status = 'Cancelled' AND NEW.status != 'Cancelled' THEN
      UPDATE users 
      SET 
        total_bookings = total_bookings + 1,
        total_revenue = total_revenue + NEW.total_amount
      WHERE id = NEW.agent_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for user statistics
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Function to update item ratings
CREATE OR REPLACE FUNCTION update_item_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating decimal(3,2);
  review_count integer;
BEGIN
  -- Calculate new average rating
  SELECT AVG(rating), COUNT(*) 
  INTO avg_rating, review_count
  FROM reviews 
  WHERE item_id = NEW.item_id AND item_type = NEW.item_type AND status = 'Published';
  
  -- Update the appropriate table
  IF NEW.item_type = 'Cruise' THEN
    UPDATE cruises 
    SET rating = avg_rating, review_count = review_count
    WHERE id = NEW.item_id;
  ELSIF NEW.item_type = 'Hotel' THEN
    UPDATE hotels 
    SET rating = avg_rating, review_count = review_count
    WHERE id = NEW.item_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for rating updates
CREATE TRIGGER update_item_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_item_rating();