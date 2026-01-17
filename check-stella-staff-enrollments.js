const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function checkStaffEnrollments() {
  try {
    console.log('Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    
    const corporates = mongoose.connection.collection('corporateprofiles');
    const staffCollection = mongoose.connection.collection('corporatestaffs');
    const usersCollection = mongoose.connection.collection('users');
    const enrollmentsCollection = mongoose.connection.collection('enrollments');
    const coursesCollection = mongoose.connection.collection('courses');

    // Get Stella's corporate
    const stellaCorporate = await corporates.findOne({ companyName: 'Netcrest' });
    
    if (!stellaCorporate) {
      console.log('Netcrest corporate not found');
      await mongoose.connection.close();
      return;
    }

    console.log(`Corporate: ${stellaCorporate.companyName}`);
    console.log(`Registered Courses: ${stellaCorporate.registeredCourses?.length || 0}\n`);

    // Get all staff under Netcrest
    const staff = await staffCollection.find({ corporateId: stellaCorporate._id }).toArray();
    
    console.log(`=== STAFF MEMBERS (${staff.length}) ===\n`);

    for (const s of staff) {
      const user = await usersCollection.findOne({ _id: s.userId });
      console.log(`${user.email} - ${user.fullName}`);
    }

    console.log(`\n=== ENROLLMENTS PER COURSE ===\n`);

    // Check enrollments for each course
    for (const courseId of (stellaCorporate.registeredCourses || [])) {
      const enrollments = await enrollmentsCollection.find({
        $or: [
          { courseId: new mongoose.Types.ObjectId(courseId) },
          { eventId: new mongoose.Types.ObjectId(courseId) }
        ]
      }).toArray();

      const course = await coursesCollection.findOne({ _id: new mongoose.Types.ObjectId(courseId) });

      // Filter for staff only
      const staffEnrollments = [];
      for (const enroll of enrollments) {
        const user = await usersCollection.findOne({ _id: enroll.userId });
        const isStaff = staff.some(s => s.userId.toString() === enroll.userId.toString());
        if (isStaff) {
          staffEnrollments.push({ email: user.email, fullName: user.fullName });
        }
      }

      console.log(`📚 ${course?.title || courseId}`);
      console.log(`   Total enrollments: ${enrollments.length}`);
      console.log(`   Staff enrolled: ${staffEnrollments.length}`);
      if (staffEnrollments.length > 0) {
        staffEnrollments.forEach(e => {
          console.log(`     • ${e.email} (${e.fullName})`);
        });
      }
      console.log();
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
  }
}

checkStaffEnrollments();
