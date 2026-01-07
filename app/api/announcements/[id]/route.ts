import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { announcementService } from '@/server/announcements/service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const announcement = await announcementService.getAnnouncementById(id);
    return NextResponse.json(
      { success: true, announcement },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/announcements/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Announcement not found' },
      { status: 404 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const announcement = await announcementService.updateAnnouncement(id, body);

    return NextResponse.json(
      { success: true, announcement },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PATCH /api/announcements/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update announcement' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    await announcementService.deleteAnnouncement(id);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/announcements/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}
