// @ts-nocheck
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local'), override: true });

async function run() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  
  const MessageModel = (await import('./src/server/db/models/message.model')).default;
  const unreadMsgNull = await MessageModel.countDocuments({ readAt: null });
  const unreadMsgExists = await MessageModel.countDocuments({ readAt: { $exists: false } });
  
  const totalMsgs = await MessageModel.countDocuments();
  console.log({ totalMsgs, unreadMsgNull, unreadMsgExists });
  
  const EnrollmentModel = (await import('./src/server/db/models/enrollment.model')).default;
  const statuses = await EnrollmentModel.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  console.log('Enrollments:', statuses);
  
  process.exit(0);
}
run();
