import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { messageService } from '@/server/messages/service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const message = await messageService.getMessageById(id);
    return NextResponse.json(
      { success: true, message },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/messages/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Message not found' },
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
    const message = await messageService.updateMessage(id, body);

    return NextResponse.json(
      { success: true, message },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PATCH /api/messages/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
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
    await messageService.deleteMessage(id);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/messages/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
