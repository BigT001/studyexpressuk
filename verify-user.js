const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection;
    
    // Check the test user we created
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new mongoose.Types.ObjectId('6966a9c03f1c7cf48aef1e3d') });
    
    if (user) {
      console.log('User details:');
      console.log('  Email:', user.email);
      console.log('  First Name:', user.firstName);
      console.log('  Last Name:', user.lastName);
      console.log('  Phone:', user.phone);
      console.log('  DOB:', user.dob);
      console.log('  Bio:', user.bio);
      console.log('  Interests:', user.interests);
      console.log('  Qualifications:', user.qualifications);
      console.log('  Profile Image:', user.profileImage);
    } else {
      console.log('User not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
