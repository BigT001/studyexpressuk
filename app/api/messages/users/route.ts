import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import UserModel from '@/server/db/models/user.model';

/**
 * GET /api/messages/users
 * Fetch users for messaging
 * Query params:
 *   - role: Filter by user role (INDIVIDUAL, CORPORATE, STAFF, ADMIN)
 */
export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get role filter from query params
    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get('role');

    // Build query - exclude current user
    const query: any = { _id: { $ne: session.user.id } };

    if (roleFilter) {
      // If specific role requested, fetch that role
      query.role = roleFilter;
    } else if (session.user.role === 'ADMIN') {
      // Admin fetches INDIVIDUAL, CORPORATE, and STAFF (exclude ADMIN and SUB_ADMIN)
      query.role = { $in: ['INDIVIDUAL', 'CORPORATE', 'STAFF'] };
    } else {
      // Non-admin users fetch only ADMIN users
      query.role = 'ADMIN';
    }

    const rawUsers = await UserModel.find(
      query,
      'firstName lastName email role profileImage createdAt'
    ).sort({ createdAt: -1 });

    // Format users response
    const users = rawUsers.map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    }));

    return NextResponse.json(
      { success: true, users },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
