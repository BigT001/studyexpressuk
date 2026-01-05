import { NextResponse, NextRequest } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateProfileModel from '@/server/db/models/corporate.model';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin role
    const session = await getServerAuthSession() as { user: { role: string } } | null;
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, verificationStatus } = body;

    await connectToDatabase();

    // Build update object
    const updateData: Record<string, string> = {};
    
    // Map subscription status to verification status
    if (status) {
      if (!['subscribed', 'not-subscribed'].includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status value' },
          { status: 400 }
        );
      }
      // Convert to model's status format
      updateData.status = status === 'subscribed' ? 'active' : 'pending';
    }

    // If explicit verification status provided, use it
    if (verificationStatus) {
      if (!['pending', 'verified', 'rejected'].includes(verificationStatus)) {
        return NextResponse.json(
          { success: false, error: 'Invalid verification status' },
          { status: 400 }
        );
      }
      const statusMap: Record<string, string> = {
        'verified': 'verified',
        'pending': 'pending',
        'rejected': 'suspended'
      };
      updateData.status = statusMap[verificationStatus];
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No update data provided' },
        { status: 400 }
      );
    }

    // Update corporate profile
    const corporate = await CorporateProfileModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean().maxTimeMS(30000);

    if (!corporate) {
      return NextResponse.json(
        { success: false, error: 'Corporate account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, corporate });
  } catch (err: unknown) {
    console.error('Error updating corporate:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update corporate' },
      { status: 500 }
    );
  }
}
