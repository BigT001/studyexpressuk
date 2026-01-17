import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
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
