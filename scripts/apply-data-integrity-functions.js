const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function applyDataIntegrityFunctions() {
  console.log('Applying data integrity functions to Supabase...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'supabase', 'migrations', '003_add_data_integrity_functions.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message);
        console.error('Statement:', statement);
        return false;
      }
    }
    
    console.log('✅ All data integrity functions applied successfully!');
    return true;
  } catch (error) {
    console.error('Error applying data integrity functions:', error.message);
    return false;
  }
}

// Run the function
applyDataIntegrityFunctions()
  .then(success => {
    if (success) {
      console.log('Data integrity functions are now available in your Supabase database.');
      process.exit(0);
    } else {
      console.error('Failed to apply data integrity functions.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 