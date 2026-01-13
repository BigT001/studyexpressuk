const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection;
    
    // List all collections
    const collections = await db.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(c => console.log('  -', c.name));
    
    // Check corporate_staff
    const staffCollection = db.collection('corporate_staff');
    const staffCount = await staffCollection.countDocuments();
    console.log('\ncorporate_staff count:', staffCount);
    
    if (staffCount > 0) {
      const staffList = await staffCollection.find({}).toArray();
      console.log('\nStaff records:');
      staffList.forEach(s => {
        console.log(`  ID: ${s._id} - Role: ${s.role}`);
      });
    }
    
    // Check corporatestaffs (with 's')
    const staffCollectionS = db.collection('corporatestaffs');
    const staffCountS = await staffCollectionS.countDocuments();
    console.log('\ncorporatestaffs count:', staffCountS);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
