import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import mongoose from 'mongoose';

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

export async function GET(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const notifications = await NotificationModel.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { action, notificationId } = await req.json();

    if (action === 'read-all') {
      // Mark all unread notifications as read
      await NotificationModel.updateMany(
        { userId: session.user.id, status: 'unread' },
        { status: 'read' }
      );
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (action === 'read' && notificationId) {
      // Mark individual notification as read
      await NotificationModel.findByIdAndUpdate(
        notificationId,
        { status: 'read' },
        { new: true }
      );
      return NextResponse.json({ success: true, message: 'Notification marked as read' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
