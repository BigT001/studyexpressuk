const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studyexpressuk';

async function dropUserRelatedCollections() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    const collections = [
      'users',
      'individualprofile',
      'corporate',
      'enrollments',
      'messages',
    ];
    for (const name of collections) {
      if (mongoose.connection.collections[name]) {
        await mongoose.connection.collections[name].drop();
        console.log(`Dropped collection: ${name}`);
      } else {
        console.log(`Collection not found: ${name}`);
      }
    }
    console.log('✅ All user-related collections dropped.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error dropping collections:', error);
    process.exit(1);
  }
}

dropUserRelatedCollections();
