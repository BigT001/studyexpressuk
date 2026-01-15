const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://studyexpress:studyexpress%40123@studyexpressuk.vr7gqea.mongodb.net/studyexpressdb?retryWrites=true&w=majority';

async function testAnnouncements() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected!');

    // Check existing announcements
    const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', new mongoose.Schema({}, { collection: 'announcements' }));
    const announcements = await Announcement.find().lean();
    console.log('\n📢 Existing Announcements:');
    announcements.forEach(a => {
      console.log(`- "${a.title}": type="${a.type}", content="${a.content ? a.content.substring(0, 50) : 'MISSING'}"...`);
    });

    // Check notifications
    const Notification = mongoose.models.Notification || mongoose.model('Notification', new mongoose.Schema({}, { collection: 'notifications' }));
    const notifications = await Notification.find().lean();
    console.log('\n📬 Total Notifications:', notifications.length);
    
    const urgentNotifications = notifications.filter(n => n.priority === 'urgent');
    console.log('🚨 Urgent Notifications:', urgentNotifications.length);
    
    const normalNotifications = notifications.filter(n => n.priority === 'normal' || !n.priority);
    console.log('📝 Normal Notifications:', normalNotifications.length);

    // Show sample notifications
    console.log('\n Sample Notifications:');
    notifications.slice(0, 5).forEach(n => {
      console.log(`- Title: "${n.title}", Priority: "${n.priority}", Content: "${n.content || n.body ? (n.content || n.body).substring(0, 40) : 'MISSING'}"...`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Test complete');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAnnouncements();
