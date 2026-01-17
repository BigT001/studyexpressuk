import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import { Announcement } from '@/server/db/models/announcement.model';

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id || session.user.role !== 'SUBADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const { announcementId } = body;

    if (!announcementId) {
      return NextResponse.json(
        { success: false, error: 'Announcement ID required' },
        { status: 400 }
      );
    }

    // Mark announcement as read by this user
    // $addToSet adds user ID to readBy array only if not already present
    await Announcement.findByIdAndUpdate(
      announcementId,
      {
        $addToSet: { readBy: session.user.id },
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
