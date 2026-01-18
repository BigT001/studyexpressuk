import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateUserActivity } from './login-tracker';

/**
 * Activity tracking middleware for API routes
 * Tracks user activity on every API call
 * Add this to API routes that require authentication
 */
export async function trackUserActivity(request: NextRequest) {
  try {
    // Get JWT token from request
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (token && token.id) {
      // Update user activity asynchronously (don't wait for it)
      // isLoginEvent = false because this is ongoing activity, not a login event
      updateUserActivity(token.id as string, false).catch(err => {
        console.error('[ActivityMiddleware] Failed to track activity:', err);
      });
    }
  } catch (error) {
    console.error('[ActivityMiddleware] Error:', error);
    // Don't throw - this should never block the API
  }
}

/**
 * Helper function to add activity tracking to API route handlers
 * Usage: await trackActivity(request);
 */
export async function trackActivity(request: NextRequest): Promise<string | null> {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (token && token.id) {
      // Update asynchronously
      updateUserActivity(token.id as string, false).catch(err => {
        console.error('[ActivityTracking] Error:', err);
      });
      return token.id as string;
    }
    
    return null;
  } catch (error) {
    console.error('[ActivityTracking] Error getting token:', error);
    return null;
  }
}
