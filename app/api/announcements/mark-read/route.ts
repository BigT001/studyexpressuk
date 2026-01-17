import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import { Announcement } from '@/server/db/models/announcement.model';

export async function POST(req: Request) {
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

    const body = await req.json();
    const { announcementId } = body;

    if (!announcementId) {
      return NextResponse.json({ success: false, error: 'Announcement ID required' }, { status: 400 });
    }

    // Mark announcement as read by this user
    await Announcement.findByIdAndUpdate(
      announcementId,
      {
        $addToSet: { readBy: user._id }, // Add user to readBy array if not already there
      },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking announcement as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark announcement as read' },
      { status: 500 }
    );
  }
}
