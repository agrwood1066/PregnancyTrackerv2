const fs = require('fs');
const path = require('path');

function printDataIntegrityFunctions() {
  console.log('Data Integrity Functions SQL:');
  console.log('=============================');
  console.log('Copy and paste the following SQL into your Supabase SQL Editor:');
  console.log('=============================\n');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'supabase', 'migrations', '003_add_data_integrity_functions.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Print the SQL content
    console.log(sqlContent);
    
    console.log('\n=============================');
    console.log('After executing the SQL, run the data integrity check script:');
    console.log('node scripts/check-data-integrity.js');
    console.log('=============================');
  } catch (error) {
    console.error('Error reading SQL file:', error.message);
    process.exit(1);
  }
}

// Run the function
printDataIntegrityFunctions(); 