import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple RBAC middleware: expects `x-user-role` header for demo purposes.
// In production, replace with NextAuth session or JWT verification.

const adminOnlyPaths = ['/api/users', '/api/events'];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const role = req.headers.get('x-user-role');

  // Protect admin-only paths for non-GET methods
  for (const p of adminOnlyPaths) {
    if (path.startsWith(p)) {
      if (req.method !== 'GET') {
        if (!role || (role !== 'ADMIN' && role !== 'SUB_ADMIN')) {
          return new NextResponse(JSON.stringify({ success: false, error: 'Forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
        }
      }
    }
  }

  // For memberships purchase, require user or corporate role
  if (path.startsWith('/api/memberships') && req.method === 'POST') {
    if (!role || (role !== 'INDIVIDUAL' && role !== 'CORPORATE')) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
