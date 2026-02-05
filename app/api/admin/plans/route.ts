import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import * as planService from '@/server/plans/service';

export async function GET(req: Request) {
    try {
        const session = await getServerAuthSession();
        // Allow public or user access? Usually public to see prices?
        // Admin needs to see all including inactive?
        // Let's check query params if needed, but for now return all active for users, all for admin?
        // Actually, to keep it simple, let's return all plans. Frontend can filter active.
        // Ideally we should have better RBAC.

        const plans = await planService.getPlans({});
        return NextResponse.json(plans);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerAuthSession();
        if (!session || !['ADMIN', 'SUBADMIN'].includes(session.user?.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const plan = await planService.createPlan(body);
        return NextResponse.json(plan, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
