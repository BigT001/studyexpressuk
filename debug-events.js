const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function debugEvents() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const UserModel = require('./src/server/db/models/user.model').default;
    const EnrollmentModel = require('./src/server/db/models/enrollment.model').default;
    const EventModel = require('./src/server/db/models/event.model').default;

    // Find user by email
    const user = await UserModel.findOne({ email: 'stellajo@gmail.com' });
    
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log('\n=== USER ===');
    console.log(`ID: ${user._id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);

    // Get all enrollments for this user
    const enrollments = await EnrollmentModel.find({ userId: user._id }).lean();
    console.log(`\n=== ENROLLMENTS ===`);
    console.log(`Total enrollments: ${enrollments.length}`);

    // Get event details
    const events = [];
    for (const enrollment of enrollments) {
      const event = await EventModel.findById(enrollment.eventId).lean();
      if (event) {
        events.push(event);
        console.log(`\nEvent ${events.length}:`);
        console.log(`  - ID: ${event._id}`);
        console.log(`  - Title: ${event.title}`);
        console.log(`  - Status: ${event.status}`);
        console.log(`  - Type: ${event.type}`);
      }
    }

    // Count active/published events
    const activeCount = events.filter(e => ['active', 'published'].includes(e.status)).length;
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total events enrolled: ${events.length}`);
    console.log(`Active/Published events: ${activeCount}`);

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

debugEvents();
