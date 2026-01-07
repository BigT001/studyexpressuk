import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import * as coursesService from '@/server/courses/service';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Require admin or sub-admin role
    const session = await getServerAuthSession() as { user: { role: string } } | null;
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUB_ADMIN')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const course = await coursesService.updateCourse(id, body);
    return NextResponse.json({ success: true, course });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Update course error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Require admin or sub-admin role
    const session = await getServerAuthSession() as { user: { role: string } } | null;
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUB_ADMIN')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await coursesService.deleteCourse(id);
    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Delete course error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const course = await coursesService.getCourseById(id);
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Get course error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
