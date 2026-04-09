import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import UserModel from '@/server/db/models/user.model';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id }).lean();
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    const user = await UserModel.findById(session.user.id).lean();

    return NextResponse.json({
      success: true,
      accessControl: corporate.metadata?.accessControl || {
        viewFinancials: true,
        managePeople: true,
        approveEnrollment: true,
        viewReports: true,
        editCourses: false,
        accessAnalytics: true,
        managePayments: true,
        viewAuditLogs: false,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      twoFactorEnabled: (user as any).twoFactorEnabled || false,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { accessControl, twoFactorEnabled } = body;

    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    if (accessControl !== undefined) {
      corporate.metadata = {
        ...corporate.metadata,
        accessControl,
      };
      await corporate.save();
    }

    if (twoFactorEnabled !== undefined) {
      await UserModel.findByIdAndUpdate(session.user.id, {
        twoFactorEnabled,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
