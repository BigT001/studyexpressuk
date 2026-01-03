const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function checkUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    const UserSchema = new mongoose.Schema({
      email: String,
      passwordHash: String,
      role: String,
      status: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
    
    // Check for the specific user
    const email = 'unclet1992@gmail.com';
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      console.log(`❌ User "${email}" NOT FOUND in database`);
      console.log('\n📋 All users in database:');
      const allUsers = await UserModel.find({}, { email: 1, role: 1, status: 1 });
      console.table(allUsers);
    } else {
      console.log(`✅ User "${email}" FOUND`);
      console.log('📧 Email:', user.email);
      console.log('👤 Role:', user.role);
      console.log('🔒 Status:', user.status);
      console.log('🕐 Created:', user.createdAt);
      
      // Test password if provided
      const testPassword = process.argv[2];
      if (testPassword) {
        console.log(`\n🔑 Testing password: "${testPassword}"`);
        const isMatch = await bcrypt.compare(testPassword, user.passwordHash);
        if (isMatch) {
          console.log('✅ Password is CORRECT');
        } else {
          console.log('❌ Password is INCORRECT');
        }
      } else {
        console.log('\n💡 Tip: Run with password as argument to test: node check-user.js "your-password"');
      }
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUser();
