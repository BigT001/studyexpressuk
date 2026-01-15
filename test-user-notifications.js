const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
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

async function testUserNotifications() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected');

    const userCollection = mongoose.connection.collection('users');
    const notificationCollection = mongoose.connection.collection('notifications');

    // Get first individual user
    const individual = await userCollection.findOne({ role: 'INDIVIDUAL' });
    if (!individual) {
      console.log('❌ No INDIVIDUAL user found');
      await mongoose.connection.close();
      return;
    }

    console.log(`\n👤 Testing with user: ${individual.email} (${individual.role})`);
    console.log(`   User ID: ${individual._id}`);

    // Get their notifications
    const userNotifications = await notificationCollection.find({
      userId: new mongoose.Types.ObjectId(individual._id)
    }).toArray();

    console.log(`\n📬 Found ${userNotifications.length} notifications for this user:`);
    userNotifications.forEach((notif, i) => {
      console.log(`\n  ${i + 1}. "${notif.title}"`);
      console.log(`     Type: ${notif.type}`);
      console.log(`     Priority: ${notif.priority}`);
      console.log(`     Status: ${notif.status}`);
      console.log(`     Sender: ${notif.sender}`);
      console.log(`     Created: ${new Date(notif.createdAt).toLocaleString()}`);
    });

    // Count by type
    const announcements = userNotifications.filter(n => n.type === 'announcement');
    const messages = userNotifications.filter(n => n.type === 'message');

    console.log(`\n📊 Summary:`);
    console.log(`   Announcements: ${announcements.length}`);
    console.log(`   Messages: ${messages.length}`);
    console.log(`   Unread: ${userNotifications.filter(n => n.status === 'unread').length}`);

    await mongoose.connection.close();
    console.log('\n✓ Done');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testUserNotifications();
