import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { emailService } from '@/server/emails/service';

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUB_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const email = await emailService.createEmailNotification({
      ...body,
      createdBy: session.user.email,
    });

    return NextResponse.json(
      { success: true, email },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create email' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const emails = await emailService.listEmails();
    return NextResponse.json(
      { success: true, emails },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
