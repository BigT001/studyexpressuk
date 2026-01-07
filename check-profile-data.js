const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  dob: { type: Date, required: false },
  bio: { type: String, required: false, maxlength: 500 },
  interests: { type: String, required: false },
  qualifications: { type: String, required: false },
  profileImage: { type: String, required: false },
  password: { type: String, required: false },
  passwordHash: { type: String, required: false },
  role: { type: String, enum: ['INDIVIDUAL', 'CORPORATE', 'SUB_ADMIN', 'ADMIN'], default: 'INDIVIDUAL' },
  status: { type: String, enum: ['subscribed', 'not-subscribed'], default: 'not-subscribed' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function checkProfileData() {
  try {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    const users = await User.find().select('email firstName lastName phone dob bio').lean();
    console.log('\n=== Users in Database ===');
    console.table(users);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkProfileData();
