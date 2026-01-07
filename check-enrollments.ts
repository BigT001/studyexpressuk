import mongoose from 'mongoose';
import Enrollment from './src/server/db/models/enrollment.model.js';
import User from './src/server/db/models/user.model.js';
import connectToDatabase from './src/server/db/mongoose.js';

(async () => {
  await connectToDatabase();
  const user = await User.findOne({ email: 'looplap@gmail.com' });
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }
  const enrollments = await Enrollment.find({ userId: user._id });
  console.log('Enrollments for user:', enrollments.length);
  if (enrollments.length > 0) {
    console.log('Sample enrollment:', enrollments[0]);
  }
  process.exit(0);
})();
