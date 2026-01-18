/**
 * Global middleware for tracking user activity across all authenticated endpoints
 * This ensures lastActivity is updated whenever a user makes any API call
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function trackActivityMiddleware(request: NextRequest) {
  try {
    // Only track for API routes that need auth
    if (request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.includes('/public/')) {
      // Get JWT token from request
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      
      if (token && token.id) {
        // Dynamically import to avoid circular dependency
        const { updateUserActivity } = await import('@/server/utils/login-tracker');
        
        // Update activity asynchronously (non-blocking)
        updateUserActivity(token.id as string, false).catch(err => {
          console.error('[GlobalActivityMiddleware] Failed to track activity:', err);
        });
      }
    }
  } catch (error) {
    console.error('[GlobalActivityMiddleware] Error:', error);
    // Never block the request due to tracking failures
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};
