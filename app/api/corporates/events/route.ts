import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import EventModel from '@/server/db/models/event.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();

    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const corporate = await CorporateProfileModel.findOne({ ownerId: session.user?.id }).lean();

    if (!corporate) {
      return NextResponse.json(
        { success: false, error: 'Corporate profile not found' },
        { status: 404 }
      );
    }

    // Get registered events for this corporate
    const registeredEventIds = corporate.registeredEvents || [];

    if (registeredEventIds.length === 0) {
      return NextResponse.json(
        { success: true, events: [] },
        { status: 200 }
      );
    }

    // Fetch events with instructor details populated
    const events = await EventModel.find({
      _id: { $in: registeredEventIds },
    })
      .populate('instructor', 'fullName firstName lastName email')
      .lean();

    return NextResponse.json(
      { success: true, events },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching corporate events:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
