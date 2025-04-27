// This script applies the database schema to your Supabase project
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a Supabase client with the service role key for admin access
// Note: You need to get the service role key from your Supabase dashboard
// and add it to your .env.local file as SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey
);

async function applySchema() {
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // Split the SQL into individual statements
    const statements = migrationSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute.`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
          // Continue with the next statement even if this one fails
        } else {
          console.log(`Statement ${i + 1} executed successfully.`);
        }
      } catch (err) {
        console.error(`Error executing statement ${i + 1}:`, err);
        // Continue with the next statement even if this one fails
      }
    }

    console.log('Schema application completed.');
  } catch (error) {
    console.error('Error applying schema:', error);
  }
}

applySchema(); 