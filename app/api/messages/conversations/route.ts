import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import MessageModel from '@/server/db/models/message.model';
import UserModel from '@/server/db/models/user.model';

/**
 * GET /api/messages/conversations
 * Fetch all conversations for the admin (users they've messaged or received messages from)
 */
export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const adminId = session.user.id;

    // Get all unique users involved in conversations with this admin
    const messages = await MessageModel.find({
      $or: [
        { senderId: adminId },
        { recipientId: adminId }
      ]
    })
      .populate('senderId', 'firstName lastName email role profileImage')
      .populate('recipientId', 'firstName lastName email role profileImage')
      .sort({ createdAt: -1 });

    // Build unique conversation map
    const conversationMap = new Map();

    for (const message of messages) {
      const otherUser = message.senderId._id.toString() === adminId
        ? (message.recipientId as any)
        : (message.senderId as any);

      const userId = otherUser._id.toString();

      if (!conversationMap.has(userId)) {
        conversationMap.set(userId, {
          userId: otherUser._id,
          userName: `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || 'Unknown User',
          userEmail: otherUser.email,
          userRole: otherUser.role,
          userImage: otherUser.profileImage,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unreadCount: 0,
        });
      }
    }

    // Count unread messages for each conversation
    for (const [userId, conversation] of conversationMap) {
      const unreadCount = messages.filter(
        m =>
          m.recipientId._id.toString() === adminId &&
          m.senderId._id.toString() === userId &&
          !m.readAt
      ).length;
      conversation.unreadCount = unreadCount;
    }

    // Sort by last message time
    const conversations = Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    return NextResponse.json(
      { success: true, conversations },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
