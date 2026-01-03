const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('❌ Usage: node reset-password.js <email> <new-password>');
    console.log('   Example: node reset-password.js unclet1992@gmail.com "MyNewPassword123!"');
    process.exit(1);
  }

  try {
    console.log(`🔗 Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI);
    
    const UserSchema = new mongoose.Schema({
      email: String,
      passwordHash: String,
      role: String,
      status: String,
      updatedAt: Date
    });
    
    const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
    
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      await mongoose.disconnect();
      process.exit(1);
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    user.passwordHash = hashedPassword;
    user.updatedAt = new Date();
    await user.save();
    
    console.log(`✅ Password reset successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log(`\n💡 You can now login with these credentials.`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
