import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel, { UserRole } from '@/server/db/models/user.model';
import SubAdminModel, { SubAdminPermissionLevel } from '@/server/db/models/subadmin.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { firstName, lastName, email, password, permissionLevel } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !password || !permissionLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 10);

    // Create user
    const user = await UserModel.create({
      email: email.toLowerCase(),
      passwordHash,
      role: UserRole.SUB_ADMIN,
      status: 'active',
    });

    // Set permissions based on permission level
    const permissionsMap = {
      [SubAdminPermissionLevel.FULL_ADMIN]: {
        manageEvents: true,
        manageCourses: true,
        manageContent: true,
        manageUsers: true,
        manageMemberships: true,
        viewAnalytics: true,
        managePayments: true,
      },
      [SubAdminPermissionLevel.CONTENT_ADMIN]: {
        manageEvents: true,
        manageCourses: true,
        manageContent: true,
        manageUsers: false,
        manageMemberships: false,
        viewAnalytics: true,
        managePayments: false,
      },
      [SubAdminPermissionLevel.USER_ADMIN]: {
        manageEvents: false,
        manageCourses: false,
        manageContent: false,
        manageUsers: true,
        manageMemberships: true,
        viewAnalytics: true,
        managePayments: false,
      },
    };

    // Create sub-admin profile
    const subAdmin = await SubAdminModel.create({
      userId: user._id,
      firstName,
      lastName,
      email: email.toLowerCase(),
      permissionLevel,
      permissions: permissionsMap[permissionLevel as SubAdminPermissionLevel],
      isActive: true,
    });

    return NextResponse.json(
      {
        message: 'Sub-admin created successfully',
        subAdmin: {
          id: subAdmin._id.toString(),
          firstName: subAdmin.firstName,
          lastName: subAdmin.lastName,
          email: subAdmin.email,
          permissionLevel: subAdmin.permissionLevel,
          isActive: subAdmin.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating sub-admin:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create sub-admin: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const subAdmins = await SubAdminModel.find({ isActive: true }).select(
      '_id firstName lastName email permissionLevel isActive createdAt'
    );

    // Transform the response to include id as a string
    const formattedSubAdmins = subAdmins.map((admin: any) => ({
      id: admin._id.toString(),
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      permissionLevel: admin.permissionLevel,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    }));

    return NextResponse.json({ subAdmins: formattedSubAdmins }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sub-admins:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch sub-admins: ${errorMessage}` },
      { status: 500 }
    );
  }
}
