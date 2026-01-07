import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';

async function checkUsers() {
  try {
    await connectToDatabase();
    const users = await UserModel.find().select('email firstName lastName phone dob bio').limit(10).lean();
    
    console.log('\n=== Users in Database ===');
    users.forEach((user: any) => {
      console.log(`Email: ${user.email}`);
      console.log(`  firstName: "${user.firstName || 'EMPTY'}"`);
      console.log(`  lastName: "${user.lastName || 'EMPTY'}"`);
      console.log(`  phone: "${user.phone || 'EMPTY'}"`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
