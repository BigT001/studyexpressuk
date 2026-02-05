import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/server/auth/session';
import SettingsModel from '@/server/db/models/settings.model';

// Check for admin role
async function isAdmin(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    return session?.user?.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch settings from database
    const systemSettings = await SettingsModel.findOne({ type: 'system' }) || {};

    // Set defaults if settings don't exist
    const defaultSettings = {
      allowIndividualRegistration: true,
      allowCorporateRegistration: true,
      requireEmailVerification: true,
      enforce2FAForAdmins: true,
      passwordExpiryDays: 90,
      sessionTimeoutMinutes: 60,
      maxLoginAttempts: 5,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@studyexpressuk.com',
      emailFromName: 'Study Express UK',
      emailFromAddress: 'noreply@studyexpressuk.com',
      stripeEnabled: true,
      taxRate: 0,
      maintenanceMode: false,
      maintenanceMessage: '',
      enableMessaging: true,
      enableAnalytics: true,
      enableCertificates: true,
      enableEventNotifications: true,
    };

    const mergedSettings = { ...defaultSettings, ...systemSettings?.settings };

    return NextResponse.json({
      success: true,
      settings: mergedSettings,
    });
  } catch (error) {
    console.error('[Settings API] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const settings = await req.json();

    // Validate settings
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid settings format' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (settings.passwordExpiryDays && (typeof settings.passwordExpiryDays !== 'number' || settings.passwordExpiryDays < 0)) {
      return NextResponse.json(
        { success: false, error: 'Password expiry days must be a non-negative number' },
        { status: 400 }
      );
    }

    if (settings.sessionTimeoutMinutes && (typeof settings.sessionTimeoutMinutes !== 'number' || settings.sessionTimeoutMinutes < 5)) {
      return NextResponse.json(
        { success: false, error: 'Session timeout must be at least 5 minutes' },
        { status: 400 }
      );
    }

    if (settings.maxLoginAttempts && (typeof settings.maxLoginAttempts !== 'number' || settings.maxLoginAttempts < 1)) {
      return NextResponse.json(
        { success: false, error: 'Max login attempts must be at least 1' },
        { status: 400 }
      );
    }

    if (settings.smtpPort && (typeof settings.smtpPort !== 'number' || settings.smtpPort < 1 || settings.smtpPort > 65535)) {
      return NextResponse.json(
        { success: false, error: 'SMTP port must be between 1 and 65535' },
        { status: 400 }
      );
    }

    if (settings.taxRate && (typeof settings.taxRate !== 'number' || settings.taxRate < 0 || settings.taxRate > 100)) {
      return NextResponse.json(
        { success: false, error: 'Tax rate must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Validate email format
    if (settings.emailFromAddress && !isValidEmail(settings.emailFromAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Update or create settings in database
    const updatedSettings = await SettingsModel.findOneAndUpdate(
      { type: 'system' },
      {
        type: 'system',
        settings,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings: updatedSettings.settings,
    });
  } catch (error) {
    console.error('[Settings API] POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
