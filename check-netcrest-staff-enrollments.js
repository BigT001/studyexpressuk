const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function checkNetcrestStaffEnrollments() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get collections
    const corporates = mongoose.connection.collection('corporateprofiles');
    const corporateStaffs = mongoose.connection.collection('corporatestaffs');
    const enrollments = mongoose.connection.collection('enrollments');
    const users = mongoose.connection.collection('users');

    // Get Stella's corporate (Netcrest)
    const stellaCorporate = await corporates.findOne({ 
      'admin.email': 'stellajo@gmail.com' 
    });

    if (!stellaCorporate) {
      console.log('Stella corporate not found');
      return;
    }

    console.log(`📍 Corporate: ${stellaCorporate.companyName} (${stellaCorporate._id})`);
    console.log(`Admin: ${stellaCorporate.admin.email}\n`);

    // Get all corporate staff registered under Stella
    const corporateStaffMembers = await corporateStaffs.find({
      corporateId: stellaCorporate._id
    }).toArray();

    console.log(`📊 Total staff registered: ${corporateStaffMembers.length}`);
    console.log(`Expected staff: math@gmail.com, sam@gmail.com, look@gmail.com\n`);

    corporateStaffMembers.forEach((staff, index) => {
      console.log(`${index + 1}. ${staff.userId?.email} - ${staff.userId?.fullName} (${staff.userId?._id})`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('CHECKING ENROLLMENTS FOR EACH STAFF MEMBER');
    console.log('='.repeat(80) + '\n');

    // Check enrollments for each staff member
    for (const staff of corporateStaffMembers) {
      const user = await users.findOne({ _id: new mongoose.Types.ObjectId(staff.userId) });
      
      console.log(`\n👤 ${user?.email} (${user?.fullName})`);
      
      const staffEnrollments = await enrollments.find({
        userId: staff.userId
      }).toArray();

      if (staffEnrollments.length === 0) {
        console.log('   No enrollments found');
      } else {
        staffEnrollments.forEach((enrollment, idx) => {
          const courseId = enrollment.courseId?._id || enrollment.eventId?._id || enrollment.courseId || enrollment.eventId;
          console.log(`   ${idx + 1}. Course ID: ${courseId}`);
        });
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY: ENROLLED STAFF COUNT PER COURSE');
    console.log('='.repeat(80) + '\n');

    // Get Netcrest's registered courses
    const registeredCourseIds = stellaCorporate.registeredCourses || [];
    console.log(`📚 Netcrest registered courses: ${registeredCourseIds.length}`);

    // Map staff IDs to emails
    const staffMap = {};
    for (const staff of corporateStaffMembers) {
      const user = await users.findOne({ _id: new mongoose.Types.ObjectId(staff.userId) });
      staffMap[staff.userId.toString()] = user?.email;
    }

    console.log(`Staff emails: ${Object.values(staffMap).join(', ')}\n`);

    for (const courseId of registeredCourseIds) {
      const courseEnrollments = await enrollments.find({
        $or: [
          { courseId: new mongoose.Types.ObjectId(courseId) },
          { eventId: new mongoose.Types.ObjectId(courseId) }
        ]
      }).toArray();

      const staffEnrollments = courseEnrollments.filter(e => 
        staffMap[e.userId.toString()]
      );

      const enrolledStaffNames = await Promise.all(
        staffEnrollments.map(async (e) => {
          const user = await users.findOne({ _id: new mongoose.Types.ObjectId(e.userId) });
          return user?.email;
        })
      );

      console.log(`Course ${courseId}:`);
      console.log(`  Total enrollments: ${courseEnrollments.length}`);
      console.log(`  Corporate staff enrollments: ${staffEnrollments.length}`);
      if (staffEnrollments.length > 0) {
        console.log(`  Staff: ${enrolledStaffNames.join(', ')}`);
      }
      console.log();
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
  }
}

checkNetcrestStaffEnrollments();
