import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import MessageModel from '@/server/db/models/message.model';

export async function GET(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Count unread messages for this user (where readAt is null/not set)
    const unreadCount = await MessageModel.countDocuments({
      recipientId: user._id,
      readAt: null,
    });

    return NextResponse.json({
      success: true,
      count: unreadCount || 0,
    });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch unread messages' },
      { status: 500 }
    );
  }
}
