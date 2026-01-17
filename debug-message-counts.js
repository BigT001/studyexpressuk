const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studyexpressuk';

async function debugCounts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get models
    const MessageModel = require('./src/server/db/models/message.model').default;
    const { Announcement } = require('./src/server/db/models/announcement.model');
    const UserModel = require('./src/server/db/models/user.model').default;

    // Find a test user (an individual user)
    const testUser = await UserModel.findOne({ role: 'INDIVIDUAL' });
    if (!testUser) {
      console.log('❌ No INDIVIDUAL user found');
      process.exit(1);
    }

    console.log('\n📋 User ID:', testUser._id);
    console.log('📋 User Email:', testUser.email);
    console.log('📋 User Role:', testUser.role);

    // Count all messages for this user
    const allMessages = await MessageModel.find({ recipientId: testUser._id });
    console.log('\n📧 Total messages for user:', allMessages.length);
    
    if (allMessages.length > 0) {
      console.log('📧 First message:', {
        from: allMessages[0].senderId,
        content: allMessages[0].content.substring(0, 50),
        readAt: allMessages[0].readAt,
      });
    }

    // Count unread messages
    const unreadMessages = await MessageModel.countDocuments({
      recipientId: testUser._id,
      readAt: null,
    });
    console.log('📧 Unread messages:', unreadMessages);

    // Count all announcements
    const allAnnouncements = await Announcement.find({ isActive: true });
    console.log('\n📢 Total announcements:', allAnnouncements.length);
    
    if (allAnnouncements.length > 0) {
      console.log('📢 First announcement:', {
        title: allAnnouncements[0].title,
        readByCount: allAnnouncements[0].readBy?.length || 0,
        readBy: allAnnouncements[0].readBy,
      });
    }

    // Count unread announcements for this user
    const unreadAnnouncements = await Announcement.countDocuments({
      isActive: true,
      readBy: { $ne: testUser._id }
    });
    console.log('📢 Unread announcements:', unreadAnnouncements);

    // Show which announcements are unread
    const unreadAnnouncementDocs = await Announcement.find({
      isActive: true,
      readBy: { $ne: testUser._id }
    }).select('title readBy');
    
    console.log('\n📢 Unread announcements for this user:');
    unreadAnnouncementDocs.forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.title} (readBy: ${a.readBy?.length || 0} users)`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database check complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugCounts();
