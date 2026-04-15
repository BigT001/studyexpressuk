import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env', override: false });

import { connectToDatabase } from '../src/server/db/mongoose';
import UserModel from '../src/server/db/models/user.model';
import SubAdminModel from '../src/server/db/models/subadmin.model';
import mongoose from 'mongoose';

async function main() {
    try {
        await connectToDatabase();
        console.log('Cleaning up sub-admins (Users and Profiles)...');

        // Delete from SubAdminModel first
        const subAdminResult = await SubAdminModel.deleteMany({});
        console.log(`Deleted ${subAdminResult.deletedCount} sub-admin profiles.`);

        // Delete from UserModel where role is SUB_ADMIN
        const userResult = await UserModel.deleteMany({ role: 'SUB_ADMIN' });
        console.log(`Deleted ${userResult.deletedCount} sub-admin user accounts.`);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);
    }
}

main();
