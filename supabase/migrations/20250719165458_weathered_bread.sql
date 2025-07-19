/*
  # Initial Database Schema for Yorke Holidays CRM

  1. New Tables
    - `users` - User accounts and profiles
    - `cruises` - Cruise inventory and details  
    - `hotels` - Hotel inventory and details
    - `bookings` - Customer bookings and transactions
    - `complaints` - Customer complaint tracking
    - `offers` - Promotional offers and discounts

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control

  3. Real-time
    - Enable real-time subscriptions for bookings
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('Travel Agent', 'Basic Admin', 'Super Admin')),
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Pending')),
  avatar text,
  region text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cruises table
CREATE TABLE IF NOT EXISTS cruises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image text NOT NULL,
  from_location text NOT NULL,
  to_location text NOT NULL,
  duration integer NOT NULL,
  departure_dates text[] NOT NULL DEFAULT '{}',
  amenities text[] NOT NULL DEFAULT '{}',
  price_per_person numeric NOT NULL,
  room_types text[] NOT NULL DEFAULT '{}',
  meal_plans text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  ship_type text NOT NULL,
  cruise_line text NOT NULL,
  availability jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  image text NOT NULL,
  star_rating integer NOT NULL CHECK (star_rating >= 1 AND star_rating <= 5),
  price_per_night numeric NOT NULL,
  available_room_types text[] NOT NULL DEFAULT '{}',
  meal_plans text[] NOT NULL DEFAULT '{}',
  amenities text[] NOT NULL DEFAULT '{}',
  available_from text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  hotel_type text NOT NULL,
  hotel_chain text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('Cruise', 'Hotel')),
  item_id uuid NOT NULL,
  item_name text NOT NULL,
  agent_id uuid NOT NULL REFERENCES users(id),
  agent_name text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  booking_date date NOT NULL,
  travel_date date NOT NULL,
  status text NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Pending', 'Cancelled', 'Completed')),
  total_amount numeric NOT NULL,
  commission_amount numeric NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Failed', 'Refunded')),
  guests integer NOT NULL DEFAULT 1,
  special_requests text,
  region text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  agent_id uuid NOT NULL REFERENCES users(id),
  customer_name text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Escalated')),
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  category text NOT NULL,
  assigned_to uuid REFERENCES users(id),
  resolution text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('Percentage', 'Fixed Amount')),
  discount_value numeric NOT NULL,
  valid_from date NOT NULL,
  valid_to date NOT NULL,
  applicable_for text NOT NULL CHECK (applicable_for IN ('Cruises', 'Hotels', 'Both')),
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Expired')),
  created_by uuid NOT NULL REFERENCES users(id),
  usage_count integer NOT NULL DEFAULT 0,
  max_usage integer,
  regions text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruises ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- Create policies for cruises table (public read)
CREATE POLICY "Anyone can read cruises" ON cruises
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage cruises" ON cruises
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- Create policies for hotels table (public read)
CREATE POLICY "Anyone can read hotels" ON hotels
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage hotels" ON hotels
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- Create policies for bookings table
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

-- Create policies for complaints table
CREATE POLICY "Users can read own complaints" ON complaints
  FOR SELECT TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Users can create complaints" ON complaints
  FOR INSERT TO authenticated
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Admins can manage complaints" ON complaints
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- Create policies for offers table
CREATE POLICY "Anyone can read active offers" ON offers
  FOR SELECT TO authenticated
  USING (status = 'Active');

CREATE POLICY "Admins can manage offers" ON offers
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('Basic Admin', 'Super Admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_agent_id ON bookings(agent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
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