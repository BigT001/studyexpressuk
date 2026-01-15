import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { announcementService } from '@/server/announcements/service';

export async function POST(req: Request) {
  try {
    console.log('🔵 [POST /api/announcements] Request received');
    const session = await getServerAuthSession();
    console.log('🔵 Session:', session?.user?.email, '| Role:', session?.user?.role);
    
    if (!session || session.user?.role !== 'ADMIN') {
      console.log('❌ Unauthorized: Not admin');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log('🔵 Request body:', JSON.stringify(body));
    
    const announcement = await announcementService.createAnnouncement({
      ...body,
      createdBy: session.user.email,
    });

    console.log('🟢 Announcement created successfully:', announcement._id);
    return NextResponse.json(
      { success: true, announcement },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ [POST /api/announcements] Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement', details: error.message },
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
