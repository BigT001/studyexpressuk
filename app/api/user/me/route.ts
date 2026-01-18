import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { updateUserActivity } from '@/server/utils/login-tracker';

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Track user activity (non-blocking)
    try {
      updateUserActivity((session.user as any).id, false).catch(() => {
        // Silently fail
      });
    } catch (err) {
      console.error('[ActivityTracking] Error:', err);
    }

    return NextResponse.json(
      { success: true, user: session.user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
