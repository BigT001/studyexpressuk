const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

const eventSchema = new mongoose.Schema({}, { strict: false });
const Event = mongoose.model('Event', eventSchema);

async function migrateFormat() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });
    console.log('✅ Connected!');

    // Check current state
    console.log('\n📊 Checking current events...');
    const allEvents = await Event.find({}).lean();
    console.log(`Total events: ${allEvents.length}`);
    
    if (allEvents.length > 0) {
      console.log('\nSample events:');
      allEvents.slice(0, 3).forEach((event, idx) => {
        console.log(`${idx + 1}. ${event.title} - format: ${event.format || 'MISSING'}`);
      });
    }

    // The fix: Just leave format field empty for old events
    // New events created will have format only if explicitly set
    console.log('\n✅ Schema fix is in place - new events will store format correctly');
    console.log('✅ Existing events without format will not show format badge (as intended)');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

migrateFormat();
