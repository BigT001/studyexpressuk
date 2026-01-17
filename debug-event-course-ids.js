const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function debug() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    
    const eventIds = [
      '695d81a3535cd73a0b065526',
      '695d8aeb535cd73a0b065551',
      '695de60f535cd73a0b06555a'
    ];

    const events = mongoose.connection.collection('events');
    const courses = mongoose.connection.collection('courses');

    console.log('=== CHECKING FOR STELLA\'S ENROLLED EVENT IDS ===\n');

    for (const id of eventIds) {
      const objId = new mongoose.Types.ObjectId(id);
      
      // Check in events
      const event = await events.findOne({ _id: objId });
      // Check in courses
      const course = await courses.findOne({ _id: objId });
      
      console.log(`ID: ${id}`);
      console.log(`  In Events collection: ${event ? 'YES - ' + event.title : 'NO'}`);
      console.log(`  In Courses collection: ${course ? 'YES - ' + course.title : 'NO'}`);
      console.log('');
    }

    // List all courses
    console.log('=== ALL COURSES IN DATABASE ===\n');
    const allCourses = await courses.find({}).toArray();
    console.log('Total courses:', allCourses.length);
    allCourses.forEach((c, i) => {
      console.log(`${i + 1}. ${c.title} (ID: ${c._id})`);
    });

    // List all events
    console.log('\n=== ALL EVENTS IN DATABASE ===\n');
    const allEvents = await events.find({}).toArray();
    console.log('Total events:', allEvents.length);
    allEvents.forEach((e, i) => {
      console.log(`${i + 1}. ${e.title} (ID: ${e._id}, Type: ${e.type})`);
    });

    console.log('\n✅ Debug complete\n');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
  }
}

debug();
