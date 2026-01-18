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

    // Import the model
    const messageModelPath = require.resolve('./src/server/db/models/message.model.ts');
    // For JS, we need the compiled model
    const MessageModel = require('./src/server/db/models/message.model.ts');
    
    // Get all messages with readAt: null
    const unreadMessages = await mongoose.connection.collection('messages').find({ readAt: null }).toArray();
    console.log('\n=== UNREAD MESSAGES (readAt: null) ===');
    console.log(`Total unread messages: ${unreadMessages.length}`);
    
    if (unreadMessages.length > 0) {
      console.log('\nFirst 5 unread messages:');
      unreadMessages.slice(0, 5).forEach((msg, i) => {
        console.log(`${i + 1}. senderId: ${msg.senderId}, recipientId: ${msg.recipientId}, content: "${msg.content?.substring(0, 50)}..."`);
      });
    }

    // Group unread messages by recipientId
    const unreadByRecipient = {};
    unreadMessages.forEach(msg => {
      const recipientId = msg.recipientId?.toString() || msg.recipientId;
      if (!unreadByRecipient[recipientId]) {
        unreadByRecipient[recipientId] = [];
      }
      unreadByRecipient[recipientId].push(msg);
    });

    console.log('\n=== UNREAD MESSAGES BY RECIPIENT ===');
    Object.entries(unreadByRecipient).forEach(([recipientId, messages]) => {
      console.log(`${recipientId}: ${messages.length} unread`);
    });

    // Check for messages that should have been marked as read
    const allMessages = await mongoose.connection.collection('messages').find({}).toArray();
    console.log('\n=== TOTAL MESSAGE STATS ===');
    console.log(`Total messages in database: ${allMessages.length}`);
    console.log(`Unread messages: ${unreadMessages.length}`);
    console.log(`Read messages: ${allMessages.length - unreadMessages.length}`);

    // Show most recent messages
    console.log('\n=== MOST RECENT MESSAGES (last 10) ===');
    const recent = await mongoose.connection.collection('messages')
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    
    recent.forEach((msg, i) => {
      console.log(`${i + 1}. [${msg.readAt ? 'READ' : 'UNREAD'}] ${msg.createdAt} - "${msg.content?.substring(0, 40)}..."`);
    });

    await mongoose.connection.close();
    console.log('\nDebug complete');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

debugMessages();
