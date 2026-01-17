const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function checkAllCorporateStaff() {
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

    // Find all corporate users
    const corporateUsers = await UserModel.find({ role: 'CORPORATE' });
    
    console.log('📋 All Corporate Users:\n');
    
    for (const user of corporateUsers) {
      const corporateProfile = await CorporateProfileModel.findOne({ ownerId: user._id });
      const staffCount = await CorporateStaffModel.countDocuments({ corporateId: corporateProfile?._id });
      
      console.log(`${user.firstName} ${user.lastName}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Company: ${corporateProfile?.companyName || 'N/A'}`);
      console.log(`  Staff Count: ${staffCount}`);
      console.log('');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAllCorporateStaff();
