const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

// Define models
const UserSchema = new mongoose.Schema({}, { strict: false });
const CorporateStaffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  corporateId: { type: mongoose.Schema.Types.ObjectId, ref: 'CorporateProfile' },
  role: String,
  department: String,
  status: String,
  joinDate: Date,
  approvalStatus: String,
  approvedBy: mongoose.Schema.Types.ObjectId,
  approvalDate: Date,
});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
const CorporateStaffModel = mongoose.models.CorporateStaff || mongoose.model('CorporateStaff', CorporateStaffSchema);

async function testAPI() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Test with the new staff ID
    const staffId = '6966a9c03f1c7cf48aef1e3f';
    console.log('Testing API logic for staff ID:', staffId);
    console.log('');
    
    const staff = await CorporateStaffModel.findById(staffId)
      .populate('userId', 'email firstName lastName phone dob bio interests qualifications profileImage')
      .lean();
    
    if (!staff) {
      console.log('ERROR: Staff member not found');
    } else {
      console.log('SUCCESS: Staff found!');
      console.log('Staff object:');
      console.log(JSON.stringify(staff, null, 2));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testAPI();
