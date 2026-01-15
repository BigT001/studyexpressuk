import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import mongoose from 'mongoose';

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, notification });
  } catch (error: any) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const notification = await NotificationModel.findByIdAndDelete(id);

    if (!notification) {
      return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
