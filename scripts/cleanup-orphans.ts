import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env', override: false });

import { connectToDatabase } from '../src/server/db/mongoose';
import UserModel from '../src/server/db/models/user.model';
import EnrollmentModel from '../src/server/db/models/enrollment.model';
import MembershipModel from '../src/server/db/models/membership.model';
import MessageModel from '../src/server/db/models/message.model';
import mongoose from 'mongoose';

async function main() {
    try {
        await connectToDatabase();
        console.log('Cleaning up orphaned records...');

        // Get all valid user IDs
        const validUsers = await UserModel.find().select('_id').lean();
        const validUserIds = validUsers.map(u => u._id);

        console.log(`Found ${validUserIds.length} valid users.`);

        // Delete enrollments
        if (EnrollmentModel) {
            const result = await EnrollmentModel.deleteMany({ userId: { $nin: validUserIds } });
            console.log(`Deleted ${result.deletedCount} orphaned enrollments.`);
        }

        // Delete memberships
        if (MembershipModel) {
            const result = await MembershipModel.deleteMany({ userId: { $nin: validUserIds } });
            console.log(`Deleted ${result.deletedCount} orphaned memberships.`);
        }

        // Delete messages (where sender or recipient is missing)
        if (MessageModel) {
            const result = await MessageModel.deleteMany({
                $or: [
                    { senderId: { $nin: validUserIds } },
                    { recipientId: { $nin: validUserIds } }
                ]
            });
            console.log(`Deleted ${result.deletedCount} orphaned messages.`);
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
