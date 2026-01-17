const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function linkStaffToCorporate() {
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

    // Find users
    const samuel = await UserModel.findOne({ email: 'look@gmail.com' });
    const stella = await UserModel.findOne({ email: 'stellajo@gmail.com' });
    const samuel2 = await UserModel.findOne({ email: 'sam@gmail.com' });
    const mathew = await UserModel.findOne({ email: 'math@gmail.com' });

    if (!samuel || !stella) {
      console.log('❌ Users not found');
      await mongoose.disconnect();
      return;
    }

    // Find Stella's corporate profile
    const stellaCorporate = await CorporateProfileModel.findOne({ ownerId: stella._id });
    if (!stellaCorporate) {
      console.log('❌ Stella corporate profile not found');
      await mongoose.disconnect();
      return;
    }

    console.log('📝 Creating/Updating Staff Records:\n');

    // For Samuel Star (look@gmail.com)
    const existingSamuel = await CorporateStaffModel.findOne({ userId: samuel._id });
    if (!existingSamuel) {
      await CorporateStaffModel.create({
        userId: samuel._id,
        corporateId: stellaCorporate._id,
        role: 'developer',
        department: 'IT',
        joinDate: new Date(),
        status: 'active',
        approvalStatus: 'approved',
        approvedBy: stella._id,
        approvalDate: new Date(),
      });
      console.log('✓ Created staff record for Samuel Star (look@gmail.com)');
    } else {
      console.log('ℹ️  Samuel Star already linked');
    }

    // For Samuel Stan (sam@gmail.com)
    if (samuel2) {
      const existingSamuel2 = await CorporateStaffModel.findOne({ userId: samuel2._id });
      if (!existingSamuel2) {
        await CorporateStaffModel.create({
          userId: samuel2._id,
          corporateId: stellaCorporate._id,
          role: 'assistant',
          department: 'Support',
          joinDate: new Date(),
          status: 'active',
          approvalStatus: 'approved',
          approvedBy: stella._id,
          approvalDate: new Date(),
        });
        console.log('✓ Created staff record for Samuel Stan (sam@gmail.com)');
      } else {
        console.log('ℹ️  Samuel Stan already linked');
      }
    }

    // For Mathew Ola (math@gmail.com) - check if already exists
    if (mathew) {
      const existingMathew = await CorporateStaffModel.findOne({ userId: mathew._id });
      if (!existingMathew) {
        await CorporateStaffModel.create({
          userId: mathew._id,
          corporateId: stellaCorporate._id,
          role: 'manager',
          department: 'dev',
          joinDate: new Date(),
          status: 'active',
          approvalStatus: 'approved',
          approvedBy: stella._id,
          approvalDate: new Date(),
        });
        console.log('✓ Created staff record for Mathew Ola (math@gmail.com)');
      } else {
        console.log('ℹ️  Mathew Ola already linked');
      }
    }

    // Verify all staff are now linked
    console.log('\n✅ Verification:');
    const allStaff = await CorporateStaffModel.find({ corporateId: stellaCorporate._id });
    console.log(`Total staff under Netcrest: ${allStaff.length}`);
    
    for (const staff of allStaff) {
      const staffUser = await UserModel.findOne({ _id: staff.userId });
      console.log(`  - ${staffUser.firstName} ${staffUser.lastName} (${staffUser.email})`);
    }

    await mongoose.disconnect();
    console.log('\n✓ All staff records have been linked successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

linkStaffToCorporate();
