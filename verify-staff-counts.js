const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function verifyStaffCount() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    
    // Get Netcrest corporate
    const corporates = mongoose.connection.collection('corporateprofiles');
    const corporate = await corporates.findOne({ companyName: 'Netcrest' });
    
    if (!corporate) {
      console.log('❌ Corporate not found');
      return;
    }

    console.log('=== CORPORATE COURSES & STAFF COUNTS ===\n');
    console.log(`Corporate: ${corporate.companyName}`);
    console.log(`Registered Courses: ${corporate.registeredCourses?.length || 0}\n`);

    if (!corporate.registeredCourses || corporate.registeredCourses.length === 0) {
      console.log('No courses registered');
      mongoose.connection.close();
      return;
    }

    const courses = mongoose.connection.collection('courses');
    const enrollments = mongoose.connection.collection('enrollments');

    // For each course, count enrollments
    for (const courseId of corporate.registeredCourses) {
      const course = await courses.findOne({ _id: courseId });
      const courseEnrollments = await enrollments.find({ eventId: courseId }).toArray();
      
      console.log(`📚 Course: ${course?.title || 'Unknown'}`);
      console.log(`   ID: ${courseId}`);
      console.log(`   Staff Enrolled: ${courseEnrollments.length}`);
      
      if (courseEnrollments.length > 0) {
        console.log(`   Enrolled Staff:`);
        for (const enrollment of courseEnrollments) {
          const user = await mongoose.connection.collection('users').findOne({ _id: enrollment.userId });
          console.log(`     - ${user?.email || 'Unknown'} (Status: ${enrollment.status})`);
        }
      }
      console.log('');
    }

    console.log('✅ Count verification complete\n');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
  }
}

verifyStaffCount();
