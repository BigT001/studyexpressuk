import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { getUnreadMessageCount } from '@/server/utils/communication';

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id || session.user.role !== 'SUBADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const count = await getUnreadMessageCount(session.user.id);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching message count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch message count' },
      { status: 500 }
    );
  }
}
