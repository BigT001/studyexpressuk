const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function debug() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    
    // Find Stella's user
    const users = mongoose.connection.collection('users');
    const stella = await users.findOne({ email: 'stellajo@gmail.com' });
    
    console.log('=== STELLA USER ===');
    console.log('User ID:', stella?._id);
    console.log('Email:', stella?.email);
    console.log('Role:', stella?.role);

    if (stella) {
      // Find enrollments for Stella
      const enrollments = mongoose.connection.collection('enrollments');
      const stellaEnrollments = await enrollments.find({ userId: stella._id }).toArray();
      
      console.log('\n=== STELLA ENROLLMENTS ===');
      console.log('Total enrollments:', stellaEnrollments.length);
      stellaEnrollments.forEach((e, i) => {
        console.log(`${i + 1}. Event/Course ID: ${e.eventId}, Status: ${e.status}`);
      });

      // Find events for those enrollments
      if (stellaEnrollments.length > 0) {
        const events = mongoose.connection.collection('events');
        const eventIds = stellaEnrollments.map(e => new mongoose.Types.ObjectId(e.eventId));
        const eventDetails = await events.find({ _id: { $in: eventIds } }).toArray();
        
        console.log('\n=== EVENT DETAILS ===');
        eventDetails.forEach((e, i) => {
          console.log(`${i + 1}. Title: ${e.title}`);
          console.log(`   Event ID: ${e._id}`);
          console.log(`   Type: ${e.type}`);
        });
      }
    }

    // Find corporate
    const corporates = mongoose.connection.collection('corporateprofiles');
    const corporate = await corporates.findOne({ companyName: 'Netcrest' });
    
    console.log('\n=== CORPORATE PROFILE ===');
    console.log('Corporate ID:', corporate?._id);
    console.log('Company Name:', corporate?.companyName);
    console.log('Owner ID:', corporate?.ownerId);
    
    if (corporate) {
      console.log('Registered Courses (raw):', corporate.registeredCourses);
      
      // Check if registered courses are Event or Course IDs
      if (corporate.registeredCourses && corporate.registeredCourses.length > 0) {
        const courses = mongoose.connection.collection('courses');
        const events = mongoose.connection.collection('events');
        
        const courseIds = corporate.registeredCourses.map(id => new mongoose.Types.ObjectId(id));
        
        const courseDetails = await courses.find({ _id: { $in: courseIds } }).toArray();
        const eventDetails = await events.find({ _id: { $in: courseIds } }).toArray();
        
        console.log('\n=== REGISTERED COURSES (from Courses collection) ===');
        console.log('Found:', courseDetails.length);
        courseDetails.forEach((c, i) => {
          console.log(`${i + 1}. ${c.title} (ID: ${c._id})`);
        });
        
        console.log('\n=== REGISTERED COURSES (from Events collection) ===');
        console.log('Found:', eventDetails.length);
        eventDetails.forEach((e, i) => {
          console.log(`${i + 1}. ${e.title} (ID: ${e._id})`);
        });
      }
    }

    // Find staff under this corporate
    if (corporate) {
      const staff = mongoose.connection.collection('corporatestaff');
      const staffList = await staff.find({ corporateId: corporate._id }).toArray();
      
      console.log('\n=== CORPORATE STAFF ===');
      console.log('Total staff:', staffList.length);
      staffList.forEach((s, i) => {
        console.log(`${i + 1}. Staff ID: ${s._id}, User ID: ${s.userId}`);
      });
    }

    console.log('\n✅ Debug complete\n');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
  }
}

debug();
