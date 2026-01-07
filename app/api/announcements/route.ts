import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { announcementService } from '@/server/announcements/service';

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const announcement = await announcementService.createAnnouncement({
      ...body,
      createdBy: session.user.email,
    });

    return NextResponse.json(
      { success: true, announcement },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const announcements = await announcementService.listAnnouncements();
    return NextResponse.json(
      { success: true, announcements },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}
