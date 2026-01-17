import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateStaffModel from '@/server/db/models/staff.model';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const staff = await CorporateStaffModel.findOne({ userId: id })
      .populate('userId', 'email firstName lastName role profileImage')
      .populate('corporateId', '_id name');

    if (!staff) {
      return NextResponse.json({ success: false, error: 'Staff record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
