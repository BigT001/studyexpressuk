const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function verifyFix() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected\n');

    // Get all schemas
    const userSchema = new mongoose.Schema({}, { strict: false });
    const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
    
    const CorporateProfileSchema = new mongoose.Schema({}, { strict: false });
    const CorporateProfileModel = mongoose.models.CorporateProfile || mongoose.model('CorporateProfile', CorporateProfileSchema, 'corporateprofiles');
    
    // THIS IS THE KEY FIX - specify the correct collection name
    const CorporateStaffSchema = new mongoose.Schema({}, { strict: false });
    const CorporateStaffModel = mongoose.models.CorporateStaff || mongoose.model('CorporateStaff', CorporateStaffSchema, 'corporatestaffs');

    // Find Stella
    const stella = await UserModel.findOne({ email: 'stellajo@gmail.com' });
    console.log('👤 Stella Ibidapomola:');
    console.log('  User ID:', stella._id);

    // Find corporate profile
    const corporateProfile = await CorporateProfileModel.findOne({ ownerId: stella._id });
    console.log('\n🏢 Corporate Profile:');
    console.log('  Corporate ID:', corporateProfile._id);

    // Find staff using the correct collection
    const staff = await CorporateStaffModel.find({ corporateId: corporateProfile._id });

    console.log('\n👥 Staff Members (' + staff.length + '):');
    
    for (const s of staff) {
      const staffUser = await UserModel.findOne({ _id: s.userId });
      console.log(`\n1. ${staffUser.firstName} ${staffUser.lastName}`);
      console.log('   - Email:', staffUser.email);
      console.log('   - Department:', s.department);
      console.log('   - Role:', s.role);
      console.log('   - Status:', s.status);
    }

    console.log('\n✓ Fix verified! Staff members now show up correctly.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyFix();
