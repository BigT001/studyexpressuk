import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import MessageModel from '@/server/db/models/message.model';

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Mark ALL unread messages as read at once
    const result = await MessageModel.updateMany(
      {
        recipientId: userId,
        readAt: null
      },
      { readAt: new Date() },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount || 0
    });
  } catch (error) {
    console.error('Error marking all messages as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
