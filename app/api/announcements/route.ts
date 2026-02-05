import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { announcementService } from '@/server/announcements/service';

export async function POST(req: Request) {
  try {
    console.log('🔵 [POST /api/announcements] Request received');
    const session = await getServerAuthSession();
    console.log('🔵 Session:', session?.user?.email, '| Role:', session?.user?.role);

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUB_ADMIN')) {
      console.log('❌ Unauthorized: Not admin/subadmin');
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
    let activeAnnouncements = announcements.filter((a: any) => a.isActive === true);

    let unreadCount = 0;
    let readAnnouncementIds: string[] = [];
    let user: any = null;

    if (session?.user?.email) {
      const { connectToDatabase } = await import('@/server/db/mongoose');
      const UserModel = (await import('@/server/db/models/user.model')).default;
      const { Announcement } = await import('@/server/db/models/announcement.model');

      await connectToDatabase();
      user = await UserModel.findOne({ email: session.user.email });

      if (user) {
        // Filter announcements based on user role and creation date
        if (user.role !== 'ADMIN' && user.role !== 'SUB_ADMIN') {
          const userJoinDate = new Date(user.createdAt);
          // Allow a small buffer (e.g. 1 minute) just in case of slight clock diffs if created immediately
          userJoinDate.setMinutes(userJoinDate.getMinutes() - 1);

          activeAnnouncements = activeAnnouncements.filter((a: any) => {
            return new Date(a.createdAt) >= userJoinDate;
          });
        }

        // Calculate unread count from the filtered list (most accurate/consistent)
        unreadCount = activeAnnouncements.filter((a: any) =>
          !a.readBy?.some((id: any) => id.toString() === user._id.toString())
        ).length;

        // Get read announcement IDs (intersect with filtered list if needed, or just all read)
        // Generally we just want to know which IDs the user has read.
        const readAnnouncements = await Announcement.find({
          isActive: true,
          readBy: user._id
        }).select('_id');
        readAnnouncementIds = readAnnouncements.map((a: any) => a._id.toString());
      }
    }

    if (countOnly) {
      return NextResponse.json(
        { success: true, count: unreadCount },
        { status: 200 }
      );
    }

    // Serialize readBy arrays to strings for easier client-side comparison
    // MUST be done AFTER filtering activeAnnouncements
    const serializedAnnouncements = activeAnnouncements.map((a: any) => ({
      ...a.toObject?.() || a,
      readBy: (a.readBy || []).map((id: any) => id.toString())
    }));

    return NextResponse.json(
      { success: true, announcements: serializedAnnouncements, count: serializedAnnouncements.length, unreadCount, readAnnouncementIds },
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
