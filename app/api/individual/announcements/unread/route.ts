import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import { getUnreadAnnouncementCount } from '@/server/utils/communication';

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

    // Count unread announcements for individual (students)
    const unreadCount = await getUnreadAnnouncementCount(user._id, 'INDIVIDUAL');

    return NextResponse.json({
      success: true,
      count: unreadCount || 0,
    });
  } catch (error) {
    console.error('Error counting unread announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to count unread announcements' },
      { status: 500 }
    );
  }
}
