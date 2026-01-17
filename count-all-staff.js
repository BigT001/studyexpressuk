const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function countAllStaff() {
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

    // Count total staff
    const totalStaff = await CorporateStaffModel.countDocuments();
    console.log(`📊 Total Corporate Staff Members: ${totalStaff}\n`);

    if (totalStaff === 0) {
      console.log('❌ No staff members found!');
      await mongoose.disconnect();
      return;
    }

    // Get all staff grouped by corporate
    const staffData = await CorporateStaffModel.find({});
    
    // Group by corporate
    const staffByCompany = {};
    
    for (const staff of staffData) {
      const corporateProfile = await CorporateProfileModel.findOne({ _id: staff.corporateId });
      const corporateUser = await UserModel.findOne({ _id: corporateProfile.ownerId });
      const staffUser = await UserModel.findOne({ _id: staff.userId });
      
      const companyName = corporateProfile.companyName;
      const corporateEmail = corporateUser.email;
      
      if (!staffByCompany[companyName]) {
        staffByCompany[companyName] = {
          email: corporateEmail,
          staff: []
        };
      }
      
      staffByCompany[companyName].staff.push({
        name: `${staffUser.firstName} ${staffUser.lastName}`,
        email: staffUser.email,
        department: staff.department,
        role: staff.role,
        status: staff.status
      });
    }

    // Display results
    Object.keys(staffByCompany).forEach(company => {
      const data = staffByCompany[company];
      console.log(`🏢 ${company}`);
      console.log(`   Corporate Email: ${data.email}`);
      console.log(`   Staff Count: ${data.staff.length}`);
      data.staff.forEach((staff, index) => {
        console.log(`   ${index + 1}. ${staff.name}`);
        console.log(`      Email: ${staff.email}`);
        console.log(`      Department: ${staff.department || 'N/A'}`);
        console.log(`      Role: ${staff.role}`);
        console.log(`      Status: ${staff.status}`);
      });
      console.log('');
    });

    console.log(`✓ Total: ${totalStaff} staff members across ${Object.keys(staffByCompany).length} companies`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

countAllStaff();
