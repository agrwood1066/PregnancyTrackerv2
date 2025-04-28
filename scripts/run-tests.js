// Script to run all tests
const { execSync } = require('child_process');
const path = require('path');

// List of test scripts to run
const testScripts = [
  'test-supabase-connection.js',
  'test-shopping-feature.js'
];

console.log('Running all tests...\n');

let allTestsPassed = true;

// Run each test script
for (const script of testScripts) {
  console.log(`\n=== Running ${script} ===\n`);
  
  try {
    execSync(`node ${path.join(__dirname, script)}`, { stdio: 'inherit' });
    console.log(`\n✅ ${script} passed\n`);
  } catch (error) {
    console.error(`\n❌ ${script} failed\n`);
    allTestsPassed = false;
  }
}

// Print summary
console.log('\n=== Test Summary ===');
if (allTestsPassed) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please check the logs above for details.');
  process.exit(1);
} 