const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

async function checkStaffList() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection;
    
    // Get the corporate ID
    const corporateCollection = db.collection('corporateprofiles');
    const corporate = await corporateCollection.findOne({ companyName: 'Netcrest' });
    
    console.log('Corporate ID:', corporate._id.toString());
    
    // Get all staff for this corporate
    const staffCollection = db.collection('corporatestaffs');
    const staff = await staffCollection.find({ corporateId: corporate._id }).toArray();
    
    console.log('\nStaff in database:');
    staff.forEach((s, i) => {
      console.log(`${i+1}. ID: ${s._id.toString()}`);
      console.log(`   userId: ${s.userId.toString()}`);
      console.log(`   role: ${s.role}`);
    });
    
    // Now check what should be returned by the API
    console.log('\nWhat the API should return:');
    staff.forEach(s => {
      console.log(`_id: "${s._id.toString()}"`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkStaffList();
