-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('primary', 'partner');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE shopping_item_status AS ENUM ('pending', 'purchased', 'not_needed');
CREATE TYPE hospital_bag_item_status AS ENUM ('packed', 'not_packed', 'not_needed');
CREATE TYPE baby_name_status AS ENUM ('liked', 'disliked', 'maybe');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create households table
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create household_members table
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'primary',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(household_id, profile_id)
);

-- Create shopping_lists table
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_items table
CREATE TABLE shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status shopping_item_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
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

-- Create baby_names table
CREATE TABLE baby_names (
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

-- Create hospital_bag_lists table
CREATE TABLE hospital_bag_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hospital_bag_items table
CREATE TABLE hospital_bag_items (
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

-- Create Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_bag_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_bag_items ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for households
CREATE POLICY "Household members can view their households" 
  ON households FOR SELECT 
  USING (
    id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Primary users can create households" 
  ON households FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Primary users can update their households" 
  ON households FOR UPDATE 
  USING (
    id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
      AND role = 'primary'
    )
  );

-- Create policies for household_members
CREATE POLICY "Household members can view members of their households" 
  ON household_members FOR SELECT 
  USING (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Primary users can add members to their households" 
  ON household_members FOR INSERT 
  WITH CHECK (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
      AND role = 'primary'
    )
  );

-- Create policies for shopping_lists
CREATE POLICY "Household members can view their shopping lists" 
  ON shopping_lists FOR SELECT 
  USING (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Household members can create shopping lists" 
  ON shopping_lists FOR INSERT 
  WITH CHECK (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Household members can update their shopping lists" 
  ON shopping_lists FOR UPDATE 
  USING (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Create policies for shopping_items
CREATE POLICY "Household members can view shopping items in their lists" 
  ON shopping_items FOR SELECT 
  USING (
    shopping_list_id IN (
      SELECT id FROM shopping_lists 
      WHERE household_id IN (
        SELECT household_id 
        FROM household_members 
        WHERE profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Household members can create shopping items" 
  ON shopping_items FOR INSERT 
  WITH CHECK (
    shopping_list_id IN (
      SELECT id FROM shopping_lists 
      WHERE household_id IN (
        SELECT household_id 
        FROM household_members 
        WHERE profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Household members can update shopping items" 
  ON shopping_items FOR UPDATE 
  USING (
    shopping_list_id IN (
      SELECT id FROM shopping_lists 
      WHERE household_id IN (
        SELECT household_id 
        FROM household_members 
        WHERE profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Create policies for appointments
CREATE POLICY "Household members can view their appointments" 
  ON appointments FOR SELECT 
  USING (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Household members can create appointments" 
  ON appointments FOR INSERT 
  WITH CHECK (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Household members can update their appointments" 
  ON appointments FOR UPDATE 
  USING (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Create policies for baby_names
CREATE POLICY "Household members can view baby names in their household" 
  ON baby_names FOR SELECT 
  USING (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Household members can create baby names" 
  ON baby_names FOR INSERT 
  WITH CHECK (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Household members can update baby names" 
  ON baby_names FOR UPDATE 
  USING (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Create policies for hospital_bag_lists
CREATE POLICY "Household members can view their hospital bag lists" 
  ON hospital_bag_lists FOR SELECT 
  USING (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Household members can create hospital bag lists" 
  ON hospital_bag_lists FOR INSERT 
  WITH CHECK (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Household members can update their hospital bag lists" 
  ON hospital_bag_lists FOR UPDATE 
  USING (
    household_id IN (
      SELECT household_id 
      FROM household_members 
      WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Create policies for hospital_bag_items
CREATE POLICY "Household members can view hospital bag items in their lists" 
  ON hospital_bag_items FOR SELECT 
  USING (
    hospital_bag_list_id IN (
      SELECT id FROM hospital_bag_lists 
      WHERE household_id IN (
        SELECT household_id 
        FROM household_members 
        WHERE profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Household members can create hospital bag items" 
  ON hospital_bag_items FOR INSERT 
  WITH CHECK (
    hospital_bag_list_id IN (
      SELECT id FROM hospital_bag_lists 
      WHERE household_id IN (
        SELECT household_id 
        FROM household_members 
        WHERE profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Household members can update hospital bag items" 
  ON hospital_bag_items FOR UPDATE 
  USING (
    hospital_bag_list_id IN (
      SELECT id FROM hospital_bag_lists 
      WHERE household_id IN (
        SELECT household_id 
        FROM household_members 
        WHERE profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 