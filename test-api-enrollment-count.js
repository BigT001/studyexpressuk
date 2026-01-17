const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function testAPIResponse() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    
    // Simulate what the API returns
    const corporate = await mongoose.connection.collection('corporateprofiles').findOne({ companyName: 'Netcrest' });
    const staff = await mongoose.connection.collection('corporatestaff').find({ corporateId: corporate._id }).toArray();
    const staffUserIds = staff.map(s => s.userId);

    console.log('=== SIMULATING API RESPONSE ===\n');
    console.log(`Corporate Staff Count: ${staffUserIds.length}`);
    console.log(`Staff User IDs:`, staffUserIds.map(id => id.toString()));

    // Get enrollments like the API does
    const enrollments = await mongoose.connection.collection('enrollments')
      .find({ userId: { $in: staffUserIds } })
      .toArray();

    console.log(`\nTotal Enrollments: ${enrollments.length}`);
    console.log('\nEnrollments grouped by course:');

    // Get registered courses
    const registeredCourses = corporate.registeredCourses || [];
    
    for (const courseId of registeredCourses) {
      const courseEnrollments = enrollments.filter(e => {
        const enrollmentCourseId = e.eventId?.toString();
        const courseIdStr = courseId.toString();
        return enrollmentCourseId === courseIdStr;
      });

      const course = await mongoose.connection.collection('courses').findOne({ _id: courseId });
      
      console.log(`\n📚 ${course?.title || 'Unknown'}`);
      console.log(`   Course ID: ${courseId}`);
      console.log(`   Enrollments for this course: ${courseEnrollments.length}`);
      
      // Show the filter working
      courseEnrollments.forEach((e, i) => {
        console.log(`   ${i + 1}. Event ID: ${e.eventId}, Matches: ${e.eventId.toString() === courseId.toString()}`);
      });
    }

    console.log('\n✅ API response simulation complete\n');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
  }
}

testAPIResponse();
