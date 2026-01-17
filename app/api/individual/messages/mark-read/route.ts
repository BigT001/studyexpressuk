import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import MessageModel from '@/server/db/models/message.model';

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
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json({ success: false, error: 'Message ID required' }, { status: 400 });
    }

    // Mark message as read
    await MessageModel.findByIdAndUpdate(messageId, {
      readAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark message as read' },
      { status: 500 }
    );
  }
}
