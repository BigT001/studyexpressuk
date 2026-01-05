import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';

export async function GET(req: Request) {
  try {
    // Require admin role to list corporate accounts
    const session = await getServerAuthSession() as { user: { role: string } } | null;
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    await connectToDatabase();

    // Fetch all users with role CORPORATE
    const corporateUsers = await UserModel.find({ role: 'CORPORATE' })
      .maxTimeMS(30000)
      .lean()
      .limit(limit)
      .sort({ createdAt: -1 });

    // Enrich with corporate profile data if exists
    const formattedCorporates = await Promise.all(
      corporateUsers.map(async (user: Record<string, unknown>) => {
        let profile: Record<string, unknown> | null = null;

        try {
          profile = await CorporateProfileModel.findOne({ ownerId: user._id }).lean();
        } catch {
          // Profile doesn't exist yet
        }

        // Map status to subscription status
        let subscriptionStatus = 'not-subscribed';
        if (profile?.status === 'active' || profile?.status === 'verified') {
          subscriptionStatus = 'subscribed';
        }

        return {
          _id: profile?._id || user._id,
          ownerId: user._id,
          companyName: profile?.companyName || '-',
          registrationNumber: profile?.registrationNumber || '-',
          industry: profile?.industry || '-',
          website: profile?.website || '-',
          email: user.email,
          phone: user.phone || '-',
          status: subscriptionStatus,
          verificationStatus: profile?.status || 'pending',
          staffCount: profile?.employeeCount || 0,
          createdAt: profile?.createdAt || user.createdAt,
        };
      })
    );

    return NextResponse.json({ success: true, corporates: formattedCorporates });
  } catch (err: unknown) {
    console.error('Error fetching corporate accounts:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch corporate accounts' },
      { status: 500 }
    );
  }
}
