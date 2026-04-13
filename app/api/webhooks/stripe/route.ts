import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// Initialize Stripe lazily to avoid build-time errors if env vars are missing
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    // Return a dummy instance or throw a descriptive error that we can catch
    // During build, Next.js might explore these routes. 
    // We should only throw if we are actually trying to use it in a request.
    throw new Error('STRIPE_SECRET_KEY is missing');
  }
  return new Stripe(apiKey, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  });
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('Missing signature or webhook secret');
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (err: any) {
    console.error('Stripe initialization failed:', err.message);
    return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  await connectToDatabase();

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const itemType = session.metadata?.itemType;
      const itemId = session.metadata?.itemId;

      if (userId) {
        if (itemType === 'course' && itemId) {
          await EnrollmentModel.create({
            userId: userId,
            eventId: itemId,
            status: 'enrolled',
            progress: 0,
            metadata: {
              enrolledAt: new Date(),
              paymentSessionId: session.id,
              discountApplied: session.metadata?.discountPercent,
            }
          });
          console.log(`✓ Course enrollment active for user: ${userId}, Course: ${itemId}`);
        } else if (itemType === 'event' && itemId) {
          await EnrollmentModel.create({
            userId: userId,
            eventId: itemId,
            status: 'registered',
            progress: 0,
            metadata: {
              registeredAt: new Date(),
              paymentSessionId: session.id,
              ticketType: 'standard',
            }
          });
          console.log(`✓ Event registration active for user: ${userId}, Event: ${itemId}`);
        } else {
          // Default: Membership
          const planType = session.metadata?.planType;
          await UserModel.findByIdAndUpdate(userId, {
            membershipPlan: planType,
            membershipStatus: 'active',
            membershipStartDate: new Date(),
            stripeCustomerId: session.customer,
            paymentStatus: 'completed',
          });
          console.log(`✓ Membership activated for user: ${userId}, Plan: ${planType}`);
        }
      }
      break;
    }

    case 'payment_intent.succeeded':
      console.log('✓ Payment succeeded:', event.data.object.id);
      break;

    case 'payment_intent.payment_failed':
      console.log('✗ Payment failed:', event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
