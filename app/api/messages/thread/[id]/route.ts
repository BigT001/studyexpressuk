import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { messageService } from '@/server/messages/service';
import MessageModel from '@/server/db/models/message.model';

// Fetch all messages between two users (works for both admin and non-admin users)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await params;
    const currentUserId = session.user.id ?? '';
    const otherUserId = id ?? '';
    
    // Fetch all messages between the two users
    const messages = await messageService.getConversation(currentUserId, otherUserId);
    
    // Mark messages as read for this conversation
    await MessageModel.updateMany(
      {
        senderId: otherUserId,
        recipientId: currentUserId,
        readAt: null
      },
      { readAt: new Date() }
    );
    
    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/messages/thread/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// Send a message to a specific user (works for any authenticated user)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    const { id } = await params;
    const { content } = await req.json();
    const senderId = session.user.id ?? '';
    const recipientId = id ?? '';
    
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    const message = await MessageModel.create({
      senderId,
      recipientId,
      content: content.trim(),
    });

    const populatedMessage = await message.populate([
      { path: 'senderId', select: 'firstName lastName email role profileImage' },
      { path: 'recipientId', select: 'firstName lastName email role profileImage' }
    ]);

    return NextResponse.json(
      { success: true, message: populatedMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/messages/thread/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
