const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function debugSamuelStar() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected\n');

    // Get schemas
    const userSchema = new mongoose.Schema({}, { strict: false });
    const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
    
    const CorporateProfileSchema = new mongoose.Schema({}, { strict: false });
    const CorporateProfileModel = mongoose.models.CorporateProfile || mongoose.model('CorporateProfile', CorporateProfileSchema, 'corporateprofiles');
    
    const CorporateStaffSchema = new mongoose.Schema({}, { strict: false });
    const CorporateStaffModel = mongoose.models.CorporateStaff || mongoose.model('CorporateStaff', CorporateStaffSchema, 'corporatestaffs');

    const IndividualProfileSchema = new mongoose.Schema({}, { strict: false });
    const IndividualProfileModel = mongoose.models.IndividualProfile || mongoose.model('IndividualProfile', IndividualProfileSchema, 'individualprofiles');

    // Find Samuel Star
    const samuel = await UserModel.findOne({ email: 'look@gmail.com' });
    
    console.log('👤 SAMUEL STAR - User Record:');
    console.log('='.repeat(50));
    console.log('User ID:', samuel._id);
    console.log('Email:', samuel.email);
    console.log('First Name:', samuel.firstName);
    console.log('Last Name:', samuel.lastName);
    console.log('Role:', samuel.role);
    console.log('Status:', samuel.status);
    console.log('Phone:', samuel.phone || 'N/A');
    console.log('Created At:', samuel.createdAt);
    console.log('All User Fields:', Object.keys(samuel.toObject()));

    // Check if he has an individual profile
    console.log('\n📋 Individual Profile:');
    console.log('='.repeat(50));
    const individualProfile = await IndividualProfileModel.findOne({ userId: samuel._id });
    if (individualProfile) {
      console.log('Profile ID:', individualProfile._id);
      console.log('Profile Fields:', Object.keys(individualProfile.toObject()));
      console.log(JSON.stringify(individualProfile.toObject(), null, 2).substring(0, 500));
    } else {
      console.log('❌ No individual profile found');
    }

    // Check if he's registered as staff
    console.log('\n👨‍💼 Staff Record:');
    console.log('='.repeat(50));
    const staffRecord = await CorporateStaffModel.findOne({ userId: samuel._id });
    if (staffRecord) {
      console.log('Staff ID:', staffRecord._id);
      console.log('Corporate ID:', staffRecord.corporateId);
      console.log('Department:', staffRecord.department);
      console.log('Role:', staffRecord.role);
      console.log('Status:', staffRecord.status);
      console.log('All Staff Fields:', Object.keys(staffRecord.toObject()));
      
      // Find the corporate
      const corporateProfile = await CorporateProfileModel.findOne({ _id: staffRecord.corporateId });
      if (corporateProfile) {
        const corporateUser = await UserModel.findOne({ _id: corporateProfile.ownerId });
        console.log('\n🏢 Linked Corporate:');
        console.log('   Company: ' + corporateProfile.companyName);
        console.log('   Owner: ' + corporateUser.firstName + ' ' + corporateUser.lastName);
        console.log('   Owner Email: ' + corporateUser.email);
      }
    } else {
      console.log('❌ No staff record found for this user');
      console.log('⚠️  This user is registered as STAFF but has no corporatestaff entry!');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🔍 DIAGNOSIS:');
    console.log('='.repeat(50));
    console.log('✓ User exists in database');
    console.log(`${individualProfile ? '✓' : '❌'} Individual profile exists`);
    console.log(`${staffRecord ? '✓' : '❌'} Corporate staff record exists`);
    console.log(`${samuel.role === 'STAFF' ? '✓' : '❌'} User role is STAFF`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

debugSamuelStar();
