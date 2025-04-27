// This script checks if the database schema has been applied
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    // Check if profiles table exists
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('Error checking profiles table:', profilesError);
      console.log('Profiles table may not exist or you may not have access to it.');
    } else {
      console.log('Profiles table exists and is accessible.');
    }

    // Check if households table exists
    const { data: households, error: householdsError } = await supabase
      .from('households')
      .select('*')
      .limit(1);
    
    if (householdsError) {
      console.error('Error checking households table:', householdsError);
      console.log('Households table may not exist or you may not have access to it.');
    } else {
      console.log('Households table exists and is accessible.');
    }

    // Check if shopping_lists table exists
    const { data: shoppingLists, error: shoppingListsError } = await supabase
      .from('shopping_lists')
      .select('*')
      .limit(1);
    
    if (shoppingListsError) {
      console.error('Error checking shopping_lists table:', shoppingListsError);
      console.log('Shopping lists table may not exist or you may not have access to it.');
    } else {
      console.log('Shopping lists table exists and is accessible.');
    }

    // Check if appointments table exists
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .limit(1);
    
    if (appointmentsError) {
      console.error('Error checking appointments table:', appointmentsError);
      console.log('Appointments table may not exist or you may not have access to it.');
    } else {
      console.log('Appointments table exists and is accessible.');
    }

    // Check if baby_names table exists
    const { data: babyNames, error: babyNamesError } = await supabase
      .from('baby_names')
      .select('*')
      .limit(1);
    
    if (babyNamesError) {
      console.error('Error checking baby_names table:', babyNamesError);
      console.log('Baby names table may not exist or you may not have access to it.');
    } else {
      console.log('Baby names table exists and is accessible.');
    }

    // Check if hospital_bag_lists table exists
    const { data: hospitalBagLists, error: hospitalBagListsError } = await supabase
      .from('hospital_bag_lists')
      .select('*')
      .limit(1);
    
    if (hospitalBagListsError) {
      console.error('Error checking hospital_bag_lists table:', hospitalBagListsError);
      console.log('Hospital bag lists table may not exist or you may not have access to it.');
    } else {
      console.log('Hospital bag lists table exists and is accessible.');
    }

  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkDatabase(); 