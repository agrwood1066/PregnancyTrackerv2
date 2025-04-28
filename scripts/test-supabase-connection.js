// Test script for Supabase connectivity and data operations
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Authentication error:', authError.message);
      return false;
    }
    
    console.log('Authentication successful');
    
    // Test database tables
    const tables = [
      'profiles',
      'households',
      'household_members',
      'shopping_lists',
      'shopping_items',
      'appointments',
      'baby_names',
      'hospital_bag_lists',
      'hospital_bag_items'
    ];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.error(`Error accessing ${table}:`, error.message);
        return false;
      }
      
      console.log(`Successfully accessed ${table} table`);
    }
    
    // Test data operations on shopping_items
    console.log('\nTesting data operations on shopping_items table...');
    
    // Insert a test item
    const testItem = {
      name: 'Test Item',
      completed: false,
      user_id: authData.session?.user?.id || '00000000-0000-0000-0000-000000000000'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('shopping_items')
      .insert([testItem])
      .select();
    
    if (insertError) {
      console.error('Error inserting test item:', insertError.message);
      return false;
    }
    
    const insertedItem = insertData[0];
    console.log('Successfully inserted test item:', insertedItem);
    
    // Update the test item
    const { data: updateData, error: updateError } = await supabase
      .from('shopping_items')
      .update({ completed: true })
      .eq('id', insertedItem.id)
      .select();
    
    if (updateError) {
      console.error('Error updating test item:', updateError.message);
      return false;
    }
    
    console.log('Successfully updated test item:', updateData[0]);
    
    // Delete the test item
    const { error: deleteError } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', insertedItem.id);
    
    if (deleteError) {
      console.error('Error deleting test item:', deleteError.message);
      return false;
    }
    
    console.log('Successfully deleted test item');
    
    console.log('\nAll tests passed successfully!');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return false;
  }
}

// Run the test
testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('Supabase connection and data operations are working correctly.');
      process.exit(0);
    } else {
      console.error('Supabase connection or data operations failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Test script failed:', error);
    process.exit(1);
  }); 