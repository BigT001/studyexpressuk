import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';

// This will handle Stripe webhook events
import Stripe from 'stripe';

// Initialize Stripe lazily to avoid build-time errors if env vars are missing
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const stripe = getStripe();
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planType = session.metadata?.planType;

        if (userId) {
          // Update user with membership
          await UserModel.findByIdAndUpdate(userId, {
            membershipPlan: planType,
            membershipStatus: 'active',
            membershipStartDate: new Date(),
            stripeCustomerId: session.customer,
            paymentStatus: 'completed',
          });

          console.log(`✓ Membership activated for user: ${userId}, Plan: ${planType}`);
        }
        break;

      case 'payment_intent.succeeded':
        console.log('✓ Payment succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('✗ Payment failed:', event.data.object.id);
        break;

      case 'charge.refunded':
        console.log('✓ Refund processed:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
