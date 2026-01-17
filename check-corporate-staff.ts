import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import CorporateStaffModel from '@/server/db/models/staff.model';

async function checkCorporateStaff() {
  try {
    await connectToDatabase();
    console.log('✓ Connected to MongoDB');

    // Find the corporate user by email
    const corporateUser = await UserModel.findOne({ email: 'stellajo@gmail.com' });
    if (!corporateUser) {
      console.log('❌ Corporate user not found');
      process.exit(1);
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
      process.exit(1);
    }

    console.log('\n🏢 Corporate Profile:');
    console.log('- Company Name:', corporateProfile.companyName);
    console.log('- Corporate ID:', corporateProfile._id);

    // Find all staff under this corporate
    const staff = await CorporateStaffModel.find({ corporateId: corporateProfile._id }).populate('userId', 'firstName lastName email');

    console.log('\n👥 Staff Members (' + staff.length + '):');
    staff.forEach((s: any, index: number) => {
      console.log(`\n${index + 1}. ${s.userId.firstName} ${s.userId.lastName}`);
      console.log('   - Email:', s.userId.email);
      console.log('   - Department:', s.department);
      console.log('   - Role:', s.role);
      console.log('   - Status:', s.status);
      console.log('   - Staff ID:', s._id);
    });

    console.log('\n✓ Total Staff Members:', staff.length);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCorporateStaff();
