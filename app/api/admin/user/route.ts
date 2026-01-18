import { NextResponse } from 'next/server';
import UserModel from '@/server/db/models/user.model';

/**
 * GET /api/admin/user
 * Fetches the system admin user
 */
export async function GET() {
  try {
    const admin = await UserModel.findOne({ role: 'ADMIN' }).select(
      'email firstName lastName profileImage role'
    );

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: admin._id.toString(),
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          profileImage: admin.profileImage,
          role: admin.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin user' },
      { status: 500 }
    );
  }
}
