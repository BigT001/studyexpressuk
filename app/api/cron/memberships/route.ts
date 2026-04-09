import { NextResponse } from 'next/server';
import { processMembershipExpirations, processMembershipNotifications } from '@/server/memberships/service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Handles automated cron requests to process memberships.
 * This endpoint should be triggered periodically (e.g. daily at midnight)
 * by a service like Vercel Cron, AWS CloudWatch, or a standard HTTP ping tool.
 */
export async function GET(request: Request) {
  try {
    // Note: If you are running this in a totally public environment, 
    // you should add an Authorization header check here matching a secure CRON_SECRET.

    // 1. Cut off any memberships that have passed their end date
    const expirationsProcessed = await processMembershipExpirations();

    // 2. Identify memberships expiring within 7 days and send them a system notification message
    const notificationsSent = await processMembershipNotifications();

    return NextResponse.json({
      success: true,
      message: 'System membership cron executed successfully.',
      data: {
        expiredMembershipsProcessed: expirationsProcessed,
        oneWeekProratedNoticesSent: notificationsSent
      }
    });
  } catch (error: any) {
    console.error('Membership Cron System Failure:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal cron failure' },
      { status: 500 }
    );
  }
}
