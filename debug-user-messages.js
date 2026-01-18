const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function debugMessages() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get the corporate user from the database
    const User = mongoose.connection.collection('users');
    const corporateUser = await User.findOne({ role: 'CORPORATE' });
    
    if (!corporateUser) {
      console.log('No corporate user found');
      process.exit(0);
    }

    const userId = corporateUser._id.toString();
    console.log(`\n=== TESTING USER: ${userId} (${corporateUser.email}) ===\n`);

    // Get unread messages for this user
    const messages = mongoose.connection.collection('messages');
    const unreadMessages = await messages.find({ recipientId: corporateUser._id, readAt: null }).toArray();
    
    console.log(`Total unread messages: ${unreadMessages.length}`);
    
    if (unreadMessages.length > 0) {
      console.log('\nUnread messages:');
      unreadMessages.forEach((msg, i) => {
        console.log(`${i + 1}. From: ${msg.senderId} | Content: "${msg.content?.substring(0, 40)}..." | Created: ${msg.createdAt}`);
      });

      // Group by sender
      const byS ender = {};
      unreadMessages.forEach(msg => {
        const senderId = msg.senderId.toString();
        if (!bySender[senderId]) {
          bySender[senderId] = [];
        }
        bySender[senderId].push(msg);
      });

      console.log('\n=== UNREAD BY SENDER ===');
      Object.entries(bySender).forEach(([senderId, msgs]) => {
        console.log(`Sender ${senderId}: ${msgs.length} unread`);
      });
    }

    // Get all messages for this user
    const allMessages = await messages.find({ recipientId: corporateUser._id }).toArray();
    console.log(`\nTotal messages (read + unread): ${allMessages.length}`);
    console.log(`Read messages: ${allMessages.length - unreadMessages.length}`);
    console.log(`Unread messages: ${unreadMessages.length}`);

    await mongoose.connection.close();
    console.log('\nDebug complete');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

debugMessages();
