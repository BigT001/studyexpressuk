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

const mongoUri = env.MONGODB_URI || 'mongodb://localhost:27017/studyexpressuk';

async function testAnnouncements() {
  try {
    console.log('Connecting to MongoDB Cloud...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Check announcements
    const announcementCollection = mongoose.connection.collection('announcements');
    const announcements = await announcementCollection.find({}).toArray();
    console.log(`\n📢 Found ${announcements.length} announcements:`);
    announcements.forEach((a) => {
      console.log(`  - ${a.title} (${a.targetAudience}) - ${new Date(a.createdAt).toLocaleString()}`);
    });

    // Check notifications
    const notificationCollection = mongoose.connection.collection('notifications');
    const notifications = await notificationCollection.find({}).toArray();
    console.log(`\n🔔 Found ${notifications.length} notifications:`);
    
    // Group by type
    const byType = {};
    notifications.forEach((n) => {
      if (!byType[n.type]) byType[n.type] = 0;
      byType[n.type]++;
    });
    
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    // Show recent announcements with their notification counts
    console.log(`\n📊 Announcement to Notification Mapping:`);
    for (const announcement of announcements.slice(0, 5)) {
      const notifCount = await notificationCollection.countDocuments({ 
        title: announcement.title 
      });
      console.log(`  - "${announcement.title}": ${notifCount} notifications`);
    }

    // Check users
    const userCollection = mongoose.connection.collection('users');
    const users = await userCollection.find({}).toArray();
    console.log(`\n👥 Found ${users.length} users`);
    
    // Group by role
    const byRole = {};
    users.forEach((u) => {
      if (!byRole[u.role]) byRole[u.role] = 0;
      byRole[u.role]++;
    });
    
    Object.entries(byRole).forEach(([role, count]) => {
      console.log(`  - ${role}: ${count}`);
    });

    await mongoose.connection.close();
    console.log('\n✓ Done');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testAnnouncements();
