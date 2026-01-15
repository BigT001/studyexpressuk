import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
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

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
