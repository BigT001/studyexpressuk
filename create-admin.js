const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function createAdminUser() {
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
    
    // Check if admin exists
    const existingAdmin = await UserModel.findOne({ email: 'sta99175@gmail.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      await mongoose.disconnect();
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('Moremoney1992!', 10);
    
    // Create admin user
    const adminUser = await UserModel.create({
      email: 'sta99175@gmail.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      status: 'active'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: sta99175@gmail.com');
    console.log('🔐 Password: Moremoney1992!');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();
