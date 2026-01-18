/**
 * Backfill script to set lastLogin for existing users
 * This script sets lastLogin to createdAt for all users who don't have lastLogin set
 */

import mongoose from 'mongoose';
import UserModel from '../src/server/db/models/user.model';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function backfillLastLogin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not set');
    }

    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Find all users without lastLogin
    const usersWithoutLastLogin = await UserModel.find({ 
      $or: [
        { lastLogin: null },
        { lastLogin: { $exists: false } }
      ]
    });

    console.log(`Found ${usersWithoutLastLogin.length} users without lastLogin`);

    if (usersWithoutLastLogin.length === 0) {
      console.log('✓ All users already have lastLogin set');
      await mongoose.disconnect();
      return;
    }

    // Update each user's lastLogin to their createdAt
    const updateResult = await UserModel.updateMany(
      {
        $or: [
          { lastLogin: null },
          { lastLogin: { $exists: false } }
        ]
      },
      [
        {
          $set: {
            lastLogin: {
              $cond: [{ $eq: ['$lastLogin', null] }, '$createdAt', '$lastLogin']
            }
          }
        }
      ]
    );

    console.log(`✓ Updated ${updateResult.modifiedCount} users`);

    // Verify the update
    const totalUsers = await UserModel.countDocuments({});
    const usersWithLastLogin = await UserModel.countDocuments({ lastLogin: { $exists: true } });

    console.log(`\n✓ Summary:`);
    console.log(`  Total users: ${totalUsers}`);
    console.log(`  Users with lastLogin: ${usersWithLastLogin}`);
    console.log(`  Coverage: ${((usersWithLastLogin / totalUsers) * 100).toFixed(1)}%`);

    await mongoose.disconnect();
    console.log('\n✓ Backfill complete');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

backfillLastLogin();
