const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function checkCorporateStaff() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected\n');

    // Find the corporate user
    const userSchema = new mongoose.Schema({}, { strict: false });
    const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
    
    const corporateUser = await UserModel.findOne({ email: 'stellajo@gmail.com' });
    if (!corporateUser) {
      console.log('❌ Corporate user not found');
      await mongoose.disconnect();
      return;
    }

    console.log('📋 Corporate User Found:');
    console.log('- Name:', corporateUser.firstName, corporateUser.lastName);
    console.log('- Email:', corporateUser.email);
    console.log('- Role:', corporateUser.role);
    console.log('- User ID:', corporateUser._id);

    // Find corporate profile
    const CorporateProfileSchema = new mongoose.Schema({}, { strict: false });
    const CorporateProfileModel = mongoose.models.CorporateProfile || mongoose.model('CorporateProfile', CorporateProfileSchema, 'corporateprofiles');
    
    const corporateProfile = await CorporateProfileModel.findOne({ ownerId: corporateUser._id });
    if (!corporateProfile) {
      console.log('\n❌ Corporate profile not found');
      await mongoose.disconnect();
      return;
    }

    console.log('\n🏢 Corporate Profile:');
    console.log('- Company Name:', corporateProfile.companyName);
    console.log('- Corporate ID:', corporateProfile._id);

    // Find all staff under this corporate
    const CorporateStaffSchema = new mongoose.Schema({}, { strict: false });
    const CorporateStaffModel = mongoose.models.CorporateStaff || mongoose.model('CorporateStaff', CorporateStaffSchema, 'corporatestaff');
    
    const staff = await CorporateStaffModel.find({ corporateId: corporateProfile._id });

    console.log('\n👥 Staff Members (' + staff.length + '):');
    
    for (let i = 0; i < staff.length; i++) {
      const s = staff[i];
      const staffUser = await UserModel.findOne({ _id: s.userId });
      
      console.log(`\n${i + 1}. ${staffUser.firstName} ${staffUser.lastName}`);
      console.log('   - Email:', staffUser.email);
      console.log('   - Department:', s.department || 'N/A');
      console.log('   - Role:', s.role);
      console.log('   - Status:', s.status);
      console.log('   - Staff ID:', s._id);
    }

    console.log('\n✓ Total Staff Members:', staff.length);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCorporateStaff();
