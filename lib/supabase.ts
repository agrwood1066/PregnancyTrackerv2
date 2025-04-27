import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Profile = {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Household = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type HouseholdMember = {
  id: string;
  household_id: string;
  profile_id: string;
  role: 'primary' | 'partner';
  created_at: string;
  updated_at: string;
};

export type ShoppingList = {
  id: string;
  household_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ShoppingItem = {
  id: string;
  shopping_list_id: string;
  name: string;
  status: 'pending' | 'purchased' | 'not_needed';
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  household_id: string;
  title: string;
  description: string | null;
  appointment_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  location: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type BabyName = {
  id: string;
  household_id: string;
  name: string;
  gender: string | null;
  meaning: string | null;
  origin: string | null;
  status: 'liked' | 'disliked' | 'maybe';
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type HospitalBagList = {
  id: string;
  household_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type HospitalBagItem = {
  id: string;
  hospital_bag_list_id: string;
  name: string;
  category: string | null;
  status: 'packed' | 'not_packed' | 'not_needed';
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}; 