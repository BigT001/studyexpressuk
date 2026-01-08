import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { messageService } from '@/server/messages/service';

// Fetch all messages between admin and a specific user
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await params;
    // The admin's user id (sender or receiver)
    const adminId = session.user.id ?? '';
    // Ensure id is always a string
    const userId = id ?? '';
    // Fetch all messages where (sender=admin and receiver=id) or (sender=id and receiver=admin)
    const messages = await messageService.getConversation(adminId, userId);
    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/messages/thread/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}
