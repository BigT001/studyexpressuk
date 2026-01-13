const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

async function checkAllStaff() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection;
    
    // Get all corporate profiles
    const corporateCollection = db.collection('corporateprofiles');
    const corporates = await corporateCollection.find({}).toArray();
    
    console.log('All Corporate Profiles:');
    for (const corp of corporates) {
      console.log(`\nCorporate: ${corp.companyName} (ID: ${corp._id})`);
      console.log(`  Owner: ${corp.ownerId}`);
      
      // Get all staff for this corporate
      const staffCollection = db.collection('corporatestaffs');
      const staffList = await staffCollection.find({ corporateId: corp._id }).toArray();
      
      console.log(`  Staff Count: ${staffList.length}`);
      for (const staff of staffList) {
        console.log(`    - ID: ${staff._id}`);
        console.log(`      Role: ${staff.role}`);
        console.log(`      UserId: ${staff.userId}`);
        
        // Get user details
        const userCollection = db.collection('users');
        const user = await userCollection.findOne({ _id: staff.userId });
        if (user) {
          console.log(`      User: ${user.firstName} ${user.lastName} (${user.email})`);
        }
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkAllStaff();
