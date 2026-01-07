import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import * as coursesService from '@/server/courses/service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Require admin or sub-admin role
    const session = await getServerAuthSession() as { user: { role: string } } | null;
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUB_ADMIN')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const course = await coursesService.createCourse(body);
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Create course error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const courses = await coursesService.listCourses();
    return NextResponse.json({ success: true, courses });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('List courses error:', message, err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
