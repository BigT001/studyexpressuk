const fetch = require('node-fetch');

async function testAPI() {
  try {
    // This won't work without auth, but let's see what happens
    const response = await fetch('http://localhost:3000/api/corporates/staff');
    const data = await response.json();
    
    console.log('API Response:', data);
    
    if (data.staff) {
      console.log('\nStaff IDs returned:');
      data.staff.forEach(s => {
        console.log(`  ${s._id}`);
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    console.log('(This is expected - the API requires authentication)');
    process.exit(0);
  }
}

testAPI();
