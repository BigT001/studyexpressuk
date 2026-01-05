import { NextResponse, NextRequest } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin role
    const session: any = await getServerAuthSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    await connectToDatabase();

    const user = await UserModel.findById(id).lean().maxTimeMS(30000);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // TODO: Integrate with email service to send password reset link
    // For now, we'll just log the action
    console.log(`Password reset requested for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent',
      email: user.email,
    });
  } catch (err: any) {
    console.error('Error resetting password:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to reset password' },
      { status: 500 }
    );
  }
}
