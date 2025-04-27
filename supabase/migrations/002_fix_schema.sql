-- Drop existing policies to fix recursion
DROP POLICY IF EXISTS "Household members can view members of their households" ON household_members;
DROP POLICY IF EXISTS "Primary users can add members to their households" ON household_members;
DROP POLICY IF EXISTS "Household members can view their households" ON households;
DROP POLICY IF EXISTS "Primary users can create households" ON households;
DROP POLICY IF EXISTS "Primary users can update their households" ON households;
DROP POLICY IF EXISTS "Household members can view their shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Household members can create shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Household members can update their shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Household members can view shopping items in their lists" ON shopping_items;
DROP POLICY IF EXISTS "Household members can create shopping items" ON shopping_items;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'primary',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(household_id, profile_id)
);

CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status shopping_item_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  location TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS baby_names (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT,
  meaning TEXT,
  origin TEXT,
  status baby_name_status NOT NULL DEFAULT 'maybe',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospital_bag_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospital_bag_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_bag_list_id UUID NOT NULL REFERENCES hospital_bag_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  status hospital_bag_item_status NOT NULL DEFAULT 'not_packed',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create simplified RLS policies
CREATE POLICY "Enable read access for authenticated users" ON households
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON households
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON households
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users" ON household_members
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON household_members
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON shopping_lists
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON shopping_lists
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON shopping_lists
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users" ON shopping_items
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON shopping_items
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON shopping_items
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users" ON appointments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON appointments
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users" ON baby_names
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON baby_names
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON baby_names
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users" ON hospital_bag_lists
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON hospital_bag_lists
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON hospital_bag_lists
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users" ON hospital_bag_items
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON hospital_bag_items
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON hospital_bag_items
  FOR UPDATE TO authenticated
  USING (true); 