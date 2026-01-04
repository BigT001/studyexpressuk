import { NextResponse } from 'next/server';
import { createEventSchema } from '@/shared/validators/event.validator';
import * as eventsService from '@/server/events/service';
import { getServerAuthSession } from '@/server/auth/session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createEventSchema.parse(body);
    // Require admin or sub-admin role (server-side session)
    const session: any = await getServerAuthSession();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUB_ADMIN')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const ev = await eventsService.createEvent(parsed as any);
    return NextResponse.json({ success: true, event: ev }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 400 });
  }
}

export async function GET() {
  try {
    const events = await eventsService.listEvents();
    return NextResponse.json({ success: true, events });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
