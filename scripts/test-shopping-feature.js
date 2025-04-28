// Test script for shopping list feature
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

async function testShoppingFeature() {
  console.log('Testing shopping list feature...');
  
  try {
    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Authentication error:', authError.message);
      return false;
    }
    
    const userId = authData.session?.user?.id;
    if (!userId) {
      console.error('No authenticated user found');
      return false;
    }
    
    console.log('Authentication successful');
    
    // Get or create a household
    let householdId;
    const { data: households, error: householdsError } = await supabase
      .from('households')
      .select('id')
      .limit(1);
    
    if (householdsError) {
      console.error('Error fetching households:', householdsError.message);
      return false;
    }
    
    if (households && households.length > 0) {
      householdId = households[0].id;
      console.log('Using existing household:', householdId);
    } else {
      // Create a new household
      const { data: newHousehold, error: createHouseholdError } = await supabase
        .from('households')
        .insert([{ name: 'Test Household' }])
        .select()
        .single();
      
      if (createHouseholdError) {
        console.error('Error creating household:', createHouseholdError.message);
        return false;
      }
      
      householdId = newHousehold.id;
      console.log('Created new household:', householdId);
      
      // Add user to household
      const { error: addMemberError } = await supabase
        .from('household_members')
        .insert([{
          household_id: householdId,
          profile_id: userId,
          role: 'primary'
        }]);
      
      if (addMemberError) {
        console.error('Error adding user to household:', addMemberError.message);
        return false;
      }
      
      console.log('Added user to household');
    }
    
    // Create a shopping list
    const { data: shoppingList, error: createListError } = await supabase
      .from('shopping_lists')
      .insert([{
        household_id: householdId,
        name: 'Test Shopping List'
      }])
      .select()
      .single();
    
    if (createListError) {
      console.error('Error creating shopping list:', createListError.message);
      return false;
    }
    
    console.log('Created shopping list:', shoppingList.id);
    
    // Add items to the shopping list
    const testItems = [
      { name: 'Diapers', status: 'pending', notes: 'Size 1' },
      { name: 'Baby Wipes', status: 'pending', notes: 'Unscented' },
      { name: 'Baby Formula', status: 'pending', notes: 'Ready-to-feed' }
    ];
    
    const { data: insertedItems, error: insertItemsError } = await supabase
      .from('shopping_items')
      .insert(
        testItems.map(item => ({
          ...item,
          shopping_list_id: shoppingList.id,
          created_by: userId
        }))
      )
      .select();
    
    if (insertItemsError) {
      console.error('Error inserting shopping items:', insertItemsError.message);
      return false;
    }
    
    console.log(`Added ${insertedItems.length} items to shopping list`);
    
    // Update an item
    const itemToUpdate = insertedItems[0];
    const { data: updatedItem, error: updateItemError } = await supabase
      .from('shopping_items')
      .update({ status: 'purchased' })
      .eq('id', itemToUpdate.id)
      .select()
      .single();
    
    if (updateItemError) {
      console.error('Error updating shopping item:', updateItemError.message);
      return false;
    }
    
    console.log('Updated item:', updatedItem.name, 'to status:', updatedItem.status);
    
    // Fetch all items in the list
    const { data: fetchedItems, error: fetchItemsError } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('shopping_list_id', shoppingList.id)
      .order('created_at', { ascending: true });
    
    if (fetchItemsError) {
      console.error('Error fetching shopping items:', fetchItemsError.message);
      return false;
    }
    
    console.log(`Fetched ${fetchedItems.length} items from shopping list`);
    
    // Clean up - delete the shopping list (this will cascade delete the items)
    const { error: deleteListError } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', shoppingList.id);
    
    if (deleteListError) {
      console.error('Error deleting shopping list:', deleteListError.message);
      return false;
    }
    
    console.log('Deleted shopping list and its items');
    
    console.log('\nAll shopping list feature tests passed successfully!');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return false;
  }
}

// Run the test
testShoppingFeature()
  .then(success => {
    if (success) {
      console.log('Shopping list feature is working correctly.');
      process.exit(0);
    } else {
      console.error('Shopping list feature tests failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Test script failed:', error);
    process.exit(1);
  }); 