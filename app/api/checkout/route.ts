import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import PlanModel from '@/server/db/models/plan.model';
import CourseModel from '@/server/db/models/course.model';
import EventModel from '@/server/db/models/event.model';
import MembershipModel from '@/server/db/models/membership.model';

import Stripe from 'stripe';

// Initialize Stripe lazily to avoid build-time errors if env vars are missing
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover', // Update to match installed types
        // Let's use typescript: true if needed.
        typescript: true,
    });
};


interface CheckoutRequest {
    itemId: string;
    itemType: 'course' | 'event';
}

export async function POST(req: Request) {
    try {
        const stripe = getStripe();
        const session: any = await getServerAuthSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { itemId, itemType } = await req.json() as CheckoutRequest;

        if (!itemId || !['course', 'event'].includes(itemType)) {
            return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await UserModel.findById(session.user.id).lean();
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // 1. Fetch Item Details
        let item: any;
        let basePrice = 0;
        let itemName = '';

        if (itemType === 'course') {
            item = await CourseModel.findById(itemId).lean();
            if (!item) throw new Error('Course not found');
            basePrice = item.price || 0;
            itemName = item.title;
        } else {
            item = await EventModel.findById(itemId).lean();
            // Events might be free, check access type if needed, but for checkout we assume paid
            if (!item) throw new Error('Event not found');
            // Assuming events have a price field? The model has access but price isn't explicit in Schema view
            // Let's assume metadata price or 0 for now if not in schema.
            // Wait, let's check Event Schema. It has access enum but no price field? 
            // Checking Event Model...
            // Event Schema does NOT have a price field! It has access: 'free' | 'premium' | 'corporate'.
            // If premium, where is the price? 
            // Assumption: Events are free for members? Or price is missing. 
            // For now, let's assume Events are free or cost 0 if no price field. 
            // OR, maybe we should add price to Event model? 
            // The user asked to "link events and cources to the payment".
            // Let's double check if I missed price in EventModel.
            // Line 41: location, 42: format... NO PRICE.
            // I will add price to Event Model as well for this to work.
            basePrice = (item as any).price || 0;
            itemName = item.title;
        }

        // 2. Calculate Discount
        let discountPercent = 0;

        // Check for active membership
        const membership = await MembershipModel.findOne({
            subjectId: user._id,
            status: 'active',
            endDate: { $gte: new Date() }
        }).lean();

        if (membership && membership.planId) {
            const plan = await PlanModel.findById(membership.planId).lean();
            if (plan) {
                if (itemType === 'course') {
                    discountPercent = plan.courseDiscount || 0;
                } else {
                    discountPercent = plan.eventDiscount || 0;
                }
            }
        }

        const finalPrice = Math.max(0, basePrice * (1 - discountPercent / 100));

        // If free, auto-enroll the user
        if (finalPrice === 0) {
            const EnrollmentModel = (await import('@/server/db/models/enrollment.model')).default;

            await EnrollmentModel.create({
                userId: user._id,
                eventId: itemId,
                status: itemType === 'course' ? 'in_progress' : 'registered',
                progress: 0,
                enrollmentDate: new Date(),
            });

            return NextResponse.json({
                success: true,
                free: true,
                message: `Successfully ${itemType === 'course' ? 'enrolled in' : 'registered for'} ${itemName}!`
            });
        }

        // 3. Create Stripe Session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: itemName,
                            description: item.description
                                ? `${item.description.substring(0, 200)}${item.description.length > 200 ? '...' : ''}${discountPercent > 0 ? ` | ${discountPercent}% membership discount applied` : ''}`
                                : discountPercent > 0 ? `Includes ${discountPercent}% membership discount` : undefined,
                            images: item.imageUrl ? [item.imageUrl] : undefined,
                            metadata: {
                                type: itemType,
                                category: item.category || 'General',
                                ...(itemType === 'event' && item.startDate ? { startDate: new Date(item.startDate).toLocaleDateString() } : {}),
                                ...(itemType === 'course' && item.duration ? { duration: `${item.duration} hours` } : {}),
                            },
                        },
                        unit_amount: Math.round(finalPrice * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/enrollment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/${itemType}s/${itemId}`, // Redirect back to item page
            metadata: {
                userId: session.user.id,
                itemType,
                itemId,
                originalPrice: basePrice,
                discountPercent,
            },
        });

        return NextResponse.json({
            success: true,
            sessionId: checkoutSession.id,
            url: checkoutSession.url,
        });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Checkout failed' }, { status: 500 });
    }
}
