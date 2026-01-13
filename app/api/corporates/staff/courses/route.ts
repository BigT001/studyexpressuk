import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateStaffModel from '@/server/db/models/staff.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import EventModel from '@/server/db/models/event.model';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { staffId, eventId } = body;

    if (!staffId || !eventId) {
      return NextResponse.json({ error: 'Staff ID and Event ID are required' }, { status: 400 });
    }

    // Verify staff belongs to this corporate
    const staff = await CorporateStaffModel.findOne({
      _id: staffId,
      corporateId: corporate._id,
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Verify event exists
    const event = await EventModel.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event/Course not found' }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await EnrollmentModel.findOne({
      userId: staff.userId,
      eventId: eventId,
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Staff member is already enrolled in this course/event' }, { status: 400 });
    }

    // Create enrollment
    const enrollment = await EnrollmentModel.create({
      userId: staff.userId,
      eventId: eventId,
      status: 'enrolled',
      progress: 0,
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error('Error assigning course:', error);
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

    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user.id });
    if (!corporate) {
      return NextResponse.json({ error: 'Corporate profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    // If staffId is provided, fetch enrollments for that specific staff member
    if (staffId) {
      // Get staff member
      const staff = await CorporateStaffModel.findOne({
        _id: staffId,
        corporateId: corporate._id,
      });

      if (!staff) {
        return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
      }

      // Get all enrollments for this staff member
      const enrollments = await EnrollmentModel.find({ userId: staff.userId })
        .populate('eventId')
        .sort({ createdAt: -1 });

      return NextResponse.json({ success: true, enrollments });
    }

    // If no staffId provided, fetch all enrollments for all staff in this corporate
    const staffMembers = await CorporateStaffModel.find({ corporateId: corporate._id });
    const staffUserIds = staffMembers.map(s => s.userId);

    const enrollments = await EnrollmentModel.find({ userId: { $in: staffUserIds } })
      .populate('eventId')
      .populate({
        path: 'userId',
        select: 'firstName lastName email',
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, enrollments });
  } catch (error) {
    console.error('Error fetching staff enrollments:', error);
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
    const { enrollmentId, progress, status } = body;

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Enrollment ID is required' }, { status: 400 });
    }

    // Update enrollment
    const enrollment = await EnrollmentModel.findByIdAndUpdate(
      enrollmentId,
      {
        ...(progress !== undefined && { progress }),
        ...(status && { status }),
        ...(status === 'completed' && { completionDate: new Date() }),
      },
      { new: true }
    ).populate('eventId');

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error('Error updating enrollment:', error);
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
    const enrollmentId = searchParams.get('id');

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Enrollment ID is required' }, { status: 400 });
    }

    await EnrollmentModel.deleteOne({ _id: enrollmentId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing enrollment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
