import { NextResponse, NextRequest } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';

import Stripe from 'stripe';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  });
};

interface CheckoutSessionRequest {
  planType: 'individual' | 'corporate';
  priceAmount: number;
  planName: string;
}

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body: CheckoutSessionRequest = await req.json();

    if (!body.planType || !body.priceAmount || !body.planName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user
    const user = await UserModel.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Create Stripe checkout session
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: body.planName,
              description: `${body.planType === 'individual' ? 'Individual' : 'Corporate'} membership plan`,
            },
            unit_amount: Math.round(body.priceAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/memberships`,
      metadata: {
        userId: session.user.id,
        planType: body.planType,
        planName: body.planName,
        userEmail: user.email,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      clientSecret: checkoutSession.client_secret,
    });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
