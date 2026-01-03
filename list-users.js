const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function listAllUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    const UserSchema = new mongoose.Schema({
      email: String,
      role: String,
      status: String,
      passwordHash: String,
      createdAt: Date
    });
    
    const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
    
    const users = await UserModel.find({}, { email: 1, role: 1, status: 1, createdAt: 1 }).lean();
    
    console.log('\n📋 All Users in Database:\n');
    users.forEach((user, i) => {
      console.log(`${i + 1}. Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Created: ${user.createdAt}\n`);
    });
    
    console.log(`\nTotal Users: ${users.length}`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listAllUsers();
