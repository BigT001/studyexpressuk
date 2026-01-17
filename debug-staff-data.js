const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function debugStaffData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected\n');

    // Get all schemas
    const userSchema = new mongoose.Schema({}, { strict: false });
    const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
    
    const CorporateProfileSchema = new mongoose.Schema({}, { strict: false });
    const CorporateProfileModel = mongoose.models.CorporateProfile || mongoose.model('CorporateProfile', CorporateProfileSchema, 'corporateprofiles');
    
    const CorporateStaffSchema = new mongoose.Schema({}, { strict: false });
    const CorporateStaffModel = mongoose.models.CorporateStaff || mongoose.model('CorporateStaff', CorporateStaffSchema, 'corporatestaff');

    // Find Stella
    const stella = await UserModel.findOne({ email: 'stellajo@gmail.com' });
    console.log('👤 Stella Ibidapomola:');
    console.log('  User ID:', stella._id);
    console.log('  Email:', stella.email);

    // Find corporate profile
    const corporateProfile = await CorporateProfileModel.findOne({ ownerId: stella._id });
    console.log('\n🏢 Corporate Profile:');
    console.log('  Corporate ID:', corporateProfile._id);
    console.log('  Corporate ownerId:', corporateProfile.ownerId);
    console.log('  Company Name:', corporateProfile.companyName);

    // Find ALL staff records in the database
    console.log('\n📊 ALL Staff Records in Database:');
    const allStaff = await CorporateStaffModel.find({});
    console.log('Total staff records:', allStaff.length);
    
    for (const staff of allStaff) {
      const staffUser = await UserModel.findOne({ _id: staff.userId });
      console.log(`\n  ${staffUser.firstName} ${staffUser.lastName} (${staffUser.email})`);
      console.log(`    Staff ID: ${staff._id}`);
      console.log(`    User ID: ${staff.userId}`);
      console.log(`    Corporate ID: ${staff.corporateId}`);
      console.log(`    Department: ${staff.department}`);
      console.log(`    Role: ${staff.role}`);
      console.log(`    Status: ${staff.status}`);
      
      // Check if this matches Stella's corporate
      if (staff.corporateId.toString() === corporateProfile._id.toString()) {
        console.log(`    ✓ MATCHES Stella's corporate`);
      } else {
        console.log(`    ❌ Does NOT match Stella's corporate`);
      }
    }

    // Check if the issue is with ownerId vs _id
    console.log('\n🔍 Checking staff by ownerId instead of _id:');
    const staffByOwnerId = await CorporateStaffModel.find({ corporateId: stella._id });
    console.log('Staff found using ownerId:', staffByOwnerId.length);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugStaffData();
