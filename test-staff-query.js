const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

async function testQuery() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection;
    const staffCollection = db.collection('corporatestaffs');
    
    // Test the exact query that the API would do
    const staffId = '69668035cc64b33a6c7096d3';
    console.log('Looking for staff ID:', staffId);
    
    // Try with string ID
    const staffString = await staffCollection.findOne({ _id: staffId });
    console.log('Result with string:', staffString ? 'FOUND' : 'NOT FOUND');
    
    // Try with ObjectId
    const staffOid = await staffCollection.findOne({ _id: new mongoose.Types.ObjectId(staffId) });
    console.log('Result with ObjectId:', staffOid ? 'FOUND' : 'NOT FOUND');
    
    if (staffOid) {
      console.log('Staff details:', {
        _id: staffOid._id,
        corporateId: staffOid.corporateId,
        userId: staffOid.userId,
        role: staffOid.role
      });
      
      // Now try to populate the user
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ _id: staffOid.userId });
      console.log('User found:', user ? 'YES' : 'NO');
      if (user) {
        console.log('User:', {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testQuery();
