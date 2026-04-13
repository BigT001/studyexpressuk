import { NextResponse } from 'next/server';
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

const GRIP_PLANS = {
    STANDARD: {
        name: 'GRIP Programme - Standard Tier',
        price: 1500,
        currency: 'gbp',
        description: '5 nights hotel (twin), Transfers, Masterclass, 2 days @ The Business Show, Welcome dinner',
    },
    PREMIUM: {
        name: 'GRIP Programme - Premium Tier',
        price: 2200,
        currency: 'gbp',
        description: 'Standard + Private Room, VIP Speed Networking, Pre-show Investor Briefing, Digital Brand Audit',
    },
    EXECUTIVE: {
        name: 'GRIP Programme - Executive Tier',
        price: 3000,
        currency: 'gbp',
        description: 'Premium + 5-star Accommodation, Private 1:1, Company Setup Consultation, GAIN Mentorship',
    },
};

export async function POST(req: Request) {
    try {
        const stripe = getStripe();
        const session: any = await getServerAuthSession();
        
        if (!session || !session.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { tier } = await req.json();
        const plan = GRIP_PLANS[tier as keyof typeof GRIP_PLANS];

        if (!plan) {
            return NextResponse.json({ success: false, error: 'Invalid plan tier' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await UserModel.findById(session.user.id).lean();
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: plan.currency,
                        product_data: {
                            name: plan.name,
                            description: plan.description,
                        },
                        unit_amount: plan.price * 100, // Price in cents/pence
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/grip-programme?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/grip-programme`,
            metadata: {
                userId: session.user.id,
                type: 'grip_programme',
                tier: tier,
            },
        });

        return NextResponse.json({
            success: true,
            url: checkoutSession.url,
        });

    } catch (error: any) {
        console.error('GRIP Checkout error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Checkout failed' }, { status: 500 });
    }
}
