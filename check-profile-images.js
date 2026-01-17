const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  profileImage: String,
});

const User = mongoose.model('User', userSchema, 'users');

async function check() {
  try {
    await mongoose.connect('mongodb://localhost/studyexpressuk');
    console.log('Connected to MongoDB');

    const users = [
      { email: 'look@gmail.com', name: 'Samuel Star' },
      { email: 'sam@gmail.com', name: 'Samuel Stan' },
      { email: 'math@gmail.com', name: 'Mathew Ola' },
    ];

    for (const user of users) {
      const doc = await User.findOne({ email: user.email });
      console.log(`\n${user.name} (${user.email}):`);
      if (doc) {
        console.log(`  - firstName: ${doc.firstName}`);
        console.log(`  - lastName: ${doc.lastName}`);
        console.log(`  - profileImage: ${doc.profileImage || 'NOT SET'}`);
      } else {
        console.log('  - NOT FOUND IN DB');
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

check();
