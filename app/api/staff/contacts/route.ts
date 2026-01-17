import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateStaffModel from '@/server/db/models/staff.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import UserModel from '@/server/db/models/user.model';

export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerAuthSession();
    
    if (!session || session.user?.role !== 'STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Get staff record to find corporate
    const staff = await CorporateStaffModel.findOne({ userId: session.user.id });
    if (!staff) {
      return NextResponse.json({ error: 'Staff record not found' }, { status: 404 });
    }

    // Find corporate owner (admin of the company)
    const corporate = await CorporateProfileModel.findById(staff.corporateId);
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate not found' }, { status: 404 });
    }

    // Get corporate owner user
    const corporateOwner = await UserModel.findById(corporate.ownerId);

    // Get all staff members in the same corporate
    const otherStaff = await CorporateStaffModel.find({
      corporateId: staff.corporateId,
      userId: { $ne: session.user.id }
    }).populate('userId', 'email firstName lastName profileImage role');

    // Get system admin
    const systemAdmin = await UserModel.findOne({ role: 'ADMIN' });

    // Build contacts array
    const contacts = [];

    // Add system admin
    if (systemAdmin) {
      contacts.push({
        _id: systemAdmin._id,
        email: systemAdmin.email,
        firstName: systemAdmin.firstName,
        lastName: systemAdmin.lastName,
        role: 'ADMIN',
        profileImage: systemAdmin.profileImage,
        isAdmin: true,
        isCorporateAdmin: false,
      });
    }

    // Add corporate owner (if different from staff)
    if (corporateOwner && corporateOwner._id.toString() !== session.user.id) {
      contacts.push({
        _id: corporateOwner._id,
        email: corporateOwner.email,
        firstName: corporateOwner.firstName,
        lastName: corporateOwner.lastName,
        role: 'CORPORATE',
        profileImage: corporateOwner.profileImage,
        isAdmin: false,
        isCorporateAdmin: true,
      });
    }

    // Add other staff members
    for (const staffMember of otherStaff) {
      const user = staffMember.userId as any;
      contacts.push({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
        isAdmin: false,
        isCorporateAdmin: false,
      });
    }

    return NextResponse.json({ success: true, users: contacts });
  } catch (error) {
    console.error('Error fetching staff contacts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
