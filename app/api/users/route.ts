import { NextResponse } from 'next/server';
import { createUserSchema } from '@/shared/validators/user.validator';
import * as userService from '@/server/users/service';
import { getServerAuthSession } from '@/server/auth/session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createUserSchema.parse(body);
    const user = await userService.createUser({ email: parsed.email, password: parsed.password, phone: parsed.phone, role: parsed.role as any });
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 400 });
  }
}

export async function GET() {
  try {
    // Require admin role to list users
    const session: any = await getServerAuthSession(); // in API context req would be passed; here use helper
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const users = await userService.listUsers();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
