import { NextResponse } from 'next/server';
import { createEventSchema } from '@/shared/validators/event.validator';
import * as eventsService from '@/server/events/service';
import { getServerAuthSession } from '@/server/auth/session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('===== CREATE EVENT API =====');
    console.log('Raw request body:', body);
    console.log('Format in body:', body.format);
    const parsed = createEventSchema.parse(body);
    console.log('Parsed data:', parsed);
    console.log('Format in parsed:', parsed.format);
    // Require admin or sub-admin role (server-side session)
    const session = await getServerAuthSession() as { user: { role: string } } | null;
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUB_ADMIN')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const ev = await eventsService.createEvent(parsed as Record<string, unknown>);
    console.log('Saved event:', ev);
    console.log('Saved event format:', ev.format);
    return NextResponse.json({ success: true, event: ev }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Create event error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const events = await eventsService.listEvents();
    console.log('===== LIST EVENTS API =====');
    console.log('Total events returned:', events.length);
    if (events.length > 0) {
      console.log('First event:', events[0]);
      console.log('First event format:', events[0].format);
    }
    return NextResponse.json({ success: true, events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('List events error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
