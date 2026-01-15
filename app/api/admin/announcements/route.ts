import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import mongoose from 'mongoose';

// Announcement Schema
const announcementSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    type: { type: String, enum: ['info', 'warning', 'success', 'urgent'] },
    targetAudience: { type: String, enum: ['all', 'individual', 'corporate', 'subadmin'] },
    createdBy: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { collection: 'announcements' }
);

const AnnouncementModel = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

// Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    type: { type: String, enum: ['announcement', 'message', 'email'] },
    title: String,
    content: String,
    sender: String,
    priority: { type: String, enum: ['normal', 'urgent'], default: 'normal' },
    status: { type: String, enum: ['read', 'unread'], default: 'unread' },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'notifications' }
);

const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export async function POST(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { title, content, type, targetAudience } = body;

    if (!title || !content || !type || !targetAudience) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const announcement = await AnnouncementModel.create({
      title,
      content,
      type,
      targetAudience,
      createdBy: session.user.id,
      createdAt: new Date(),
      isActive: true,
    });

    // Create notifications for target audience
    const roleMap: any = {
      'all': null,
      'individual': 'INDIVIDUAL',
      'corporate': 'CORPORATE',
      'subadmin': 'SUB_ADMIN',
    };

    let query: any = {};
    if (roleMap[targetAudience]) {
      query.role = roleMap[targetAudience];
    }

    const recipients = await UserModel.find(query);

    // Create notification for each recipient
    const priority = type === 'urgent' ? 'urgent' : 'normal';
    const notificationPromises = recipients.map((recipient: any) =>
      NotificationModel.create({
        userId: recipient._id,
        type: 'announcement',
        title,
        content,
        sender: 'StudyExpress Team',
        priority,
        status: 'unread',
        createdAt: new Date(),
      })
    );

    await Promise.all(notificationPromises);

    return NextResponse.json({ 
      success: true, 
      announcement,
      notificationsSent: recipients.length,
    });
  } catch (error: any) {
    console.error('Announcement error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const announcements = await AnnouncementModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
