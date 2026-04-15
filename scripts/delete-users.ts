import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env', override: false }); // fallback

import { connectToDatabase } from '../src/server/db/mongoose';
import UserModel from '../src/server/db/models/user.model';
import mongoose from 'mongoose';

async function main() {
    try {
        console.log('Connecting to database...');
        await connectToDatabase();
        
        console.log('Finding and deleting non-admin users...');
        const result = await UserModel.deleteMany({ role: { $ne: 'ADMIN' } });
        
        console.log(`Deleted ${result.deletedCount} non-admin users.`);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    }
}

main();
