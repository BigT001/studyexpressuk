
import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { messageService } from '@/server/messages/service';
import MessageModel from '@/server/db/models/message.model';

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUB_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    // For direct chat: create a MessageModel (not GroupMessage)
    const { receiverId, content } = body;
    if (!receiverId || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing receiverId or content' },
        { status: 400 }
      );
    }
    const message = await MessageModel.create({
      senderId: session.user.id,
      recipientId: receiverId,
      content,
    });
    return NextResponse.json(
      { success: true, message },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    // Only fetch messages for the logged-in user
    const messages = await MessageModel.find({ recipientId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, messages },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
