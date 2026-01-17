const mongoose = require('mongoose');
const path = require('path');

// Import models
const UserModel = require('./src/server/db/models/user.model').default;
const CorporateProfileModel = require('./src/server/db/models/corporate.model').default;
const CorporateStaffModel = require('./src/server/db/models/staff.model').default;

async function checkCorporateStaff() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studyexpressuk';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Find the corporate user by email
    const corporateUser = await UserModel.findOne({ email: 'stellajo@gmail.com' });
    if (!corporateUser) {
      console.log('❌ Corporate user not found');
      return;
    }

    console.log('\n📋 Corporate User Found:');
    console.log('- Name:', corporateUser.firstName, corporateUser.lastName);
    console.log('- Email:', corporateUser.email);
    console.log('- Role:', corporateUser.role);
    console.log('- User ID:', corporateUser._id);

    // Find corporate profile
    const corporateProfile = await CorporateProfileModel.findOne({ ownerId: corporateUser._id });
    if (!corporateProfile) {
      console.log('\n❌ Corporate profile not found');
      return;
    }

    console.log('\n🏢 Corporate Profile:');
    console.log('- Company Name:', corporateProfile.companyName);
    console.log('- Corporate ID:', corporateProfile._id);

    // Find all staff under this corporate
    const staff = await CorporateStaffModel.find({ corporateId: corporateProfile._id }).populate('userId', 'firstName lastName email');

    console.log('\n👥 Staff Members (' + staff.length + '):');
    staff.forEach((s, index) => {
      console.log(`\n${index + 1}. ${s.userId.firstName} ${s.userId.lastName}`);
      console.log('   - Email:', s.userId.email);
      console.log('   - Department:', s.department);
      console.log('   - Role:', s.role);
      console.log('   - Status:', s.status);
      console.log('   - Staff ID:', s._id);
    });

    console.log('\n✓ Total Staff Members:', staff.length);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCorporateStaff();
