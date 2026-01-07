import { connectToDatabase } from '@/server/db/mongoose';
import User from '@/server/db/models/user.model';

async function inspectUsers() {
  try {
    await connectToDatabase();
    
    // Get first 5 users
    const users = await User.find().limit(5);
    
    console.log('\n=== Users in Database ===');
    users.forEach((user: any) => {
      console.log('\nUser ID:', user._id);
      console.log('Email:', user.email);
      console.log('FirstName:', user.firstName || '(empty)');
      console.log('LastName:', user.lastName || '(empty)');
      console.log('Phone:', user.phone || '(empty)');
      console.log('Role:', user.role);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

inspectUsers();
