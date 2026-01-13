import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import EventModel from '@/server/db/models/event.model';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session || session.user?.role !== 'CORPORATE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch available courses/events
    const events = await EventModel.find({ status: 'active' })
      .select('_id title description category')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
