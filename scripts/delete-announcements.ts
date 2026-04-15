import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env', override: false });

import { connectToDatabase } from '../src/server/db/mongoose';
import { Announcement } from '../src/server/db/models/announcement.model';
import mongoose from 'mongoose';

async function main() {
    try {
        await connectToDatabase();
        console.log('Cleaning up announcements...');

        if (Announcement) {
            const result = await Announcement.deleteMany({});
            console.log(`Deleted ${result.deletedCount} announcements.`);
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);
    }
}

main();
