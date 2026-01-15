const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const env = {};

envLines.forEach(line => {
  const match = line.match(/^([^=]+)=["']?([^"']*)/);
  if (match) {
    env[match[1]] = match[2];
  }
});

const mongoUri = env.MONGODB_URI;

async function testAPIResponse() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    const userCollection = mongoose.connection.collection('users');
    const notificationCollection = mongoose.connection.collection('notifications');

    // Get an individual user
    const user = await userCollection.findOne({ role: 'INDIVIDUAL' });
    console.log(`Testing API response for: ${user.email}\n`);

    // Simulate what the API does
    const notifications = await notificationCollection.find({ 
      userId: new mongoose.Types.ObjectId(user._id) 
    }).sort({ createdAt: -1 }).toArray();

    console.log('API Response:');
    console.log(JSON.stringify({
      success: true,
      notifications: notifications
    }, null, 2));

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testAPIResponse();
