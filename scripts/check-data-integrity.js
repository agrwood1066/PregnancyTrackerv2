// Script to check for data integrity issues
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDataIntegrity() {
  console.log('Running data integrity checks...\n');
  let hasErrors = false;

  // Check for duplicate shopping items
  console.log('Checking for duplicate shopping items...');
  const { data: duplicates, error: duplicatesError } = await supabase
    .rpc('find_duplicate_shopping_items');
  
  if (duplicatesError) {
    console.error('Error checking for duplicates:', duplicatesError.message);
    hasErrors = true;
  } else if (duplicates && duplicates.length > 0) {
    console.log('Found duplicate shopping items:');
    duplicates.forEach(dup => {
      console.log(`- List ${dup.shopping_list_id}: "${dup.name}" appears ${dup.count} times`);
    });
    hasErrors = true;
  } else {
    console.log('No duplicate shopping items found.');
  }

  // Check for orphaned shopping items
  console.log('\nChecking for orphaned shopping items...');
  const { data: orphanedItems, error: orphanedItemsError } = await supabase
    .rpc('find_orphaned_shopping_items');
  
  if (orphanedItemsError) {
    console.error('Error checking for orphaned items:', orphanedItemsError.message);
    hasErrors = true;
  } else if (orphanedItems && orphanedItems.length > 0) {
    console.log('Found orphaned shopping items:');
    orphanedItems.forEach(item => {
      console.log(`- Item "${item.name}" (ID: ${item.id}) has no shopping list`);
    });
    hasErrors = true;
  } else {
    console.log('No orphaned shopping items found.');
  }

  // Check for orphaned shopping lists
  console.log('\nChecking for orphaned shopping lists...');
  const { data: orphanedLists, error: orphanedListsError } = await supabase
    .rpc('find_orphaned_shopping_lists');
  
  if (orphanedListsError) {
    console.error('Error checking for orphaned lists:', orphanedListsError.message);
    hasErrors = true;
  } else if (orphanedLists && orphanedLists.length > 0) {
    console.log('Found orphaned shopping lists:');
    orphanedLists.forEach(list => {
      console.log(`- List "${list.name}" (ID: ${list.id}) has no household`);
    });
    hasErrors = true;
  } else {
    console.log('No orphaned shopping lists found.');
  }

  // Check for invalid status in shopping items
  console.log('\nChecking for invalid status in shopping items...');
  const { data: invalidStatusItems, error: invalidStatusItemsError } = await supabase
    .rpc('find_invalid_status_shopping_items');
  
  if (invalidStatusItemsError) {
    console.error('Error checking for invalid status items:', invalidStatusItemsError.message);
    hasErrors = true;
  } else if (invalidStatusItems && invalidStatusItems.length > 0) {
    console.log('Found shopping items with invalid status:');
    invalidStatusItems.forEach(item => {
      console.log(`- Item "${item.name}" (ID: ${item.id}) has invalid status: ${item.status}`);
    });
    hasErrors = true;
  } else {
    console.log('No shopping items with invalid status found.');
  }

  // Check for invalid status in appointments
  console.log('\nChecking for invalid status in appointments...');
  const { data: invalidStatusAppointments, error: invalidStatusAppointmentsError } = await supabase
    .rpc('find_invalid_status_appointments');
  
  if (invalidStatusAppointmentsError) {
    console.error('Error checking for invalid status appointments:', invalidStatusAppointmentsError.message);
    hasErrors = true;
  } else if (invalidStatusAppointments && invalidStatusAppointments.length > 0) {
    console.log('Found appointments with invalid status:');
    invalidStatusAppointments.forEach(appointment => {
      console.log(`- Appointment "${appointment.title}" (ID: ${appointment.id}) has invalid status: ${appointment.status}`);
    });
    hasErrors = true;
  } else {
    console.log('No appointments with invalid status found.');
  }

  // Check for invalid status in baby names
  console.log('\nChecking for invalid status in baby names...');
  const { data: invalidStatusBabyNames, error: invalidStatusBabyNamesError } = await supabase
    .rpc('find_invalid_status_baby_names');
  
  if (invalidStatusBabyNamesError) {
    console.error('Error checking for invalid status baby names:', invalidStatusBabyNamesError.message);
    hasErrors = true;
  } else if (invalidStatusBabyNames && invalidStatusBabyNames.length > 0) {
    console.log('Found baby names with invalid status:');
    invalidStatusBabyNames.forEach(babyName => {
      console.log(`- Baby name "${babyName.name}" (ID: ${babyName.id}) has invalid status: ${babyName.status}`);
    });
    hasErrors = true;
  } else {
    console.log('No baby names with invalid status found.');
  }

  // Check for invalid status in hospital bag items
  console.log('\nChecking for invalid status in hospital bag items...');
  const { data: invalidStatusHospitalBagItems, error: invalidStatusHospitalBagItemsError } = await supabase
    .rpc('find_invalid_status_hospital_bag_items');
  
  if (invalidStatusHospitalBagItemsError) {
    console.error('Error checking for invalid status hospital bag items:', invalidStatusHospitalBagItemsError.message);
    hasErrors = true;
  } else if (invalidStatusHospitalBagItems && invalidStatusHospitalBagItems.length > 0) {
    console.log('Found hospital bag items with invalid status:');
    invalidStatusHospitalBagItems.forEach(item => {
      console.log(`- Hospital bag item "${item.name}" (ID: ${item.id}) has invalid status: ${item.status}`);
    });
    hasErrors = true;
  } else {
    console.log('No hospital bag items with invalid status found.');
  }

  console.log('\nData integrity check completed.');
  if (hasErrors) {
    console.log('❌ Data integrity issues found. Please review the issues above.');
    process.exit(1);
  } else {
    console.log('✅ No data integrity issues found.');
    process.exit(0);
  }
}

checkDataIntegrity().catch(error => {
  console.error('Error running data integrity checks:', error);
  process.exit(1);
}); 