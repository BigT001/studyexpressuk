const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function checkStaffUsers() {
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

    // Search for the staff users
    const staffEmails = ['look@gmail.com', 'sam@gmail.com', 'math@gmail.com'];
    
    console.log('👥 Checking Staff Users:\n');
    
    for (const email of staffEmails) {
      const user = await UserModel.findOne({ email });
      
      if (!user) {
        console.log(`❌ ${email} - NOT FOUND`);
        continue;
      }

      console.log(`✓ ${user.firstName} ${user.lastName}`);
      console.log(`  Email: ${email}`);
      console.log(`  Role: ${user.role}`);
      
      // Check if this staff user is linked to a corporate
      const staffRecord = await CorporateStaffModel.findOne({ userId: user._id });
      
      if (staffRecord) {
        // Find the corporate that owns this staff
        const corporateProfile = await CorporateProfileModel.findOne({ _id: staffRecord.corporateId });
        const corporateUser = await UserModel.findOne({ _id: corporateProfile.ownerId });
        
        console.log(`  💼 Corporate: ${corporateUser.firstName} ${corporateUser.lastName}`);
        console.log(`  🏢 Company: ${corporateProfile.companyName}`);
        console.log(`  Department: ${staffRecord.department || 'N/A'}`);
        console.log(`  Staff Role: ${staffRecord.role}`);
        console.log(`  Status: ${staffRecord.status}`);
      } else {
        console.log(`  ❌ NOT LINKED to any corporate`);
      }
      
      console.log('');
    }

    // Also search by partial name in case they're not using exact emails
    console.log('\n🔍 Searching by partial name match:\n');
    
    const partialNames = ['Samuel Star', 'Samuel Stan', 'Mathew Ola', 'mathew'];
    
    for (const name of partialNames) {
      const users = await UserModel.find({
        $or: [
          { firstName: { $regex: name.split(' ')[0], $options: 'i' } },
          { lastName: { $regex: name.split(' ').slice(1).join(' '), $options: 'i' } }
        ],
        role: 'STAFF'
      });
      
      if (users.length > 0) {
        for (const user of users) {
          console.log(`Found: ${user.firstName} ${user.lastName} (${user.email})`);
          
          const staffRecord = await CorporateStaffModel.findOne({ userId: user._id });
          if (staffRecord) {
            const corporateProfile = await CorporateProfileModel.findOne({ _id: staffRecord.corporateId });
            const corporateUser = await UserModel.findOne({ _id: corporateProfile.ownerId });
            console.log(`  → Linked to: ${corporateUser.firstName} ${corporateUser.lastName} (${corporateProfile.companyName})`);
          } else {
            console.log(`  → NOT LINKED to any corporate`);
          }
          console.log('');
        }
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkStaffUsers();
