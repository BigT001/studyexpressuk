import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { emailService } from '@/server/emails/service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const email = await emailService.getEmailById(id);
    return NextResponse.json(
      { success: true, email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/emails/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Email not found' },
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
    const email = await emailService.updateEmail(id, body);

    return NextResponse.json(
      { success: true, email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PATCH /api/emails/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update email' },
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
    await emailService.deleteEmail(id);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/emails/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete email' },
      { status: 500 }
    );
  }
}
