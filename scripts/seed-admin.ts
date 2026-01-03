import { connectToDatabase } from '@/server/db/mongoose';
import UserModel, { UserRole } from '@/server/db/models/user.model';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    await connectToDatabase();

    const adminEmail = 'sta99175@gmail.com';
    const adminPassword = 'Moremoney1992!';

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const adminUser = await UserModel.create({
      email: adminEmail,
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      status: 'active',
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password: Moremoney1992!');
    console.log('👤 Role:', adminUser.role);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
