const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

async function updateStaffNames() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);

    const UserSchema = new mongoose.Schema({}, { strict: false });
    const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

    // Find all STAFF users without firstName and lastName
    const staffUsersWithoutNames = await UserModel.find({
      role: 'STAFF',
      $or: [
        { firstName: { $exists: false } },
        { firstName: '' },
        { lastName: { $exists: false } },
        { lastName: '' }
      ]
    });

    console.log(`\n📋 Found ${staffUsersWithoutNames.length} staff members without names\n`);

    if (staffUsersWithoutNames.length === 0) {
      console.log('✅ All staff members have names!');
      process.exit(0);
    }

    staffUsersWithoutNames.forEach((user, idx) => {
      console.log(`${idx + 1}. Email: ${user.email}`);
      console.log(`   First Name: ${user.firstName || 'MISSING'}`);
      console.log(`   Last Name: ${user.lastName || 'MISSING'}\n`);
    });

    console.log('\n⚠️  To update names, you need to do it manually via the profile page.');
    console.log('📝 Each staff member should log in and fill their profile with their name.\n');

    console.log('Alternative: Update via API');
    console.log('POST to /api/users/profile with your JWT token and data like:');
    console.log(JSON.stringify({
      firstName: 'John',
      lastName: 'Doe'
    }, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

updateStaffNames();
