const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function checkFormatFields() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });
    console.log('✅ Connected!\n');

    const db = mongoose.connection.db;
    const collection = db.collection('events');

    // Get all events
    const events = await collection.find({}).toArray();
    console.log(`📊 Total events in database: ${events.length}\n`);

    if (events.length > 0) {
      console.log('First 5 events - checking format field:');
      events.slice(0, 5).forEach((event, idx) => {
        console.log(`${idx + 1}. "${event.title}"`);
        console.log(`   format field: ${event.format || '❌ MISSING/UNDEFINED'}`);
        console.log(`   Has format in doc: ${event.hasOwnProperty('format')}`);
        console.log();
      });

      // Count events with format
      const withFormat = events.filter(e => e.format).length;
      const withoutFormat = events.filter(e => !e.format).length;
      console.log(`Summary:`);
      console.log(`✅ Events with format: ${withFormat}`);
      console.log(`❌ Events without format: ${withoutFormat}`);

      // Show all events with format
      if (withFormat > 0) {
        console.log(`\nEvents with format field:`);
        events.filter(e => e.format).forEach(event => {
          console.log(`  - "${event.title}": ${event.format}`);
        });
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkFormatFields();
