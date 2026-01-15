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

async function dispatchMissingNotifications() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected\n');

    const announcementCollection = mongoose.connection.collection('announcements');
    const notificationCollection = mongoose.connection.collection('notifications');
    const userCollection = mongoose.connection.collection('users');

    // Get all announcements
    const announcements = await announcementCollection.find({}).toArray();
    console.log(`📢 Found ${announcements.length} announcements to process\n`);

    let totalCreated = 0;

    for (const announcement of announcements) {
      console.log(`Processing: "${announcement.title}"`);
      
      // Check if notifications already exist for this announcement
      const existingCount = await notificationCollection.countDocuments({
        title: announcement.title,
        type: 'announcement'
      });

      if (existingCount > 0) {
        console.log(`  ✓ Already has ${existingCount} notifications, skipping\n`);
        continue;
      }

      // Determine target audience
      const roleMap = {
        'all': null,
        'individual': 'INDIVIDUAL',
        'corporate': 'CORPORATE',
        'subadmin': 'SUB_ADMIN',
        'students': 'INDIVIDUAL', // Map 'students' to INDIVIDUAL
      };

      let query = {};
      const targetRole = roleMap[announcement.targetAudience];
      if (targetRole) {
        query.role = targetRole;
      }

      // Find recipients
      const recipients = await userCollection.find(query).toArray();
      console.log(`  Found ${recipients.length} recipients (role: ${targetRole || 'ALL'})`);

      // Create notifications
      const notifications = recipients.map(recipient => ({
        userId: new mongoose.Types.ObjectId(recipient._id),
        type: 'announcement',
        title: announcement.title,
        content: announcement.content,
        sender: 'StudyExpress Admin',
        priority: announcement.type === 'urgent' ? 'urgent' : 'normal',
        status: 'unread',
        createdAt: new Date(announcement.createdAt),
      }));

      if (notifications.length > 0) {
        const result = await notificationCollection.insertMany(notifications);
        console.log(`  ✓ Created ${result.insertedIds.length} notifications\n`);
        totalCreated += result.insertedIds.length;
      } else {
        console.log(`  ℹ No recipients to notify\n`);
      }
    }

    console.log(`\n✅ Dispatch complete! Created ${totalCreated} notifications total\n`);

    // Verify
    const allNotifs = await notificationCollection.find({}).toArray();
    console.log(`📊 Final count: ${allNotifs.length} total notifications in database`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

dispatchMissingNotifications();
