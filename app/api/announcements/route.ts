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
    const url = new URL(req.url);
    const countOnly = url.searchParams.get('countOnly') === 'true';

    const session = await getServerAuthSession();
    
    const announcements = await announcementService.listAnnouncements();
    
    // Filter by isActive status
    const activeAnnouncements = announcements.filter((a: any) => a.isActive === true);

    // Count unread announcements for current user if user is logged in
    let unreadCount = 0;
    if (session?.user?.email) {
      const { connectToDatabase } = await import('@/server/db/mongoose');
      const UserModel = (await import('@/server/db/models/user.model')).default;
      const { Announcement } = await import('@/server/db/models/announcement.model');
      
      await connectToDatabase();
      const user = await UserModel.findOne({ email: session.user.email });
      
      if (user) {
        unreadCount = await Announcement.countDocuments({
          isActive: true,
          readBy: { $ne: user._id }
        });
      }
    }

    if (countOnly) {
      return NextResponse.json(
        { success: true, count: unreadCount },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, announcements: activeAnnouncements, count: activeAnnouncements.length, unreadCount },
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
