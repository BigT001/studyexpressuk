import { NextResponse, NextRequest } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin role
    const session = await getServerAuthSession() as { user: { role: string } } | null;
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !['subscribed', 'not-subscribed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await UserModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean().maxTimeMS(30000);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    console.error('Error updating user:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update user' },
      { status: 500 }
    );
  }
}
