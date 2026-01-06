const mongoose = require('mongoose');
const crypto = require('crypto');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

const eventSchema = new mongoose.Schema({}, { strict: false });
const Event = mongoose.model('Event', eventSchema);

async function testFormatField() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });
    console.log('✅ Connected!\n');

    // Create a test event with format
    const testEvent = {
      _id: new mongoose.Types.ObjectId(),
      title: `Format Test ${Date.now()}`,
      description: 'Testing format field persistence',
      type: 'event',
      category: 'test',
      access: 'free',
      format: 'offline', // EXPLICITLY set format
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600000),
      maxCapacity: 100,
      currentEnrollment: 0,
      location: 'Test Location',
      status: 'published',
      featured: false,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('📝 Creating test event:');
    console.log(`   Title: ${testEvent.title}`);
    console.log(`   Format: ${testEvent.format}`);

    const result = await Event.collection.insertOne(testEvent);
    console.log(`✅ Event created with ID: ${result.insertedId}\n`);

    // Retrieve it back
    console.log('🔍 Retrieving event from database...');
    const retrieved = await Event.findById(result.insertedId).lean();
    console.log('📊 Retrieved event:');
    console.log(`   Title: ${retrieved.title}`);
    console.log(`   Format from DB: ${retrieved.format || 'UNDEFINED'}`);
    console.log(`   Has format field: ${retrieved.format !== undefined}`);

    if (retrieved.format === 'offline') {
      console.log('\n✅ SUCCESS: Format field is correctly saved and retrieved!');
    } else {
      console.log('\n❌ FAILURE: Format field not saved correctly');
      console.log('Full document:', JSON.stringify(retrieved, null, 2));
    }

    await mongoose.disconnect();
    console.log('\n✅ Test complete');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testFormatField();
