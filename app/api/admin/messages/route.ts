import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import mongoose from 'mongoose';

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    subject: String,
    body: String,
    senderName: String,
    senderId: mongoose.Schema.Types.ObjectId,
    recipientGroups: [String],
    status: { type: String, enum: ['draft', 'scheduled', 'sent', 'failed'], default: 'sent' },
    sentAt: { type: Date, default: Date.now },
    readBy: [mongoose.Schema.Types.ObjectId],
  },
  { collection: 'messages' }
);

const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema);

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
    const { subject, body: messageBody, senderName, recipientGroups } = body;

    if (!subject || !messageBody || !senderName || !recipientGroups || recipientGroups.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const message = await MessageModel.create({
      subject,
      body: messageBody,
      senderName,
      senderId: session.user.id,
      recipientGroups,
      status: 'sent',
      sentAt: new Date(),
      readBy: [],
    });

    // Create notifications for all recipient groups
    const roleMap: any = {
      'individual': 'INDIVIDUAL',
      'corporate': 'CORPORATE',
      'subadmin': 'SUB_ADMIN',
      'all': null,
    };

    let query: any = {};
    const roles: string[] = [];

    if (recipientGroups.includes('all')) {
      // Send to everyone
      query = {};
    } else {
      recipientGroups.forEach((group: string) => {
        if (roleMap[group]) {
          roles.push(roleMap[group]);
        }
      });
      if (roles.length > 0) {
        query.role = { $in: roles };
      }
    }

    const recipients = await UserModel.find(query);

    // Create notification for each recipient
    const notificationPromises = recipients.map((recipient: any) =>
      NotificationModel.create({
        userId: recipient._id,
        type: 'message',
        title: subject,
        content: messageBody,
        sender: senderName,
        priority: 'normal',
        status: 'unread',
        createdAt: new Date(),
      })
    );

    await Promise.all(notificationPromises);

    return NextResponse.json({ 
      success: true, 
      message,
      notificationsSent: recipients.length,
    });
  } catch (error: any) {
    console.error('Message error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const messages = await MessageModel.find()
      .sort({ sentAt: -1 })
      .lean();

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
