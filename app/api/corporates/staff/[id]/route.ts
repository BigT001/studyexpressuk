import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateStaffModel from '@/server/db/models/staff.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('[STAFF-DETAIL] Incoming request for staff ID:', id);

    const session = await getServerAuthSession();
    if (!session || session.user?.role !== 'CORPORATE') {
      console.log('[STAFF-DETAIL] Unauthorized');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    console.log('[STAFF-DETAIL] Database connected');

    // Get corporate profile
    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      console.log('[STAFF-DETAIL] Corporate not found for user:', session.user.id);
      return NextResponse.json({ success: false, error: 'Corporate profile not found' }, { status: 404 });
    }

    console.log('[STAFF-DETAIL] Found corporate:', corporate._id);

    // Convert id to ObjectId safely
    let staffObjectId;
    try {
      staffObjectId = new mongoose.Types.ObjectId(id);
    } catch (e) {
      console.log('[STAFF-DETAIL] Invalid ObjectId format:', id);
      return NextResponse.json({ success: false, error: 'Invalid staff ID format' }, { status: 400 });
    }

    // Find staff by ID
    const staff = await CorporateStaffModel.findById(staffObjectId).populate(
      'userId',
      'email firstName lastName phone dob bio interests qualifications profileImage'
    );

    console.log('[STAFF-DETAIL] Query result:', { found: !!staff, staffId: staff?._id });

    if (!staff) {
      console.log('[STAFF-DETAIL] Staff not found with ID:', staffObjectId.toString());
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }

    console.log('[STAFF-DETAIL] Returning staff:', staff._id);

    return NextResponse.json({
      success: true,
      staff: staff.toObject(),
    });
  } catch (error) {
    console.error('[STAFF-DETAIL] Exception:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
