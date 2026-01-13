const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection;
    
    // Check corporatestaffs (correct name)
    const staffCollection = db.collection('corporatestaffs');
    const staffList = await staffCollection.find({}).toArray();
    console.log('Total staff records:', staffList.length);
    console.log('\nAll staff:');
    staffList.forEach((s, i) => {
      console.log(`${i+1}. ID: ${s._id}`);
      console.log(`   userId: ${s.userId}`);
      console.log(`   corporateId: ${s.corporateId}`);
      console.log(`   role: ${s.role}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
