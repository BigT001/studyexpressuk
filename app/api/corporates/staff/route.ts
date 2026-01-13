import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateStaffModel from '@/server/db/models/staff.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import UserModel from '@/server/db/models/user.model';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Find corporate profile for this user
    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { email, firstName, lastName, role, department, password } = body;

    if (!email || !firstName || !lastName || !role || !password) {
      return NextResponse.json({ error: 'Email, first name, last name, role, and password are required' }, { status: 400 });
    }

    // Check if user with this email already exists
    let user = await UserModel.findOne({ email });
    
    if (user) {
      return NextResponse.json(
        { error: 'User with this email already exists. Use a different email.' },
        { status: 400 }
      );
    }

    // Check if staff member already exists for this corporate
    const existingStaff = await CorporateStaffModel.findOne({
      corporateId: corporate._id,
      userId: { $exists: true }
    }).populate('userId');
    
    if (existingStaff && (existingStaff.userId as any).email === email) {
      return NextResponse.json({ error: 'This staff member is already added' }, { status: 400 });
    }

    // Hash the password
    const passwordHash = await hash(password, 10);

    // Create new user account for the staff member
    const newUser = await UserModel.create({
      email,
      password: password, // keep plain for reference but also hash
      passwordHash,
      role: 'STAFF',
      firstName,
      lastName,
      status: 'subscribed',
    });

    // Create new staff member
    const newStaff = await CorporateStaffModel.create({
      userId: newUser._id,
      corporateId: corporate._id,
      role,
      department: department || '',
      joinDate: new Date(),
      status: 'active',
      approvalStatus: 'approved',
      approvedBy: session.user.id,
      approvalDate: new Date(),
    });

    // Populate user details
    await newStaff.populate('userId');

    return NextResponse.json({ 
      success: true, 
      staff: newStaff,
      credentials: {
        email: newUser.email,
        password: password, // Return plain password so company can send to staff
        message: 'Share these credentials with the staff member. They can log in and change their password later.'
      }
    });
  } catch (error) {
    console.error('Error adding staff:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Find corporate profile
    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    // Get all staff members for this corporate
    const staff = await CorporateStaffModel.find({ corporateId: corporate._id })
      .populate('userId', 'email firstName lastName')
      .sort({ createdAt: -1 });

    console.log('[STAFF-LIST-API] Found staff:', staff.map(s => ({ _id: s._id.toString(), email: (s.userId as any).email })));

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
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
    const { staffId, role, department, status } = body;

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    // Verify staff belongs to this corporate
    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    const staff = await CorporateStaffModel.findOne({
      _id: staffId,
      corporateId: corporate._id,
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Update fields
    if (role) staff.role = role;
    if (department) staff.department = department;
    if (status) staff.status = status;

    await staff.save();
    await staff.populate('userId', 'email');

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('id');

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    // Verify staff belongs to this corporate
    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    const staff = await CorporateStaffModel.findOne({
      _id: staffId,
      corporateId: corporate._id,
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    await CorporateStaffModel.deleteOne({ _id: staffId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
