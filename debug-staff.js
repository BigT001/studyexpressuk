const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Check CorporateStaff collection
    const db = mongoose.connection;
    const collection = db.collection('corporate_staff');
    const count = await collection.countDocuments();
    console.log('Total CorporateStaff records:', count);
    
    // Get the staff IDs
    const staffList = await collection.find({}).limit(5).toArray();
    console.log('\nFirst 5 staff records:');
    staffList.forEach((s, i) => {
      console.log(`${i+1}. ID: ${s._id} - Role: ${s.role} - UserId: ${s.userId}`);
    });
    
    // Check the specific ID from URL
    const specificId = '6966932b08b9f5082b51e13c';
    const staff = await collection.findOne({ _id: new mongoose.Types.ObjectId(specificId) });
    console.log('\nLooking for staff ID:', specificId);
    console.log('Found:', staff ? 'YES' : 'NO');
    if (staff) {
      console.log('Staff Details:');
      console.log('  - ID:', staff._id);
      console.log('  - Role:', staff.role);
      console.log('  - Status:', staff.status);
      console.log('  - UserId:', staff.userId);
      console.log('  - CorporateId:', staff.corporateId);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}
check();
