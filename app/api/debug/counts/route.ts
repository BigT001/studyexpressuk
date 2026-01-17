import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db/mongoose';
import MessageModel from '@/server/db/models/message.model';
import { Announcement } from '@/server/db/models/announcement.model';
import UserModel from '@/server/db/models/user.model';

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Get all messages
    const messages = await MessageModel.find({}).lean();
    console.log('Total messages in DB:', messages.length);

    // Get all announcements
    const announcements = await Announcement.find({}).lean();
    console.log('Total announcements in DB:', announcements.length);

    // Get all users
    const users = await UserModel.find({}).select('email role firstName lastName').lean();
    console.log('Total users:', users.length);

    // Get individual users
    const individuals = await UserModel.find({ role: 'INDIVIDUAL' }).select('email firstName lastName').lean();
    console.log('Individual users:', individuals.length);

    // For each individual user, count unread messages
    const messageStats = [];
    for (const user of individuals.slice(0, 3)) {
      const unreadCount = await MessageModel.countDocuments({
        recipientId: user._id,
        readAt: null
      });
      messageStats.push({
        email: user.email,
        firstName: user.firstName,
        unreadMessages: unreadCount
      });
    }

    // For each individual user, count unread announcements
    const announcementStats = [];
    for (const user of individuals.slice(0, 3)) {
      const unreadCount = await Announcement.countDocuments({
        isActive: true,
        readBy: { $ne: user._id }
      });
      announcementStats.push({
        email: user.email,
        firstName: user.firstName,
        unreadAnnouncements: unreadCount
      });
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalMessages: messages.length,
        totalAnnouncements: announcements.length,
        totalUsers: users.length,
        individualUsers: individuals.length,
      },
      messageStats,
      announcementStats,
      sampleMessages: messages.slice(0, 3),
      sampleAnnouncements: announcements.slice(0, 3),
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
