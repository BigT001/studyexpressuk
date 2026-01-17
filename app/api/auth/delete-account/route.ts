import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';

export async function DELETE(req: Request) {
  try {
    // Get authenticated session
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { password, _userType = 'individual' } = await req.json();

    // Note: userType can be used for future user-type-specific deletions
    // (individual, corporate, subadmin)

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user
    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Delete the user account
    await UserModel.findByIdAndDelete(session.user.id);

    // TODO: Delete related data based on userType
    // For 'individual': delete enrollments, messages, announcements, etc.
    // For 'corporate': delete staff, courses, company data, etc.
    // For 'subadmin': delete assigned data, permissions, etc.

    return NextResponse.json(
      {
        success: true,
        message: 'Account deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
