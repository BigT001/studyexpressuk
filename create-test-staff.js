const mongoose = require('mongoose');
const { hash } = require('bcryptjs');
const MONGODB_URI = 'mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress';

// Define models inline
const UserSchema = new mongoose.Schema({}, { strict: false });
const CorporateProfileSchema = new mongoose.Schema({}, { strict: false });
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
const CorporateProfileModel = mongoose.models.CorporateProfile || mongoose.model('CorporateProfile', CorporateProfileSchema);
const CorporateStaffModel = mongoose.models.CorporateStaff || mongoose.model('CorporateStaff', CorporateStaffSchema);

async function createTestStaff() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Get a corporate profile
    const corporate = await CorporateProfileModel.findOne().limit(1);
    if (!corporate) {
      console.log('No corporate profiles found in database');
      process.exit(1);
    }
    
    console.log('Using corporate:', corporate._id);
    
    // Create a test user
    const testEmail = 'teststaff@example.com';
    let user = await UserModel.findOne({ email: testEmail });
    
    if (!user) {
      console.log('Creating new test user...');
      const passwordHash = await hash('testpass123', 10);
      user = await UserModel.create({
        email: testEmail,
        passwordHash,
        password: 'testpass123',
        role: 'STAFF',
        firstName: 'Test',
        lastName: 'Staff',
        phone: '1234567890',
        dob: '1990-01-15',
        bio: 'Test staff member',
        interests: ['education', 'training'],
        qualifications: ['Bachelor of Science', 'Microsoft Certified'],
        profileImage: 'https://via.placeholder.com/400?text=Test+Staff',
        status: 'subscribed',
      });
      console.log('User created:', user._id);
    } else {
      console.log('User already exists:', user._id);
    }
    
    // Create staff record
    const staffRecord = await CorporateStaffModel.create({
      userId: user._id,
      corporateId: corporate._id,
      role: 'Manager',
      department: 'HR',
      joinDate: new Date('2025-01-01'),
      status: 'active',
      approvalStatus: 'approved',
      approvalDate: new Date(),
    });
    
    console.log('\nStaff member created successfully!');
    console.log('Staff ID:', staffRecord._id);
    console.log('User ID:', user._id);
    console.log('Email:', user.email);
    console.log('Name:', user.firstName, user.lastName);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createTestStaff();
