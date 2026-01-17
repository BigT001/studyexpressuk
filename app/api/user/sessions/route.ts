import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import { UAParser } from 'ua-parser-js';

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await UserModel.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get client info from request headers
    const userAgent = req.headers.get('user-agent') || '';
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    
    // Parse user agent
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    const browserName = result.browser.name || 'Unknown Browser';
    const osName = result.os.name || 'Unknown OS';
    const deviceType = result.device.type || 'desktop';
    
    const deviceIcon = deviceType === 'mobile' ? '📱' : 
                       deviceType === 'tablet' ? '📑' : '💻';

    const deviceName = `${osName} (${browserName})`;

    // Mock devices array with current device and a sample previous device
    const devices = [
      {
        id: 'current-' + Date.now(),
        name: deviceName,
        icon: deviceIcon,
        lastActive: new Date().toISOString(),
        ip: clientIP,
        location: 'London, UK', // In production, use IP geolocation service
        isCurrent: true,
      },
      // This would be previous sessions if stored in database
      // For now showing as empty to avoid duplicate data
    ];

    // In production, you would query sessions stored in database
    // const sessions = await SessionModel.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        devices,
        currentDevice: devices[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions', details: error.message },
      { status: 500 }
    );
  }
}
