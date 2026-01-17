import { NextResponse } from 'next/server';
import { createUserSchema } from '@/shared/validators/user.validator';
import * as userService from '@/server/users/service';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import IndividualProfileModel from '@/server/db/models/individualProfile.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName = '', lastName = '', ...rest } = body;
    const parsed = createUserSchema.parse(rest);
    const user = await userService.createUser({ 
      email: parsed.email, 
      password: parsed.password, 
      phone: parsed.phone, 
      role: parsed.role as any,
      firstName,
      lastName
    });
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    // Require admin role to list users
    const session: any = await getServerAuthSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    await connectToDatabase();

    // Build query - exclude ADMIN and SUB_ADMIN, include all messaging users
    const query: any = {
      role: { $in: ['INDIVIDUAL', 'CORPORATE', 'STAFF'] }  // Fetch individual, corporate, and staff users
    };
    if (role && ['INDIVIDUAL', 'CORPORATE', 'STAFF'].includes(role)) query.role = role;
    if (status) query.status = status;

    // Fetch users
    const users = await UserModel.find(query)
      .maxTimeMS(30000)
      .lean()
      .limit(limit)
      .sort({ createdAt: -1 });

    // Enrich users with profile data
    const enrichedUsers = await Promise.all(
      users.map(async (user: any) => {
        let profile: any = null;

        if (user.role === 'INDIVIDUAL') {
          profile = await IndividualProfileModel.findOne({ userId: user._id }).lean();
        } else if (user.role === 'CORPORATE') {
          profile = await CorporateProfileModel.findOne({ ownerId: user._id }).lean();
        }
        // STAFF users don't need profile lookup - use firstName/lastName from user model

        // Normalize status: convert old values to new ones
        let normalizedStatus = user.status;
        if (user.status === 'active' || user.status === 'inactive' || user.status === 'suspended') {
          normalizedStatus = 'not-subscribed';
        }

        return {
          _id: user._id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: normalizedStatus,
          createdAt: user.createdAt,
          firstName: user.firstName || profile?.firstName || profile?.companyName || '-',
          lastName: user.lastName || profile?.lastName || '-',
          profileImage: user.profileImage,
        };
      })
    );

    return NextResponse.json({ success: true, users: enrichedUsers });
  } catch (err: any) {
    console.error('Error fetching users:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch users' }, { status: 500 });
  }
}
