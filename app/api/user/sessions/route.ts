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

    let location = 'Unknown Location';
    try {
       // Only query external API if IP looks somewhat public
       if (clientIP && clientIP !== '127.0.0.1' && clientIP !== '::1' && clientIP !== 'Unknown' && clientIP.split('.').length === 4) {
          const geoRes = await fetch(`http://ip-api.com/json/${clientIP}?fields=city,country`);
          const geoData = await geoRes.json();
          if (geoData.status === 'success') {
             location = `${geoData.city}, ${geoData.country}`;
          }
       } else {
          location = 'Local Network / Development';
       }
    } catch (e) {
       console.log('Geo IP fetch failed', e);
    }

    // Mock devices array with current device and a sample previous device
    const devices = [
      {
        id: 'current-' + Date.now(),
        name: deviceName,
        icon: deviceIcon,
        lastActive: new Date().toISOString(),
        ip: clientIP,
        location: location,
        isCurrent: true,
      },
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
