import { connectToDatabase } from '../src/server/db/mongoose';

async function dropUserRelatedCollections() {
  try {
    await connectToDatabase();
    const mongoose = (await import('mongoose')).default;
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
