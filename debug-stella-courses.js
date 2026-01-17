require('dotenv').config();
const mongoose = require('mongoose');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find Stella's user
    const User = mongoose.model('User', new mongoose.Schema({}, { collection: 'users' }));
    const stella = await mongoose.connection.collection('users').findOne({ email: 'stellajo@gmail.com' });
    console.log('\n=== STELLA USER ===');
    console.log('User ID:', stella?._id);
    console.log('Email:', stella?.email);

    if (stella) {
      // Find enrollments for Stella
      const enrollments = await mongoose.connection.collection('enrollments').find({ userId: stella._id }).toArray();
      console.log('\n=== STELLA ENROLLMENTS ===');
      console.log('Total enrollments:', enrollments.length);
      enrollments.forEach((e, i) => {
        console.log(`${i + 1}. Event ID: ${e.eventId}, Status: ${e.status}`);
      });

      // Find events/courses for those enrollments
      if (enrollments.length > 0) {
        const eventIds = enrollments.map(e => e.eventId);
        const events = await mongoose.connection.collection('events').find({ _id: { $in: eventIds } }).toArray();
        console.log('\n=== EVENTS LINKED TO ENROLLMENTS ===');
        events.forEach((e, i) => {
          console.log(`${i + 1}. ${e.title} (ID: ${e._id})`);
        });
      }
    }

    // Find corporate profile
    const corporate = await mongoose.connection.collection('corporateprofiles').findOne({ companyName: { $regex: 'Netcrest', $options: 'i' } });
    console.log('\n=== CORPORATE PROFILE ===');
    console.log('Corporate ID:', corporate?._id);
    console.log('Registered Courses:', corporate?.registeredCourses);

    if (corporate?.registeredCourses) {
      const registeredCourseDetails = await mongoose.connection.collection('courses').find({ _id: { $in: corporate.registeredCourses } }).toArray();
      console.log('\n=== REGISTERED COURSE DETAILS ===');
      registeredCourseDetails.forEach((c, i) => {
        console.log(`${i + 1}. ${c.title} (ID: ${c._id})`);
      });
    }

    // Find staff under this corporate
    const staffList = await mongoose.connection.collection('corporatestaff').find({ corporateId: corporate?._id }).toArray();
    console.log('\n=== STAFF MEMBERS ===');
    console.log('Total staff:', staffList.length);
    staffList.forEach((s, i) => {
      console.log(`${i + 1}. Staff ID: ${s._id}, User ID: ${s.userId}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
}

debug();
